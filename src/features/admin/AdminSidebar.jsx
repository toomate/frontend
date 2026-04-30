function ListaItensBarra({ itens, itemAtivo, aoSelecionar }) {
  return (
    <nav className="admin-sidebar-nav">
      {itens.map((item) => {
        const Icone = item.icone;
        const ativo = item.id === itemAtivo;
        return (
          <button
            type="button"
            key={item.id}
            className={`admin-sidebar-item ${ativo ? "is-active" : ""}`}
            onClick={() => aoSelecionar(item.id)}
          >
            <Icone size={18} />
            <span>{item.rotulo}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function BarraLateralAdmin({
  itens,
  acoes,
  itemAtivo,
  aoSelecionar,
  aoSelecionarAcao,
}) {
  return (
    <div className="admin-sidebar-content">
      <header className="admin-sidebar-header">
        <h1>Painel Administrativo</h1>
      </header>

      <ListaItensBarra itens={itens} itemAtivo={itemAtivo} aoSelecionar={aoSelecionar} />

      {acoes?.length ? (
        <>
          <div className="admin-sidebar-divider" />
          <p className="admin-sidebar-subtitle">Ações rápidas</p>
          <ListaItensBarra
            itens={acoes}
            itemAtivo={itemAtivo}
            aoSelecionar={aoSelecionarAcao}
          />
        </>
      ) : null}
    </div>
  );
}

