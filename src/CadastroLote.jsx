import React from "react";
import "./index1.css";
import { ArrowLeft, Plus } from "lucide-react";

export default function CadastroLote({ irPara }) {
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
            <button className="icon-btn"> 
              +
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
            <input
              type="file"
              accept="image/*"
            />
          </label>
        </div>

        <div className="actions">
          <button className="btn btn-cancelar" onClick={() => irPara("dashboard")}>
            Cancelar
          </button>
          <button className="btn">Cadastrar</button>
        </div>
      </div>
    </div>
  );
}
