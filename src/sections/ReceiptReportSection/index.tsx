import { IReceiptReportGet } from "@/interfaces/IReceiptReport";
import LoaderComponent from "@/components/LoaderComponent";
import useSWR from "swr";
import ContentBox from "@/components/ContentBox";
import Box from "@mui/material/Box";
import ReceiptReportTable from "@/features/ReceiptReport/ReceiptReportTable";
import { fetchAll } from "@/services/HttpRequests";
import Title from "@/components/Title";

const ReceiptReportSection = () => {
  const { data: receipts, isLoading: isLoadingReceipts } = useSWR(
    "api/receipt",
    () => fetchAll<IReceiptReportGet>("api/receipt")
  );

  if (isLoadingReceipts) return <LoaderComponent />;

  return (
    <ContentBox>
      <Box sx={{ marginTop: 2, marginX: 2 }}>
        <Title variant="h2">Reporte de Comprobantes de Pago</Title>
      </Box>

      <ReceiptReportTable data={receipts!} />
    </ContentBox>
  );
};

export default ReceiptReportSection;
