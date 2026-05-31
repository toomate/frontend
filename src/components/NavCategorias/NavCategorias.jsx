import { useEffect, useMemo, useRef, useState } from "react";
import { Beef, BottleWine, ChevronDown, Leaf, Milk, Package, Wheat, ShoppingCart, Fish, Sandwich, CookingPot, Droplet } from "lucide-react";

import "./NavCategorias.css";

const categoriasPadrao = ["Geral"];

export function NavCategorias({
  categoriasAtivas = [],
  aoAlternarCategoria,
  aoLimparCategorias,
  categorias = categoriasPadrao,
}) {
  const listaCategorias = categorias?.length ? categorias : categoriasPadrao;
  const [menuAberto, setMenuAberto] = useState(false);
  const refMobile = useRef(null);

  const pegarIcone = (categoria) => {
    switch (categoria.toLowerCase()) {
      case "proteínas":
      case "proteinas":
      case "protenas":
      case "carnes":
      case "carnes e aves":
      case "aves":
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
      case "oleos e gorduras":
      case "óleos e gordura":
      case "óleos e gorduras":
      case "leos e gordura":
      case "leos e gorduras":
      case "gordura":
        return <Droplet size={28} />


      case "frios":
      case "embutidos":
      case "frios e embutidos":
        return <Sandwich size={28} />;

      case "laticínios":
      case "laticinios":
      case "laticnios":
      case "laticã­nios":
        return <Milk size={28} />;

      case "hortifruti":
        return <Leaf size={28} />;

      case "grãos e secos":
      case "graos e secos":
      case "gros e secos":
      case "grãos":
      case "graos":
      case "grãos e cereais":
      case "graos e cereais":
      case "grã£os e cereais":
      case "grã£os e secos":
      case "grã£os":
      case "cereais":
        return <Wheat size={28} />;

      case "bebidas":
      case "bebida":
        return <BottleWine size={28} />;

      default:
        return <Package size={28} />;
    }
  };

  function categoriaEhAtiva(categoria) {
    if (categoria === "Geral") {
      return categoriasAtivas.length === 0;
    }
    return categoriasAtivas.includes(categoria);
  }

  function aoClicarCategoria(categoria) {
    if (categoria === "Geral") {
      aoLimparCategorias?.();
      return;
    }
    aoAlternarCategoria?.(categoria);
  }

  const textoBotaoMobile = useMemo(() => {
    if (categoriasAtivas.length === 0) return "Todas as categorias";
    if (categoriasAtivas.length === 1) return categoriasAtivas[0];
    return `${categoriasAtivas.length} categorias`;
  }, [categoriasAtivas]);

  useEffect(() => {
    if (!menuAberto) return;

    function fecharFora(evento) {
      if (refMobile.current && !refMobile.current.contains(evento.target)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener("mousedown", fecharFora);
    return () => document.removeEventListener("mousedown", fecharFora);
  }, [menuAberto]);

  return (
    <div className="categorias-container">
      <div className="categorias-toolbar categorias-toolbar-desktop">
        {listaCategorias.map((atual) => (
          <div
            key={atual}
            id={categoriaEhAtiva(atual) ? "active" : ""}
            className="categoria-item"
            onClick={() => aoClicarCategoria(atual)}
          >
            {pegarIcone(atual)} {atual}
          </div>
        ))}
      </div>

      <div className="categorias-toolbar-mobile" ref={refMobile}>
        <button
          type="button"
          className={`categorias-mobile-botao ${menuAberto ? "aberto" : ""}`}
          onClick={() => setMenuAberto((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={menuAberto}
        >
          <span className="categorias-mobile-texto">{textoBotaoMobile}</span>
          {categoriasAtivas.length > 0 && (
            <span className="categorias-mobile-contagem">{categoriasAtivas.length}</span>
          )}
          <ChevronDown size={16} className={`categorias-mobile-chevron ${menuAberto ? "rotacionado" : ""}`} />
        </button>

        {menuAberto && (
          <div className="categorias-mobile-dropdown" role="listbox">
            <label className="categorias-mobile-item">
              <input
                type="checkbox"
                checked={categoriasAtivas.length === 0}
                onChange={() => aoLimparCategorias?.()}
              />
              <span>Todas as categorias</span>
            </label>

            {listaCategorias.length > 1 && <div className="categorias-mobile-divisor" />}

            {listaCategorias
              .filter((c) => c !== "Geral")
              .map((categoria) => (
                <label key={categoria} className="categorias-mobile-item">
                  <input
                    type="checkbox"
                    checked={categoriasAtivas.includes(categoria)}
                    onChange={() => aoAlternarCategoria?.(categoria)}
                  />
                  <span>{categoria}</span>
                </label>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
