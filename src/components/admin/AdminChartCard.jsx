import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import ReactApexChart from "react-apexcharts";

function formatarMoedaPrecisa(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function truncarTexto(texto, limite) {
  const textoNormalizado = String(texto ?? "");
  if (textoNormalizado.length <= limite) {
    return textoNormalizado;
  }
  return `${textoNormalizado.slice(0, limite).trim()}...`;
}

export default function CardGraficoAdmin({ titulo, subtitulo, categorias, serie }) {
  const LIMITE_MOBILE_INSUMOS = 5;
  const [modoMobile, setModoMobile] = useState(false);
  const [mostrarTodosMobile, setMostrarTodosMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");

    function atualizarModoMobile() {
      setModoMobile(mediaQuery.matches);
    }

    atualizarModoMobile();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", atualizarModoMobile);
    } else {
      mediaQuery.addListener(atualizarModoMobile);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", atualizarModoMobile);
      } else {
        mediaQuery.removeListener(atualizarModoMobile);
      }
    };
  }, []);

  useEffect(() => {
    if (!modoMobile) {
      setMostrarTodosMobile(false);
    }
  }, [modoMobile]);

  const precisaResumirNoMobile =
    modoMobile && categorias.length > LIMITE_MOBILE_INSUMOS;

  const categoriasExibidas =
    precisaResumirNoMobile && !mostrarTodosMobile
      ? categorias.slice(0, LIMITE_MOBILE_INSUMOS)
      : categorias;

  const serieExibida = useMemo(
    () =>
      (serie ?? []).map((itemSerie) => ({
        ...itemSerie,
        data: (itemSerie.data ?? []).slice(0, categoriasExibidas.length),
      })),
    [categoriasExibidas.length, serie]
  );

  const maiorValorSerie = useMemo(() => {
    const valores = serieExibida.flatMap((item) => item.data ?? []);
    const maiorValor = Math.max(0, ...valores.map((valor) => Number(valor) || 0));
    return maiorValor;
  }, [serieExibida]);

  const opcoes = useMemo(
    () => ({
      chart: {
        toolbar: { show: false },
        fontFamily: "Arial, sans-serif",
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: "58%",
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (valor) => formatarMoedaPrecisa(valor),
        offsetX: 8,
        textAnchor: "start",
        style: {
          colors: ["#6b4423"],
          fontSize: "11px",
          fontWeight: 700,
        },
        dropShadow: {
          enabled: false,
        },
      },
      stroke: { width: 0 },
      xaxis: {
        categories: categoriasExibidas,
        max: maiorValorSerie > 0 ? maiorValorSerie * 1.2 : undefined,
        labels: {
          show: false,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (valor) => truncarTexto(valor, modoMobile ? 14 : 24),
          style: { colors: "#6f6f6f" },
        },
      },
      grid: {
        borderColor: "#e3e1de",
        strokeDashArray: 4,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
        fontSize: "14px",
      },
      tooltip: {
        y: {
          formatter: (valor) =>
            valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        },
      },
      responsive: [
        {
          breakpoint: 620,
          options: {
            dataLabels: {
              offsetX: 6,
              style: {
                fontSize: "10px",
              },
            },
            legend: {
              position: "bottom",
              horizontalAlign: "center",
            },
          },
        },
      ],
    }),
    [categoriasExibidas, maiorValorSerie, modoMobile]
  );

  const alturaGrafico = modoMobile && precisaResumirNoMobile ? 330 : 360;

  return (
    <article className="admin-card admin-chart-card">
      <div className="admin-chart-header">
        <h2>
          <TrendingUp size={17} />
          {titulo}
        </h2>
        <p>{subtitulo}</p>
      </div>

      <div className="admin-chart-area">
        <ReactApexChart
          options={opcoes}
          series={serieExibida}
          type="bar"
          height={alturaGrafico}
        />
      </div>

      {precisaResumirNoMobile ? (
        <button
          type="button"
          className="admin-chart-toggle-btn"
          onClick={() => setMostrarTodosMobile((estadoAtual) => !estadoAtual)}
        >
          {mostrarTodosMobile ? "Mostrar menos" : "Ver todos"}
        </button>
      ) : null}
    </article>
  );
}

