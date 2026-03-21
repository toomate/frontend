import { useEffect, useMemo, useState } from "react";
import { Activity, FileText, Home, List, UserPlus, Users, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutAdmin from "./components/admin/AdminLayout";
import BarraLateralAdmin from "./components/admin/AdminSidebar";
import TopoAdmin from "./components/admin/AdminTopbar";
import CardResumoAdmin from "./components/admin/AdminStatCard";
import CardGraficoAdmin from "./components/admin/AdminChartCard";
import ComparativoPrecoUnitarioAdmin from "./components/admin/AdminComparativoPrecoUnitario";
import GerenciamentoUsuariosAdmin from "./components/admin/AdminUsersManagement";
import AdminLogsSistema from "./components/admin/AdminLogsSistema";
import AdminRelatorios from "./components/admin/AdminRelatorios";
import AdminLancamentos from "./components/admin/AdminLancamentos";
import HeaderPadrao from "./HeaderPadrao";
import { AdminApi, AuthApi, FornecedorApi, Lote } from "./provider/Api";
import "./components/admin/Admin.css";

const hoje = new Date();
const anoAtualNumero = hoje.getFullYear();
const mesAtualNumero = hoje.getMonth() + 1;

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
  tiposRelatorio: [
    { id: 1, nome: "Custo total de compras", cor: "#2f80ed" },
    { id: 2, nome: "Itens perdidos por validade", cor: "#c92c2c" },
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
};

const itensBarraLateral = [
  { id: "inicio", rotulo: "Início", icone: Home },
  { id: "lancamentos", rotulo: "Lançamentos", icone: List },
  { id: "usuarios", rotulo: "Usuários", icone: Users },
  { id: "relatorios", rotulo: "Relatórios", icone: FileText },
  { id: "logs", rotulo: "Logs do sistema", icone: Activity },
];

const acoesBarraLateral = [
  { id: "cadastro-usuario", rotulo: "Cadastro de usuário", icone: UserPlus },
];

const abasAdminDisponiveis = new Set([
  "inicio",
  "lancamentos",
  "usuarios",
  "relatorios",
  "logs",
]);

function listasIguais(listaA, listaB) {
  if (listaA.length !== listaB.length) {
    return false;
  }

  return listaA.every((item, indice) => item === listaB[indice]);
}

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

function normalizarIntervaloDatas(dataInicialIso, dataFinalIso) {
  const inicioPadrao = obterPrimeiroDiaMesAtualIso();
  const fimPadrao = obterUltimoDiaMesAtualIso();

  const inicioValido = /^\d{4}-\d{2}-\d{2}$/.test(String(dataInicialIso))
    ? dataInicialIso
    : inicioPadrao;
  const fimValido = /^\d{4}-\d{2}-\d{2}$/.test(String(dataFinalIso))
    ? dataFinalIso
    : fimPadrao;

  if (inicioValido <= fimValido) {
    return { inicioIntervaloIso: inicioValido, fimIntervaloIso: fimValido };
  }

  return { inicioIntervaloIso: fimValido, fimIntervaloIso: inicioValido };
}

function calcularIntervaloAnterior(inicioIso, fimIso) {
  const inicio = new Date(`${inicioIso}T12:00:00`);
  const fim = new Date(`${fimIso}T12:00:00`);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    const inicioPadrao = obterPrimeiroDiaMesAtualIso();
    const fimPadrao = obterUltimoDiaMesAtualIso();
    return {
      inicioAnteriorIso: inicioPadrao,
      fimAnteriorIso: fimPadrao,
    };
  }

  const umDiaMs = 24 * 60 * 60 * 1000;
  const tamanhoIntervaloDias = Math.max(
    1,
    Math.floor((fim.getTime() - inicio.getTime()) / umDiaMs) + 1
  );

  const fimAnterior = new Date(inicio);
  fimAnterior.setDate(fimAnterior.getDate() - 1);

  const inicioAnterior = new Date(inicio);
  inicioAnterior.setDate(inicioAnterior.getDate() - tamanhoIntervaloDias);

  return {
    inicioAnteriorIso: inicioAnterior.toISOString().slice(0, 10),
    fimAnteriorIso: fimAnterior.toISOString().slice(0, 10),
  };
}

function extrairLista(resposta, chavesFallback = []) {
  if (Array.isArray(resposta)) {
    return resposta;
  }

  for (const chave of chavesFallback) {
    if (Array.isArray(resposta?.[chave])) {
      return resposta[chave];
    }
  }

  return [];
}

function converterDataParaIso(dataEntrada, dataPadrao) {
  const dataIso = extrairDataIsoFlexivel(dataEntrada);
  return dataIso || dataPadrao;
}

function converterDataParaIsoOpcional(dataEntrada) {
  return extrairDataIsoFlexivel(dataEntrada);
}

