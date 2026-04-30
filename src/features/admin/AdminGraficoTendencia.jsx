import { useMemo } from "react";
import { LineChart } from "lucide-react";
import ReactApexChart from "react-apexcharts";

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function rotuloDeMes(anoMes) {
  const [ano, mes] = anoMes.split("-");
  const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${nomes[Number(mes) - 1]}/${String(ano).slice(2)}`;
}

export default function AdminGraficoTendencia({ lancamentos }) {
  const { meses, valores } = useMemo(() => {
    const mapa = new Map();

    (lancamentos ?? []).forEach((l) => {
      if (!l.dataIso) return;
      const anoMes = l.dataIso.slice(0, 7);
      mapa.set(anoMes, (mapa.get(anoMes) ?? 0) + (Number(l.valorTotal) || 0));
    });

    const ordenados = Array.from(mapa.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    return {
      meses: ordenados.map(([anoMes]) => rotuloDeMes(anoMes)),
      valores: ordenados.map(([, v]) => Math.round(v * 100) / 100),
    };
  }, [lancamentos]);

  const opcoes = useMemo(
    () => ({
      chart: {
        toolbar: { show: false },
        fontFamily: "Arial, sans-serif",
        zoom: { enabled: false },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.02,
          stops: [0, 95],
        },
      },
      colors: ["#b88b09"],
      xaxis: {
        categories: meses,
        labels: {
          style: { colors: "#6f6f6f", fontSize: "12px" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (v) => formatarMoeda(v),
          style: { colors: "#6f6f6f", fontSize: "11px" },
        },
      },
      grid: {
        borderColor: "#e3e1de",
        strokeDashArray: 4,
      },
      dataLabels: { enabled: false },
      markers: {
        size: 4,
        colors: ["#b88b09"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      tooltip: {
        y: { formatter: (v) => formatarMoeda(v) },
      },
    }),
    [meses]
  );

  const semDados = valores.length === 0;

  return (
    <article className="admin-card admin-chart-card">
      <div className="admin-chart-header">
        <h2>
          <LineChart size={17} />
          Evolução dos gastos
        </h2>
        <p>Total mensal ao longo do histórico</p>
      </div>

      <div className="admin-chart-area">
        {semDados ? (
          <p style={{ color: "#9e9e9e", fontSize: 14, padding: "40px 0", textAlign: "center" }}>
            Sem dados suficientes para exibir a tendência.
          </p>
        ) : (
          <ReactApexChart
            options={opcoes}
            series={[{ name: "Gastos", data: valores }]}
            type="area"
            height={360}
          />
        )}
      </div>
    </article>
  );
}
