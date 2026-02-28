export function FiltroCategoriaFornecedor({
  categorias,
  categoriaSelecionada,
  aoMudarCategoria,
}) {
  return (
    <div className="filtro-categoria-container">
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          type="button"
          className={`filtro-categoria-btn ${categoriaSelecionada === categoria.id ? "active" : ""}`}
          onClick={() => aoMudarCategoria(categoria.id)}
        >
          {categoria.nome}
        </button>
      ))}
    </div>
  );
}
