import React, { useState } from "react";
import "./App.css";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CadastroFornecedor() {
  const navigate = useNavigate();

  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  

  return (
    <div className="container">
      
      <div className="box">

        <span className="titulo">Cadastro de Fornecedor</span>

        <div className="caixa">
          <span>Razão Social</span>
          <input type="text" placeholder="Nome do Estabelecimento" />
          
          <span>Telefone</span>
          <input type="number" placeholder="(XX) XXXXX-XXXX" />

          <span>Link do Whatsapp</span>
          <input type="text" placeholder="www.linkwhatsapp.com/nomefornecedor" />
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
