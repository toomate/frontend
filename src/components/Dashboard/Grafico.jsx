import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Lote } from "../../provider/Api";
import { useEffect } from "react";

export default function Grafico({dados}) {
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
        height: "100%",
        width: "100%"
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
        customLegendItems: ["Atual", "Esperado"],
        markers: {
          fillColors: ["green", "red"]
        }
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return Math.floor(val);
          }
        }
      }
    }
  });

  return (
    <div id="chart" style={{ width: "100%", height: "100%" }}>
      <ReactApexChart
        options={state.options}
        series={[{ name: "Estoque", data: dados }]}
        type="bar"
        width="100%"
        height="100%"
      />
    </div>
  );
}