export function FiltroCategoriaFornecedor({
  categorias,
  categoriaSelecionada,
  aoMudarCategoria,
}) {
  function rotatividadeTexto(rotatividade) {
    if (rotatividade === true) return "Alta rotatividade";
    if (rotatividade === false) return "Baixa rotatividade";
    return "Rotatividade nao definida";
  }

  return (
    <div className="filtro-categoria-container">
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          type="button"
          className={`filtro-categoria-btn ${categoriaSelecionada === categoria.id ? "active" : ""}`}
          onClick={() => aoMudarCategoria(categoria.id)}
          title={rotatividadeTexto(categoria.rotatividade)}
        >
          {typeof categoria.rotatividade === "boolean" && (
            <span
              className={`filtro-categoria-dot ${
                categoria.rotatividade ? "filtro-categoria-dot-alta" : "filtro-categoria-dot-baixa"
              }`}
              aria-hidden="true"
            />
          )}
          {categoria.nome}
        </button>
      ))}
    </div>
  );
}
