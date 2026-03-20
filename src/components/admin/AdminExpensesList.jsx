import { useEffect, useMemo, useState } from "react";

const LIMITE_INICIAL_LANCAMENTOS = 5;

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ListaLancamentosAdmin({ titulo, subtitulo, lancamentos }) {
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    setMostrarTodos(false);
  }, [lancamentos]);

  const lancamentosExibidos = useMemo(
    () =>
      mostrarTodos
        ? lancamentos
        : lancamentos.slice(0, LIMITE_INICIAL_LANCAMENTOS),
    [lancamentos, mostrarTodos]
  );

  const possuiMaisLancamentos = lancamentos.length > LIMITE_INICIAL_LANCAMENTOS;

  const totalLista = lancamentos.reduce(
    (acumulado, lancamento) => acumulado + (Number(lancamento.valorTotal) || 0),
    0
  );

  return (
    <article className="admin-card admin-expenses-card">
      <header className="admin-expenses-header">
        <h2>{titulo}</h2>
        {subtitulo ? <p>{subtitulo}</p> : null}
      </header>

      <div className="admin-expenses-list">
        {lancamentos.length > 0 ? (
          lancamentosExibidos.map((lancamento) => (
            <div className="admin-expense-item" key={lancamento.id}>
              <div className="admin-expense-left">
                <h3>{lancamento.insumo}</h3>
                <p className="admin-expense-extra">{lancamento.marca}</p>
                <p className="admin-expense-meta">{lancamento.fornecedor}</p>
              </div>

              <div className="admin-expense-right">
                <strong>{formatarMoeda(lancamento.valorTotal)}</strong>
                <small>{lancamento.data}</small>
              </div>
            </div>
          ))
        ) : (
          <p className="admin-empty-list">Nenhum lançamento encontrado.</p>
        )}
      </div>

      <div className="admin-expense-total">
        <span>Total do período</span>
        <strong>{formatarMoeda(totalLista)}</strong>
      </div>

      {possuiMaisLancamentos ? (
        <button
          type="button"
          className="admin-link-button"
          onClick={() => setMostrarTodos((estadoAtual) => !estadoAtual)}
        >
          {mostrarTodos
            ? "Mostrar menos"
            : `Mostrar todos (${lancamentos.length})`}
        </button>
      ) : null}
    </article>
  );
}
