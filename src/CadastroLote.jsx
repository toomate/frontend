import React, { useState } from "react";
import "./App.css";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CadastroLote() {
  const navigate = useNavigate();

  const [abrirModal, setAbrirModal] = useState(null);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [novaMarca, setNovaMarca] = useState("");

  return (
    <div className="container">
      <div className="box">

        <span className="titulo">Cadastro de Lote</span>

        <div className="caixa">

          {/* Nome do insumo */}
          <span>Nome</span>
          <div className="input-wrapper">
            <select className="selectNome">
              <option>Nome do Insumo</option>
              <option>Alimentos</option>
              <option>Bebidas</option>
              <option>Limpeza</option>
            </select>
  
            <button type="button" className="eye-btn1" onClick={() => setAbrirModal("nome")}>
              <Plus size={18} />
            </button>
          </div>

          {/* Marca */}
          <span>Marca</span>
          <div className="input-wrapper">
            <select className="selectMarca">
              <option>Marca do Insumo</option>
              <option>Tio João</option>
              <option>Coca Cola</option>
              <option>Ciff</option>
            </select>

            <button type="button" className="eye-btn2" onClick={() => setAbrirModal("marca")}>
              <Plus size={18} />
            </button>
          </div>
          
          <span>Preço unitário</span>
          <input type="number" placeholder="R$ XXX,XX" />
          
          <span>Data de validade</span>
          <input type="date" />

          <span>Quantidade</span>
          <input type="number" placeholder="0" />

          {/* Upload */}
          <div className="botao-upload">
            Enviar Nota Fiscal
            <label className="botao-upload-lote">
              <input type="file" accept="image/*" />
            </label>
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-cancelar" onClick={() => navigate("/dashboard")}>
            Cancelar
          </button>

          <button className="btn">
            Cadastrar
          </button>
        </div>
      </div>

      {/* MODAL NOVA MARCA */}
      {abrirModal && (
        <div className="modal-overlay">
          <div className="modal">

            <span className="titulo">
              {abrirModal === "nome"
                ? "Novo nome de Insumo"
                : "Nova marca de insumo"}
            </span>

            <input
              className="modal-input"
              type="text"
              placeholder="Nome da marca"
              value={novaMarca}
              onChange={(e) => setNovaMarca(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn btn-cancelar"
                onClick={() => setAbrirModal(null)}
              >
                Cancelar <Trash2 size={14} />
              </button>

              <button
                className="btn"
                onClick={() => {
                  setAbrirModal(null);
                  setAbrirModalSucesso(true);
                }}
              >
                Salvar <Save size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUCESSO */}
      {abrirModalSucesso && (
        <div className="modal-overlay">
          <div className="modal modal-sucesso">

            <CheckCircle size={80} className="icone-sucesso" />

            <span className="titulo">
              Cadastro realizado com sucesso!
            </span>

            <button
              className="btn"
              onClick={() => setAbrirModalSucesso(false)}
            >
              OK
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
