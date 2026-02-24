import React from "react";
import "./index.css";
import { ArrowLeft, Plus } from "lucide-react";

export default function CadastroInsumo({ irPara }) {
  return (
    <div className="container">
      <div className="box box-cadastro">
      
        <button className="btn-voltar" onClick={() => irPara("dashboard")}>
          <ArrowLeft size={20} />
        </button>

        <span className="titulo">Cadastro de Insumo</span>

        <div className="form-group">
          <label>Nome</label>
          <input type="text" placeholder="Nome do Insumo" />
        </div>

        <div className="form-group">
          <label>Categoria</label>
          <div className="select-wrapper">
            <select>
              <option>Categoria do Insumo</option>
              <option>Alimentos</option>
              <option>Bebidas</option>
              <option>Limpeza</option>
            </select>
            <button className="icon-btn"> 
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Un. de Medida</label>
          <select>
            <option>Kg</option>
            <option>Unidade</option>
            <option>Litro</option>
          </select>
        </div>

        <div className="form-group">
          <label>Qtd. Mínima</label>
          <input type="number" placeholder="Ex: 5" />
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
