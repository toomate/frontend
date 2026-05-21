import { FiltroSelecaoMultipla } from "../shared/FiltroSelecaoMultipla";

export function FiltroFornecedor({
  fornecedores,
  fornecedoresSelecionados,
  aoToggleFornecedor,
  aoLimparFornecedores,
}) {
  return (
    <FiltroSelecaoMultipla
      itens={fornecedores}
      itensSelecionados={fornecedoresSelecionados}
      aoAlternarItem={aoToggleFornecedor}
      aoLimparSelecao={aoLimparFornecedores}
      obterValorItem={(fornecedor) => fornecedor.id}
      obterRotuloItem={(fornecedor) => fornecedor.razaoSocial}
      rotuloTudo="Todos"
      rotuloTudoSelecionado="Todos os fornecedores"
      rotuloItemUnicoFallback="1 fornecedor"
      rotuloItensMuitos={(quantidade) => `${quantidade} fornecedores selecionados`}
      classeBase="filtro-categoria"
    />
  );
}
