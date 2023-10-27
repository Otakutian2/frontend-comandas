import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import React, { useEffect, useRef, useState } from "react";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ReceiptDetails from "@/features/Receipt/ReceiptDetails";
import ReceiptAddRetrieveCustomer from "@/features/Receipt/ReceiptAddRetrieveCustomer";
import Divider from "@mui/material/Divider";
import ReceiptAddDiscountAndAdditionalAmount from "@/features/Receipt/ReceiptAddDiscountAndAdditionalAmount";
import { styled, useTheme } from "@mui/material";
import ReceiptAddAmout from "@/features/Receipt/ReceiptAddAmount";
import ReceiptTypeAndCash from "@/features/Receipt/ReceiptTypeAndCash";
import { ICommandDetailsGet } from "@/interfaces/ICommand";
import {
  IReceiptCreate,
  IReceiptGet,
  IReceiptInfo,
  IReceiptTypeAndCash,
} from "@/interfaces/IReceipt";
import ReceiptPaymentMethodCollection from "@/features/Receipt/ReceiptPaymentMethodCollection";
import useSWR, { useSWRConfig } from "swr";
import { IPaymentMethodGet } from "@/interfaces/IPaymentMethod";
import { createObject, fetchAll } from "@/services/HttpRequests";
import { removeAccents, roundDecimal } from "@/utils";
import { FormikProps } from "formik";
import { showErrorMessage, showSuccessMessage } from "@/lib";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { APP_ROUTES } from "@/routes";

