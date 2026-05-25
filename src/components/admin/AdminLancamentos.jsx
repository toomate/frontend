import { useEffect, useMemo, useState } from "react";
import { Lote } from "../../provider/Api";

const TAMANHO_PAGINA = 10;

function obterPrimeiroDiaMesIso() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function obterUltimoDiaMesIso() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarDataBr(dataIso) {
  if (!dataIso || !/^\d{4}-\d{2}-\d{2}/.test(String(dataIso))) return "-";
  const valor = String(dataIso).slice(0, 10);
  const [ano, mes, dia] = valor.split("-");
  return `${dia}/${mes}/${ano}`;
}

function dataIsoLote(lote) {
  return (
    lote?.dataEntrada ??
    lote?.dataCadastro ??
    lote?.dataValidade ??
    lote?.createdAt ??
    ""
  );
}

function normalizarTexto(valor, fallback = "") {
  const texto = String(valor ?? "").trim();
  return texto || fallback;
}

function normalizarNumero(valor, fallback = 0) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : fallback;
}

function normalizarLote(lote, indice) {
  const idLote = normalizarNumero(lote?.idLote ?? lote?.id, indice + 1);
  const insumo = normalizarTexto(
    lote?.marca?.insumo?.nome ?? lote?.insumo?.nome ?? lote?.nomeInsumo,
    "Insumo não informado"
  );
  const marca = normalizarTexto(
    lote?.marca?.nomeMarca ?? lote?.marca?.nome ?? lote?.nomeMarca,
    "Sem marca"
  );
  const fornecedor = normalizarTexto(
    lote?.fornecedor?.razaoSocial ??
      lote?.fornecedor?.nome ??
      lote?.marca?.fornecedor?.razaoSocial ??
      lote?.fornecedorNome,
    "Fornecedor não informado"
  );
  const precoUnitario = normalizarNumero(lote?.precoUnitario ?? lote?.preco, 0);
  const quantidade = normalizarNumero(
    lote?.quantidadeTotal ?? lote?.quantidadeMedida ?? lote?.quantidade,
    0
  );
  const valorTotal = normalizarNumero(
    lote?.valorTotal,
    precoUnitario * quantidade
  );
  const dataIso = String(dataIsoLote(lote)).slice(0, 10);

  return {
    id: idLote,
    insumo,
    marca,
    fornecedor,
    dataIso,
    data: formatarDataBr(dataIso),
    quantidade,
    precoUnitario,
    valorTotal,
  };
}

