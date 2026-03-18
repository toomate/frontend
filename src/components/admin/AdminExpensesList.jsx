function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ListaLancamentosAdmin({ titulo, subtitulo, lancamentos }) {
  const totalLista = lancamentos.reduce(
    (acumulado, lancamento) => acumulado + (Number(lancamento.valorTotal) || 0),
    0
  );

  return (
    <article className="admin-card admin-expenses-card">
      <header className="admin-expenses-header">
        <h2>{titulo}</h2>
        <p>{subtitulo}</p>
      </header>

      <div className="admin-expenses-list">
        {lancamentos.length > 0 ? (
          lancamentos.map((lancamento) => (
            <div className="admin-expense-item" key={lancamento.id}>
              <div className="admin-expense-left">
                <h3>{lancamento.insumo}</h3>
                <p className="admin-expense-extra">{lancamento.marca}</p>
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

      <button type="button" className="admin-link-button">
        Ver todos os lançamentos
      </button>
    </article>
  );
}

