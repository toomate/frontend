import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginacaoFornecedor({ paginaAtual, totalPaginas, aoMudarPagina }) {
  if (totalPaginas <= 1) return null;

  function gerarPaginas() {
    if (totalPaginas <= 7) {
      return Array.from({ length: totalPaginas }, (_, i) => i);
    }

    const paginas = new Set([0, totalPaginas - 1, paginaAtual]);
    if (paginaAtual > 0) paginas.add(paginaAtual - 1);
    if (paginaAtual < totalPaginas - 1) paginas.add(paginaAtual + 1);

    const ordenadas = Array.from(paginas).sort((a, b) => a - b);
    const resultado = [];

    for (let i = 0; i < ordenadas.length; i++) {
      if (i > 0 && ordenadas[i] - ordenadas[i - 1] > 1) {
        resultado.push("...");
      }
      resultado.push(ordenadas[i]);
    }

    return resultado;
  }

  return (
    <div className="paginacao-container">
      <button
        type="button"
        className="paginacao-btn paginacao-nav"
        onClick={() => aoMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 0}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>

      {gerarPaginas().map((item, i) =>
        item === "..." ? (
          <span key={`ellipsis-${i}`} className="paginacao-ellipsis">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`paginacao-btn ${item === paginaAtual ? "paginacao-btn-ativo" : ""}`}
            onClick={() => aoMudarPagina(item)}
          >
            {item + 1}
          </button>
        )
      )}

      <button
        type="button"
        className="paginacao-btn paginacao-nav"
        onClick={() => aoMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas - 1}
        aria-label="Próxima página"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
