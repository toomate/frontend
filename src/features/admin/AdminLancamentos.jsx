import ListaLancamentosAdmin from "./AdminExpensesList";

export default function AdminLancamentos({ lancamentos }) {
  return (
    <section className="admin-lancamentos-container">
      <header className="admin-lancamentos-topo">
        <h2>Lançamentos de gastos</h2>
        <p>Lista de lançamentos por lote com os filtros selecionados.</p>
      </header>

      <ListaLancamentosAdmin
        className="admin-lancamentos-card"
        titulo="Todos os lançamentos"
        subtitulo={`Total de registros: ${lancamentos.length}`}
        lancamentos={lancamentos}
        mostrarTodosInicialmente
        ocultarBotaoMostrarTodos
      />
    </section>
  );
}
