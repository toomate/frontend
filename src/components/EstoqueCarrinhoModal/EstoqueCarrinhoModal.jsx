import { ShoppingCart, X, Trash2, Save } from "lucide-react";
import { BaseModal } from "../common/BaseModal";
import "./EstoqueCarrinhoModal.css";

function montarDescricao(mudanca) {
  const quantidadeOriginal = Number(mudanca?.quantidadeOriginal ?? 0);
  const quantidadeAtual = Number(mudanca?.quantidadeMedida ?? 0);
  const diferenca = quantidadeAtual - quantidadeOriginal;
  const direcao = diferenca >= 0 ? "Adicionar" : "Remover";
  const unidade = mudanca?.unidadeMedida || "un";
  return `${direcao} ${Math.abs(diferenca)} ${unidade}`;
}

export function EstoqueCarrinhoModal({
  aberto,
  mudancas = [],
  onFechar,
  onRemover,
  onLimpar,
  onSalvar,
  salvando = false,
}) {
  const totalMovimentos = mudancas.reduce((acc, item) => {
    const diferenca = Number(item?.quantidadeMedida ?? 0) - Number(item?.quantidadeOriginal ?? 0);
    return acc + Math.abs(diferenca);
  }, 0);

  return (
    <BaseModal
      aberto={aberto}
      onClose={onFechar}
      title="Carrinho de alteracoes"
      width={980}
      footer={
        <div className="estoque-carrinho-acoes">
          <button type="button" className="estoque-carrinho-btn neutro" onClick={onFechar}>
            Editar
          </button>

          <button
            type="button"
            className="estoque-carrinho-btn alerta"
            onClick={onLimpar}
            disabled={mudancas.length === 0 || salvando}
          >
            <Trash2 size={16} />
            Limpar
          </button>

          <button
            type="button"
            className="estoque-carrinho-btn primario"
            onClick={onSalvar}
            disabled={mudancas.length === 0 || salvando}
          >
            <Save size={16} />
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      }
    >
      <div className="estoque-carrinho-resumo">
        <ShoppingCart size={18} />
        <span>
          {mudancas.length} item(ns) alterado(s) · {totalMovimentos} movimento(s)
        </span>
      </div>

      <div className="estoque-carrinho-lista">
        {mudancas.length === 0 ? (
          <p className="estoque-carrinho-vazio">Nenhuma alteracao adicionada ainda.</p>
        ) : (
          mudancas.map((item) => (
            <div key={item.id} className="estoque-carrinho-linha">
              <div className="estoque-carrinho-produto">{item.produto}</div>
              <div className="estoque-carrinho-separador">-</div>
              <div className="estoque-carrinho-descricao">{montarDescricao(item)}</div>
              <button
                type="button"
                className="estoque-carrinho-remover"
                onClick={() => onRemover(item.id)}
                aria-label={`Remover ${item.produto}`}
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </BaseModal>
  );
}
