import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Boxes,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  FileText,
  Handshake,
  Home,
  List,
  Menu,
  Package,
  QrCode,
  Receipt,
  Shield,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ehAdmin, limparSessaoAutenticacao } from "../../utils/sessao";
import "./HamburgerButton.css";

const secoesMenu = [
  { id: "home", titulo: "Home", to: "/dashboard", icone: Home },
  {
    id: "estoque",
    titulo: "Estoque",
    to: "/estoque",
    icone: Boxes,
    subitens: [
      { to: "/cadastro-insumo", label: "Cadastro de Insumo", icone: Package },
      { to: "/cadastro-lote", label: "Cadastro de Lote", icone: Boxes },
      { to: "/cadastro-fornecedor", label: "Cadastro de Fornecedor", icone: Building2 },
      { to: "/rotinas", label: "Rotinas", icone: List },
      { to: "/leitor", label: "Leitor de Código de Barras", icone: QrCode },
    ],
  },
  { id: "fornecedores", titulo: "Fornecedores", to: "/fornecedores", icone: Building2 },
  { id: "vencimentos", titulo: "Vencimentos", to: "/vencimentos", icone: CalendarDays },
  {
    id: "boletos",
    titulo: "Boletos",
    to: "/boletos",
    icone: Receipt,
    apenasAdmin: true,
    subitens: [
      { to: "/cadastro-boleto", label: "Cadastro de Boletos", icone: CircleDollarSign },
      { to: "/boletos", label: "Lista de Boletos", icone: Receipt },
    ],
  },
  {
    id: "fiados",
    titulo: "Fiados",
    to: "/fiados",
    icone: Handshake,
    apenasAdmin: true,
    subitens: [
      { to: "/cadastro-fiado", label: "Cadastro de Fiados", icone: CircleDollarSign },
      { to: "/fiados", label: "Lista de Fiados", icone: Handshake },
    ],
  },
  {
    id: "admin",
    titulo: "Admin",
    to: "/admin",
    icone: Shield,
    apenasAdmin: true,
    subitens: [
      { to: "/admin?aba=lancamentos", label: "Controle de Gastos", icone: Wallet },
      { to: "/admin?aba=usuarios", label: "Gerenciamento de Usuários", icone: Users },
      { to: "/cadastro", label: "Cadastro de Usuários", icone: UserPlus },
      { to: "/admin?aba=logs", label: "Logs de Mudança", icone: Activity },
      { to: "/admin?aba=relatorios", label: "Relatório do Sistema", icone: FileText },
      {to: "/admin?aba=whatsapp", label: "Configurações do WhatsApp", icone: Handshake},
    ],
  },
];

function normalizarCaminho(caminho) {
  const caminhoNormalizado = String(caminho || "").replace(/\/+$/, "");
  return caminhoNormalizado || "/";
}

function extrairPartesUrl(caminho) {
  const url = new URL(caminho, "http://localhost");

  return {
    pathname: normalizarCaminho(url.pathname),
    search: url.search || "",
  };
}

