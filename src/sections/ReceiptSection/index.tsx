import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { FormikProps } from "formik";
import Swal from "sweetalert2";
import { AxiosError } from "axios";

// UI Components
import {
  Box,
  Grid,
  Button,
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  styled,
  useTheme,
} from "@mui/material";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { TransitionProps } from "@mui/material/transitions";

// Features & Components
import ReceiptDetails from "@/features/Receipt/ReceiptDetails";
import ReceiptAddRetrieveCustomer from "@/features/Receipt/ReceiptAddRetrieveCustomer";
import ReceiptAddAmout from "@/features/Receipt/ReceiptAddAmount";
import ReceiptTypeAndCash from "@/features/Receipt/ReceiptTypeAndCash";
// import ReceiptPaymentMethodCollection from "@/features/Receipt/ReceiptPaymentMethodCollection"; // Uncomment if needed

// Utils, Services & Interfaces
import { createObject, fetchAll } from "@/services/HttpRequests";
import { removeAccents, roundTwoDecimal } from "@/utils";
import { showErrorMessage, showSuccessMessage } from "@/lib";
import { APP_ROUTES } from "@/routes";
import DiscountType from "@/enum/DiscountType";
import { ICommandDetailsGet } from "@/interfaces/ICommand";
import { IPaymentMethodGet } from "@/interfaces/IPaymentMethod";
import {
  IReceiptCreate,
  IReceiptGet,
  IReceiptInfo,
  IReceiptTypeAndCash,
} from "@/interfaces/IReceipt";


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DividerStyled = styled(Divider)(({ theme }) => ({
  marginTop: "2.5rem",
  marginBottom: "2.5rem",
  borderWidth: "1px",
  borderColor: theme.palette.grey[500],
}));


const calculateSubtotal = (details: ICommandDetailsGet[]) => {
  return details.reduce((total, detail) => {
    const dishTotal = detail.dishPrice * detail.dishQuantity;
    const extrasTotal = detail.extras.reduce(
      (acc, extra) => acc + extra.extraDish.price * extra.quantity,
      0
    );
    return total + dishTotal + extrasTotal;
  }, 0);
};

const calculateDiscountedPrice = (
  originalPrice: number,
  discountValue: number,
  type: DiscountType
) => {
  const value = Number(discountValue) || 0;
  if (type === "percentage") {
    return Math.max(0, originalPrice - originalPrice * (value / 100));
  } else if (type === "amount") {
    return Math.max(0, originalPrice - value);
  }
  return originalPrice;
};


interface ReceiptSectionProps {
  open: boolean;
  close: () => void;
  commandDetailsCollection: ICommandDetailsGet[];
  commandId?: number;
  discount: number;
  discountType: DiscountType;
}

