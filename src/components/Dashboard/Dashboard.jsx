import React, { useEffect } from "react";
import "./Dashboard.css";
import HeaderPadrao from "../../HeaderPadrao";
import { data, useNavigate } from "react-router-dom";
import Kpi from "../Kpi/Kpi";
import Grafico from "./Grafico";
import fiadosIcon from "../../images/fiados.png";
import { useState } from "react";
import { clientes, Lote } from "../../provider/Api";
import { boletos } from "../../provider/Api";
import { dividas } from "../../provider/Api";

export default function Index() {
  const navigate = useNavigate();
  const [kpisDados, setKpisDados] = useState([])
  const [lotesData, setlotesData] = useState([])
  const [dadosInsumo, setDadosInsumo] = useState([])
  const [boletosData, setBoletosData] = useState([])
  const [clientesData, setClientesData] = useState(0)
  async function fetchLotes() {
    const lotesData = await Lote.listarLotes()
    setlotesData(lotesData)
  }
  function agruparDados(dados) {
    var dadosAgrupados = []
    var nomes = new Set()
    for (const dado of dados) {
      nomes.add(dado.marca.insumo.nome)
    }
    for (const nome of nomes) {
      var quantidade = 0
      for (const dado of dados) {
        if (dado.marca.insumo.nome == nome) {
          quantidade += dado.quantidadeMedida
          var loteFormatado = {
            x: dado.marca.insumo.nome.split(" ")[0],
            y: quantidade,
            goals: [
              {
                name: "Estoque Mínimo",
                value: dado.marca.insumo.qtdMinima,
                strokeHeight: 5,
                strokeColor: "red"
              }
            ]
          }
        }
      }
      dadosAgrupados.push(loteFormatado)
    }
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
  useEffect(() => {
    fetchLotes();
    fetchBoletos();
    fetchClientes();
  }, []);
  useEffect(() => {
    agruparDados(lotesData)
  }, [lotesData])
  useEffect(() => {
    kpis();
  }, [lotesData, boletosData, clientesData, dadosInsumo])

  function kpis() {
    console.log(dadosInsumo)
    var umaSemana = new Date(new Date().getTime() + 604800000)
    var contadorEstoqueMinimo = 0
    var contadorInsumoValidade = 0
    var contadorBoletoVencimento = 0
    for (const dado of dadosInsumo) {
      if (dado.y <= dado.goals[0].value) {
        contadorEstoqueMinimo++
      }
    }
    for (const dado of lotesData) {
      if (new Date(dado.dataValidade) <= umaSemana) {
        contadorInsumoValidade++
      }
    }
    for (const boleto of boletosData) {
      if (boleto.pago == false && new Date(boleto.dataVencimento) <= umaSemana) {
        contadorBoletoVencimento++
      }
    }
    const totalClientesDevedores = Array.isArray(clientesData)
      ? clientesData.length
      : Number(clientesData) || 0
    setKpisDados([contadorEstoqueMinimo, contadorInsumoValidade, contadorBoletoVencimento, totalClientesDevedores])
  }
  const cards = [{
    nome: "Produtos Abaixo do Estoque Min.",
    valor: kpisDados[0]
  },
  {
    nome: "Produtos Perto da Data de Vencimento",
    valor: kpisDados[1]
  },
  {
    nome: "Boletos Próximo ao Vencimento",
    valor: kpisDados[2]
  },
  {
    nome: "Total de Clientes Devedores",
    valor: kpisDados[3]
  }
  ]
  return (
    <div className="dashboard">
      <HeaderPadrao mostrarBotao={false}/>

      <nav className="menu">
        <button onClick={() => navigate("/estoque")} className="btn btn-menu estoque-menu">
          <span className="menu-icone estoque-menu-icone"></span>
          <span>Estoque</span>
        </button>
                <button onClick={() => navigate("/Vencimentos")} className="btn btn-menu vencimentos-menu">
          <span className="menu-icone vencimentos-menu-icone"></span>
          <span>Vencimentos</span>
        </button>
        <button className="btn btn-menu gastos-menu">
          <span className="menu-icone gastos-menu-icone"></span>
          <span>Gastos</span>
        </button>
        <button onClick={() => navigate("/fornecedor")} className="btn btn-menu fornecedor-menu">
          <span className="menu-icone fornecedor-menu-icone"></span>
          <span>Fornecedores</span>
        </button>
        <button onClick={() => navigate("/Boletos")} className="btn btn-menu boleto-menu">
          <span className="menu-icone boleto-menu-icone"></span>
          <span>Boletos</span>
        </button>
        <button onClick={() => navigate("/Fiados")} className="btn btn-menu fiado-menu">
          <span
            className="menu-icone fiado-menu-icone"
            style={{ backgroundImage: `url(${fiadosIcon})` }}
          ></span>
          <span>Fiados</span>
        </button>
      </nav>

      <Kpi kpis={cards} />

      <div className="container2">
        <div className="grafico" id="chart">
          <Grafico dados={dadosInsumo} />
        </div>

        <div className="notificacao">
          <h2 className="alerta-titulo">ALERTAS!</h2>

          <button className="alerta-btn validade">
            <span className="validade-icone"></span>
            <span>Notificação de Validade!</span>
          </button>

          <button className="alerta-btn estoque">
            <span className="estoque-icone"></span>
            <span>Notificação de Estoque!</span>
          </button>

          <button className="alerta-btn fornecedor">
            <span className="fornecedor-icone"></span>
            <span>Notificação de Fornecedor!</span>
          </button>

          <button className="alerta-btn boleto">
            <span className="boleto-icone"></span>
            <span>Notificação de Boleto!</span>
          </button>
        </div>
      </div>
    </div>
  );
}

