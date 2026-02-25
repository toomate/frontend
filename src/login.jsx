import React, { useState } from "react";
import "./App.css";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

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

        <button className="btn" onClick={() => navigate("/dashboard")}>
          Entrar
        </button>

        <p className="auth-switch">
          <span onClick={() => navigate("/cadastro")}>Cadastre-se</span>
        </p>
      </div>
    </div>
  );
}