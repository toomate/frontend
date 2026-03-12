import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function Grafico() {
  
  const [state] = useState({
    series: [
      {
        name: "Actual",
        data: [
          { x: "2011", y: 1292, goals: [{ name: "Expected", value: 1400, strokeHeight: 5, strokeColor: "red" }] },
          { x: "2012", y: 4432, goals: [{ name: "Expected", value: 5400, strokeHeight: 5, strokeColor: "red" }] },
          { x: "2013", y: 5423, goals: [{ name: "Expected", value: 5200, strokeHeight: 5, strokeColor: "red" }] },
          { x: "2014", y: 6653, goals: [{ name: "Expected", value: 6500, strokeHeight: 5, strokeColor: "red" }] },
          { x: "2015", y: 8133, goals: [{ name: "Expected", value: 6600, strokeHeight: 13, strokeWidth: 0, strokeLineCap: "round", strokeColor: "red" }] },
          { x: "2016", y: 7132, goals: [{ name: "Expected", value: 7500, strokeHeight: 5, strokeColor: "red" }] },
          { x: "2017", y: 7332, goals: [{ name: "Expected", value: 8700, strokeHeight: 5, strokeColor: "red" }] },
          { x: "2018", y: 6553, goals: [{ name: "Expected", value: 7300, strokeHeight: 2, strokeDashArray: 2, strokeColor: "red" }] }
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