interface ReceiptSectionProps {
  open: boolean;
  close: () => void;
  commandDetailsCollection: ICommandDetailsGet[];
  commandId?: number;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
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

export const paymentMethodImageCollection = {
  bbva: "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041601/payment-method/t8k5omxjjuerfhsiamt0.png",
  bcp: "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041503/payment-method/a6ovwi0ineypacersbts.png",
  paypal:
    "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041624/payment-method/os897u62rmnczgwf3o7i.png",
  efectivo:
    "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041564/payment-method/wegvv3jvufdy77fbynj1.png",
  interbank:
    "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041587/payment-method/gknaj5gj6w2fq41jetkw.jpg",
  scotiabank:
    "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041541/payment-method/algmnx4jjgzzai5msoti.png",
  nacion:
    "https://res.cloudinary.com/dpfhjk0sw/image/upload/v1697041694/payment-method/r4g846zgko9xuq4ipljn.jpg",
};

export const findImage = (text: string) => {
  const keys = Object.keys(paymentMethodImageCollection);

  const key = keys.find((x) => removeAccents(text).toLowerCase().includes(x));

  return key
    ? paymentMethodImageCollection[
        key as keyof typeof paymentMethodImageCollection
      ]
    : undefined;
};

const ReceiptSection: React.FC<ReceiptSectionProps> = ({
  open,
  close,
  commandDetailsCollection,
  commandId,
}) => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const formikRef = useRef<FormikProps<IReceiptTypeAndCash>>(null);
  const subTotal = commandDetailsCollection.reduce(
    (acc, curr) => acc + curr.orderPrice,
    0
  );
  const igv = roundDecimal(subTotal * 0.18);
  const initialValues: IReceiptInfo = {
    subTotal,
    igv,
    additionalAmount: 0,
    discount: 0,
    customer: null,
    receiptDetailsCollection: null,
    total: roundDecimal(subTotal + igv),
    amountDue: roundDecimal(subTotal + igv),
  };
  const theme = useTheme();
  const [receiptDetails, setReceiptDetails] =
    React.useState<IReceiptInfo>(initialValues);
  const { data, isLoading } = useSWR("api/paymentmethod", () =>
    fetchAll<IPaymentMethodGet>("api/paymentmethod")
  );
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  useEffect(() => {
    setReceiptDetails(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandDetailsCollection]);

  useEffect(() => {
    setReceiptDetails((prev) => {
      const total = roundDecimal(
        receiptDetails.subTotal +
          receiptDetails.igv +
          receiptDetails.additionalAmount -
          receiptDetails.discount
      );

      const amountDue = roundDecimal(
        total -
          (receiptDetails.receiptDetailsCollection?.reduce(
            (acc, curr) => acc + curr.amount,
            0
          ) || 0)
      );

      return { ...prev, total, amountDue };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    receiptDetails.discount,
    receiptDetails.additionalAmount,
    receiptDetails.receiptDetailsCollection,
  ]);

  const generateReceipt = async () => {
    if (!receiptDetails.receiptDetailsCollection) {
      setLoadingSubmit(false);
      formikRef.current?.setSubmitting(false);
      showErrorMessage({
        title: "NO SE PUEDE GENERAR COMPROBANTE",
        contentHtml: "El comprobante debe tener al menos un pago",
      });
      return;
    }

    if (receiptDetails.amountDue !== 0) {
      setLoadingSubmit(false);
      formikRef.current?.setSubmitting(false);
      showErrorMessage({
        title: "NO SE PUEDE GENERAR COMPROBANTE",
        contentHtml: `Falta pagar un total de S/. ${receiptDetails.amountDue.toFixed(
          2
        )}`,
      });
      return;
    }

    const receiptCreate: IReceiptCreate = {
      commandId: commandId!,
      cashId: formikRef.current?.values.cashId!,
      customerId: receiptDetails.customer?.id,
      discount: receiptDetails.discount,
      receiptTypeId: formikRef.current?.values.receiptTypeId!,
      receiptDetailsCollection: receiptDetails.receiptDetailsCollection,
      additionalAmount: receiptDetails.additionalAmount,
    };

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

          if (!result) {
            throw new Error("Ups! Hubo un error");
          }

          mutate("api/table/commands");
          showSuccessMessage("Comprobante generado con exito");
          router.push(APP_ROUTES.command);
        } catch (err) {
          if (err instanceof AxiosError) {
            const error = err as AxiosError;
            showErrorMessage({ title: error.response?.data as string });
          }
        } finally {
          setLoadingSubmit(false);
        }
      },
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      scroll="paper"
      TransitionComponent={Transition}
      sx={{
        zIndex: 1400,
      }}
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
          <Grid item xs={12} md={7}>
            <ReceiptTypeAndCash
              customRef={formikRef}
              generateReceipt={generateReceipt}
            />
            <DividerStyled />
            <ReceiptAddAmout
              data={data}
              isLoading={isLoading}
              receiptDetails={receiptDetails}
              loadingSubmit={loadingSubmit}
              setReceiptDetails={setReceiptDetails}
            />
            <DividerStyled />
            <ReceiptAddDiscountAndAdditionalAmount
              receiptDetails={receiptDetails}
              loadingSubmit={loadingSubmit}
              setReceiptDetails={setReceiptDetails}
            />
            <DividerStyled />
            <ReceiptAddRetrieveCustomer
              receiptDetails={receiptDetails}
              loadingSubmit={loadingSubmit}
              setReceiptDetails={setReceiptDetails}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <DividerStyled
              sx={{
                display: { xs: "block", md: "none" },
              }}
            />
            <ReceiptDetails
              receiptDetails={receiptDetails}
              commandDetailsCollection={commandDetailsCollection}
            />

            <ReceiptPaymentMethodCollection
              paymentMethodCollection={data}
              receiptDetails={receiptDetails}
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
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => {
              close();
              setReceiptDetails(initialValues);
            }}
            color="error"
            variant="contained"
            size="large"
            startIcon={<CloseIcon />}
            disabled={loadingSubmit}
          >
            Salir
          </Button>
          <Button
            color="secondary"
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            disabled={loadingSubmit}
            onClick={async () => {
              setLoadingSubmit(true);
              await formikRef.current?.submitForm();

              if (formikRef && !formikRef.current?.isValid) {
                setLoadingSubmit(false);
                return;
              }
            }}
          >
            Generar Comprobante
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiptSection;
