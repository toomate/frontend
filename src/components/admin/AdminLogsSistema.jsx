import { useEffect, useState } from "react";
import { AdminApi } from "../../provider/Api";

const TAMANHO_PAGINA = 20;

function formatarDataHora(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function obterDataLocalIso(dataReferencia = new Date()) {
  const d = new Date(dataReferencia.getTime() - dataReferencia.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
}

const ACAO_COR = {
  LOGIN:    { cor: "#1ba968", bg: "#f0faf5" },
  LOGOUT:   { cor: "#7d4ce0", bg: "#f5f0ff" },
  CREATE:   { cor: "#2f80ed", bg: "#eef4ff" },
  CRIACAO:  { cor: "#2f80ed", bg: "#eef4ff" },
  UPDATE:   { cor: "#e07b00", bg: "#fff8ee" },
  EDICAO:   { cor: "#e07b00", bg: "#fff8ee" },
  DELETE:   { cor: "#c92c2c", bg: "#fff3f3" },
  EXCLUSAO: { cor: "#c92c2c", bg: "#fff3f3" },
};

function resolverAcaoCor(acao) {
  const key = String(acao ?? "").toUpperCase();
  return ACAO_COR[key] ?? { cor: "#6b4423", bg: "#fdf5dc" };
}

function normalizarLogs(conteudo) {
  return (Array.isArray(conteudo) ? conteudo : []).map((log, i) => {
    const dataValida = log?.timestamp ? new Date(log.timestamp) : null;
    return {
      id: log?.id ?? i,
      timestamp: dataValida && !isNaN(dataValida) ? dataValida.toISOString() : new Date().toISOString(),
      usuario: log?.usuario ?? null,
      acao: log?.acao ?? null,
      entidade: log?.entidade ?? null,
      detalhe: log?.detalhe ?? null,
    };
  });
}

export default function AdminLogsSistema() {
  const [dataSelecionada, setDataSelecionada] = useState(obterDataLocalIso());
  const [pagina, setPagina] = useState(0);
  const [resposta, setResposta] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setPagina(0);
  }, [dataSelecionada]);

  useEffect(() => {
    let ativo = true;

    async function buscar() {
      setCarregando(true);
      setErro("");
      try {
        const dados = await AdminApi.listarAuditLogsPaginado({
          data: dataSelecionada,
          pagina,
          tamanho: TAMANHO_PAGINA,
        });
        if (!ativo) return;
        setResposta(dados ?? { content: [], totalElements: 0, totalPages: 1 });
      } catch {
        if (!ativo) return;
        setErro("Não foi possível carregar os logs do sistema.");
        setResposta({ content: [], totalElements: 0, totalPages: 1 });
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscar();
    return () => { ativo = false; };
  }, [dataSelecionada, pagina]);

  const logs = normalizarLogs(resposta?.content);
  const totalPaginas = Math.max(1, resposta?.totalPages ?? 1);
  const totalElementos = resposta?.totalElements ?? logs.length;

  return (
    <section className="admin-card admin-logs-lista-card">
      <header className="admin-logs-lista-header">
        <h2>Logs do sistema</h2>
      </header>

      <div className="admin-logs-lista-filtros">
        <label htmlFor="filtro-data-logs">Data</label>
        <input
          id="filtro-data-logs"
          className="admin-logs-lista-data-input"
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
        />
        {!carregando && !erro && (
          <span className="admin-logs-contagem">
            {totalElementos} registro{totalElementos !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="admin-logs-lista">
        {carregando ? (
          <p className="admin-empty-list">Carregando logs...</p>
        ) : erro ? (
          <p className="admin-empty-list" style={{ color: "#c92c2c" }}>{erro}</p>
        ) : logs.length > 0 ? (
          logs.map((log) => {
            const acaCor = resolverAcaoCor(log.acao);
            return (
              <article className="admin-logs-lista-item" key={log.id}>
                <div className="admin-logs-item-topo">
                  <div className="admin-logs-item-topo-esquerda">
                    {log.acao && (
                      <span
                        className="admin-logs-nivel-badge"
                        style={{ color: acaCor.cor, background: acaCor.bg }}
                      >
                        {log.acao}
                      </span>
                    )}
                    {log.entidade && (
                      <span className="admin-logs-entidade">{log.entidade}</span>
                    )}
                  </div>
                  <span className="admin-logs-lista-datahora">{formatarDataHora(log.timestamp)}</span>
                </div>

                {log.detalhe && (
                  <p className="admin-logs-lista-mensagem">{log.detalhe}</p>
                )}

                {log.usuario && (
                  <div className="admin-logs-item-meta">
                    <span className="admin-logs-meta-item">
                      <strong>Usuário:</strong> {log.usuario}
                    </span>
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <p className="admin-empty-list">Nenhum log encontrado para a data selecionada.</p>
        )}
      </div>

      <div className="admin-lancamentos-paginacao">
        <button
          type="button"
          className="admin-lancamentos-pag-btn"
          onClick={() => setPagina((p) => Math.max(0, p - 1))}
          disabled={carregando || pagina <= 0}
        >
          Anterior
        </button>
        <span className="admin-lancamentos-pag-info">
          Página {pagina + 1} de {totalPaginas}
        </span>
        <button
          type="button"
          className="admin-lancamentos-pag-btn"
          onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
          disabled={carregando || pagina + 1 >= totalPaginas}
        >
          Próxima
        </button>
      </div>
    </section>
  );
}