function extrairDataIsoFlexivel(dataEntrada) {
  if (!dataEntrada) {
    return "";
  }

  const valorData = String(dataEntrada).trim();
  if (!valorData) {
    return "";
  }

  const valorSemHora = valorData.split("T")[0].split(" ")[0];

  if (/^\d{4}-\d{2}-\d{2}$/.test(valorSemHora)) {
    return valorSemHora;
  }

  if (/^\d{4}\/\d{2}\/\d{2}$/.test(valorSemHora)) {
    return valorSemHora.replace(/\//g, "-");
  }

  const dataBrOuHifen = valorSemHora.match(/^(\d{2})[/.-](\d{2})[/.-](\d{4})$/);
  if (dataBrOuHifen) {
    const [, dia, mes, ano] = dataBrOuHifen;
    return `${ano}-${mes}-${dia}`;
  }

  const data = new Date(valorData);
  if (Number.isNaN(data.getTime())) {
    return "";
  }

  return data.toISOString().slice(0, 10);
}

function converterDataHoraParaIso(dataEntrada, dataPadrao = new Date().toISOString()) {
  const data = new Date(dataEntrada || dataPadrao);

  if (Number.isNaN(data.getTime())) {
    return dataPadrao;
  }

  return data.toISOString();
}

function resolverDataLote(lote, dataPadrao) {
  return converterDataParaIso(
    lote?.dataCadastro ??
      lote?.dataEntrada ??
      lote?.dataCompra ??
      lote?.dataLancamento ??
      lote?.dataMovimentacao ??
      lote?.dataRegistro ??
      lote?.dataCriacao ??
      lote?.dtCompra ??
      lote?.dtEntrada ??
      lote?.dtLancamento ??
      lote?.dtCriacao ??
      lote?.createdAt ??
      lote?.created_at ??
      lote?.data,
    dataPadrao
  );
}

function resolverDataValidadeLote(lote) {
  return converterDataParaIsoOpcional(
    lote?.dataValidade ??
      lote?.dataVencimento ??
      lote?.dataVenc ??
      lote?.validade ??
      lote?.dtValidade ??
      lote?.dtVenc ??
      lote?.dataVencimento ??
      lote?.dtVencimento ??
      lote?.vencimento ??
      lote?.venc
  );
}

function normalizarTexto(valor, fallback = "") {
  const texto = String(valor ?? "").trim();
  return texto || fallback;
}

function normalizarNumero(valor, fallback = 0) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : fallback;
}

function normalizarBooleano(valor) {
  return valor === true || valor === "true" || valor === 1 || valor === "1";
}

