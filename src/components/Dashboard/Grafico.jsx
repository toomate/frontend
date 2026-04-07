import React from "react";
import ReactApexChart from "react-apexcharts";

export default function Grafico({ dados }) {
  const options = {
    chart: {
      type: "bar",
      height: 380,
      width: "100%",
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "52%",
        borderRadius: 4,
      },
    },
    colors: ["green"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ["Atual", "Esperado"],
      markers: {
        fillColors: ["green", "red"],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return Math.floor(val);
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 380,
          },
          plotOptions: {
            bar: {
              columnWidth: "72%",
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 380,
          },
          plotOptions: {
            bar: {
              columnWidth: "82%",
            },
          },
        },
      },
    ],
  };

  return (
    <div id="chart" style={{ width: "100%", height: "100%", minHeight: "380px" }}>
      <ReactApexChart
        options={options}
        series={[{ name: "Estoque", data: dados }]}
        type="bar"
        width="100%"
        height={380}
      />
    </div>
  );
}
