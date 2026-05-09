import React from "react";
import { BaseModal } from "./BaseModal";

export default function FormModal({
  open,
  title,
  onClose,
  onSave,
  isSaving = false,
  saveLabel = "Salvar",
  cancelLabel = "Cancelar",
  errorMessage,
  children,
}) {
  return (
    <BaseModal
      aberto={open}
      onClose={onClose}
      title={title}
      footer={(
        <>
          <button type="button" className="btn btn-cancelar" onClick={onClose}>
            {cancelLabel}
          </button>
          <button type="button" className="btn" disabled={isSaving} onClick={onSave}>
            {isSaving ? "Salvando..." : saveLabel}
          </button>
        </>
      )}
    >
      {children}
      {errorMessage && <span style={{ color: "#b3261e", fontSize: "14px" }}>{errorMessage}</span>}
    </BaseModal>
  );
}
