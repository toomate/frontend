import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export function FiltroFornecedor({
  fornecedores,
  fornecedoresSelecionados,
  aoToggleFornecedor,
  aoLimparFornecedores,
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
    if (fornecedoresSelecionados.length === 0) return "Todos os fornecedores";
    if (fornecedoresSelecionados.length === 1) {
      return fornecedores.find((f) => f.id === fornecedoresSelecionados[0])?.razaoSocial ?? "1 fornecedor";
    }
    return `${fornecedoresSelecionados.length} fornecedores selecionados`;
  }

  const todosSelecionados = fornecedoresSelecionados.length === 0;

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
              checked={todosSelecionados}
              onChange={aoLimparFornecedores}
            />
            Todos
          </label>

          {fornecedores.length > 0 && <div className="filtro-categoria-divisor" />}

          {fornecedores.map((f) => (
            <label key={f.id} className="filtro-categoria-opcao">
              <input
                type="checkbox"
                checked={fornecedoresSelecionados.includes(f.id)}
                onChange={() => aoToggleFornecedor(f.id)}
              />
              {f.razaoSocial}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
