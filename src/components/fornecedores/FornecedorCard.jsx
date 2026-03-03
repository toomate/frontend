import { Pencil, Trash2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

function limparTelefone(telefone = "") {
  return telefone.replace(/\D/g, "");
}

export function FornecedorCard({ fornecedor, onEditar, onExcluir }) {
  const telefone = fornecedor?.telefone ?? "";
  const telefoneLimpo = limparTelefone(telefone);
  const linkContato = fornecedor?.link?.trim()
    ? fornecedor.link.trim()
    : telefoneLimpo
    ? `https://wa.me/55${telefoneLimpo}`
    : "#";

  return (
    <article className="fornecedor-card">
      <header className="fornecedor-card-topo">
        <h3>{fornecedor.razaoSocial}</h3>
        <div className="fornecedor-whatsapp" aria-hidden="true" title="WhatsApp">
          <FaWhatsapp size={24} />
        </div>
      </header>

      <p className="fornecedor-telefone">{telefone || "Telefone nao informado"}</p>

      <div className="fornecedor-acoes">
        <a
          href={linkContato}
          target="_blank"
          rel="noreferrer"
          className="fornecedor-contatar"
        >
          Contatar
        </a>

        <div className="fornecedor-acoes-direita">
          <button
            type="button"
            className="fornecedor-btn-acao"
            onClick={() => onEditar(fornecedor)}
            aria-label={`Editar ${fornecedor.razaoSocial}`}
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            className="fornecedor-btn-acao fornecedor-btn-excluir"
            onClick={() => onExcluir(fornecedor)}
            aria-label={`Excluir ${fornecedor.razaoSocial}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
