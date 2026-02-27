import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import "./NavCategorias.css";

const categoriasPadrao = ["Geral", "Mercearia", "Proteinas", "Vegetais", "Graos", "Bebidas"];

export function NavCategorias({
  categoriaAtual,
  aoMudarCategoria,
  categorias = categoriasPadrao,
  maxCategoriasFixas = 4,
}) {
  const listaCategorias = categorias?.length ? categorias : categoriasPadrao;
  const [menuAberto, setMenuAberto] = useState(false);

  const categoriasFixas = useMemo(
    () => listaCategorias.slice(0, maxCategoriasFixas),
    [listaCategorias, maxCategoriasFixas]
  );

  function selecionarCategoria(categoria) {
    aoMudarCategoria(categoria);
    setMenuAberto(false);
  }

  return (
    <div className="categorias-container">
      <div className="categorias-toolbar">
        <button
          type="button"
          className={`categoria-menu-btn ${menuAberto ? "active" : ""}`}
          onClick={() => setMenuAberto((prev) => !prev)}
          aria-label="Mostrar todas as categorias"
        >
          <Menu size={18} />
        </button>

        {categoriasFixas.map((atual) => (
          <div
            key={atual}
            id={categoriaAtual === atual ? "active" : ""}
            className="categoria-item"
            onClick={() => selecionarCategoria(atual)}
          >
            {atual}
          </div>
        ))}
      </div>

      {menuAberto && (
        <div className="categorias-dropdown">
          {listaCategorias.map((atual) => (
            <button
              type="button"
              key={atual}
              className={`categorias-dropdown-item ${categoriaAtual === atual ? "active" : ""}`}
              onClick={() => selecionarCategoria(atual)}
            >
              {atual}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
