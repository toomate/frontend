import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Lote } from "../../provider/Api";
import { useEffect } from "react";

export default function Grafico() {
      const [lotes, setLotes] = useState([]);
    async function fetchLotes() {
    const lotesData = await Lote.listarLotes()
    console.log(lotesData)
    var lotesFormatados = []
    for (const lote of lotesData) {
      var loteFormatado = {
        x: lote.marca.insumo.nome,
        y: lote.quantidadeMedida,
        goals: [
          {
            name: "Estoque Mínimo",
            value: lote.marca.insumo.qtdMinima,
            strokeHeight: 5,
            strokeColor: "red"
          }
        ]
      }
      lotesFormatados.push(loteFormatado)
    }
    setLotes(lotesFormatados)
  }
  useEffect(() => {
    fetchLotes();
  }, []);
    useEffect(() => {
    console.log(lotes);

  }, [lotes]);
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
        customLegendItems: ["Atual", "Esperado"],
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
        series={[{ name: "Estoque", data: lotes }]}
        type="bar"
        height={350}
      />
    </div>
  );
}