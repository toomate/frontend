import { useMemo, useState } from "react";
import { AlertTriangle, ClipboardList, Download, TrendingDown, TrendingUp } from "lucide-react";
import CardResumoAdmin from "./AdminStatCard";

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarDataBr(dataIso) {
  if (!dataIso || !/^\d{4}-\d{2}-\d{2}$/.test(String(dataIso))) return "-";
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterPrimeiroDiaMesIso() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function obterHojeIso() {
  return new Date().toISOString().slice(0, 10);
}


export default function AdminRelatorios({ lancamentosInsumos }) {
  const hojeIso = useMemo(() => obterHojeIso(), []);

  const [dataInicial, setDataInicial] = useState(obterPrimeiroDiaMesIso);
  const [dataFinal, setDataFinal] = useState(obterHojeIso);
  const [insumosSelecionados, setInsumosSelecionados] = useState([]);
  const [filtroInsumosAberto, setFiltroInsumosAberto] = useState(false);
  const [buscaInsumos, setBuscaInsumos] = useState("");
  const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState([]);
  const [filtroFornecedoresAberto, setFiltroFornecedoresAberto] = useState(false);
  const [buscaFornecedores, setBuscaFornecedores] = useState("");
  const [relatorioAtivo, setRelatorioAtivo] = useState("compras");

  const opcoesInsumo = useMemo(
    () =>
      Array.from(new Set(lancamentosInsumos.map((l) => l.insumo))).sort((a, b) =>
        a.localeCompare(b, "pt-BR")
      ),
    [lancamentosInsumos]
  );

  const opcoesFornecedor = useMemo(
    () =>
      Array.from(new Set(lancamentosInsumos.map((l) => l.fornecedor))).sort((a, b) =>
        a.localeCompare(b, "pt-BR")
      ),
    [lancamentosInsumos]
  );

  const opcoesFornecedorFiltradas = useMemo(
    () =>
      buscaFornecedores.trim()
        ? opcoesFornecedor.filter((f) =>
            f.toLowerCase().includes(buscaFornecedores.toLowerCase())
          )
        : opcoesFornecedor,
    [opcoesFornecedor, buscaFornecedores]
  );

  const opcoesInsumoFiltradas = useMemo(
    () =>
      buscaInsumos.trim()
        ? opcoesInsumo.filter((i) =>
            i.toLowerCase().includes(buscaInsumos.toLowerCase())
          )
        : opcoesInsumo,
    [opcoesInsumo, buscaInsumos]
  );

  function alternarInsumo(insumo) {
    setInsumosSelecionados((prev) =>
      prev.includes(insumo) ? prev.filter((i) => i !== insumo) : [...prev, insumo]
    );
  }

  function alternarFornecedor(fornecedor) {
    setFornecedoresSelecionados((prev) =>
      prev.includes(fornecedor) ? prev.filter((f) => f !== fornecedor) : [...prev, fornecedor]
    );
  }

  function limparFiltros() {
    setDataInicial(obterPrimeiroDiaMesIso());
    setDataFinal(obterHojeIso());
    setInsumosSelecionados([]);
    setBuscaInsumos("");
    setFornecedoresSelecionados([]);
    setBuscaFornecedores("");
  }

  const resumoFiltroFornecedores =
    fornecedoresSelecionados.length === 0
      ? "Todos os fornecedores"
      : fornecedoresSelecionados.length === 1
      ? fornecedoresSelecionados[0]
      : `${fornecedoresSelecionados.length} fornecedores`;

  const resumoFiltroInsumos =
    insumosSelecionados.length === 0
      ? "Todos os insumos"
      : insumosSelecionados.length === 1
      ? insumosSelecionados[0]
      : `${insumosSelecionados.length} insumos`;

  const lancamentosFiltrados = useMemo(() => {
    return lancamentosInsumos.filter((l) => {
      if (dataInicial && l.dataIso < dataInicial) return false;
      if (dataFinal && l.dataIso > dataFinal) return false;
      if (insumosSelecionados.length > 0 && !insumosSelecionados.includes(l.insumo))
        return false;
      if (fornecedoresSelecionados.length > 0 && !fornecedoresSelecionados.includes(l.fornecedor))
        return false;
      return true;
    });
  }, [lancamentosInsumos, dataInicial, dataFinal, insumosSelecionados, fornecedoresSelecionados]);

  const totalCompras = useMemo(
    () => lancamentosFiltrados.reduce((acum, l) => acum + (Number(l.valorTotal) || 0), 0),
    [lancamentosFiltrados]
  );

  const mediaCompra =
    lancamentosFiltrados.length > 0 ? totalCompras / lancamentosFiltrados.length : 0;

  const topInsumosPorGasto = useMemo(() => {
    const mapa = new Map();
    lancamentosFiltrados.forEach((l) => {
      const atual = mapa.get(l.insumo) ?? { insumo: l.insumo, total: 0, qtd: 0 };
      atual.total += Number(l.valorTotal) || 0;
      atual.qtd += 1;
      mapa.set(l.insumo, atual);
    });
    return Array.from(mapa.values()).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [lancamentosFiltrados]);

  const topFornecedores = useMemo(() => {
    const mapa = new Map();
    lancamentosFiltrados.forEach((l) => {
      const atual = mapa.get(l.fornecedor) ?? { fornecedor: l.fornecedor, total: 0, qtd: 0 };
      atual.total += Number(l.valorTotal) || 0;
      atual.qtd += 1;
      mapa.set(l.fornecedor, atual);
    });
    return Array.from(mapa.values()).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [lancamentosFiltrados]);

  const itensPerdidos = useMemo(() => {
    const mapa = new Map();
    lancamentosFiltrados.forEach((lancamento, indice) => {
      const dataValidadeIso = String(lancamento.dataValidadeIso || "");
      const quantidadeEstoque = Number(lancamento.quantidadeEstoque) || 0;
      if (!dataValidadeIso || quantidadeEstoque <= 0) return;
      if (dataValidadeIso >= hojeIso) return;
      const precoUnitario = Number(lancamento.precoUnitario) || 0;
      const produto =
        String(lancamento.insumo || "").trim() || `Produto ${indice + 1}`;
      const perdaAtual = mapa.get(produto) ?? {
        id: produto,
        produto,
        valorTotal: 0,
        quantidadeTotal: 0,
        lotesVencidos: 0,
        ultimaDataValidadeIso: dataValidadeIso,
      };
      perdaAtual.valorTotal += precoUnitario * quantidadeEstoque;
      perdaAtual.quantidadeTotal += quantidadeEstoque;
      perdaAtual.lotesVencidos += 1;
      if (dataValidadeIso > perdaAtual.ultimaDataValidadeIso) {
        perdaAtual.ultimaDataValidadeIso = dataValidadeIso;
      }
      mapa.set(produto, perdaAtual);
    });
    return Array.from(mapa.values()).sort((a, b) => b.valorTotal - a.valorTotal);
  }, [hojeIso, lancamentosFiltrados]);

  const totalPerdas = useMemo(
    () => itensPerdidos.reduce((acum, item) => acum + (Number(item.valorTotal) || 0), 0),
    [itensPerdidos]
  );

  const totalUnidadesPerdidas = itensPerdidos.reduce(
    (acum, item) => acum + item.quantidadeTotal,
    0
  );

  const periodoLabel = `${formatarDataBr(dataInicial)} — ${formatarDataBr(dataFinal)}`;

  return (
    <section className="admin-relatorios-container">
      <header className="admin-relatorios-topo">
        <div>
          <h2>Relatórios</h2>
          <p>Período: {periodoLabel}</p>
        </div>

        <button type="button" className="admin-relatorios-pdf-btn" onClick={() => window.print()}>
          <Download size={15} />
          Baixar PDF
        </button>
      </header>

      <section className="admin-filtros" aria-label="Filtros do relatório">
        <div className="admin-filtro-campo admin-filtro-campo-insumos">
          <label>Insumos</label>
          <div className="admin-filtro-dropdown">
            <button
              type="button"
              className={`admin-filtro-dropdown-botao ${filtroInsumosAberto ? "aberto" : ""}`}
              onClick={() => {
                setFiltroInsumosAberto((v) => {
                  if (v) setBuscaInsumos("");
                  return !v;
                });
              }}
            >
              <span>{resumoFiltroInsumos}</span>
              <span className="admin-filtro-dropdown-seta" />
            </button>

            {filtroInsumosAberto && (
              <div className="admin-filtro-dropdown-menu">
                <input
                  type="text"
                  className="admin-filtro-busca"
                  placeholder="Buscar insumo..."
                  value={buscaInsumos}
                  onChange={(e) => setBuscaInsumos(e.target.value)}
                />
                <div className="admin-filtro-checklist">
                  {opcoesInsumoFiltradas.length > 0 ? (
                    opcoesInsumoFiltradas.map((insumo) => (
                      <label key={insumo} className="admin-filtro-check-item">
                        <input
                          type="checkbox"
                          checked={insumosSelecionados.includes(insumo)}
                          onChange={() => alternarInsumo(insumo)}
                        />
                        <span>{insumo}</span>
                      </label>
                    ))
                  ) : (
                    <p className="admin-filtro-vazio">Nenhum insumo encontrado.</p>
                  )}
                </div>
                <div className="admin-filtro-checklist-acoes">
                  <button
                    type="button"
                    className="admin-filtro-check-btn"
                    disabled={opcoesInsumoFiltradas.length === 0}
                    onClick={() =>
                      setInsumosSelecionados(opcoesInsumoFiltradas)
                    }
                  >
                    Marcar todos
                  </button>
                  <button
                    type="button"
                    className="admin-filtro-check-btn"
                    onClick={() => setInsumosSelecionados([])}
                  >
                    Limpar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="admin-filtro-campo admin-filtro-campo-insumos">
          <label>Fornecedores</label>
          <div className="admin-filtro-dropdown">
            <button
              type="button"
              className={`admin-filtro-dropdown-botao ${filtroFornecedoresAberto ? "aberto" : ""}`}
              onClick={() => {
                setFiltroFornecedoresAberto((v) => {
                  if (v) setBuscaFornecedores("");
                  return !v;
                });
                setFiltroInsumosAberto(false);
                setBuscaInsumos("");
              }}
            >
              <span>{resumoFiltroFornecedores}</span>
              <span className="admin-filtro-dropdown-seta" />
            </button>

            {filtroFornecedoresAberto && (
              <div className="admin-filtro-dropdown-menu">
                <input
                  type="text"
                  className="admin-filtro-busca"
                  placeholder="Buscar fornecedor..."
                  value={buscaFornecedores}
                  onChange={(e) => setBuscaFornecedores(e.target.value)}
                />
                <div className="admin-filtro-checklist">
                  {opcoesFornecedorFiltradas.length > 0 ? (
                    opcoesFornecedorFiltradas.map((fornecedor) => (
                      <label key={fornecedor} className="admin-filtro-check-item">
                        <input
                          type="checkbox"
                          checked={fornecedoresSelecionados.includes(fornecedor)}
                          onChange={() => alternarFornecedor(fornecedor)}
                        />
                        <span>{fornecedor}</span>
                      </label>
                    ))
                  ) : (
                    <p className="admin-filtro-vazio">Nenhum fornecedor encontrado.</p>
                  )}
                </div>
                <div className="admin-filtro-checklist-acoes">
                  <button
                    type="button"
                    className="admin-filtro-check-btn"
                    disabled={opcoesFornecedorFiltradas.length === 0}
                    onClick={() => setFornecedoresSelecionados(opcoesFornecedorFiltradas)}
                  >
                    Marcar todos
                  </button>
                  <button
                    type="button"
                    className="admin-filtro-check-btn"
                    onClick={() => setFornecedoresSelecionados([])}
                  >
                    Limpar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="admin-filtro-campo">
          <label htmlFor="relatorio-data-inicial">Data inicial</label>
          <input
            id="relatorio-data-inicial"
            type="date"
            className="admin-filtro-input"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
          />
        </div>

        <div className="admin-filtro-campo">
          <label htmlFor="relatorio-data-final">Data final</label>
          <input
            id="relatorio-data-final"
            type="date"
            className="admin-filtro-input"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
          />
        </div>

        <div className="admin-filtro-campo admin-filtro-campo-acoes">
          <span className="admin-filtro-label-fantasma" aria-hidden="true">Ações</span>
          <button type="button" className="admin-filtro-limpar" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
      </section>

      <div className="admin-relatorios-grid">
        <CardResumoAdmin
          className={`admin-relatorio-card ${relatorioAtivo === "compras" ? "is-active" : ""}`}
          titulo="Custo Total de Compras"
          metrica={formatarMoeda(totalCompras)}
          icone={ClipboardList}
          iconeCor="#2f80ed"
          rotuloAcao="Ver relatório"
          aoClicarAcao={() => setRelatorioAtivo("compras")}
        >
          <p className="admin-card-subtitle">{periodoLabel}</p>
          <p className="admin-empty-list">{lancamentosFiltrados.length} lançamentos no período</p>
        </CardResumoAdmin>

        <CardResumoAdmin
          className={`admin-relatorio-card ${relatorioAtivo === "perdas" ? "is-active" : ""}`}
          titulo="Valor Total de Itens Perdidos"
          metrica={formatarMoeda(totalPerdas)}
          icone={AlertTriangle}
          iconeCor="#c92c2c"
          rotuloAcao="Ver relatório"
          aoClicarAcao={() => setRelatorioAtivo("perdas")}
        >
          {itensPerdidos.length > 0 ? (
            <p className="admin-empty-list">
              {itensPerdidos.length} insumo(s) com perda por validade
            </p>
          ) : (
            <p className="admin-empty-list">Sem perdas por validade no período</p>
          )}
        </CardResumoAdmin>
      </div>

      <article className="admin-card admin-relatorio-detalhe">
        {relatorioAtivo === "compras" ? (
          <>
            <div className="admin-relatorio-detalhe-header">
              <div>
                <h3>Relatório de Compras</h3>
                <p>{periodoLabel}</p>
              </div>
            </div>

            <div className="admin-relatorio-metricas">
              <div className="admin-relatorio-metrica-item">
                <span>Total gasto</span>
                <strong>{formatarMoeda(totalCompras)}</strong>
              </div>
              <div className="admin-relatorio-metrica-item">
                <span>Lançamentos</span>
                <strong>{lancamentosFiltrados.length}</strong>
              </div>
              <div className="admin-relatorio-metrica-item">
                <span>Média por compra</span>
                <strong>{formatarMoeda(mediaCompra)}</strong>
              </div>
            </div>

            {topInsumosPorGasto.length > 0 ? (
              <>
                <h4 className="admin-relatorio-subtitulo">
                  <TrendingUp size={14} /> Top insumos por gasto
                </h4>
                <div className="admin-relatorio-tabela-wrapper">
                  <table className="admin-relatorio-tabela">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Insumo</th>
                        <th>Compras</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topInsumosPorGasto.map((item, i) => (
                        <tr key={item.insumo}>
                          <td className="admin-relatorio-rank">{i + 1}</td>
                          <td>{item.insumo}</td>
                          <td>{item.qtd}</td>
                          <td><strong>{formatarMoeda(item.total)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}

            {topFornecedores.length > 0 ? (
              <>
                <h4 className="admin-relatorio-subtitulo">
                  <TrendingUp size={14} /> Top fornecedores por gasto
                </h4>
                <div className="admin-relatorio-tabela-wrapper">
                  <table className="admin-relatorio-tabela">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Fornecedor</th>
                        <th>Pedidos</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topFornecedores.map((item, i) => (
                        <tr key={item.fornecedor}>
                          <td className="admin-relatorio-rank">{i + 1}</td>
                          <td>{item.fornecedor}</td>
                          <td>{item.qtd}</td>
                          <td><strong>{formatarMoeda(item.total)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}

            {lancamentosFiltrados.length === 0 ? (
              <p className="admin-empty-list">Nenhum lançamento no período.</p>
            ) : null}
          </>
        ) : null}

        {relatorioAtivo === "perdas" ? (
          <>
            <div className="admin-relatorio-detalhe-header">
              <div>
                <h3>Relatório de Perdas por Validade</h3>
                <p>{periodoLabel}</p>
              </div>
            </div>

            {itensPerdidos.length > 0 ? (
              <>
                <div className="admin-relatorio-metricas">
                  <div className="admin-relatorio-metrica-item">
                    <span>Valor total perdido</span>
                    <strong className="admin-relatorio-metrica-alerta">{formatarMoeda(totalPerdas)}</strong>
                  </div>
                  <div className="admin-relatorio-metrica-item">
                    <span>Insumos afetados</span>
                    <strong>{itensPerdidos.length}</strong>
                  </div>
                  <div className="admin-relatorio-metrica-item">
                    <span>Unidades perdidas</span>
                    <strong>{totalUnidadesPerdidas}</strong>
                  </div>
                </div>

                <h4 className="admin-relatorio-subtitulo">
                  <TrendingDown size={14} /> Insumos com perdas
                </h4>
                <div className="admin-relatorio-tabela-wrapper">
                  <table className="admin-relatorio-tabela">
                    <thead>
                      <tr>
                        <th>Insumo</th>
                        <th>Lotes</th>
                        <th>Unidades</th>
                        <th>Último venc.</th>
                        <th>Valor perdido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensPerdidos.map((item) => (
                        <tr key={item.id}>
                          <td>{item.produto}</td>
                          <td>{item.lotesVencidos}</td>
                          <td>{item.quantidadeTotal}</td>
                          <td>{formatarDataBr(item.ultimaDataValidadeIso)}</td>
                          <td>
                            <strong className="admin-relatorio-metrica-alerta">
                              {formatarMoeda(item.valorTotal)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="admin-empty-list">Sem itens vencidos no período.</p>
            )}
          </>
        ) : null}
      </article>
    </section>
  );
}
