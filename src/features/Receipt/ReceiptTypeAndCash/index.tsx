import ComboBox from "@/components/ComboBox";
import { ICashGet } from "@/interfaces";
import { IReceiptTypeAndCash } from "@/interfaces/IReceipt";
import { IReceiptTypeGet } from "@/interfaces/IReceiptType";
import { receiptTypeAndCashShema } from "@/schemas/Receipt";
import { fetchAll } from "@/services/HttpRequests";
import Grid from "@mui/material/Grid";
import { Formik, FormikProps } from "formik";
import React from "react";
import useSWR from "swr";

interface ReceiptTypAndCashProps {
  customRef?: React.RefObject<FormikProps<IReceiptTypeAndCash>>;
  generateReceipt: () => void;
}

const ReceiptTypeAndCash: React.FC<ReceiptTypAndCashProps> = ({
  customRef,
  generateReceipt,
}) => {
  const {
    data: receiptTypeCollection,
    isLoading: isLoadingReceiptTypeCollection,
  } = useSWR("api/receipttype", () =>
    fetchAll<IReceiptTypeGet>("api/receipttype")
  );
  const { data: cashCollection, isLoading: isLoadingCashCollection } = useSWR(
    "api/cash",
    () => fetchAll<ICashGet>("api/cash")
  );

  return (
    <Formik<IReceiptTypeAndCash>
      initialValues={{}}
      innerRef={customRef}
      validateOnChange={false}
      validationSchema={receiptTypeAndCashShema}
      onSubmit={() => {
        generateReceipt();
      }}
    >
      {({ errors, isSubmitting, setFieldValue }) => (
        <form>
          <Grid container columnSpacing={4} rowSpacing={4}>
            <Grid item xs={6}>
              <ComboBox
                id={"id"}
                label={"name"}
                values={receiptTypeCollection || []}
                loading={isLoadingReceiptTypeCollection}
                handleChange={(receiptType) => {
                  setFieldValue("receiptTypeId", receiptType?.id);
                }}
                disabled={isSubmitting}
                textFieldProps={{
                  label: "Tipo de Comprobante",
                  error: Boolean(errors.receiptTypeId),
                  helperText: errors.receiptTypeId,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <ComboBox
                id={"id"}
                label={"id"}
                values={cashCollection || []}
                loading={isLoadingCashCollection}
                handleChange={(cash) => {
                  setFieldValue("cashId", cash?.id);
                }}
                disabled={isSubmitting}
                textFieldProps={{
                  label: "Caja",
                  error: Boolean(errors.cashId),
                  helperText: errors.cashId,
                }}
              />
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default ReceiptTypeAndCash;
