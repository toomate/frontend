import React, { useState } from "react";
import "./App.css";
import { Plus,  Trash2, Save, CheckCircle  } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CadastroInsumo() {
  const navigate = useNavigate();

  const [abrirModal, setAbrirModal] = useState(null);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [novoInsumo, setNovoInsumo] = useState("");
  
  return (
    <div className="container">
      <div className="box">

        <span className="titulo">Cadastro de Insumo</span>

      <div className="caixa">

        <span>Nome do Insumo</span>
        <input type="text" placeholder="Ex: Arroz" />

        {/* Categoria */}
        <span>Categoria do Insumo</span>
        <div className="input-wrapper">
          <select className="selectCategoria">
            <option>Selecione</option>
            <option>Alimentos</option>
            <option>Bebidas</option>
            <option>Limpeza</option>
          </select>

          <button type="button" className="eye-btn1" onClick={() => setAbrirModal("categoria")}>
            <Plus size={18} />
          </button>
        </div>

        {/* Unidade */}
        <span>Unidade de Medida</span>
        <div className="input-wrapper">
          <select className="selectUnidade">
            <option>Selecione</option>
            <option>Kg</option>
            <option>Unidade</option>
            <option>Litro</option>
          </select>

          <button type="button" className="eye-btn2" onClick={() => setAbrirModal("unidade")}>
            <Plus size={18} />
          </button>
        </div>

        <span>Quantidade</span>
        <input type="number" placeholder="0" />
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

      {/* MODAL NOVO INSUMO */}
      {abrirModal && (
        <div className="modal-overlay"> 
          <div className="modal">

            <span className="titulo">
              {abrirModal === "categoria"
                ? "Nova Categoria de Insumo"
                : "Nova Unidade de Medida"}
            </span>

            <input
              className="modal-input"
              type="text"
              placeholder="Nome da marca"
              value={novoInsumo}
              onChange={(e) => setNovoInsumo(e.target.value)}
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
