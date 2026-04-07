import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export function FiltroCategoriaFornecedor({
  categorias,
  categoriasSelecionadas,
  aoToggleCategoria,
  aoLimparCategorias,
}) {
  const [aberto, setAberto] = useState(false);
  const refContainer = useRef(null);

  useEffect(() => {
    function fecharFora(e) {
      if (refContainer.current && !refContainer.current.contains(e.target)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", fecharFora);
    return () => document.removeEventListener("mousedown", fecharFora);
  }, []);

  function textoSelecao() {
    if (categoriasSelecionadas.length === 0) return "Todas as categorias";
    if (categoriasSelecionadas.length === 1) {
      return categorias.find((c) => c.id === categoriasSelecionadas[0])?.nome ?? "1 categoria";
    }
    return `${categoriasSelecionadas.length} categorias selecionadas`;
  }

  const todasSelecionadas = categoriasSelecionadas.length === 0;

  return (
    <div className="filtro-categoria-container" ref={refContainer}>
      <button
        type="button"
        className={`filtro-categoria-toggle ${aberto ? "aberto" : ""}`}
        onClick={() => setAberto((v) => !v)}
      >
        <span>{textoSelecao()}</span>
        <ChevronDown size={14} className={`filtro-categoria-chevron ${aberto ? "rotacionado" : ""}`} />
      </button>

      {aberto && (
        <div className="filtro-categoria-dropdown">
          <label className="filtro-categoria-opcao">
            <input
              type="checkbox"
              checked={todasSelecionadas}
              onChange={aoLimparCategorias}
            />
            Todas
          </label>

          {categorias.length > 0 && <div className="filtro-categoria-divisor" />}

          {categorias.map((cat) => (
            <label key={cat.id} className="filtro-categoria-opcao">
              <input
                type="checkbox"
                checked={categoriasSelecionadas.includes(cat.id)}
                onChange={() => aoToggleCategoria(cat.id)}
              />
              {cat.nome}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
