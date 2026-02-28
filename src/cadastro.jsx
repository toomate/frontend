import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Cadastro() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="auth-page">
      <div className="auth-card auth-card-register">
        <h1 className="auth-brand">Toomate</h1>
        <h2 className="auth-title">Cadastro</h2>
        <p className="auth-subtitle">Crie sua conta para comecar a usar a plataforma.</p>

        <input className="auth-input" type="text" placeholder="Nome completo" />
        <input className="auth-input" type="text" placeholder="Usuario" />

        <div className="auth-input-wrap">
          <input
            className="auth-input"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
          />
          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setMostrarSenha(!mostrarSenha)}
          >
            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="auth-input-wrap">
          <input
            className="auth-input"
            type={mostrarConfirmar ? "text" : "password"}
            placeholder="Confirmar senha"
          />
          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
          >
            {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button className="auth-submit" onClick={() => navigate("/")}>
          Cadastrar
        </button>

        <p className="auth-link-row">
          Ja possui conta? <span onClick={() => navigate("/")}>Entrar</span>
        </p>
      </div>
    </section>
  );
}