export default function AdminLancamentos() {
  const [dataInicial, setDataInicial] = useState(obterPrimeiroDiaMesIso);
  const [dataFinal, setDataFinal] = useState(obterUltimoDiaMesIso);
  const [pagina, setPagina] = useState(0);
  const [resposta, setResposta] = useState(null);
  const [resumo, setResumo] = useState({ totalValor: 0, totalRegistros: 0 });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setPagina(0);
  }, [dataInicial, dataFinal]);

  useEffect(() => {
    let ativo = true;

    async function buscar() {
      setCarregando(true);
      setErro("");
      try {
        const [pagedados, resumoDados] = await Promise.all([
          Lote.listarLotesPaginado({
            pagina,
            tamanho: TAMANHO_PAGINA,
            dataInicial,
            dataFinal,
          }),
          Lote.resumoPeriodoLotes({ dataInicial, dataFinal }),
        ]);
        if (!ativo) return;
        setResposta(pagedados ?? { content: [], totalElements: 0, totalPages: 1 });
        setResumo({
          totalValor: Number(resumoDados?.totalValor ?? 0),
          totalRegistros: Number(resumoDados?.totalRegistros ?? 0),
        });
      } catch {
        if (!ativo) return;
        setErro("Não foi possível carregar os lançamentos.");
        setResposta({ content: [], totalElements: 0, totalPages: 1 });
        setResumo({ totalValor: 0, totalRegistros: 0 });
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscar();
    return () => {
      ativo = false;
    };
  }, [pagina, dataInicial, dataFinal]);

  const lancamentos = useMemo(() => {
    const conteudo = Array.isArray(resposta?.content) ? resposta.content : [];
    return conteudo.map(normalizarLote);
  }, [resposta]);

  const totalPaginas = Math.max(1, resposta?.totalPages ?? 1);
  const totalRegistros = resumo.totalRegistros;
  const paginaAtualUi = pagina + 1;
  const inicio = pagina * TAMANHO_PAGINA + 1;
  const fim = Math.min(inicio + lancamentos.length - 1, totalRegistros || lancamentos.length);

  function limparFiltros() {
    setDataInicial(obterPrimeiroDiaMesIso());
    setDataFinal(obterUltimoDiaMesIso());
  }

  return (
    <section className="admin-lancamentos-page">
      <header className="admin-lancamentos-page-topo">
        <div>
          <h2>Lançamentos de gastos</h2>
        </div>
      </header>

      <section className="admin-lancamentos-filtros">
        <div className="admin-filtro-campo">
          <label htmlFor="lancamentos-data-inicial">Data inicial</label>
          <input
            id="lancamentos-data-inicial"
            type="date"
            className="admin-filtro-input"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
          />
        </div>
        <div className="admin-filtro-campo">
          <label htmlFor="lancamentos-data-final">Data final</label>
          <input
            id="lancamentos-data-final"
            type="date"
            className="admin-filtro-input"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
          />
        </div>
        <div className="admin-filtro-campo admin-filtro-campo-acoes">
          <span className="admin-filtro-label-fantasma" aria-hidden="true">Ações</span>
          <button type="button" className="admin-filtro-limpar" onClick={limparFiltros}>
            Resetar período
          </button>
        </div>
      </section>

      <section className="admin-lancamentos-resumo">
        <div className="admin-lancamentos-resumo-item">
          <span>Total do período</span>
          <strong>{formatarMoeda(resumo.totalValor)}</strong>
        </div>
        <div className="admin-lancamentos-resumo-item">
          <span>Registros no período</span>
          <strong>{totalRegistros}</strong>
        </div>
        <div className="admin-lancamentos-resumo-item">
          <span>Período</span>
          <strong>
            {formatarDataBr(dataInicial)} — {formatarDataBr(dataFinal)}
          </strong>
        </div>
      </section>

      {erro ? (
        <p className="admin-empty-list" style={{ color: "#c92c2c" }}>{erro}</p>
      ) : (
        <div className="admin-lancamentos-tabela-wrapper">
          <table className="admin-lancamentos-tabela">
            <thead>
              <tr>
                <th>Data</th>
                <th>Insumo</th>
                <th>Marca</th>
                <th>Fornecedor</th>
                <th className="t-right">Quantidade</th>
                <th className="t-right">Preço unit.</th>
                <th className="t-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {carregando && lancamentos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-empty-list">Carregando...</td>
                </tr>
              ) : lancamentos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-empty-list">
                    Nenhum lançamento no período selecionado.
                  </td>
                </tr>
              ) : (
                lancamentos.map((l) => (
                  <tr key={l.id}>
                    <td>{l.data}</td>
                    <td>{l.insumo}</td>
                    <td>{l.marca}</td>
                    <td>{l.fornecedor}</td>
                    <td className="t-right">{l.quantidade}</td>
                    <td className="t-right">{formatarMoeda(l.precoUnitario)}</td>
                    <td className="t-right"><strong>{formatarMoeda(l.valorTotal)}</strong></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-lancamentos-paginacao">
        <span className="admin-lancamentos-pag-resumo">
          {totalRegistros > 0
            ? `Mostrando ${inicio}-${fim} de ${totalRegistros}`
            : "Sem registros"}
        </span>
        <div className="admin-lancamentos-pag-acoes">
          <button
            type="button"
            className="admin-lancamentos-pag-btn"
            onClick={() => setPagina((p) => Math.max(0, p - 1))}
            disabled={carregando || pagina <= 0}
          >
            Anterior
          </button>
          <span className="admin-lancamentos-pag-info">
            Página {paginaAtualUi} de {totalPaginas}
          </span>
          <button
            type="button"
            className="admin-lancamentos-pag-btn"
            onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
            disabled={carregando || paginaAtualUi >= totalPaginas}
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  );
}
