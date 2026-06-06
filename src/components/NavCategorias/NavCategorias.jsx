import { useEffect, useRef, useState, useMemo } from "react";
import {
  Beef, BottleWine, ChevronDown, Leaf, Milk, Package, Wheat,
  Fish, Sandwich, CookingPot, Droplet, Menu,
} from "lucide-react";

import "./NavCategorias.css";

const CATEGORIAS_PADRAO = [
  "Geral",
  "Proteínas",
  "Hortifruti",
  "Frios e Embutidos",
  "Temperos e Condimentos",
  "Bebidas",
  "Pescados",
  "Laticínios",
  "Grãos e Secos",
  "Óleos e Gorduras",
];

export function NavCategorias({
  categoriasAtivas = [],
  aoAlternarCategoria,
  aoLimparCategorias,
  categorias = CATEGORIAS_PADRAO,
}) {
  // Bar always shows hardcoded defaults — independent of API naming
  const categoriasNaBarra = CATEGORIAS_PADRAO;

  // Hamburger shows everything from the API (may include custom categories)
  const listaCategorias = categorias?.length ? categorias : CATEGORIAS_PADRAO;

  const [menuAberto, setMenuAberto] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const refHamburger = useRef(null);
  const refMobile = useRef(null);

  const pegarIcone = (categoria) => {
    switch (categoria.toLowerCase()) {
      case "proteínas":
      case "proteinas":
      case "carnes":
      case "carnes e aves":
      case "aves":
        return <Beef size={20} />;
      case "pescados":
      case "peixes":
      case "frutos do mar":
        return <Fish size={20} />;
      case "temperos e condimentos":
      case "temperos":
      case "condimentos":
        return <CookingPot size={20} />;
      case "óleos e gorduras":
      case "oleos e gorduras":
      case "óleos e gordura":
      case "oleos e gordura":
      case "gordura":
        return <Droplet size={20} />;
      case "frios e embutidos":
      case "frios":
      case "embutidos":
        return <Sandwich size={20} />;
      case "laticínios":
      case "laticinios":
        return <Milk size={20} />;
      case "hortifruti":
        return <Leaf size={20} />;
      case "grãos e secos":
      case "graos e secos":
      case "grãos":
      case "graos":
      case "cereais":
      case "grãos e cereais":
      case "graos e cereais":
        return <Wheat size={20} />;
      case "bebidas":
      case "bebida":
        return <BottleWine size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  function categoriaEhAtiva(categoria) {
    if (categoria === "Geral") return categoriasAtivas.length === 0;
    return categoriasAtivas.includes(categoria);
  }

  function aoClicarCategoria(categoria) {
    if (categoria === "Geral") {
      aoLimparCategorias?.();
      return;
    }
    aoAlternarCategoria?.(categoria);
  }

  const totalAtivas = categoriasAtivas.length;

  const textoBotaoMobile = useMemo(() => {
    if (categoriasAtivas.length === 0) return "Todas as categorias";
    if (categoriasAtivas.length === 1) return categoriasAtivas[0];
    return `${categoriasAtivas.length} categorias`;
  }, [categoriasAtivas]);

  useEffect(() => {
    if (!menuAberto) return;
    function fecharFora(e) {
      if (refHamburger.current && !refHamburger.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", fecharFora);
    return () => document.removeEventListener("mousedown", fecharFora);
  }, [menuAberto]);

  useEffect(() => {
    if (!menuMobileAberto) return;
    function fecharFora(e) {
      if (refMobile.current && !refMobile.current.contains(e.target)) {
        setMenuMobileAberto(false);
      }
    }
    document.addEventListener("mousedown", fecharFora);
    return () => document.removeEventListener("mousedown", fecharFora);
  }, [menuMobileAberto]);

  return (
    <div className="categorias-container">

      {/* Desktop: hamburger fora do scroll + barra com scroll */}
      <div className="categorias-toolbar-desktop">
        {/* Hamburger isolado para o dropdown não ser clipado pelo overflow */}
        <div className="categorias-hamburger-wrapper" ref={refHamburger}>
          <button
            type="button"
            className={`categorias-hamburger-btn ${menuAberto ? "aberto" : ""}`}
            onClick={() => setMenuAberto((v) => !v)}
            aria-label="Categorias"
            aria-haspopup="listbox"
            aria-expanded={menuAberto}
          >
            <Menu size={18} />
            {totalAtivas > 0 && (
              <span className="categorias-hamburger-badge">{totalAtivas}</span>
            )}
          </button>

          {menuAberto && (
            <div className="categorias-hamburger-dropdown" role="listbox">
              <label className="categorias-mobile-item">
                <input
                  type="checkbox"
                  checked={categoriasAtivas.length === 0}
                  onChange={() => aoLimparCategorias?.()}
                />
                <span>Todas as categorias</span>
              </label>

              <div className="categorias-mobile-divisor" />

              <div className="categorias-hamburger-grid">
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
            </div>
          )}
        </div>

        {/* Barra com scroll horizontal — defaults sempre fixos */}
        <div className="categorias-barra-scroll">
          {categoriasNaBarra.map((atual) => (
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
      </div>

      {/* Mobile: dropdown only */}
      <div className="categorias-toolbar-mobile" ref={refMobile}>
        <button
          type="button"
          className={`categorias-mobile-botao ${menuMobileAberto ? "aberto" : ""}`}
          onClick={() => setMenuMobileAberto((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={menuMobileAberto}
        >
          <span className="categorias-mobile-texto">{textoBotaoMobile}</span>
          {categoriasAtivas.length > 0 && (
            <span className="categorias-mobile-contagem">{categoriasAtivas.length}</span>
          )}
          <ChevronDown
            size={16}
            className={`categorias-mobile-chevron ${menuMobileAberto ? "rotacionado" : ""}`}
          />
        </button>

        {menuMobileAberto && (
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
