import { FiltroSelecaoMultipla } from "../shared/FiltroSelecaoMultipla";

export function FiltroCategoriaFornecedor({
  categorias,
  categoriasSelecionadas,
  aoToggleCategoria,
  aoLimparCategorias,
}) {
  return (
    <FiltroSelecaoMultipla
      itens={categorias}
      itensSelecionados={categoriasSelecionadas}
      aoAlternarItem={aoToggleCategoria}
      aoLimparSelecao={aoLimparCategorias}
      obterValorItem={(categoria) => categoria.id}
      obterRotuloItem={(categoria) => categoria.nome}
      rotuloTudo="Todas"
      rotuloTudoSelecionado="Todas as categorias"
      rotuloItemUnicoFallback="1 categoria"
      rotuloItensMuitos={(quantidade) => `${quantidade} categorias selecionadas`}
      classeBase="filtro-categoria"
    />
  );
}
