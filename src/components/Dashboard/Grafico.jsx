import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Lote } from "../../provider/Api";

export default function Grafico() {
  const [state] = useState({
    series: [
      {
        name: "Actual",
        data: [
          { x: "2011", y: 1292, goals: [{ name: "Expected", value: 1400, strokeHeight: 5, strokeColor: "red" }] }
        ]
      }
    ],
    options: {
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          columnWidth: "60%"
        }
      },
      colors: ["green"],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["Actual", "Expected"],
        markers: {
          fillColors: ["green", "red"]
        }
      }
    }
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </div>
  );
}