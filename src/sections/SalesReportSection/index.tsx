import LoaderComponent from "@/components/LoaderComponent";
import useSWR from "swr";
import ContentBox from "@/components/ContentBox";
import Box from "@mui/material/Box";
import DishOrderStatisticsTable from "@/features/SalesReport/DishOrderStatisticsTable";
import SalesDataTable from "@/features/SalesReport/SalesDataTable";
import ComboBox from "@/components/ComboBox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Article from "@mui/icons-material/Article";
import { IDishOrderStatistics } from "@/interfaces/IDish";
import { ISalesDataPerDate } from "@/interfaces/IReceiptReport";
import { fetchAll } from "@/services/HttpRequests";
import { useState } from "react";
import { Formik } from "formik";
import DishOrderStatisticsGraphics from "@/features/SalesReport/DishOrderStatisticsGraphics";
import SaleDataGraphics from "@/features/SalesReport/SalesDataGraphics";
import Title from "@/components/Title";

interface IOptionsReport {
  id: number;
  label: string;
}

const options: IOptionsReport[] = [
  {
    id: 1,
    label: "Reporte de Platos",
  },
  {
    id: 2,
    label: "Reporte por Fechas",
  },
];

const SalesReportSection = () => {
  const { data: dishes, isLoading: isLoadingDishes } = useSWR(
    "api/dish/dish-order-statistics",
    () => fetchAll<IDishOrderStatistics>("api/dish/dish-order-statistics")
  );

  const { data: salesData, isLoading: isLoadingSalesData } = useSWR(
    "api/receipt/sales-data-per-date",
    () => fetchAll<ISalesDataPerDate>("api/receipt/sales-data-per-date")
  );

  const [typeReport, setTypeReport] = useState<number>(options[0].id);

  if (isLoadingDishes || isLoadingSalesData) return <LoaderComponent />;

  return (
    <>
      <ContentBox>
        <Box sx={{ marginTop: 2, marginX: 2 }}>
          <Title variant="h2">Reporte de Ventas</Title>

          <Formik<IOptionsReport>
            initialValues={options[0]}
            validateOnChange={false}
            onSubmit={(option) => {
              setTypeReport(option.id);
            }}
          >
            {({ values, handleSubmit, setValues }) => (
              <Grid container spacing={1.5} marginY={2} alignItems={"center"}>
                <Grid item xs={4} minWidth={250}>
                  <ComboBox
                    id={"id"}
                    values={options}
                    value={values}
                    label={"label"}
                    textFieldProps={{
                      label: "Tipo de Reporte",
                    }}
                    disableClearable={true}
                    size="small"
                    handleChange={(e) => {
                      setValues(e!);
                    }}
                  />
                </Grid>

                <Grid item xs>
                  <Button
                    startIcon={<Article />}
                    onClick={() => handleSubmit()}
                    variant="contained"
                  >
                    Ver Reporte
                  </Button>
                </Grid>
              </Grid>
            )}
          </Formik>
        </Box>

        {typeReport === 1 ? (
          <>
            <DishOrderStatisticsTable data={dishes!} />
          </>
        ) : (
          <SalesDataTable data={salesData!} />
        )}
      </ContentBox>

      {typeReport === 1 && dishes!.length > 0 && (
        <DishOrderStatisticsGraphics data={dishes!} />
      )}

      {typeReport === 2 && salesData!.length > 0 && (
        <SaleDataGraphics data={salesData!.slice(0, 5)} />
      )}
    </>
  );
};

export default SalesReportSection;