const ReceiptSection: React.FC<ReceiptSectionProps> = ({
  open,
  close,
  commandDetailsCollection,
  commandId,
  discount,
  discountType,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  
  const formikRef = useRef<FormikProps<IReceiptTypeAndCash>>(null);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  // Fetch Payment Methods
  const { data: paymentMethods, isLoading: isLoadingMethods } = useSWR(
    "api/paymentmethod",
    () => fetchAll<IPaymentMethodGet>("api/paymentmethod")
  );

  // 1. Calculations (Memoized for performance)
  const subTotal = useMemo(
    () => calculateSubtotal(commandDetailsCollection),
    [commandDetailsCollection]
  );

  const baseTotalAfterDiscount = useMemo(
    () => calculateDiscountedPrice(subTotal, discount, discountType),
    [subTotal, discount, discountType]
  );

  const initialValues: IReceiptInfo = {
    subTotal: roundTwoDecimal(subTotal),
    igv: 0,
    additionalAmount: 0,
    discount,
    discountType,
    customer: null,
    receiptDetailsCollection: [], 
    total: baseTotalAfterDiscount,
    amountDue: baseTotalAfterDiscount,
  };

  const [receiptDetails, setReceiptDetails] = useState<IReceiptInfo>(initialValues);

  useEffect(() => {
    setReceiptDetails((prev) => {
      const currentPaid = prev.receiptDetailsCollection?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
      const newTotal = roundTwoDecimal(baseTotalAfterDiscount + prev.additionalAmount);
      
      return {
        ...prev,
        subTotal,
        discount,
        discountType,
        total: newTotal,
        amountDue: roundTwoDecimal(newTotal - currentPaid),
      };
    });
  }, [baseTotalAfterDiscount, subTotal, discount, discountType]);

useEffect(() => {
  setReceiptDetails((prev) => {
    
    let discountAmount = prev.discount;

    if (prev.discountType === "percentage") {
      discountAmount = (prev.subTotal * prev.discount) / 100;
    }

    const calculatedTotal = roundTwoDecimal(
      prev.subTotal + prev.igv + prev.additionalAmount - discountAmount
    );

    const totalPaid = prev.receiptDetailsCollection?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    return {
      ...prev,
      total: calculatedTotal,
      amountDue: roundTwoDecimal(calculatedTotal - totalPaid),
    };
  });
}, [
  receiptDetails.additionalAmount,
  receiptDetails.receiptDetailsCollection,
  receiptDetails.discount, 
  receiptDetails.discountType,  
  receiptDetails.subTotal 
]);


  const handleClose = useCallback(() => {
    close();
  }, [close]);

  const generateReceipt = async () => {
    const { receiptDetailsCollection, amountDue, customer, additionalAmount, discount: currentDiscount } = receiptDetails;

    // Validations
    if (!receiptDetailsCollection || receiptDetailsCollection.length === 0) {
      showErrorMessage({
        title: "NO SE PUEDE GENERAR COMPROBANTE",
        contentHtml: "El comprobante debe tener al menos un pago",
      });
      return;
    }

    if (amountDue > 0.1 || amountDue < -0.1) {
      showErrorMessage({
        title: "NO SE PUEDE GENERAR COMPROBANTE",
        contentHtml: `Falta pagar un total de S/. ${amountDue.toFixed(2)}`,
      });
      return;
    }
      console.log(loadingSubmit);
      
    if (!formikRef.current) return;

    const receiptCreate: IReceiptCreate = {
      commandId: commandId!,
      cashId: formikRef.current.values.cashId || 0,
      receiptTypeId: formikRef.current.values.receiptTypeId || 0,
      customerId: customer?.id,
      discount: currentDiscount,
      receiptDetailsCollection,
      additionalAmount,
    };

    setLoadingSubmit(true);

    // API Call Logic
    try {
      await Swal.fire({
        title: "Generando comprobante...",
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: async () => {
          Swal.showLoading();
          try {
            const result = await createObject<IReceiptGet, IReceiptCreate>(
              "/api/receipt",
              receiptCreate
            );

            if (!result) throw new Error("Ups! Hubo un error inesperado.");

            await mutate("api/table/commands");
            showSuccessMessage("Comprobante generado con éxito");
            router.push(APP_ROUTES.command);
          } catch (err) {
            if (err instanceof AxiosError) {
              const errorMessage = err.response?.data as string;
              showErrorMessage({ title: errorMessage || "Error al conectar con el servidor" });
            } else {
               showErrorMessage({ title: "Error desconocido" });
            }
            // Importante: No cerramos el modal si hay error para que el usuario pueda corregir
          }
        },
      });
    } finally {
      setLoadingSubmit(false);
      formikRef.current?.setSubmitting(false);
    }
  };

  const handleGenerateClick = async () => {
    setLoadingSubmit(true);
    await formikRef.current?.submitForm();
     setLoadingSubmit(false);
    // if (formikRef.current?.isValid) {
    // } else {
    //     setLoadingSubmit(false);
    // }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      scroll="paper"
      TransitionComponent={Transition}
      sx={{ zIndex: 1400 }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: theme.palette.primary.main,
        }}
      >
        COMPROBANTE
      </DialogTitle>

      <DialogContent dividers sx={{ overflow: "auto" }}>
        <Grid columnSpacing={4} container>
          {/* Columna Izquierda: Configuración y Pagos */}
          <Grid item xs={12} md={6}>
            <ReceiptTypeAndCash
              customRef={formikRef}
              generateReceipt={generateReceipt}
            />
            
            <DividerStyled />
            
            <ReceiptAddAmout
              data={paymentMethods}
              isLoading={isLoadingMethods}
              receiptDetails={receiptDetails}
              loadingSubmit={loadingSubmit}
              setReceiptDetails={setReceiptDetails}
            />
            
            {/* Componentes comentados en original mantenidos comentados */}
            {/* <DividerStyled />
            <ReceiptAddDiscountAndAdditionalAmount ... /> */}
            
            <DividerStyled />
            
            <ReceiptAddRetrieveCustomer
              receiptDetails={receiptDetails}
              loadingSubmit={loadingSubmit}
              setReceiptDetails={setReceiptDetails}
            />
          </Grid>

          {/* Columna Derecha: Detalles del Pedido */}
          <Grid item xs={12} md={6}>
            <DividerStyled sx={{ display: { xs: "block", md: "none" } }} />
            
            <ReceiptDetails
              receiptDetails={receiptDetails}
              commandDetailsCollection={commandDetailsCollection}
              paymentMethodCollection={paymentMethods}
              setReceiptDetails={setReceiptDetails}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ pt: 2 }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 2,
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handleClose}
            color="error"
            variant="contained"
            size="large"
            startIcon={<CloseIcon />}
            disabled={loadingSubmit}
          >
            Salir
          </Button>
          
          <Button
            onClick={handleGenerateClick}
            color="secondary"
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            disabled={loadingSubmit}
          >
            Generar Comprobante
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// --- Static Data (Moved to bottom or separate file) ---

export const paymentMethodImageCollection = {
  bbva: "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041601/payment-method/t8k5omxjjuerfhsiamt0.png",
  bcp: "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041503/payment-method/a6ovwi0ineypacersbts.png",
  paypal: "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041624/payment-method/os897u62rmnczgwf3o7i.png",
  efectivo: "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041564/payment-method/wegvv3jvufdy77fbynj1.png",
  interbank: "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041587/payment-method/gknaj5gj6w2fq41jetkw.jpg",
  scotiabank: "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041541/payment-method/algmnx4jjgzzai5msoti.png",
  nacion: "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041694/payment-method/r4g846zgko9xuq4ipljn.jpg",
};

export const findImage = (text: string) => {
  const keys = Object.keys(paymentMethodImageCollection);
  const key = keys.find((x) => removeAccents(text).toLowerCase().includes(x));
  return key
    ? paymentMethodImageCollection[key as keyof typeof paymentMethodImageCollection]
    : undefined;
};

export default ReceiptSection;