import { BaseModal } from "../common/BaseModal";

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
  return (
    <BaseModal
      aberto={aberto}
      onClose={aoFechar}
      title={titulo}
      width={360}
      footer={
        <>
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
        </>
      }
    >
      <div className="fornecedores-modal-body">
        <input
          name="razaoSocial"
          placeholder="Razao social"
          value={form.razaoSocial}
          onChange={aoMudar}
        />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={aoMudar} />
      </div>
    </BaseModal>
  );
}
