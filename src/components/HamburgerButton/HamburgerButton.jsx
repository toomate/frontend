import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import "./HamburgerButton.css";

const itensMenu = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/admin", label: "Admin" },
  { to: "/boletos", label: "Boletos" },
  { to: "/vencimentos", label: "Vencimentos" },
  { to: "/estoque", label: "Estoque" },
  { to: "/fornecedor", label: "Fornecedores" },
  { to: "/cadastro-insumo", label: "Cadastrar Insumo" },
  { to: "/cadastro-lote", label: "Cadastrar Lote" },
  { to: "/calendario", label: "Calendario" },
  { to: "/cadastro", label: "Cadastro de Usuario" },
  { to: "/rotinas", label: "Rotinas" },
];

export default function HamburgerButton({
  size = 28,
  color = "#b88b09",
  ariaLabel = "Abrir menu de navegacao",
  className = "",
}) {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const referenciaPainel = useRef(null);

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
    navigate("/");
  }

  return (
    <div className="menu-hamburguer-wrap">
      <button
        type="button"
        className={`botao-hamburguer ${className}`}
        onClick={() => setMenuAberto((estadoAnterior) => !estadoAnterior)}
        aria-label={ariaLabel}
        aria-expanded={menuAberto}
        aria-controls="menu-lateral-toomate"
      >
        <Menu size={size} color={color} />
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
            {itensMenu.map((itemMenu) => (
              <NavLink
                key={itemMenu.to}
                to={itemMenu.to}
                onClick={fecharMenu}
                className={({ isActive: estaAtivo }) =>
                  `link-menu ${estaAtivo ? "ativo" : ""}`
                }
              >
                {itemMenu.label}
              </NavLink>
            ))}
          </div>

          <button
            type="button"
            className="botao-sair-menu"
            onClick={sair}
          >
            Sair
          </button>
        </div>
      </aside>
    </div>
  );
}

