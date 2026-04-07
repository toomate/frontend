import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function Grafico({ dados }) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil((dados?.length || 0) / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const dadosPaginados = useMemo(() => {
    const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
    const fim = inicio + ITEMS_PER_PAGE;
    return (dados || []).slice(inicio, fim);
  }, [dados, currentPage]);

  const irParaPaginaAnterior = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const irParaProximaPagina = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const options = {
    chart: {
      type: "bar",
      height: "100%",
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
    <div className="grafico-paginado">
      <div className="chart-area" id="chart">
        <ReactApexChart
          options={options}
          series={[{ name: "Estoque", data: dadosPaginados }]}
          type="bar"
          width="100%"
          height="100%"
        />
      </div>

      <div className="chart-pagination">
        <button
          type="button"
          className="chart-page-arrow"
          onClick={irParaPaginaAnterior}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          ←
        </button>

        <span className="chart-page-indicator">Página {currentPage} de {totalPages}</span>

        <button
          type="button"
          className="chart-page-arrow"
          onClick={irParaProximaPagina}
          disabled={currentPage === totalPages}
          aria-label="Próxima página"
        >
          →
        </button>
      </div>
    </div>
  );
}
