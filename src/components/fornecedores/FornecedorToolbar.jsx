import { Plus, Search, Tag } from "lucide-react";
import { FiltroCategoriaFornecedor } from "./FiltroCategoriaFornecedor";
import { FiltroFornecedor } from "./FiltroFornecedor";

export function FornecedorToolbar({
  busca,
  aoBuscar,
  ordenacao,
  aoMudarOrdenacao,
  aoAdicionar,
  aoAdicionarCategoria,
  categorias,
  categoriasSelecionadas,
  aoToggleCategoria,
  aoLimparCategorias,
  fornecedores,
  fornecedoresSelecionados,
  aoToggleFornecedor,
  aoLimparFornecedores,
}) {
  return (
    <div className="fornecedores-toolbar">
      <div className="fornecedores-toolbar-esquerda">
        <button
          type="button"
          className="fornecedores-btn-add"
          aria-label="Adicionar fornecedor"
          onClick={aoAdicionar}
        >
          <Plus size={18} />
        </button>

        <button
          type="button"
          className="fornecedores-btn-add fornecedores-btn-add-categoria"
          aria-label="Adicionar categoria"
          title="Nova categoria"
          onClick={aoAdicionarCategoria}
        >
          <Tag size={18} />
        </button>
      </div>

      <select
        className="fornecedores-select"
        value={ordenacao}
        onChange={(e) => aoMudarOrdenacao(e.target.value)}
      >
        <option value="alfabetica">A → Z</option>
        <option value="alfabetica_desc">Z → A</option>
      </select>

      <FiltroCategoriaFornecedor
        categorias={categorias}
        categoriasSelecionadas={categoriasSelecionadas}
        aoToggleCategoria={aoToggleCategoria}
        aoLimparCategorias={aoLimparCategorias}
      />

      <FiltroFornecedor
        fornecedores={fornecedores}
        fornecedoresSelecionados={fornecedoresSelecionados}
        aoToggleFornecedor={aoToggleFornecedor}
        aoLimparFornecedores={aoLimparFornecedores}
      />

      <div className="fornecedores-busca">
        <Search size={16} className="fornecedores-busca-icone" />
        <input
          className="fornecedores-busca-input"
          type="text"
          placeholder="Pesquisar..."
          value={busca}
          onChange={(e) => aoBuscar(e.target.value)}
        />
      </div>
    </div>
  );
}
