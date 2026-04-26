import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { createPortal } from "react-dom";
import config from "../../config";

function limparTelefone(telefone = "") {
  return telefone.replace(/\D/g, "");
}

export function FornecedorCard({ fornecedor, onEditar, onExcluir }) {
  const telefone = fornecedor?.telefone ?? "";
  const telefoneLimpo = limparTelefone(telefone);
  
  const [status, setStatus] = useState(null)

  function getContatoUrl() {
    if (fornecedor?.link?.trim()) {
      let url = fornecedor.link.trim()
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url
      return url
    }
    if (telefoneLimpo) return `https://wa.me/${telefoneLimpo}`
    return null
  }

  function enviarMensagemComFeedback() {
    var url = config.VITE_WAHA_API_URL
    setStatus(null)
    axios.post(`${url}/api/sendText`, {
      chatId: `${telefoneLimpo}@c.us`,
      reply_to: null,
      text: `Olá ${fornecedor.razaoSocial}, eu gostaria de entrar em contato para saber sobre ofertas.`,
      linkPreview: true,
      linkPreviewHighQuality: false,
      session: "default"
    }, {
      headers: { 'X-Api-Key': config.VITE_WAHA_API_KEY }
    }).then(res => {
      setStatus({ type: 'success', message: 'Mensagem enviada com sucesso' })
    }).catch(err => {
      setStatus({ type: 'error', message: 'Erro ao enviar mensagem' })
      console.error('Erro ao enviar mensagem:', err)
    })
  }
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
        <button
          onClick={enviarMensagemComFeedback}
          className="fornecedor-contatar"
        >
          Contatar
        </button>

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

      {status && createPortal(
        <div className={`fornecedor-modal-overlay fornecedor-modal-${status.type}`}> 
          <div className="fornecedor-modal" role="dialog" aria-modal="true">
            <p className="fornecedor-modal-message">{status.message}</p>
            <div className="fornecedor-modal-actions">
              {status.type === 'success' && (
                <button
                  type="button"
                  className="fornecedor-modal-btn"
                  onClick={() => {
                    const url = getContatoUrl()
                    if (url) window.open(url, '_blank')
                  }}
                >
                  Entrar no chat
                </button>
              )}

              <button
                type="button"
                className="fornecedor-modal-btn fornecedor-modal-close"
                onClick={() => setStatus(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </article>
  );
}
