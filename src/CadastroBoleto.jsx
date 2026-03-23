import React, { useState } from "react";
import "./App.css";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CadastroBoleto() {
  const navigate = useNavigate();

  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [novaCategoriaBoleto, setNovaCategoriaBoleto] = useState("");

  return (
    <div className="container">
      <div className="box">

        <span className="titulo">Cadastro de Boleto</span>

        <div className="caixa">
            <span>Título</span>
            <input type="text" placeholder="Conta de luz" />

            <span>Categoria</span>
            <div className="input-wrapper">
            <select className="selectCategoriaBoleto">
                <option>Selecione uma categoria</option>
                <option>Conta de consumo</option>
                <option>Boleto de fornecedor</option>
                <option>Pagamento de funcionário</option>
            </select>

            <button type="button" className="eye-btn" onClick={() => setAbrirModal(true)}>
                <Plus size={18} />
            </button>
            </div>

            <span>Valor</span>
            <input type="number" placeholder="R$ XXX,XX" />
            
            <span>Data de Vencimento</span>
            <input type="date" />
        </div>

        <div className="actions">
          <button className="btn btn-cancelar" onClick={() => navigate(-1)}>
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
            <span className="titulo">Nova categoria de boleto</span>

            <input
              className="modal-input"
              type="text"
              placeholder="Categoria do boleto"
              value={novaCategoriaBoleto}
              onChange={(e) => setNovaCategoriaBoleto(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn btn-cancelar"
                onClick={() => setAbrirModal(false)}
              >
                Cancelar <Trash2 size={14} />
              </button>

              <button
                className="btn"
                onClick={() => {
                  setAbrirModal(false);
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
              onClick={() => navigate(-1)}
            >
              OK
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
