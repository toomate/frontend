import React, { useState } from "react";
import "./App.css";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CadastroFiado() {
  const navigate = useNavigate();

  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [novoFiado, setNovoFiado] = useState("");

  return (
    <div className="container">
      <div className="box">

        <span className="titulo">Cadastro de Fiado</span>

        <div className="caixa">

          {/* Nome do insumo */}
          <span>Nome do cliente</span>
          <div className="input-wrapper">
            <select className="selectNome">
              <option>Selecione</option>
              <option>Guilherme Fonseca</option>
              <option>Guilherme Ortiz</option>
              <option>João Pedro Assis</option>
              <option>Laysa Bispo</option>
              <option>Lucas Aquino</option>
              <option>Matheus Diniz</option>
            </select>
  
            <button type="button" className="eye-btn" onClick={() => setAbrirModal(true)}>
              <Plus size={18} />
            </button>
          </div>

          {/* Pedido */}
          <span>Pedido</span>
          <div className="input-wrapper1">
            <select className="selectPedido">
              <option>Selecione</option>
              <option>Cardápio 1</option>
              <option>Cardápio 2</option>
              <option>Cardápio 3</option>
            </select>
          </div>
          
          <span>Valor</span>
          <input type="number" placeholder="R$ XXX,XX" />
          
          <span>Data do pedido</span>
          <input type="date" />
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

            <span className="titulo">Nome do cliente</span>

            <input
              className="modal-input"
              type="text"
              placeholder="Nome do cliente"
              value={novoFiado}
              onChange={(e) => setNovoFiado(e.target.value)}
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
