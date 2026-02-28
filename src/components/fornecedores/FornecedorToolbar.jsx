import { Plus, Search, Tag } from "lucide-react";
import { Search as CampoBusca } from "../Search/Search";

export function FornecedorToolbar({
  busca,
  aoBuscar,
  ordenacao,
  aoMudarOrdenacao,
  aoAdicionar,
  aoAdicionarCategoria,
}) {
  return (
    <div className="fornecedores-toolbar">
      <div className="fornecedores-toolbar-acoes">
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
        <option value="alfabetica">Ordenar por A-Z</option>
        <option value="alfabetica_desc">Ordenar por Z-A</option>
      </select>

      <div className="fornecedores-busca">
        <CampoBusca Icone={Search} pesquisar={aoBuscar} value={busca} />
      </div>
    </div>
  );
}
