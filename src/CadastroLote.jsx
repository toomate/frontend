import React, { useState } from "react";
import "./index.css";
import { ArrowLeft, Plus, Trash2, Save, CheckCircle} from "lucide-react";

export default function CadastroLote({ irPara }) {
  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModal1, setAbrirModal1] = useState(false);
  const [novaMarca, setNovaMarca] = useState("");

  return (
    <div className="container">
      <div className="box box-cadastro">
      
        <button className="btn-voltar" onClick={() => irPara("dashboard")}>
          <ArrowLeft size={20} />
        </button>

        <span className="titulo">Cadastro de Lote</span>

        <div className="form-group">
          <label>Nome</label>
          <input type="text" placeholder="Nome do Insumo" />
        </div>

        <div className="form-group">
          <label>Marca</label>
          <div className="select-wrapper">
            <select>
              <option>Marca do Insumo</option>
              <option>Tio João</option>
              <option>Coca Cola</option>
              <option>Ciff</option>
            </select>

            <button 
              className="icon-btn" onClick={() => setAbrirModal(true)}
            >
              <Plus size={16}/>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Preço Unitário</label>
          <input type="number" placeholder="0,00" />
        </div>

        <div className="form-group1">
          <div className="form-group2">
            <label>Data de Validade</label>
            <input type="date" />
          </div>

          <div className="form-group2">
            <label>Quantidade</label>
            <input type="number" placeholder="0" />
          </div>
        </div>

        <div className="form-group">
          <label>Nota Fiscal</label>
          <label className="botao-upload">
            <input type="file" accept="image/*" />
          </label>
        </div>

        <div className="actions">
          <button className="btn btn-cancelar" onClick={() => irPara("dashboard")}>
            Cancelar
          </button>
          <button className="btn">Cadastrar</button>
        </div>
      </div>

      {/* MODAL */}
      {abrirModal && (
        <div className="modal-overlay">
          <div className="modal">
            
            <div className="modal-header">
              <span>Nome da Marca</span>
            </div>

            <input
              className="modal-input"
              type="text"
              value={novaMarca}
              onChange={(e) => setNovaMarca(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn-cancelar1" onClick={() => setAbrirModal(false)}>
                Cancelar
                <Trash2 size={12} />
              </button>

              <button className="btn-salvar1" onClick={() => {
                setAbrirModal(false);
                setAbrirModal1(true);
              }}>
                Salvar
                <Save size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {abrirModal1 && (
        <div className="modal-overlay">
          <div className="modal modal-sucesso">
            

            <div className="modal-header">
              <span>O cadastro foi realizado com sucesso!</span>
            </div>
            <CheckCircle size={88} className="icone-sucesso" />
            <button
              className="btn-ok"
              onClick={() => setAbrirModal1(false)}
            >
              OK
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
