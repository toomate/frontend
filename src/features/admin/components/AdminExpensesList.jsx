import { useEffect, useMemo, useState } from "react";

const LIMITE_INICIAL_LANCAMENTOS = 5;

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ListaLancamentosAdmin({
  titulo,
  subtitulo,
  lancamentos,
  limiteInicial = LIMITE_INICIAL_LANCAMENTOS,
  mostrarTodosInicialmente = false,
  ocultarBotaoMostrarTodos = false,
  className = "",
}) {
  const [mostrarTodos, setMostrarTodos] = useState(mostrarTodosInicialmente);

  useEffect(() => {
    setMostrarTodos(mostrarTodosInicialmente);
  }, [lancamentos, mostrarTodosInicialmente]);

  const lancamentosExibidos = useMemo(
    () => (mostrarTodos ? lancamentos : lancamentos.slice(0, limiteInicial)),
    [lancamentos, limiteInicial, mostrarTodos]
  );

  const possuiMaisLancamentos =
    !ocultarBotaoMostrarTodos && lancamentos.length > limiteInicial;

  const totalLista = lancamentos.reduce(
    (acumulado, lancamento) => acumulado + (Number(lancamento.valorTotal) || 0),
    0
  );

  return (
    <article className={`admin-card admin-expenses-card ${className}`.trim()}>
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
