import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "./provider/Api";
import "./Login.css";

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function entrar() {
    if (!username.trim() || !senha.trim()) {
      setErro("Preencha usuario e senha.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const resposta = await AuthApi.login({ apelido: username.trim(), senha: senha.trim() });
      console.log("AAAAAA", resposta)
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
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-brand">Toomate</h1>
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">Entre com seu usuario para acessar o painel.</p>

        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="auth-input-wrap">
          <input
            className="auth-input"
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
            className="auth-eye-btn"
            onClick={() => setMostrarSenha(!mostrarSenha)}
          >
            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {erro && <p className="auth-error">{erro}</p>}

        <button className="auth-submit" onClick={entrar} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        <p className="auth-link-row">
          Nao tem conta? <span onClick={() => navigate("/cadastro")}>Cadastre-se</span>
        </p>
      </div>
    </section>
  );
}
