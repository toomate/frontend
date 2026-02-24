import React, { useState } from "react";
import "./index.css";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ irPara }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div className="container">
      <div className="box">
        <span className="titulo">Toomate</span>
        <span className="subtitulo">Login</span>
        <span className="subtitulo2">
          Digite seu nome de usuário e senha para entrar
        </span>

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

        <button className="btn" onClick={() => irPara("dashboard")}>
          Entrar
        </button>

        <p className="auth-switch">
          <span onClick={() => irPara("cadastro")}>Cadastre-se</span>
        </p>
      </div>
    </div>
  );
}
