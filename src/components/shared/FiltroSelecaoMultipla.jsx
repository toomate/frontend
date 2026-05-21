import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export function FiltroSelecaoMultipla({
  itens,
  itensSelecionados,
  aoAlternarItem,
  aoLimparSelecao,
  obterValorItem = (item) => item?.id,
  obterRotuloItem = (item) => item?.nome,
  rotuloTudo = "Todos",
  rotuloTudoSelecionado = "Todos selecionados",
  rotuloItemUnicoFallback = "1 selecionado",
  rotuloItensMuitos = (quantidade) => `${quantidade} selecionados`,
  classeBase = "filtro-categoria",
  modoSelecao = "multiple",
  rotuloItem = "Selecionar",
}) {
  const [aberto, setAberto] = useState(false);
  const refContainer = useRef(null);

  useEffect(() => {
    function fecharFora(evento) {
      if (refContainer.current && !refContainer.current.contains(evento.target)) {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", fecharFora);
    return () => document.removeEventListener("mousedown", fecharFora);
  }, []);

  function obterTextoSelecao() {
    if (modoSelecao === "single") {
      if (itensSelecionados.length === 0) {
        return rotuloTudoSelecionado;
      }

      const itemSelecionado = itens.find((item) => obterValorItem(item) === itensSelecionados[0]);
      return obterRotuloItem(itemSelecionado) ?? rotuloItemUnicoFallback;
    }

    if (itensSelecionados.length === 0) {
      return rotuloTudoSelecionado;
    }

    if (itensSelecionados.length === 1) {
      const itemSelecionado = itens.find((item) => obterValorItem(item) === itensSelecionados[0]);
      return obterRotuloItem(itemSelecionado) ?? rotuloItemUnicoFallback;
    }

    return rotuloItensMuitos(itensSelecionados.length);
  }

  const todosSelecionados = itensSelecionados.length === 0;

  return (
    <div className={`${classeBase}-container`} ref={refContainer}>
      <button
        type="button"
        className={`${classeBase}-toggle ${aberto ? "aberto" : ""}`}
        onClick={() => setAberto((valorAtual) => !valorAtual)}
      >
        <span>{obterTextoSelecao()}</span>
        <ChevronDown size={14} className={`${classeBase}-chevron ${aberto ? "rotacionado" : ""}`} />
      </button>

      {aberto && (
        <div className={`${classeBase}-dropdown`}>
          <label className={`${classeBase}-opcao`}>
            <input
              type={modoSelecao === "single" ? "radio" : "checkbox"}
              name={`${classeBase}-selecao-todas`}
              checked={todosSelecionados}
              onChange={aoLimparSelecao}
            />
            {rotuloTudo}
          </label>

          {itens.length > 0 && <div className={`${classeBase}-divisor`} />}

          {itens.map((item) => {
            const valorItem = obterValorItem(item);
            const rotuloItem = obterRotuloItem(item) ?? "";
            const selecionado = itensSelecionados.includes(valorItem);

            return (
              <label key={valorItem} className={`${classeBase}-opcao`}>
                <input
                  type={modoSelecao === "single" ? "radio" : "checkbox"}
                  name={modoSelecao === "single" ? `${classeBase}-selecao` : undefined}
                  checked={selecionado}
                  onChange={() => aoAlternarItem(valorItem)}
                />
                {rotuloItem}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}