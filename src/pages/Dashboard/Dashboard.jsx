import React, { useEffect } from "react";
import "./Dashboard.css";
import "../../components/NotificationsList/NotificationsList.css";
import HeaderPadrao from "../../HeaderPadrao";
import { useNavigate } from "react-router-dom";
import Kpi from "../../components/Kpi/Kpi";
import Grafico from "../../components/Dashboard/Grafico";
import fiadosIcon from "../../images/fiados.png";
import { useState } from "react";
import { clientes, Lote } from "../../provider/Api";
import { boletos } from "../../provider/Api";
import { dividas } from "../../provider/Api";
import { ehAdmin } from "../../utils/sessao";
import { useNotifications } from "../../utils/useNotification.js";
import sseManager from "../../utils/sseManager";
import NotificationsList, {
  getNotificationKey,
} from "../../components/NotificationsList/NotificationsList";

export default function Index() {
  const navigate = useNavigate();
  const usuarioEhAdmin = ehAdmin();
  const [kpisDados, setKpisDados] = useState([])
  const [lotesData, setlotesData] = useState([])
  const [dadosInsumo, setDadosInsumo] = useState([])
  const [boletosData, setBoletosData] = useState([])
  const [clientesData, setClientesData] = useState(0)
  const [removendoIds, setRemovendoIds] = useState({})

  // ✅ Consome as notificações SSE
  const notifications = useNotifications();

  const groupedNotifications = notifications.reduce((acc, message) => {
    const { id, body } = message;
    if (!id || !body) return acc;

    const groupKey = id[0].toLowerCase();
    let groupName = "Outros";
    if (groupKey === "e") groupName = "Estoque";
    else if (groupKey === "v") groupName = "Vencimento";
    else if (groupKey === "b") groupName = "Boleto";

    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(message);
    return acc;
  }, {});

  // ========================
  // Fetch e lógica existente
  // ========================

  async function fetchLotes() {
    const lotesData = await Lote.listarLotes()
    console.log(lotesData)
    setlotesData(lotesData)
  }

  function agruparDados(dados) {
    if (!Array.isArray(dados)) return setDadosInsumo([])
    const mapa = new Map()
    for (const dado of dados) {
      const nome = dado.marca?.insumo?.nome ?? ''
      const qtd = Number(dado.quantidadeAtual ?? 0)
      const qtdMinima = Number(dado.marca?.insumo?.qtdMinima ?? 0)
      if (!mapa.has(nome)) mapa.set(nome, { nome, quantidade: 0, qtdMinima })
      const item = mapa.get(nome)
      item.quantidade += qtd
      if (!item.qtdMinima && qtdMinima) item.qtdMinima = qtdMinima
    }
    const dadosAgrupados = Array.from(mapa.values()).map((it) => {
      const parts = (it.nome || '').split(/\s+/).filter(Boolean);
      const nomeCurto = parts.slice(0, 3).join(' ');
      const y = it.quantidade
      const estoqueMinimo = Number(it.qtdMinima ?? 0)
      const diferenca = y - estoqueMinimo
      let razao
      if (estoqueMinimo !== 0) {
        razao = diferenca / estoqueMinimo
      } else {
        razao = diferenca === 0 ? 0 : (diferenca > 0 ? Infinity : -Infinity)
      }
      return {
        x: nomeCurto, y,
        goals: [{ name: 'Estoque Mínimo', value: estoqueMinimo, strokeHeight: 5, strokeColor: 'red' }],
        __diferenca: diferenca, __razao: razao, __nomeCompleto: it.nome,
      }
    })
    dadosAgrupados.sort((a, b) => {
      if (a.__razao === b.__razao) return 0
      if (a.__razao === -Infinity) return -1
      if (b.__razao === -Infinity) return 1
      if (a.__razao === Infinity) return 1
      if (b.__razao === Infinity) return -1
      return a.__razao - b.__razao
    })
    setDadosInsumo(dadosAgrupados)
  }

  async function fetchBoletos() {
    const boletosData = await boletos.listarBoletos()
    setBoletosData(boletosData)
  }

  async function fetchClientes() {
    const clientesData = await clientes.listarComDividasEmAberto()
    setClientesData(clientesData)
  }

  useEffect(() => { fetchLotes(); fetchBoletos(); fetchClientes(); }, []);
  useEffect(() => { agruparDados(lotesData) }, [lotesData])
  useEffect(() => { kpis(); }, [lotesData, boletosData, clientesData, dadosInsumo])

  function kpis() {
    var umaSemana = new Date(new Date().getTime() + 604800000)
    var contadorEstoqueMinimo = 0
    var contadorInsumoValidade = 0
    var contadorBoletoVencimento = 0
    for (const dado of dadosInsumo) {
      if (dado.y <= dado.goals[0].value) contadorEstoqueMinimo++
    }
    for (const dado of lotesData) {
      if (new Date(dado.dataValidade) <= umaSemana) contadorInsumoValidade++
    }
    for (const boleto of boletosData) {
      if (boleto.pago == false && new Date(boleto.dataVencimento) <= umaSemana) contadorBoletoVencimento++
    }
    const totalClientesDevedores = Array.isArray(clientesData)
      ? clientesData.length
      : Number(clientesData) || 0
    setKpisDados([contadorEstoqueMinimo, contadorInsumoValidade, contadorBoletoVencimento, totalClientesDevedores])
  }

  const cards = [
    { nome: "Produtos Abaixo do Estoque Min.", valor: kpisDados[0] },
    { nome: "Produtos Perto da Data de Vencimento", valor: kpisDados[1] },
    { nome: "Boletos Próximo ao Vencimento", valor: kpisDados[2] },
    { nome: "Total de Clientes Devedores", valor: kpisDados[3] },
  ]

  // ✅ Badge por grupo
  const badgeCount = (group) => groupedNotifications[group]?.length || 0;

  const handleRemoverNotificacao = async (message, index) => {
    const itemKey = getNotificationKey(message, index);

    try {
      setRemovendoIds((prev) => ({ ...prev, [itemKey]: true }));
      const removed = await sseManager.deleteNotification(message);
      if (!removed) return;
    } catch (error) {
      console.error("Erro ao remover notificacao:", error);
      alert("Nao foi possivel remover a notificacao agora.");
    } finally {
      setRemovendoIds((prev) => {
        const next = { ...prev };
        delete next[itemKey];
        return next;
      });
    }
  };

  return (
    <div className="dashboard">
      <HeaderPadrao mostrarBotao={false} />

      <nav className="menu">
        <button onClick={() => navigate("/estoque")} className="btn btn-menu estoque-menu">
          <span className="menu-icone estoque-menu-icone"></span>
          <span>Estoque</span>
        </button>
        <button onClick={() => navigate("/Vencimentos")} className="btn btn-menu vencimentos-menu">
          <span className="menu-icone vencimentos-menu-icone"></span>
          <span>Vencimentos</span>
        </button>
        {usuarioEhAdmin && (
          <button onClick={() => navigate("/admin?aba=lancamentos")} className="btn btn-menu gastos-menu">
            <span className="menu-icone gastos-menu-icone"></span>
            <span>Gastos</span>
          </button>
        )}
        <button onClick={() => navigate("/fornecedor")} className="btn btn-menu fornecedor-menu">
          <span className="menu-icone fornecedor-menu-icone"></span>
          <span>Fornecedores</span>
        </button>
        {usuarioEhAdmin && (
          <button onClick={() => navigate("/Boletos")} className="btn btn-menu boleto-menu">
            <span className="menu-icone boleto-menu-icone"></span>
            <span>Boletos</span>
          </button>
        )}
        {usuarioEhAdmin && (
          <button onClick={() => navigate("/Fiados")} className="btn btn-menu fiado-menu">
            <span className="menu-icone fiado-menu-icone" style={{ backgroundImage: `url(${fiadosIcon})` }}></span>
            <span>Fiados</span>
          </button>
        )}
      </nav>

      <Kpi kpis={cards} />

      <div className="container2">
        <div className="grafico" id="chart">
          <Grafico dados={dadosInsumo} />
        </div>

        <div className="notificacao">
          <div className="notificacao-lista-wrapper">
            <h3 className="notificacao-lista-titulo">Listagem de Notificações</h3>
            <NotificationsList
              notifications={notifications}
              onRemove={handleRemoverNotificacao}
              removendoIds={removendoIds}
              containerClass="notifications-list-container dashboard-notifications"
            />
          </div>
        </div>
      </div>
    </div>
  );
}