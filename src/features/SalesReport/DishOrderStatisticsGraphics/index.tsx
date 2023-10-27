import Box from "@mui/material/Box";
import ContentBox from "@/components/ContentBox";
import { IDishOrderStatistics } from "@/interfaces/IDish";
import { Bar } from "react-chartjs-2";
import { colorsForChart, colorsWithAlphaForChart } from "@/utils";

interface IDishOrderStatisticsGraphicsProps {
  data: IDishOrderStatistics[];
}

const DishOrderStatisticsGraphics = ({
  data,
}: IDishOrderStatisticsGraphicsProps) => {
  const chart1 = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        label: "Cantidad de platos vendidos",
        data: data
          .map((d) => d.quantityOfDishesSold)
          .sort((a, b) => b - a)
          .slice(0, 5),
        hoverOffset: 4,
        backgroundColor: colorsWithAlphaForChart.slice().reverse(),
        borderColor: colorsForChart.slice().reverse(),
        borderWidth: 1,
      },
    ],
  };

  const chart2 = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        label: "Cantidad recaudada",
        data: data.map((d) => d.totalSales).slice(0, 5),
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
            plugins: {
              title: {
                text: "LOS 5 PLATOS MÁS VENDIDOS",
                display: true,
                font: { size: 24 },
              },
            },
          }}
        />
      </ContentBox>

      <ContentBox
        sxProps={{
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Bar
          data={chart2}
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
                text: "GANANACIAS POR LOS 5 PLATOS MÁS VENDIDOS",
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

export default DishOrderStatisticsGraphics;
