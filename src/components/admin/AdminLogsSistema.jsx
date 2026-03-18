import { useMemo, useState } from "react";

function formatarData(dataHoraIso) {
  return new Date(dataHoraIso).toLocaleDateString("pt-BR");
}

function formatarHora(dataHoraIso) {
  return new Date(dataHoraIso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obterDataLocalIso(dataReferencia = new Date()) {
  const dataAjustada = new Date(
    dataReferencia.getTime() - dataReferencia.getTimezoneOffset() * 60000
  );
  return dataAjustada.toISOString().slice(0, 10);
}

export default function AdminLogsSistema({ logs }) {
  const [dataSelecionada, setDataSelecionada] = useState(obterDataLocalIso());

  const logsOrdenados = useMemo(
    () =>
      [...logs].sort(
        (a, b) => new Date(b.dataHoraIso).getTime() - new Date(a.dataHoraIso).getTime()
      ),
    [logs]
  );

  const logsFiltrados = useMemo(
    () =>
      logsOrdenados.filter(
        (log) => obterDataLocalIso(new Date(log.dataHoraIso)) === dataSelecionada
      ),
    [dataSelecionada, logsOrdenados]
  );

  return (
    <section className="admin-card admin-logs-lista-card">
      <header className="admin-logs-lista-header">
        <h2>Logs do sistema</h2>
        <p>Logs do dia com filtro por data.</p>
      </header>

      <div className="admin-logs-lista-filtros">
        <label htmlFor="filtro-data-logs">Data</label>
        <input
          id="filtro-data-logs"
          className="admin-logs-lista-data-input"
          type="date"
          value={dataSelecionada}
          onChange={(evento) => setDataSelecionada(evento.target.value)}
        />
      </div>

      <div className="admin-logs-lista">
        {logsFiltrados.length > 0 ? (
          logsFiltrados.map((log) => {
            const mensagem = log.mensagem || log.acao || log.descricao || "Log sem mensagem";

            return (
              <article className="admin-logs-lista-item" key={log.id}>
                <p className="admin-logs-lista-mensagem">{mensagem}</p>
                <span className="admin-logs-lista-datahora">
                  {formatarData(log.dataHoraIso)} as {formatarHora(log.dataHoraIso)}
                </span>
              </article>
            );
          })
        ) : (
          <p className="admin-empty-list">Nenhum log encontrado para a data selecionada.</p>
        )}
      </div>
    </section>
  );
}
