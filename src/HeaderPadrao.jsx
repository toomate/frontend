import React from "react";
import { ArrowLeft } from "lucide-react";
import "./App.css";
import "./HeaderPadrao.css";
import NotificationBell from "./components/Cabecalho/NotificationBell.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import HamburgerButton from "./components/HamburgerButton/HamburgerButton";

const titulosPorRota = {
  "/dashboard": "Dashboard",
  "/boletos": "Boletos",
  "/cadastro": "Cadastro de Usuário",
  "/estoque": "Estoque",
  "/fornecedor": "Fornecedor",
  "/fornecedores": "Fornecedores",
  "/cadastro-insumo": "Cadastro de Insumo",
  "/cadastro-fornecedor": "Cadastro de Fornecedor",
  "/cadastro-boleto": "Cadastro de Boleto",
  "/cadastro-fiado": "Cadastro de Fiado",
  "/cadastro-lote": "Cadastro de Lote",
  "/calendario": "Calendário",
  "/calendariodetalhes": "Detalhes do Calendário",
  "/vencimentos": "Vencimentos",
  "/rotinas": "Rotinas",
  "/fiados": "Fiados",
  "/leitor": "Leitor de Código de Barras",
  "/admin": "Admin",
};

function normalizarCaminho(caminho) {
  return String(caminho || "").replace(/\/+$/, "").toLowerCase() || "/";
}

function formatarTituloDaUrl(caminho) {
  const caminhoNormalizado = normalizarCaminho(caminho);

  if (titulosPorRota[caminhoNormalizado]) {
    return titulosPorRota[caminhoNormalizado];
  }

  const partes = caminhoNormalizado.split("/").filter(Boolean);

  if (!partes.length) {
    return "";
  }

  return partes
    .map((parte) =>
      parte
        .replace(/[-_]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .filter(Boolean)
        .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(" "),
    )
    .join(" /");
}

export default function HeaderPadrao({ mostrarBotao = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const nomeUsuarioLogado =
    localStorage.getItem("usuarioNomeCompleto") ||
    localStorage.getItem("usuarioNome") ||
    "Usuario";

  const estaNaDashboard = normalizarCaminho(location.pathname) === "/dashboard";
  const tituloTela = formatarTituloDaUrl(location.pathname);

  function handleLogout() {
    limparSessaoAutenticacao();
    navigate("/");
  }

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <header className="header">
      <div className="lado-esquerdo">
        <HamburgerButton size={24} color="#6b4423" className="header-hamburguer-btn" />

        <div className="logo-circulo" onClick={() => {navigate("/dashboard")}}></div>

        <div className="restaurante">
          <div className="restaurante-name">Toomate Bistrô</div>
          <div className="restaurante-subnome">{nomeUsuarioLogado}</div>
        </div>
      </div>

      <div className="titulo-tela">{tituloTela}</div>

      <div className="lado-direito" style={{ display: "flex", gap: "10px" }}>
        {mostrarBotao && (
          <button onClick={handleBack} className="btn">
            <ArrowLeft size={18} /> Voltar
          </button>
        )}
        <NotificationBell />
      </div>
    </header>
  );
}
