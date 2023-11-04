import Box from "@mui/material/Box";
import ContentBox from "@/components/ContentBox";
import dayjs from "dayjs";
import { Bar } from "react-chartjs-2";
import { colorsForChart, colorsWithAlphaForChart } from "@/utils";
import { ISalesDataPerDate } from "@/interfaces/IReceiptReport";

interface ISaleDataGraphicsProps {
  data: ISalesDataPerDate[];
}

const SaleDataGraphics = ({ data }: ISaleDataGraphicsProps) => {
  const copyData = [...data];
  const top5OfAccumulatedSales = copyData.sort(
    (a, b) => a.accumulatedSales - b.accumulatedSales
  );

  const chart1 = {
    labels: top5OfAccumulatedSales.map((d) =>
      dayjs(d.createdAt).format("DD/MM/YYYY")
    ),
    datasets: [
      {
        label: "Monto recaudado",
        data: top5OfAccumulatedSales.map((d) => d.accumulatedSales),
        hoverOffset: 4,
        backgroundColor: colorsWithAlphaForChart,
        borderColor: colorsForChart,
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns:
          " repeat(auto-fit, minmax(clamp(250px, 320px + 5vw  , 500px), 1fr));",
      }}
    >
      <ContentBox
        sxProps={{
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Bar
          data={chart1}
          className="chart"
          options={{
            scales: {
              y: {
                ticks: {
                  callback: (value) => `S/. ${value}`,
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => `S/. ${context.formattedValue}`,
                },
              },
              title: {
                text: "LOS 5 DÍAS CON MÁS VENTAS",
                display: true,
                font: { size: 24 },
              },
            },
          }}
        />
      </ContentBox>
    </Box>
  );
};

export default SaleDataGraphics;