function normalizarTextoBusca(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function Admin() {
  const navegar = useNavigate();
  const localizacao = useLocation();
  const [itemAtivo, setItemAtivo] = useState("inicio");
  const [menuLateralAberto, setMenuLateralAberto] = useState(false);
  const [usuariosSistema, setUsuariosSistema] = useState([]);
  const [logsSistema, setLogsSistema] = useState(dadosMockAdmin.logs);
  const [lancamentosInsumos, setLancamentosInsumos] = useState([]);
  const [carregandoIntegracao, setCarregandoIntegracao] = useState(false);
  const [erroIntegracao, setErroIntegracao] = useState("");
  const [insumosSelecionados, setInsumosSelecionados] = useState([]);
  const [marcasSelecionadas, setMarcasSelecionadas] = useState([]);
  const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState([]);
  const [filtroInsumosAberto, setFiltroInsumosAberto] = useState(false);
  const [filtroMarcasAberto, setFiltroMarcasAberto] = useState(false);
  const [filtroFornecedoresAberto, setFiltroFornecedoresAberto] = useState(false);
  const [buscaInsumos, setBuscaInsumos] = useState("");
  const [buscaMarcas, setBuscaMarcas] = useState("");
  const [buscaFornecedores, setBuscaFornecedores] = useState("");
  const [dataInicial, setDataInicial] = useState(obterPrimeiroDiaMesAtualIso());
  const [dataFinal, setDataFinal] = useState(obterUltimoDiaMesAtualIso());

  useEffect(() => {
    const abaQuery = new URLSearchParams(localizacao.search).get("aba");

    if (!abaQuery) {
      setItemAtivo("inicio");
      return;
    }

    if (abasAdminDisponiveis.has(abaQuery)) {
      setItemAtivo(abaQuery);
    }
  }, [localizacao.search]);

  const opcoesInsumoBase = useMemo(
    () =>
      Array.from(new Set(lancamentosInsumos.map((lancamento) => lancamento.insumo))).sort(
        (a, b) => a.localeCompare(b, "pt-BR")
      ),
    [lancamentosInsumos]
  );

  const opcoesMarcaBase = useMemo(
    () =>
      Array.from(new Set(lancamentosInsumos.map((lancamento) => lancamento.marca))).sort(
        (a, b) => a.localeCompare(b, "pt-BR")
      ),
    [lancamentosInsumos]
  );

  const opcoesFornecedorBase = useMemo(
    () =>
      Array.from(
        new Set(lancamentosInsumos.map((lancamento) => lancamento.fornecedor))
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [lancamentosInsumos]
  );

  const opcoesInsumoFiltradas = useMemo(() => {
    const termoBusca = normalizarTextoBusca(buscaInsumos);

    if (!termoBusca) {
      return opcoesInsumoBase;
    }

    return opcoesInsumoBase.filter((insumo) =>
      normalizarTextoBusca(insumo).includes(termoBusca)
    );
  }, [buscaInsumos, opcoesInsumoBase]);

  useEffect(() => {
    setInsumosSelecionados((insumosAtuais) => {
      if (opcoesInsumoBase.length === 0) {
        return [];
      }

      const insumosValidos = insumosAtuais.filter((insumo) =>
        opcoesInsumoBase.includes(insumo)
      );

      if (insumosValidos.length === 0) {
        return opcoesInsumoBase;
      }

      if (listasIguais(insumosValidos, insumosAtuais)) {
        return insumosAtuais;
      }

      return insumosValidos;
    });
  }, [opcoesInsumoBase]);

  useEffect(() => {
    let ativo = true;

    async function carregarDadosAdmin() {
      setCarregandoIntegracao(true);
      setErroIntegracao("");

      const [usuariosResposta, lotesResposta, fornecedoresResposta, logsResposta] =
        await Promise.allSettled([
          AuthApi.listarUsuarios(),
          Lote.listarLotes(),
          FornecedorApi.listar(),
          AdminApi.listarLogs(),
        ]);

      if (!ativo) return;

      const erros = [];

      if (usuariosResposta.status === "fulfilled") {
        const listaUsuarios = extrairLista(usuariosResposta.value, ["usuarios", "data"]);
        const dataPadraoUsuario = obterPrimeiroDiaMesAtualIso();
        const usuariosNormalizados = listaUsuarios.map((usuario, indice) => ({
          id: normalizarNumero(usuario?.idUsuario ?? usuario?.id, indice + 1),
          nome: normalizarTexto(
            usuario?.nome ?? usuario?.nomeCompleto,
            `Usuário ${indice + 1}`
          ),
          username: normalizarTexto(
            usuario?.apelido ?? usuario?.username ?? usuario?.login,
            `usuario.${indice + 1}`
          ),
          ehAdmin: normalizarBooleano(
            usuario?.administrador ?? usuario?.ehAdmin ?? usuario?.admin
          ),
          dataCadastroIso: converterDataParaIso(
            usuario?.dataCadastro ?? usuario?.createdAt ?? usuario?.dataCriacao,
            dataPadraoUsuario
          ),
        }));

        setUsuariosSistema(usuariosNormalizados);
      } else {
        erros.push("usuários");
      }

      const listaFornecedores =
        fornecedoresResposta.status === "fulfilled"
          ? extrairLista(fornecedoresResposta.value, ["fornecedores", "data"])
          : [];

      const mapaFornecedores = new Map(
        listaFornecedores.map((fornecedor, indice) => [
          String(
            fornecedor?.idFornecedor ??
              fornecedor?.id ??
              fornecedor?.fkFornecedor ??
              `f-${indice + 1}`
          ),
          normalizarTexto(
            fornecedor?.razaoSocial ?? fornecedor?.nome,
            `Fornecedor ${indice + 1}`
          ),
        ])
      );

      if (lotesResposta.status === "fulfilled") {
        const listaLotes = extrairLista(lotesResposta.value, ["lotes", "data"]);
        const dataPadraoLote = obterPrimeiroDiaMesAtualIso();

        const lancamentosNormalizados = listaLotes
          .map((lote, indice) => {
            const idLote = normalizarNumero(
              lote?.idLote ?? lote?.id ?? lote?.idLoteEstoque,
              indice + 1
            );
            const insumo = normalizarTexto(
              lote?.marca?.insumo?.nome ??
                lote?.insumo?.nome ??
                lote?.nomeInsumo ??
                lote?.insumoNome
            );
            const marca = normalizarTexto(
              lote?.marca?.nome ?? lote?.nomeMarca ?? lote?.marcaNome,
              "Sem marca"
            );
            const idFornecedor = String(
              lote?.idFornecedor ??
                lote?.fkFornecedor ??
                lote?.fornecedor?.idFornecedor ??
                lote?.fornecedor?.id ??
                lote?.marca?.idFornecedor ??
                lote?.marca?.fkFornecedor ??
                lote?.marca?.fornecedor?.idFornecedor ??
                lote?.marca?.fornecedor?.id ??
                ""
            );

            const fornecedor = normalizarTexto(
              lote?.fornecedor?.razaoSocial ??
                lote?.fornecedor?.nome ??
                lote?.marca?.fornecedor?.razaoSocial ??
                lote?.fornecedorNome ??
                mapaFornecedores.get(idFornecedor),
              "Fornecedor não informado"
            );

            const precoUnitario = normalizarNumero(
              lote?.precoUnitario ??
                lote?.valorUnitario ??
                lote?.preco ??
                lote?.custoUnitario ??
                lote?.marca?.precoUnitario,
              0
            );

            const quantidade = normalizarNumero(
              lote?.quantidade ??
                lote?.quantidadeInicial ??
                lote?.quantidadeMedida ??
                lote?.qtd ??
                lote?.estoque ??
                lote?.unidades,
              1
            );

            const quantidadeEstoque = normalizarNumero(
              lote?.quantidadeMedida ??
                lote?.quantidadeAtual ??
                lote?.quantidadeEmEstoque ??
                lote?.quantidadeDisponivel ??
                lote?.quantidadeEstoque ??
                lote?.estoqueAtual ??
                lote?.estoque ??
                lote?.saldo ??
                lote?.qtdEstoque ??
                lote?.quantidade ??
                lote?.unidades,
              0
            );

            const valorTotal = normalizarNumero(
              lote?.valorTotal ?? lote?.custoTotal ?? lote?.valor,
              precoUnitario * quantidade
            );

            if (!insumo) {
              return null;
            }

            return {
              id: idLote,
              lote: normalizarTexto(
                lote?.codigoLote ?? lote?.lote ?? lote?.identificador,
                `L-${idLote}`
              ),
              insumo,
              marca,
              fornecedor,
              dataIso: resolverDataLote(lote, dataPadraoLote),
              dataValidadeIso: resolverDataValidadeLote(lote),
              quantidadeEstoque,
              valorTotal,
              precoUnitario,
            };
          })
          .filter(Boolean);

        setLancamentosInsumos(lancamentosNormalizados);
      } else {
        erros.push("lotes");
      }

      if (logsResposta.status === "fulfilled") {
        const listaLogs = extrairLista(logsResposta.value, ["logs", "data"]);
        const dataPadraoLog = new Date().toISOString();
        const logsNormalizados = listaLogs
          .map((log, indice) => ({
            id: normalizarNumero(log?.idLog ?? log?.id, indice + 1),
            dataHoraIso: converterDataHoraParaIso(
              log?.dataHoraIso ?? log?.dataHora ?? log?.createdAt,
              dataPadraoLog
            ),
            mensagem: normalizarTexto(
              log?.mensagem ?? log?.acao ?? log?.descricao,
              "Log sem mensagem"
            ),
            acao: normalizarTexto(log?.acao),
          }))
          .filter((log) => !Number.isNaN(new Date(log.dataHoraIso).getTime()));

        setLogsSistema(logsNormalizados);
      } else {
        erros.push("logs");
      }

      if (erros.length > 0) {
        setErroIntegracao(
          `Falha ao integrar ${erros.join(", ")}. Exibindo dados de apoio onde necessário.`
        );
      }

      setCarregandoIntegracao(false);
    }

    carregarDadosAdmin();

    return () => {
      ativo = false;
    };
  }, []);

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
  const exibindoLancamentos = itemAtivo === "lancamentos";
  const exibindoRelatorios = itemAtivo === "relatorios";
  const exibindoLogsSistema = itemAtivo === "logs";

  const logsRecentesPainel = useMemo(
    () =>
      [...logsSistema]
        .sort((a, b) => new Date(b.dataHoraIso).getTime() - new Date(a.dataHoraIso).getTime())
        .slice(0, 3),
    [logsSistema]
  );

  const totalLogsHoje = useMemo(() => {
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    return logsSistema.filter(
      (log) => new Date(log.dataHoraIso).toLocaleDateString("pt-BR") === dataAtual
    ).length;
  }, [logsSistema]);

  const lancamentosPeriodoInsumos = useMemo(() => {
    return lancamentosInsumos
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
      });
  }, [dataFinal, dataInicial, insumosSelecionados, lancamentosInsumos]);

  const opcoesMarcaDisponiveis = useMemo(
    () =>
      Array.from(
        new Set(lancamentosPeriodoInsumos.map((lancamento) => lancamento.marca))
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [lancamentosPeriodoInsumos]
  );

  const opcoesMarcaFiltradas = useMemo(() => {
    const termoBusca = normalizarTextoBusca(buscaMarcas);

    if (!termoBusca) {
      return opcoesMarcaDisponiveis;
    }

    return opcoesMarcaDisponiveis.filter((marca) =>
      normalizarTextoBusca(marca).includes(termoBusca)
    );
  }, [buscaMarcas, opcoesMarcaDisponiveis]);

  useEffect(() => {
    setMarcasSelecionadas((marcasAtuais) => {
      if (opcoesMarcaDisponiveis.length === 0) {
        return marcasAtuais.length === 0 ? marcasAtuais : [];
      }

      const marcasValidas = marcasAtuais.filter((marca) =>
        opcoesMarcaDisponiveis.includes(marca)
      );

      if (marcasValidas.length === 0) {
        return opcoesMarcaDisponiveis;
      }

      if (listasIguais(marcasValidas, marcasAtuais)) {
        return marcasAtuais;
      }

      return marcasValidas;
    });
  }, [opcoesMarcaDisponiveis]);

  const lancamentosPeriodoInsumosMarcas = useMemo(
    () =>
      lancamentosPeriodoInsumos.filter((lancamento) =>
        marcasSelecionadas.includes(lancamento.marca)
      ),
    [lancamentosPeriodoInsumos, marcasSelecionadas]
  );

  const opcoesFornecedorDisponiveis = useMemo(
    () =>
      Array.from(
        new Set(
          lancamentosPeriodoInsumosMarcas.map((lancamento) => lancamento.fornecedor)
        )
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [lancamentosPeriodoInsumosMarcas]
  );

  const opcoesFornecedorFiltradas = useMemo(() => {
    const termoBusca = normalizarTextoBusca(buscaFornecedores);

    if (!termoBusca) {
      return opcoesFornecedorDisponiveis;
    }

    return opcoesFornecedorDisponiveis.filter((fornecedor) =>
      normalizarTextoBusca(fornecedor).includes(termoBusca)
    );
  }, [buscaFornecedores, opcoesFornecedorDisponiveis]);

  useEffect(() => {
    setFornecedoresSelecionados((fornecedoresAtuais) => {
      if (opcoesFornecedorDisponiveis.length === 0) {
        return fornecedoresAtuais.length === 0 ? fornecedoresAtuais : [];
      }

      const fornecedoresValidos = fornecedoresAtuais.filter((fornecedor) =>
        opcoesFornecedorDisponiveis.includes(fornecedor)
      );

      if (fornecedoresValidos.length === 0) {
        return opcoesFornecedorDisponiveis;
      }

      if (listasIguais(fornecedoresValidos, fornecedoresAtuais)) {
        return fornecedoresAtuais;
      }

      return fornecedoresValidos;
    });
  }, [opcoesFornecedorDisponiveis]);

  const lancamentosFiltrados = useMemo(
    () =>
      lancamentosPeriodoInsumosMarcas
        .filter((lancamento) =>
          fornecedoresSelecionados.includes(lancamento.fornecedor)
        )
        .map((lancamento) => ({
          ...lancamento,
          data: formatarDataBr(lancamento.dataIso),
        }))
        .sort((a, b) => b.dataIso.localeCompare(a.dataIso)),
    [lancamentosPeriodoInsumosMarcas, fornecedoresSelecionados]
  );

  const intervaloComparativo = useMemo(() => {
    const { inicioIntervaloIso, fimIntervaloIso } = normalizarIntervaloDatas(
      dataInicial,
      dataFinal
    );
    const { inicioAnteriorIso, fimAnteriorIso } = calcularIntervaloAnterior(
      inicioIntervaloIso,
      fimIntervaloIso
    );

    return {
      inicioIntervaloIso,
      fimIntervaloIso,
      inicioAnteriorIso,
      fimAnteriorIso,
    };
  }, [dataFinal, dataInicial]);

  const { totalMesReferencia, variacaoMensalGastos } = useMemo(() => {
    let totalAtual = 0;
    let totalAnterior = 0;

    lancamentosInsumos.forEach((lancamento) => {
      const dataLancamentoIso = String(lancamento.dataIso || "");
      const valorLancamento = Number(lancamento.valorTotal) || 0;

      if (
        dataLancamentoIso >= intervaloComparativo.inicioIntervaloIso &&
        dataLancamentoIso <= intervaloComparativo.fimIntervaloIso
      ) {
        totalAtual += valorLancamento;
      } else if (
        dataLancamentoIso >= intervaloComparativo.inicioAnteriorIso &&
        dataLancamentoIso <= intervaloComparativo.fimAnteriorIso
      ) {
        totalAnterior += valorLancamento;
      }
    });

    if (totalAnterior <= 0) {
      return {
        totalMesReferencia: totalAtual,
        variacaoMensalGastos: null,
      };
    }

    const variacao = ((totalAnterior - totalAtual) / totalAnterior) * 100;

    return {
      totalMesReferencia: totalAtual,
      variacaoMensalGastos: Number.isFinite(variacao) ? variacao : null,
    };
  }, [intervaloComparativo, lancamentosInsumos]);

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
  }, [insumosSelecionados, opcoesInsumoBase.length]);

  const resumoFiltroMarcas = useMemo(() => {
    if (opcoesMarcaDisponiveis.length === 0) {
      return "Sem marcas disponíveis";
    }

    if (marcasSelecionadas.length === 0) {
      return "Nenhuma marca selecionada";
    }

    if (marcasSelecionadas.length === opcoesMarcaDisponiveis.length) {
      return "Todas as marcas";
    }

    if (marcasSelecionadas.length === 1) {
      return marcasSelecionadas[0];
    }

    return `${marcasSelecionadas.length} marcas selecionadas`;
  }, [marcasSelecionadas, opcoesMarcaDisponiveis]);

  const resumoFiltroFornecedores = useMemo(() => {
    if (opcoesFornecedorDisponiveis.length === 0) {
      return "Sem fornecedores disponíveis";
    }

    if (fornecedoresSelecionados.length === 0) {
      return "Nenhum fornecedor selecionado";
    }

    if (fornecedoresSelecionados.length === opcoesFornecedorDisponiveis.length) {
      return "Todos os fornecedores";
    }

    if (fornecedoresSelecionados.length === 1) {
      return fornecedoresSelecionados[0];
    }

    return `${fornecedoresSelecionados.length} fornecedores selecionados`;
  }, [fornecedoresSelecionados, opcoesFornecedorDisponiveis]);

  const comparativoPrecoUnitarioPorInsumo = useMemo(() => {
    return [...insumosSelecionados]
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .map((insumo) => {
        const lancamentosDoInsumo = lancamentosFiltrados.filter(
          (lancamento) => lancamento.insumo === insumo
        );
        const ultimosLotesPorMarcaFornecedor = new Map();

        lancamentosDoInsumo.forEach((lancamento) => {
          const chaveMarcaFornecedor = `${lancamento.marca}||${lancamento.fornecedor}`;
          const loteAtual = ultimosLotesPorMarcaFornecedor.get(chaveMarcaFornecedor);

          if (!loteAtual || lancamento.dataIso > loteAtual.dataIso) {
            ultimosLotesPorMarcaFornecedor.set(chaveMarcaFornecedor, lancamento);
          }
        });

        const ultimosLotes = Array.from(ultimosLotesPorMarcaFornecedor.values());

        const fornecedoresPorMarca = new Map();
        const menorPrecoPorMarca = new Map();

        ultimosLotes.forEach((lancamento) => {
          const fornecedores = fornecedoresPorMarca.get(lancamento.marca) ?? new Set();
          fornecedores.add(lancamento.fornecedor);
          fornecedoresPorMarca.set(lancamento.marca, fornecedores);

          const precoAtual = Number(lancamento.precoUnitario || 0);
          const menorAtual = menorPrecoPorMarca.get(lancamento.marca);

          if (menorAtual === undefined || precoAtual < menorAtual) {
            menorPrecoPorMarca.set(lancamento.marca, precoAtual);
          }
        });

        const ranking = ultimosLotes
          .sort(
            (a, b) =>
              Number(a.precoUnitario || 0) - Number(b.precoUnitario || 0) ||
              a.marca.localeCompare(b.marca, "pt-BR") ||
              a.fornecedor.localeCompare(b.fornecedor, "pt-BR")
          )
          .map((lancamento, indice) => ({
            marca: lancamento.marca,
            fornecedor: lancamento.fornecedor,
            precoUnitario: lancamento.precoUnitario,
            data: formatarDataBr(lancamento.dataIso),
            melhorPreco: indice === 0,
            maisBaratoDaMarca:
              (fornecedoresPorMarca.get(lancamento.marca)?.size ?? 0) > 1 &&
              Math.abs(
                Number(lancamento.precoUnitario || 0) -
                  Number(menorPrecoPorMarca.get(lancamento.marca) || 0)
              ) < 0.00001,
          }));

        return { insumo, ranking };
      });
  }, [insumosSelecionados, lancamentosFiltrados]);

  function selecionarItemBarraLateral(id) {
    setItemAtivo(id);
    setMenuLateralAberto(false);

    if (!abasAdminDisponiveis.has(id)) {
      return;
    }

    if (id === "inicio") {
      navegar("/admin", { replace: true });
      return;
    }

    navegar(`/admin?aba=${id}`, { replace: true });
  }

  function selecionarAcaoBarraLateral(id) {
    setItemAtivo(id);
    setMenuLateralAberto(false);

    if (id === "cadastro-usuario") {
      navegar("/cadastro");
    }
  }

  async function salvarAlteracoesUsuario(idUsuario, dadosAtualizados) {
    const usuariosAntes = usuariosSistema;
    const usuarioAtual = usuariosSistema.find((usuario) => usuario.id === idUsuario);

    if (!usuarioAtual) {
      throw new Error("Usuário não encontrado para atualização.");
    }

    const usuarioDepoisDaEdicao = {
      ...usuarioAtual,
      ...(dadosAtualizados.nome !== undefined ? { nome: dadosAtualizados.nome } : {}),
      ...(dadosAtualizados.username !== undefined
        ? { username: dadosAtualizados.username }
        : {}),
      ...(dadosAtualizados.ehAdmin !== undefined
        ? { ehAdmin: Boolean(dadosAtualizados.ehAdmin) }
        : {}),
    };

    const usuariosDepois = usuariosSistema.map((usuario) =>
      usuario.id === idUsuario ? usuarioDepoisDaEdicao : usuario
    );

    const alterouNomeOuApelido =
      dadosAtualizados.nome !== undefined || dadosAtualizados.username !== undefined;
    const alterouSenha = Boolean(dadosAtualizados.senha);
    const atualizarCompleto = alterouNomeOuApelido || alterouSenha;

    const payloadApi = atualizarCompleto
      ? {
          nome: usuarioDepoisDaEdicao.nome,
          username: usuarioDepoisDaEdicao.username,
          ehAdmin: usuarioDepoisDaEdicao.ehAdmin,
          ...(alterouSenha ? { senha: dadosAtualizados.senha } : {}),
        }
      : {
          ehAdmin:
            dadosAtualizados.ehAdmin !== undefined
              ? Boolean(dadosAtualizados.ehAdmin)
              : usuarioAtual.ehAdmin,
        };

    setUsuariosSistema(usuariosDepois);

    try {
      await AuthApi.atualizarUsuario(idUsuario, payloadApi);
      setErroIntegracao("");
    } catch (erro) {
      setUsuariosSistema(usuariosAntes);
      const mensagemBackend =
        erro?.response?.data?.mensagem ||
        erro?.response?.data?.message ||
        erro?.message ||
        "Não foi possível salvar as alterações do usuário no backend.";
      setErroIntegracao(mensagemBackend);
      throw erro;
    }
  }

  function alternarSelecaoInsumo(insumo) {
    setInsumosSelecionados((selecionadosAtuais) =>
      selecionadosAtuais.includes(insumo)
        ? selecionadosAtuais.filter((item) => item !== insumo)
        : [...selecionadosAtuais, insumo]
    );
  }

  function alternarSelecaoMarca(marca) {
    setMarcasSelecionadas((selecionadasAtuais) =>
      selecionadasAtuais.includes(marca)
        ? selecionadasAtuais.filter((item) => item !== marca)
        : [...selecionadasAtuais, marca]
    );
  }

  function alternarSelecaoFornecedor(fornecedor) {
    setFornecedoresSelecionados((selecionadosAtuais) =>
      selecionadosAtuais.includes(fornecedor)
        ? selecionadosAtuais.filter((item) => item !== fornecedor)
        : [...selecionadosAtuais, fornecedor]
    );
  }

  function marcarTodosInsumos() {
    if (opcoesInsumoBase.length === 0) return;

    if (normalizarTextoBusca(buscaInsumos)) {
      setInsumosSelecionados((selecionadosAtuais) =>
        Array.from(new Set([...selecionadosAtuais, ...opcoesInsumoFiltradas]))
      );
      return;
    }

    setInsumosSelecionados(opcoesInsumoBase);
  }

  function marcarTodasMarcas() {
    if (opcoesMarcaDisponiveis.length === 0) return;

    if (normalizarTextoBusca(buscaMarcas)) {
      setMarcasSelecionadas((selecionadasAtuais) =>
        Array.from(new Set([...selecionadasAtuais, ...opcoesMarcaFiltradas]))
      );
      return;
    }

    setMarcasSelecionadas(opcoesMarcaDisponiveis);
  }

  function marcarTodosFornecedores() {
    if (opcoesFornecedorDisponiveis.length === 0) return;

    if (normalizarTextoBusca(buscaFornecedores)) {
      setFornecedoresSelecionados((selecionadosAtuais) =>
        Array.from(new Set([...selecionadosAtuais, ...opcoesFornecedorFiltradas]))
      );
      return;
    }

    setFornecedoresSelecionados(opcoesFornecedorDisponiveis);
  }

  function limparFiltros() {
    setInsumosSelecionados(opcoesInsumoBase);
    setMarcasSelecionadas(opcoesMarcaBase);
    setFornecedoresSelecionados(opcoesFornecedorBase);
    setDataInicial(obterPrimeiroDiaMesAtualIso());
    setDataFinal(obterUltimoDiaMesAtualIso());
    setFiltroInsumosAberto(false);
    setFiltroMarcasAberto(false);
    setFiltroFornecedoresAberto(false);
    setBuscaInsumos("");
    setBuscaMarcas("");
    setBuscaFornecedores("");
  }

  const filtrosLancamentos = (
    <section className="admin-filtros" aria-label="Filtros dos lançamentos">
      <div className="admin-filtro-campo admin-filtro-campo-insumos">
        <label>Insumos</label>
        <div className="admin-filtro-dropdown">
          <button
            type="button"
            className={`admin-filtro-dropdown-botao ${filtroInsumosAberto ? "aberto" : ""}`}
            onClick={() => {
              setFiltroInsumosAberto((abertoAtual) => {
                const proximoEstado = !abertoAtual;
                if (!proximoEstado) {
                  setBuscaInsumos("");
                }
                return proximoEstado;
              });
              setFiltroMarcasAberto(false);
              setFiltroFornecedoresAberto(false);
              setBuscaMarcas("");
              setBuscaFornecedores("");
            }}
          >
            <span>{resumoFiltroInsumos}</span>
            <span className="admin-filtro-dropdown-seta" />
          </button>

          {filtroInsumosAberto && (
            <div className="admin-filtro-dropdown-menu">
              <input
                type="text"
                className="admin-filtro-busca"
                placeholder="Buscar insumo..."
                value={buscaInsumos}
                onChange={(evento) => setBuscaInsumos(evento.target.value)}
              />
              <div className="admin-filtro-checklist">
                {opcoesInsumoFiltradas.length > 0 ? (
                  opcoesInsumoFiltradas.map((insumo) => (
                    <label key={insumo} className="admin-filtro-check-item">
                      <input
                        type="checkbox"
                        checked={insumosSelecionados.includes(insumo)}
                        onChange={() => alternarSelecaoInsumo(insumo)}
                      />
                      <span>{insumo}</span>
                    </label>
                  ))
                ) : (
                  <p className="admin-filtro-vazio">Nenhum insumo encontrado.</p>
                )}
              </div>
              <div className="admin-filtro-checklist-acoes">
                <button
                  type="button"
                  className="admin-filtro-check-btn"
                  disabled={opcoesInsumoFiltradas.length === 0}
                  onClick={marcarTodosInsumos}
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

      <div className="admin-filtro-campo admin-filtro-campo-marcas">
        <label>Marcas</label>
        <div className="admin-filtro-dropdown">
          <button
            type="button"
            className={`admin-filtro-dropdown-botao ${filtroMarcasAberto ? "aberto" : ""}`}
            onClick={() => {
              setFiltroMarcasAberto((abertoAtual) => {
                const proximoEstado = !abertoAtual;
                if (!proximoEstado) {
                  setBuscaMarcas("");
                }
                return proximoEstado;
              });
              setFiltroInsumosAberto(false);
              setFiltroFornecedoresAberto(false);
              setBuscaInsumos("");
              setBuscaFornecedores("");
            }}
          >
            <span>{resumoFiltroMarcas}</span>
            <span className="admin-filtro-dropdown-seta" />
          </button>

          {filtroMarcasAberto && (
            <div className="admin-filtro-dropdown-menu">
              <input
                type="text"
                className="admin-filtro-busca"
                placeholder="Buscar marca..."
                value={buscaMarcas}
                onChange={(evento) => setBuscaMarcas(evento.target.value)}
              />
              <div className="admin-filtro-checklist">
                {opcoesMarcaFiltradas.length > 0 ? (
                  opcoesMarcaFiltradas.map((marca) => (
                    <label key={marca} className="admin-filtro-check-item">
                      <input
                        type="checkbox"
                        checked={marcasSelecionadas.includes(marca)}
                        onChange={() => alternarSelecaoMarca(marca)}
                      />
                      <span>{marca}</span>
                    </label>
                  ))
                ) : (
                  <p className="admin-filtro-vazio">Nenhuma marca encontrada.</p>
                )}
              </div>
              <div className="admin-filtro-checklist-acoes">
                <button
                  type="button"
                  className="admin-filtro-check-btn"
                  disabled={opcoesMarcaFiltradas.length === 0}
                  onClick={marcarTodasMarcas}
                >
                  Marcar todos
                </button>
                <button
                  type="button"
                  className="admin-filtro-check-btn"
                  onClick={() => setMarcasSelecionadas([])}
                >
                  Limpar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="admin-filtro-campo admin-filtro-campo-fornecedores">
        <label>Fornecedores</label>
        <div className="admin-filtro-dropdown">
          <button
            type="button"
            className={`admin-filtro-dropdown-botao ${filtroFornecedoresAberto ? "aberto" : ""}`}
            onClick={() => {
              setFiltroFornecedoresAberto((abertoAtual) => {
                const proximoEstado = !abertoAtual;
                if (!proximoEstado) {
                  setBuscaFornecedores("");
                }
                return proximoEstado;
              });
              setFiltroInsumosAberto(false);
              setFiltroMarcasAberto(false);
              setBuscaInsumos("");
              setBuscaMarcas("");
            }}
          >
            <span>{resumoFiltroFornecedores}</span>
            <span className="admin-filtro-dropdown-seta" />
          </button>

          {filtroFornecedoresAberto && (
            <div className="admin-filtro-dropdown-menu">
              <input
                type="text"
                className="admin-filtro-busca"
                placeholder="Buscar fornecedor..."
                value={buscaFornecedores}
                onChange={(evento) => setBuscaFornecedores(evento.target.value)}
              />
              <div className="admin-filtro-checklist">
                {opcoesFornecedorFiltradas.length > 0 ? (
                  opcoesFornecedorFiltradas.map((fornecedor) => (
                    <label key={fornecedor} className="admin-filtro-check-item">
                      <input
                        type="checkbox"
                        checked={fornecedoresSelecionados.includes(fornecedor)}
                        onChange={() => alternarSelecaoFornecedor(fornecedor)}
                      />
                      <span>{fornecedor}</span>
                    </label>
                  ))
                ) : (
                  <p className="admin-filtro-vazio">Nenhum fornecedor encontrado.</p>
                )}
              </div>
              <div className="admin-filtro-checklist-acoes">
                <button
                  type="button"
                  className="admin-filtro-check-btn"
                  disabled={opcoesFornecedorFiltradas.length === 0}
                  onClick={marcarTodosFornecedores}
                >
                  Marcar todos
                </button>
                <button
                  type="button"
                  className="admin-filtro-check-btn"
                  onClick={() => setFornecedoresSelecionados([])}
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
  );

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
        ) : exibindoLancamentos ? (
          <>
            {filtrosLancamentos}

            <AdminLancamentos lancamentos={lancamentosFiltrados} />
          </>
        ) : exibindoRelatorios ? (
          <AdminRelatorios lancamentosInsumos={lancamentosInsumos} />
        ) : exibindoLogsSistema ? (
          <AdminLogsSistema logs={logsSistema} />
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
            metrica={`${dadosMockAdmin.tiposRelatorio.length} disponíveis`}
            icone={FileText}
            iconeCor="#2f80ed"
            rotuloAcao="Ver relatórios"
            aoClicarAcao={() => setItemAtivo("relatorios")}
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
            metrica={`${totalLogsHoje.toLocaleString("pt-BR")} hoje`}
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
            titulo="Controle de Gastos no Período"
            metrica={formatarMoeda(totalMesReferencia)}
            icone={Wallet}
            iconeCor="#f2994a"
            variacao={variacaoMensalGastos}
            rotuloVariacao="vs período anterior"
          />
        </section>

        {carregandoIntegracao ? (
          <p className="admin-integracao-status">Sincronizando dados do backend...</p>
        ) : null}

        {erroIntegracao ? (
          <p className="admin-integracao-status is-error">{erroIntegracao}</p>
        ) : null}

        {filtrosLancamentos}

        <section className="admin-bottom-grid">
          <CardGraficoAdmin
            titulo="Gastos totais por insumo"
            subtitulo={`Período: ${formatarDataFiltro(dataInicial)} até ${formatarDataFiltro(
              dataFinal
            )}`}
            categorias={graficoInsumosPeriodo.categorias}
            serie={graficoInsumosPeriodo.serie}
          />

          <ComparativoPrecoUnitarioAdmin
            titulo="Comparativo de preço unitário"
            subtitulo="Ranking por insumo usando o último lote por marca e fornecedor"
            comparativoPorInsumo={comparativoPrecoUnitarioPorInsumo}
          />
        </section>
          </>
        )}
      </LayoutAdmin>
    </div>
  );
}





