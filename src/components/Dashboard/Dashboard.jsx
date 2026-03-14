import React, { useEffect } from "react";
import "./Dashboard.css";
import HeaderPadrao from "../../HeaderPadrao";
import { useNavigate } from "react-router-dom";
import Kpi from "../Kpi/Kpi";
import Grafico from "./Grafico";
import { useState } from "react";
import { Lote } from "../../provider/Api";
import { boletos } from "../../provider/Api";

export default function Index() {
  const navigate = useNavigate();
  const [kpisDados, setKpisDados] = useState([])
  const [lotesData, setlotesData] = useState([])
  const [dadosInsumo, setDadosInsumo] = useState([])
  const [boletosData, setBoletosData] = useState([])
  async function fetchLotes() {
    const lotesData = await Lote.listarLotes()
    setlotesData(lotesData)
    var lotesFormatados = []
    for (const lote of lotesData) {
      var loteFormatado = {
        x: lote.marca.insumo.nome,
        y: lote.quantidadeMedida,
        goals: [
          {
            name: "Estoque Mínimo",
            value: lote.marca.insumo.qtdMinima,
            strokeHeight: 5,
            strokeColor: "red"
          }
        ]
      }
      lotesFormatados.push(loteFormatado)
    }
    setDadosInsumo(lotesFormatados)
  }
  useEffect(() => {
    fetchLotes();
    fetchBoletos();
  }, []);
  async function fetchBoletos(){
    const boletosData = await boletos.listarBoletos()
    setBoletosData(boletosData)
  }
  useEffect(() => {
    kpis();
  }, [lotesData, boletosData])

  function kpis() {
    var umaSemana = new Date(new Date().getTime() + 604800000)
    var contadorEstoqueMinimo = 0
    var contadorInsumoValidade = 0
    var contadorBoletoVencimento = 0
    for (const dado of lotesData) {
      if (dado.quantidadeMedida <= dado.marca.insumo.qtdMinima) {
        contadorEstoqueMinimo++
      }
      if(new Date(dado.dataValidade) <= umaSemana){
        contadorInsumoValidade++
      }
    }
    for (const boleto of boletosData){
      if(boleto.pago == false && new Date(boleto.dataVencimento) <= umaSemana){
        contadorBoletoVencimento++
      }
    }
                  setKpisDados([contadorEstoqueMinimo, contadorInsumoValidade, contadorBoletoVencimento])
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
      valor: 25
    }
    ]
    return (
      <div className="dashboard">
        <HeaderPadrao />

        <nav className="menu">
          <button onClick={() => navigate("/estoque")} className="btn">Estoque</button>
          <button className="btn">Gastos</button>
          <button onClick={() => navigate("/fornecedor")} className="btn">Fornecedores</button>
          <button onClick={() => navigate("/Boletos")} className="btn">Boletos</button>
          <button onClick={() => navigate("/Fiados")} className="btn">Fiados</button>
          <button onClick={() => navigate("/Vencimentos")} className="btn">Vencimentos</button>
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

