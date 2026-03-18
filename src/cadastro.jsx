import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "./provider/Api";
import "./Login.css";

export default function Cadastro() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [username, setUsername] = useState("");
  const [perfilAcesso, setPerfilAcesso] = useState("usuario");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function cadastrar() {
    const nomeCompletoFormatado = nomeCompleto.trim();
    const usernameFormatado = username.trim();
    const senhaFormatada = senha.trim();
    const confirmarFormatada = confirmarSenha.trim();

    if (
      !nomeCompletoFormatado ||
      !usernameFormatado ||
      !senhaFormatada ||
      !confirmarFormatada ||
      !perfilAcesso
    ) {
      setErro("Preencha nome, username, perfil, senha e confirmacao.");
      return;
    }

    if (senhaFormatada.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senhaFormatada !== confirmarFormatada) {
      setErro("As senhas nao coincidem.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      await AuthApi.cadastrar({
        nome: nomeCompletoFormatado,
        apelido: usernameFormatado,
        senha: senhaFormatada,
        administrador: perfilAcesso === "admin",
      });
      localStorage.setItem("usuarioNomeCompleto", nomeCompletoFormatado);
      navigate("/");
    } catch (error) {
      const status = error?.response?.status;

      if (status === 409) {
        setErro("Esse usuario ja existe.");
        return;
      }

      if (status === 400) {
        setErro("Dados invalidos. Verifique os campos.");
        return;
      }

      setErro("Nao foi possivel realizar o cadastro.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="auth-page auth-page-cadastro">
      <div className="auth-card auth-card-cadastro">
        <h1 className="auth-brand">Toomate</h1>
        <h2 className="auth-title">Cadastro de Usuario</h2>
        <p className="auth-subtitle">Crie uma conta para comecar a usar a plataforma.</p>

        <div className="auth-input-wrap">
          <input
            className="auth-input auth-cadastro-input"
            type="text"
            placeholder="Nome completo"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
          />
        </div>

        <div className="auth-input-wrap">
          <input
            className="auth-input auth-cadastro-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="auth-input-wrap">
          <select
            className="auth-input auth-cadastro-input auth-cadastro-select"
            value={perfilAcesso}
            onChange={(e) => setPerfilAcesso(e.target.value)}
          >
            <option value="usuario">Usuario comum</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="auth-input-wrap">
          <input className="auth-input auth-cadastro-input auth-cadastro-input-senha"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
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
            className="auth-input auth-cadastro-input auth-cadastro-input-senha"
            type={mostrarConfirmar ? "text" : "password"}
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") cadastrar();
            }}
          />
          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
          >
            {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {erro && <p className="auth-error">{erro}</p>}

        <div className="auth-actions">
          <button
            className="auth-submit"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>

          <button
            className="auth-submit"
            onClick={cadastrar}
            disabled={carregando}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </div>
    </section>
  );
}



