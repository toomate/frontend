import React, { useState } from "react";
import "./App.css";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "./provider/Api";

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function entrar() {
    if (!nome.trim() || !senha.trim()) {
      setErro("Preencha usuario e senha.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const resposta = await AuthApi.login({ nome: nome.trim(), senha: senha.trim() });
      const token = resposta?.token;

      if (!token) {
        setErro("Login sem token. Verifique o backend.");
        return;
      }

      localStorage.setItem("token", token);

      if (resposta?.nome) {
        localStorage.setItem("usuarioNome", resposta.nome);
      }

      if (resposta?.userId) {
        localStorage.setItem("usuarioId", String(resposta.userId));
      }

      navigate("/dashboard");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setErro("Usuario ou senha invalidos.");
      } else {
        setErro("Nao foi possivel realizar login.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container">
      <div className="box">
        <span className="titulo">Toomate</span>
        <span className="subtitulo">Login</span>
        <span className="subtitulo2">
          Digite seu nome de usuario e senha para entrar
        </span>

        <input
          type="text"
          placeholder="Usuario"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <div className="input-wrapper">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") entrar();
            }}
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setMostrarSenha(!mostrarSenha)}
          >
            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {erro && <p className="auth-erro">{erro}</p>}

        <button className="btn" onClick={entrar} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        <p className="auth-switch">
          <span onClick={() => navigate("/cadastro")}>Cadastre-se</span>
        </p>
      </div>
    </div>
  );
}
