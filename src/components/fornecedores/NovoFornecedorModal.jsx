export function NovoFornecedorModal({
  aberto,
  aoFechar,
  aoSalvar,
  form,
  aoMudar,
  salvando,
  titulo = "Novo fornecedor",
  textoBotao = "Salvar",
}) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="fornecedores-modal-overlay" role="presentation">
      <div className="fornecedores-modal" role="dialog" aria-modal="true">
        <div className="fornecedores-modal-header">
          <h3>{titulo}</h3>
          <button type="button" onClick={aoFechar}>
            X
          </button>
        </div>

        <div className="fornecedores-modal-body">
          <input
            name="razaoSocial"
            placeholder="Razao social"
            value={form.razaoSocial}
            onChange={aoMudar}
          />
          <input
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={aoMudar}
          />
        </div>

        <div className="fornecedores-modal-actions">
          <button type="button" className="fornecedores-btn-cancelar" onClick={aoFechar}>
            Cancelar
          </button>
          <button
            type="button"
            className="fornecedores-btn-salvar"
            onClick={aoSalvar}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : textoBotao}
          </button>
        </div>
      </div>
    </div>
  );
}
