import { Plus, Search } from "lucide-react";
import { Search as CampoBusca } from "../Search/Search";

export function FornecedorToolbar({
  busca,
  aoBuscar,
  ordenacao,
  aoMudarOrdenacao,
  aoAdicionar,
}) {
  return (
    <div className="fornecedores-toolbar">
      <button
        type="button"
        className="fornecedores-btn-add"
        aria-label="Adicionar fornecedor"
        onClick={aoAdicionar}
      >
        <Plus size={18} />
      </button>

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

