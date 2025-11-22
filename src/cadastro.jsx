import React, { useState } from "react";
import "./index1.css";
import { Eye, EyeOff } from "lucide-react";

export default function Cadastro({ irPara }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  return (
    <div className="container">
      <div className="box">
        <span className="titulo">Toomate</span>
        <span className="subtitulo">Cadastro</span>

        <input type="text" placeholder="Nome Completo" />

        <input type="text" placeholder="Usuário" />

        {/* Campo Senha */}
        <div className="input-wrapper">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setMostrarSenha(!mostrarSenha)}
          >
            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Campo Confirmar Senha */}
        <div className="input-wrapper">
          <input
            type={mostrarConfirmar ? "text" : "password"}
            placeholder="Confirmar Senha"
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
          >
            {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button className="btn" onClick={() => irPara("login")}>
          Cadastrar
        </button>

        <p className="auth-switch">
          <span onClick={() => irPara("login")}>Já possui conta?</span>
        </p>
      </div>
    </div>
  );
}
