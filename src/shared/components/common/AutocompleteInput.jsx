import React from "react";

export default function AutocompleteInput({
  options,
  value,
  onValueChange,
  onSelect,
  placeholder,
  className,
}) {
  const selectedOption = (options ?? []).find(
    (opcao) => String(opcao.label) === String(value)
  );

  function handleChange(e) {
    const selectedId = e.target.value;
    const found = (options ?? []).find((opcao) => String(opcao.id) === String(selectedId));
    if (found) {
      onValueChange(found.label);
      onSelect(found);
    } else {
      onValueChange("");
      onSelect(null);
    }
  }

  return (
    <div className="input-wrapper" style={{ width: "100%" }}>
      <select
        className={className}
        value={selectedOption ? selectedOption.id : ""}
        onChange={handleChange}
        style={{ width: "100%" }}
      >
        <option value="" disabled>
          {placeholder || "Selecione"}
        </option>
        {(options ?? []).map((opcao) => (
          <option key={opcao.id} value={opcao.id}>
            {opcao.label}
          </option>
        ))}
      </select>
    </div>
  );
}
