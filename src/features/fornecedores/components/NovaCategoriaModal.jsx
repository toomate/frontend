import { BaseModal } from "../common/BaseModal";

export function NovaCategoriaModal({ aberto, aoFechar, aoSalvar, form, aoMudar, salvando }) {
  return (
    <BaseModal
      aberto={aberto}
      onClose={aoFechar}
      title="Nova categoria"
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
            {salvando ? "Salvando..." : "Salvar categoria"}
          </button>
        </>
      }
    >
      <div className="fornecedores-modal-body">
        <input
          name="nome"
          placeholder="Nome da categoria"
          value={form.nome}
          onChange={aoMudar}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              aoSalvar();
            }
          }}
        />
      </div>
    </BaseModal>
  );
}
