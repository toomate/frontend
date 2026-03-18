import { useMemo, useState } from "react";
import { Activity, FileText, Home, UserPlus, Users, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "./components/admin/AdminLayout";
import BarraLateralAdmin from "./components/admin/AdminSidebar";
import TopoAdmin from "./components/admin/AdminTopbar";
import CardResumoAdmin from "./components/admin/AdminStatCard";
import CardGraficoAdmin from "./components/admin/AdminChartCard";
import ListaLancamentosAdmin from "./components/admin/AdminExpensesList";
import GerenciamentoUsuariosAdmin from "./components/admin/AdminUsersManagement";
import AdminLogsSistema from "./components/admin/AdminLogsSistema";
import HeaderPadrao from "./HeaderPadrao";
import "./components/admin/Admin.css";

const hoje = new Date();
const anoAtualNumero = hoje.getFullYear();
const mesAtualNumero = hoje.getMonth() + 1;

function montarDataIsoNoMesAtual(dia) {
  const data = new Date(anoAtualNumero, mesAtualNumero - 1, dia);
  return data.toISOString().slice(0, 10);
}

function montarDataHoraIsoNoMesAtual(dia, horario) {
  const [hora = "00", minuto = "00"] = String(horario).split(":");
  const data = new Date(
    anoAtualNumero,
    mesAtualNumero - 1,
    dia,
    Number(hora),
    Number(minuto),
    0
  );
  return data.toISOString();
}

function formatarDataBr(dataIso) {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterPrimeiroDiaMesAtualIso() {
  const data = new Date(anoAtualNumero, mesAtualNumero - 1, 1);
  return data.toISOString().slice(0, 10);
}

function obterUltimoDiaMesAtualIso() {
  const data = new Date(anoAtualNumero, mesAtualNumero, 0);
  return data.toISOString().slice(0, 10);
}

function formatarDataFiltro(dataIso) {
  if (!dataIso) return "-";
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

const dadosMockAdmin = {
  kpis: {
    usuarios: 248,
    relatorios: 12,
    logsHoje: 1247,
    variacaoGastos: -6.2,
  },
  usuariosRecentes: [
    { id: 1, nome: "João Silva", data: "15/03/2026" },
    { id: 2, nome: "Maria Santos", data: "14/03/2026" },
    { id: 3, nome: "Pedro Costa", data: "13/03/2026" },
  ],
  tiposRelatorio: [
    { id: 1, nome: "Vendas mensais", cor: "#2f80ed" },
    { id: 2, nome: "Desempenho", cor: "#1ba968" },
    { id: 3, nome: "Análise financeira", cor: "#f2994a" },
  ],
  logs: [
    {
      id: 1,
      dataHoraIso: montarDataHoraIsoNoMesAtual(18, "10:30"),
      nivel: "INFO",
      usuario: "João Silva",
      acao: "Login realizado",
      origem: "Autenticação",
    },
    {
      id: 2,
      dataHoraIso: montarDataHoraIsoNoMesAtual(18, "09:15"),
      nivel: "INFO",
      usuario: "Maria Santos",
      acao: "Usuário adicionado",
      origem: "Gestão de usuários",
    },
    {
      id: 3,
      dataHoraIso: montarDataHoraIsoNoMesAtual(18, "08:45"),
      nivel: "ALERTA",
      usuario: "Admin",
      acao: "Configuração alterada",
      origem: "Painel administrativo",
    },
    {
      id: 4,
      dataHoraIso: montarDataHoraIsoNoMesAtual(17, "18:22"),
      nivel: "ERRO",
      usuario: "Sistema",
      acao: "Falha ao processar relatório financeiro",
      origem: "Relatórios",
    },
    {
      id: 5,
      dataHoraIso: montarDataHoraIsoNoMesAtual(17, "16:08"),
      nivel: "INFO",
      usuario: "Pedro Costa",
      acao: "Atualização de lote de insumo",
      origem: "Controle de gastos",
    },
    {
      id: 6,
      dataHoraIso: montarDataHoraIsoNoMesAtual(16, "14:37"),
      nivel: "ALERTA",
      usuario: "Sistema",
      acao: "Tentativa de acesso sem permissão",
      origem: "Autenticação",
    },
    {
      id: 7,
      dataHoraIso: montarDataHoraIsoNoMesAtual(16, "11:03"),
      nivel: "INFO",
      usuario: "Bruna Almeida",
      acao: "Cadastro de novo fornecedor",
      origem: "Fornecedores",
    },
    {
      id: 8,
      dataHoraIso: montarDataHoraIsoNoMesAtual(15, "09:54"),
      nivel: "ERRO",
      usuario: "Sistema",
      acao: "Timeout na consulta de categorias",
      origem: "Fornecedores",
    },
  ],
  usuariosSistema: [
    { id: 1, nome: "Joao Silva", username: "joao.silva", ehAdmin: true, dataCadastroIso: "2026-03-15" },
    { id: 2, nome: "Maria Santos", username: "maria.santos", ehAdmin: false, dataCadastroIso: "2026-03-14" },
    { id: 3, nome: "Pedro Costa", username: "pedro.costa", ehAdmin: false, dataCadastroIso: "2026-03-13" },
    { id: 4, nome: "Ana Oliveira", username: "ana.oliveira", ehAdmin: true, dataCadastroIso: "2026-03-12" },
    { id: 5, nome: "Lucas Ferreira", username: "lucas.ferreira", ehAdmin: false, dataCadastroIso: "2026-03-11" },
    { id: 6, nome: "Bruna Almeida", username: "bruna.almeida", ehAdmin: false, dataCadastroIso: "2026-03-10" },
  ],
  lancamentosInsumos: [
    { id: 1, lote: "L-1001", insumo: "Tomate italiano", marca: "Campo Vivo", dataIso: montarDataIsoNoMesAtual(15), valorTotal: 1280 },
    { id: 2, lote: "L-1002", insumo: "Tomate italiano", marca: "Campo Vivo", dataIso: montarDataIsoNoMesAtual(9), valorTotal: 960 },
    { id: 3, lote: "L-1003", insumo: "Azeite extra virgem", marca: "Oliva Premium", dataIso: montarDataIsoNoMesAtual(14), valorTotal: 1740 },
    { id: 4, lote: "L-1004", insumo: "Queijo mussarela", marca: "Serra", dataIso: montarDataIsoNoMesAtual(13), valorTotal: 990 },
    { id: 5, lote: "L-1005", insumo: "Filé de salmão", marca: "Oceano Azul", dataIso: montarDataIsoNoMesAtual(11), valorTotal: 1560 },
    { id: 6, lote: "L-1006", insumo: "Farinha de trigo", marca: "Moinho Central", dataIso: montarDataIsoNoMesAtual(12), valorTotal: 690 },
    { id: 7, lote: "L-1007", insumo: "Tomate italiano", marca: "Horta Sul", dataIso: montarDataIsoNoMesAtual(8), valorTotal: 1120 },
    { id: 8, lote: "L-1008", insumo: "Arroz arbóreo", marca: "Grão Nobre", dataIso: montarDataIsoNoMesAtual(10), valorTotal: 840 },
    { id: 9, lote: "L-1009", insumo: "Azeite extra virgem", marca: "Sabor da Itália", dataIso: montarDataIsoNoMesAtual(7), valorTotal: 1580 },
    { id: 10, lote: "L-1010", insumo: "Queijo mussarela", marca: "Láctea Real", dataIso: montarDataIsoNoMesAtual(6), valorTotal: 1020 },
    { id: 11, lote: "L-1011", insumo: "Manjericão fresco", marca: "Verde Lar", dataIso: montarDataIsoNoMesAtual(16), valorTotal: 380 },
    { id: 12, lote: "L-1012", insumo: "Filé de salmão", marca: "Mar do Norte", dataIso: montarDataIsoNoMesAtual(5), valorTotal: 1490 },
    { id: 13, lote: "L-1013", insumo: "Farinha de trigo", marca: "Trigo Forte", dataIso: montarDataIsoNoMesAtual(4), valorTotal: 720 },
  ],
};

const itensBarraLateral = [
  { id: "inicio", rotulo: "Início", icone: Home },
  { id: "usuarios", rotulo: "Usuários", icone: Users },
  { id: "relatorios", rotulo: "Relatórios", icone: FileText },
  { id: "logs", rotulo: "Logs do sistema", icone: Activity },
];

const acoesBarraLateral = [
  { id: "cadastro-usuario", rotulo: "Cadastro de usuário", icone: UserPlus },
];

const opcoesInsumoBase = Array.from(
  new Set(dadosMockAdmin.lancamentosInsumos.map((lancamento) => lancamento.insumo))
).sort((a, b) => a.localeCompare(b, "pt-BR"));

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarHora(dataHoraIso) {
  return new Date(dataHoraIso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Admin() {
  const navegar = useNavigate();
  const [itemAtivo, setItemAtivo] = useState("inicio");
  const [menuLateralAberto, setMenuLateralAberto] = useState(false);
  const [usuariosSistema, setUsuariosSistema] = useState(dadosMockAdmin.usuariosSistema);
  const [insumosSelecionados, setInsumosSelecionados] = useState(opcoesInsumoBase);
  const [filtroInsumosAberto, setFiltroInsumosAberto] = useState(false);
  const [dataInicial, setDataInicial] = useState(obterPrimeiroDiaMesAtualIso());
  const [dataFinal, setDataFinal] = useState(obterUltimoDiaMesAtualIso());

  const usuariosRecentes = useMemo(
    () =>
      [...usuariosSistema]
        .sort((a, b) => b.dataCadastroIso.localeCompare(a.dataCadastroIso))
        .slice(0, 3)
        .map((usuario) => ({
          ...usuario,
          data: formatarDataBr(usuario.dataCadastroIso),
        })),
    [usuariosSistema]
  );

  const exibindoGestaoUsuarios = itemAtivo === "usuarios";
  const exibindoLogsSistema = itemAtivo === "logs";

  const logsRecentesPainel = useMemo(
    () =>
      [...dadosMockAdmin.logs]
        .sort((a, b) => new Date(b.dataHoraIso).getTime() - new Date(a.dataHoraIso).getTime())
        .slice(0, 3),
    []
  );

  const lancamentosFiltrados = useMemo(() => {
    return dadosMockAdmin.lancamentosInsumos
      .filter((lancamento) => {
        if (!insumosSelecionados.includes(lancamento.insumo)) {
          return false;
        }

        if (dataInicial && lancamento.dataIso < dataInicial) {
          return false;
        }

        if (dataFinal && lancamento.dataIso > dataFinal) {
          return false;
        }

        return true;
      })
      .map((lancamento) => ({
        ...lancamento,
        data: formatarDataBr(lancamento.dataIso),
      }))
      .sort((a, b) => b.dataIso.localeCompare(a.dataIso));
  }, [dataFinal, dataInicial, insumosSelecionados]);

  const totalGastosFiltrados = useMemo(
    () =>
      lancamentosFiltrados.reduce(
        (acumulado, lancamento) => acumulado + (Number(lancamento.valorTotal) || 0),
        0
      ),
    [lancamentosFiltrados]
  );

  const graficoInsumosPeriodo = useMemo(() => {
    const mapaInsumos = new Map();

    lancamentosFiltrados.forEach((lancamento) => {
      const valorAcumulado = mapaInsumos.get(lancamento.insumo) ?? 0;
      mapaInsumos.set(lancamento.insumo, valorAcumulado + lancamento.valorTotal);
    });

    const insumosOrdenados = Array.from(mapaInsumos.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    const categorias = insumosOrdenados.map(([insumo]) => insumo);
    const valores = insumosOrdenados.map(([, valor]) => valor);

    if (categorias.length === 0) {
      return {
        categorias: ["Sem dados"],
        serie: [{ name: "Gasto por insumo", data: [0], color: "#1ba968" }],
      };
    }

    return {
      categorias,
      serie: [{ name: "Gasto por insumo", data: valores, color: "#1ba968" }],
    };
  }, [lancamentosFiltrados]);

  const resumoFiltroInsumos = useMemo(() => {
    if (insumosSelecionados.length === 0) {
      return "Nenhum insumo selecionado";
    }

    if (insumosSelecionados.length === opcoesInsumoBase.length) {
      return "Todos os insumos";
    }

    if (insumosSelecionados.length === 1) {
      return insumosSelecionados[0];
    }

    return `${insumosSelecionados.length} insumos selecionados`;
  }, [insumosSelecionados]);

  function selecionarItemBarraLateral(id) {
    setItemAtivo(id);
    setMenuLateralAberto(false);
  }

  function selecionarAcaoBarraLateral(id) {
    setItemAtivo(id);
    setMenuLateralAberto(false);

    if (id === "cadastro-usuario") {
      navegar("/cadastro");
    }
  }

  function salvarAlteracoesUsuario(idUsuario, dadosAtualizados) {
    setUsuariosSistema((usuariosAtuais) =>
      usuariosAtuais.map((usuario) =>
        usuario.id === idUsuario ? { ...usuario, ...dadosAtualizados } : usuario
      )
    );
  }

  function alternarSelecaoInsumo(insumo) {
    setInsumosSelecionados((selecionadosAtuais) =>
      selecionadosAtuais.includes(insumo)
        ? selecionadosAtuais.filter((item) => item !== insumo)
        : [...selecionadosAtuais, insumo]
    );
  }

  function limparFiltros() {
    setInsumosSelecionados(opcoesInsumoBase);
    setDataInicial(obterPrimeiroDiaMesAtualIso());
    setDataFinal(obterUltimoDiaMesAtualIso());
    setFiltroInsumosAberto(false);
  }

  return (
    <div className="admin-page">
      <HeaderPadrao />
      <LayoutAdmin
        menuLateralAberto={menuLateralAberto}
        aoFecharMenuLateral={() => setMenuLateralAberto(false)}
        barraLateral={
          <BarraLateralAdmin
            itens={itensBarraLateral}
            acoes={acoesBarraLateral}
            itemAtivo={itemAtivo}
            aoSelecionar={selecionarItemBarraLateral}
            aoSelecionarAcao={selecionarAcaoBarraLateral}
          />
        }
        topo={
          <TopoAdmin
            aoAlternarSidebar={() =>
              setMenuLateralAberto((menuAbertoAnterior) => !menuAbertoAnterior)
            }
          />
        }
      >
        {exibindoGestaoUsuarios ? (
          <GerenciamentoUsuariosAdmin
            usuarios={usuariosSistema}
            aoSalvarUsuario={salvarAlteracoesUsuario}
          />
        ) : exibindoLogsSistema ? (
          <AdminLogsSistema logs={dadosMockAdmin.logs} />
        ) : (
          <>
            <section className="admin-stat-grid">
          <CardResumoAdmin
            titulo="Gestão de Usuários"
            metrica={`${usuariosSistema.length} usuários`}
            icone={Users}
            iconeCor="#1ba968"
            rotuloAcao="Gerenciar usuários"
            aoClicarAcao={() => setItemAtivo("usuarios")}
          >
            <p className="admin-card-subtitle">Últimos cadastros:</p>
            {usuariosRecentes.length > 0 ? (
              <ul className="admin-simple-list">
                {usuariosRecentes.map((usuario) => (
                  <li key={usuario.id} className="admin-kpi-user-item">
                    <span>{usuario.nome}</span>
                    <span
                      className={`admin-kpi-status ${
                        usuario.ehAdmin ? "is-admin" : "is-comum"
                      }`}
                    >
                      {usuario.ehAdmin ? "Admin" : "Comum"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-empty-list">Nenhum cadastro encontrado.</p>
            )}
          </CardResumoAdmin>

          <CardResumoAdmin
            titulo="Relatórios"
            metrica={`${dadosMockAdmin.kpis.relatorios} disponíveis`}
            icone={FileText}
            iconeCor="#2f80ed"
            rotuloAcao="Ver relatórios"
          >
            {dadosMockAdmin.tiposRelatorio.length > 0 ? (
              <ul className="admin-bullet-list">
                {dadosMockAdmin.tiposRelatorio.map((relatorio) => (
                  <li key={relatorio.id}>
                    <span style={{ backgroundColor: relatorio.cor }} />
                    {relatorio.nome}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-empty-list">Nenhum relatório encontrado.</p>
            )}
          </CardResumoAdmin>

          <CardResumoAdmin
            titulo="Logs do Sistema"
            metrica={`${dadosMockAdmin.kpis.logsHoje.toLocaleString("pt-BR")} hoje`}
            icone={Activity}
            iconeCor="#7d4ce0"
            rotuloAcao="Ver todos os logs"
            aoClicarAcao={() => setItemAtivo("logs")}
          >
            {logsRecentesPainel.length > 0 ? (
              <ul className="admin-simple-list admin-log-list">
                {logsRecentesPainel.map((log) => (
                  <li key={log.id}>
                    <strong>{formatarHora(log.dataHoraIso)}</strong> - {log.acao}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-empty-list">Nenhum log encontrado.</p>
            )}
          </CardResumoAdmin>

          <CardResumoAdmin
            titulo="Controle de Gastos"
            metrica={formatarMoeda(totalGastosFiltrados)}
            icone={Wallet}
            iconeCor="#f2994a"
            variacao={dadosMockAdmin.kpis.variacaoGastos}
          />
        </section>

        <section className="admin-filtros" aria-label="Filtros dos lançamentos">
          <div className="admin-filtro-campo admin-filtro-campo-insumos">
            <label>Insumos</label>
            <div className="admin-filtro-dropdown">
              <button
                type="button"
                className={`admin-filtro-dropdown-botao ${filtroInsumosAberto ? "aberto" : ""}`}
                onClick={() => setFiltroInsumosAberto((abertoAtual) => !abertoAtual)}
              >
                <span>{resumoFiltroInsumos}</span>
                <span className="admin-filtro-dropdown-seta" />
              </button>

              {filtroInsumosAberto && (
                <div className="admin-filtro-dropdown-menu">
                  <div className="admin-filtro-checklist">
                    {opcoesInsumoBase.map((insumo) => (
                      <label key={insumo} className="admin-filtro-check-item">
                        <input
                          type="checkbox"
                          checked={insumosSelecionados.includes(insumo)}
                          onChange={() => alternarSelecaoInsumo(insumo)}
                        />
                        <span>{insumo}</span>
                      </label>
                    ))}
                  </div>
                  <div className="admin-filtro-checklist-acoes">
                    <button
                      type="button"
                      className="admin-filtro-check-btn"
                      onClick={() => setInsumosSelecionados(opcoesInsumoBase)}
                    >
                      Marcar todos
                    </button>
                    <button
                      type="button"
                      className="admin-filtro-check-btn"
                      onClick={() => setInsumosSelecionados([])}
                    >
                      Limpar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="admin-filtro-campo">
            <label htmlFor="filtro-data-inicial">Data inicial</label>
            <input
              id="filtro-data-inicial"
              type="date"
              className="admin-filtro-input"
              value={dataInicial}
              onChange={(evento) => setDataInicial(evento.target.value)}
            />
          </div>

          <div className="admin-filtro-campo">
            <label htmlFor="filtro-data-final">Data final</label>
            <input
              id="filtro-data-final"
              type="date"
              className="admin-filtro-input"
              value={dataFinal}
              onChange={(evento) => setDataFinal(evento.target.value)}
            />
          </div>

          <div className="admin-filtro-campo admin-filtro-campo-acoes">
            <span className="admin-filtro-label-fantasma" aria-hidden="true">
              Ações
            </span>
            <button type="button" className="admin-filtro-limpar" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>
        </section>

        <section className="admin-bottom-grid">
          <CardGraficoAdmin
            titulo="Gastos totais por insumo"
            subtitulo={`Período: ${formatarDataFiltro(dataInicial)} até ${formatarDataFiltro(
              dataFinal
            )}`}
            categorias={graficoInsumosPeriodo.categorias}
            serie={graficoInsumosPeriodo.serie}
          />

          <ListaLancamentosAdmin
            titulo="Lançamentos por lote no período"
            lancamentos={lancamentosFiltrados}
          />
        </section>
          </>
        )}
      </LayoutAdmin>
    </div>
  );
}