export default function HamburgerButton({
  size = 28,
  color = "#b88b09",
  ariaLabel = "Abrir menu de navegação",
  className = "",
}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [secoesAbertas, setSecoesAbertas] = useState({});
  const navigate = useNavigate();
  const localizacao = useLocation();
  const referenciaPainel = useRef(null);
  const caminhoAtual = normalizarCaminho(localizacao.pathname);
  const buscaAtual = localizacao.search || "";

  useEffect(() => {
    if (!menuAberto) return;

    function fecharAoClicarFora(evento) {
      if (referenciaPainel.current && !referenciaPainel.current.contains(evento.target)) {
        setMenuAberto(false);
      }
    }

    function fecharComEscape(evento) {
      if (evento.key === "Escape") {
        setMenuAberto(false);
      }
    }

    document.addEventListener("mousedown", fecharAoClicarFora);
    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [menuAberto]);

  function fecharMenu() {
    setMenuAberto(false);
  }

  function sair() {
    fecharMenu();
    limparSessaoAutenticacao();
    navigate("/");
  }

  function itemEstaAtivo(caminho, considerarSubrotas = false) {
    const destino = extrairPartesUrl(caminho);

    if (destino.search) {
      return caminhoAtual === destino.pathname && buscaAtual === destino.search;
    }

    if (considerarSubrotas) {
      return caminhoAtual === destino.pathname || caminhoAtual.startsWith(`${destino.pathname}/`);
    }

    return caminhoAtual === destino.pathname;
  }

  function secaoEstaAberta(idSecao, estaAtiva) {
    if (secoesAbertas[idSecao] !== undefined) {
      return secoesAbertas[idSecao];
    }

    return estaAtiva;
  }

  function alternarSecao(idSecao) {
    setSecoesAbertas((estadoAtual) => ({
      ...estadoAtual,
      [idSecao]: !secaoEstaAberta(idSecao, false),
    }));
  }

  return (
    <div className="menu-hamburguer-wrap">
      <button
        type="button"
        className={`botao-hamburguer ${className}`}
        onClick={() => setMenuAberto((estadoAnterior) => !estadoAnterior)}
        style={{ color }}
        aria-label={ariaLabel}
        aria-expanded={menuAberto}
        aria-controls="menu-lateral-toomate"
      >
        <Menu size={size} strokeWidth={2.25} />
      </button>

      <div
        className={`sobreposicao-menu ${menuAberto ? "aberto" : ""}`}
        onClick={fecharMenu}
        aria-hidden={!menuAberto}
      />

      <aside
        id="menu-lateral-toomate"
        ref={referenciaPainel}
        className={`painel-lateral-menu ${menuAberto ? "aberto" : ""}`}
        role="menu"
      >
        <div className="cabecalho-painel">
          <span>Navegação</span>
          <button
            type="button"
            className="botao-fechar-painel"
            onClick={fecharMenu}
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        <div className="conteudo-painel">
          <div className="lista-links-painel">
            {secoesMenu.filter((secao) => !secao.apenasAdmin || ehAdmin()).map((secao) => {
              const secaoAtiva =
                itemEstaAtivo(secao.to, true) ||
                (secao.subitens || []).some((subitem) => itemEstaAtivo(subitem.to));
              const IconeSecao = secao.icone;

              const secaoTemSubitens = Boolean(secao.subitens?.length);
              const secaoAberta = secaoEstaAberta(secao.id, secaoAtiva);

              return (
                <div key={secao.id} className="menu-secao">
                  <div className="menu-secao-cabecalho">
                    <Link
                      to={secao.to}
                      onClick={fecharMenu}
                      className={`link-menu link-menu-principal ${secaoAtiva ? "ativo" : ""}`}
                    >
                      {IconeSecao ? (
                        <span className="link-menu-icone" aria-hidden="true">
                          <IconeSecao size={15} />
                        </span>
                      ) : null}
                      {secao.titulo}
                    </Link>

                    {secaoTemSubitens ? (
                      <button
                        type="button"
                        className={`botao-expansao-secao ${secaoAberta ? "aberto" : ""}`}
                        onClick={() => alternarSecao(secao.id)}
                        aria-label={`Alternar subtópicos de ${secao.titulo}`}
                        aria-expanded={secaoAberta}
                      >
                        <ChevronDown size={14} />
                      </button>
                    ) : null}
                  </div>

                  {secaoTemSubitens ? (
                    <div className={`submenu-painel ${secaoAberta ? "aberto" : ""}`}>
                      <div className="submenu-conteudo">
                        {secao.subitens.map((subitem) => (
                          <Link
                            key={`${secao.id}-${subitem.to}-${subitem.label}`}
                            to={subitem.to}
                            onClick={fecharMenu}
                            className={`link-menu link-menu-sub ${
                              itemEstaAtivo(subitem.to) ? "ativo" : ""
                            }`}
                          >
                            {subitem.icone ? (
                              <span className="link-menu-icone" aria-hidden="true">
                                <subitem.icone size={14} />
                              </span>
                            ) : null}
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <button type="button" className="botao-sair-menu" onClick={sair}>
            Sair
          </button>
        </div>
      </aside>
    </div>
  );
}
