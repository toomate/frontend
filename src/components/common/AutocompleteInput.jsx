import React, { useState } from "react";

export default function AutocompleteInput({
  options,
  value,
  onValueChange,
  onSelect,
  placeholder,
  className,
}) {
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const opcoesFiltradas = (options ?? [])
    .filter((opcao) => opcao.label.toLowerCase().includes(String(value ?? "").trim().toLowerCase()))
    .slice(0, 6);

  function selecionarPorTextoExato(texto) {
    const termo = String(texto ?? "").trim().toLowerCase();
    const encontrado = (options ?? []).find((opcao) => opcao.label.trim().toLowerCase() === termo);
    onSelect(encontrado ?? null);

    if (encontrado) {
      onValueChange(encontrado.label);
    }
  }

  return (
    <div className="input-wrapper" style={{ position: "relative", width: "100%" }}>
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        onFocus={() => setMostrarSugestoes(true)}
        onBlur={() => {
          selecionarPorTextoExato(value);
          setTimeout(() => setMostrarSugestoes(false), 120);
        }}
        onChange={(e) => {
          onValueChange(e.target.value);
          onSelect(null);
          setMostrarSugestoes(true);
        }}
      />

      {mostrarSugestoes && opcoesFiltradas.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #d9d9d9",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 6px 14px rgba(0, 0, 0, 0.08)",
            maxHeight: "180px",
            overflowY: "auto",
            zIndex: 20,
          }}
        >
          {opcoesFiltradas.map((opcao) => (
            <button
              key={opcao.id}
              type="button"
              onMouseDown={() => {
                onValueChange(opcao.label);
                onSelect(opcao);
                setMostrarSugestoes(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              {opcao.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}