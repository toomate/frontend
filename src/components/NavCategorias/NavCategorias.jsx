import { useMemo, useState } from "react";
import { Beef, BottleWine, Menu, Leaf, Milk, Package, Wheat, ShoppingCart, Fish, UtensilsCrossed, Sandwich, CookingPot, Droplet } from "lucide-react";

import "./NavCategorias.css";

export function NavCategorias({
  categoriaAtual,
  aoMudarCategoria,
  categorias = categoriasPadrao,
  maxCategoriasFixas,
}) {
  const listaCategorias = categorias?.length ? categorias : categoriasPadrao;
  const [menuAberto, setMenuAberto] = useState(false);

  const pegarIcone = (categoria) => {
    switch (categoria.toLowerCase()) {
      case "proteínas":
      case "proteinas":
        return <Beef size={28} />;

      case "mercearia":
        return <ShoppingCart size={28} />;

      case "pescados":
      case "peixes":
      case "frutos do mar":
        return <Fish size={28} />;

      case "temperos":
      case "condimentos":
      case "temperos e condimentos":
        return <CookingPot size={28} />

      case "oleos":
      case "óleos":
      case "oleos e gordura":
      case "óleos e gordura":
      case "gordura":
        return <Droplet size={28} />


      case "frios":
      case "embutidos":
      case "frios e embutidos":
        return <Sandwich size={28} />;

      case "laticínios":
      case "laticinios":
        return <Milk size={28} />;

      case "hortifruti":
        return <Leaf size={28} />;

      case "grãos e secos":
      case "graos e secos":
      case "grãos":
      case "graos":
        return <Wheat size={28} />;

      case "bebidas":
      case "bebida":
        return <BottleWine size={28} />;

      default:
        return <Package size={28} />;
    }
  };

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
            {pegarIcone(atual)} {atual}
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
