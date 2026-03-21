import { useMemo, useState } from "react";
import { AlertTriangle, ClipboardList } from "lucide-react";
import CardResumoAdmin from "./AdminStatCard";

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarDataBr(dataIso) {
  if (!dataIso || !/^\d{4}-\d{2}-\d{2}$/.test(String(dataIso))) {
    return "-";
  }

  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterIntervaloPeriodo(periodo) {
  const fim = new Date();
  fim.setHours(12, 0, 0, 0);

  const inicio = new Date(fim);
  if (periodo === "semanal") {
    inicio.setDate(inicio.getDate() - 6);
  } else {
    inicio.setDate(1);
  }

  return {
    inicioIso: inicio.toISOString().slice(0, 10),
    fimIso: fim.toISOString().slice(0, 10),
  };
}

export default function AdminRelatorios({ lancamentosInsumos }) {
  const [periodo, setPeriodo] = useState("semanal");
  const [relatorioAtivo, setRelatorioAtivo] = useState("compras");
  const hojeIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const intervalo = useMemo(() => obterIntervaloPeriodo(periodo), [periodo]);

  const comprasPeriodo = useMemo(
    () =>
      lancamentosInsumos.filter(
        (lancamento) =>
          lancamento.dataIso >= intervalo.inicioIso && lancamento.dataIso <= intervalo.fimIso
      ),
    [intervalo.fimIso, intervalo.inicioIso, lancamentosInsumos]
  );

  const totalComprasPeriodo = useMemo(
    () => comprasPeriodo.reduce((acum, item) => acum + (Number(item.valorTotal) || 0), 0),
    [comprasPeriodo]
  );

  const itensPerdidosPeriodo = useMemo(
    () => {
      const perdasPorProduto = new Map();

      lancamentosInsumos.forEach((lancamento, indice) => {
        const dataValidadeIso = String(lancamento.dataValidadeIso || "");
        const quantidadeEstoque = Number(lancamento.quantidadeEstoque) || 0;

        if (!dataValidadeIso || quantidadeEstoque <= 0) {
          return;
        }

        if (dataValidadeIso >= hojeIso) {
          return;
        }

        if (
          dataValidadeIso < intervalo.inicioIso ||
          dataValidadeIso > intervalo.fimIso
        ) {
          return;
        }

        const precoUnitario = Number(lancamento.precoUnitario) || 0;
        const valorPerdido = precoUnitario * quantidadeEstoque;
        const produto = String(lancamento.insumo || "").trim() || `Produto ${indice + 1}`;

        const perdaAtual = perdasPorProduto.get(produto) ?? {
          id: produto,
          produto,
          valorTotal: 0,
          quantidadeTotal: 0,
          lotesVencidos: 0,
          ultimaDataValidadeIso: dataValidadeIso,
        };

        perdaAtual.valorTotal += valorPerdido;
        perdaAtual.quantidadeTotal += quantidadeEstoque;
        perdaAtual.lotesVencidos += 1;
        if (dataValidadeIso > perdaAtual.ultimaDataValidadeIso) {
          perdaAtual.ultimaDataValidadeIso = dataValidadeIso;
        }

        perdasPorProduto.set(produto, perdaAtual);
      });

      return Array.from(perdasPorProduto.values()).sort(
        (a, b) => b.valorTotal - a.valorTotal
      );
    },
    [hojeIso, intervalo.fimIso, intervalo.inicioIso, lancamentosInsumos]
  );

  const totalPerdasPeriodo = useMemo(
    () =>
      itensPerdidosPeriodo.reduce((acum, item) => acum + (Number(item.valorTotal) || 0), 0),
    [itensPerdidosPeriodo]
  );

  const subtituloPeriodo =
    periodo === "semanal" ? "Valor total da semana atual" : "Valor total do mês atual";

  return (
    <section className="admin-relatorios-container">
      <header className="admin-relatorios-topo">
        <div>
          <h2>Relatórios</h2>
          <p>
            Período: {intervalo.inicioIso.split("-").reverse().join("/")} até{" "}
            {intervalo.fimIso.split("-").reverse().join("/")}
          </p>
        </div>

        <div className="admin-relatorios-periodo">
          <button
            type="button"
            className={`admin-relatorios-periodo-btn ${periodo === "semanal" ? "is-active" : ""}`}
            onClick={() => setPeriodo("semanal")}
          >
            Semanal
          </button>
          <button
            type="button"
            className={`admin-relatorios-periodo-btn ${periodo === "mensal" ? "is-active" : ""}`}
            onClick={() => setPeriodo("mensal")}
          >
            Mensal
          </button>
        </div>
      </header>

      <div className="admin-relatorios-grid">
        <CardResumoAdmin
          className={`admin-relatorio-card ${
            relatorioAtivo === "compras" ? "is-active" : ""
          }`}
          titulo="Custo Total de Compras"
          metrica={formatarMoeda(totalComprasPeriodo)}
          icone={ClipboardList}
          iconeCor="#2f80ed"
          rotuloAcao="Relatório"
          aoClicarAcao={() => setRelatorioAtivo("compras")}
        >
          <p className="admin-card-subtitle">{subtituloPeriodo}</p>
          <p className="admin-empty-list">
            {comprasPeriodo.length} lançamentos de compra no período.
          </p>
        </CardResumoAdmin>

        <CardResumoAdmin
          className={`admin-relatorio-card ${
            relatorioAtivo === "perdas" ? "is-active" : ""
          }`}
          titulo="Valor Total de Itens Perdidos"
          metrica={formatarMoeda(totalPerdasPeriodo)}
          icone={AlertTriangle}
          iconeCor="#c92c2c"
          rotuloAcao="Relatório"
          aoClicarAcao={() => setRelatorioAtivo("perdas")}
        >
          {itensPerdidosPeriodo.length > 0 ? (
            <p className="admin-empty-list">
              {itensPerdidosPeriodo.length} insumo(s) com perda por validade no período.
            </p>
          ) : (
            <p className="admin-empty-list">Sem perdas por validade no período.</p>
          )}
        </CardResumoAdmin>

      </div>

      <article className="admin-card admin-relatorio-detalhe">
        {relatorioAtivo === "compras" ? (
          <>
            <h3>Relatório de compras</h3>
            <p>
              Total do período: <strong>{formatarMoeda(totalComprasPeriodo)}</strong>
            </p>
          </>
        ) : null}

        {relatorioAtivo === "perdas" ? (
          <>
            <h3>Relatório de perdas por validade</h3>
            {itensPerdidosPeriodo.length > 0 ? (
              <ul className="admin-simple-list">
                {itensPerdidosPeriodo.map((item) => (
                  <li key={item.id}>
                    {item.produto} - {formatarMoeda(item.valorTotal)} ({item.quantidadeTotal} und em{" "}
                    {item.lotesVencidos} lote{item.lotesVencidos > 1 ? "s" : ""}) - Vencido em: {formatarDataBr(item.ultimaDataValidadeIso)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-empty-list">Sem itens vencidos no período.</p>
            )}
          </>
        ) : null}

      </article>
    </section>
  );
}
