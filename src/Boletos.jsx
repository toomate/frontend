import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { Menu, CalendarDays, Search } from "lucide-react";
import HeaderPadrao from "./HeaderPadrao";
import Calendario from "./components/Calendario/calendario";
import { BiFontSize } from "react-icons/bi";
import { boletos } from './provider/Api';

export default function Boletos({ irPara }) {
const navigate = useNavigate();
const [boletoLista, setBoletos] = useState([]);
const [filtroMes, setFiltroMes] = useState("proximo");

  function obterDataInicialCalendario() {
    if (boletosFiltrados.length > 0) {
      return boletosFiltrados[0].start.toISOString();
    }

    const hoje = new Date();

    if (filtroMes === "proximo") {
      const dataProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
      return dataProximoMes.toISOString();
    }

    const mesSelecionado = Number(filtroMes);
    if (Number.isFinite(mesSelecionado)) {
      const dataMesSelecionado = new Date(hoje.getFullYear(), mesSelecionado, 1);
      return dataMesSelecionado.toISOString();
    }

    return hoje.toISOString();
  }

  const boletosFiltrados = boletoLista.filter((boleto) => {
    if (!(boleto.start instanceof Date) || Number.isNaN(boleto.start.getTime())) {
      return false;
    }

    const mesBoleto = boleto.start.getMonth();
    const anoBoleto = boleto.start.getFullYear();

    if (filtroMes === "proximo") {
      const hoje = new Date();
      const proximoMes = (hoje.getMonth() + 1) % 12;
      const anoProximoMes = hoje.getMonth() === 11 ? hoje.getFullYear() + 1 : hoje.getFullYear();
      return mesBoleto === proximoMes && anoBoleto === anoProximoMes;
    }

    const mesSelecionado = Number(filtroMes);
    if (!Number.isFinite(mesSelecionado)) return true;

    return mesBoleto === mesSelecionado;
  });

  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        const boletosData = await boletos.listarBoletos();
        const boletosJson = Array.isArray(boletosData) ? boletosData.map(boleto => {
          const startDate = new Date(
            boleto.dataVencimento + 'T00:00:00'
          );
          console.log(`Boleto: ${boleto.descricao}, Data original: ${boleto.data_vencimento}, Data convertida: ${startDate}`);
          return {
            id: boleto.idBoleto,
            title: boleto.descricao,
            status: boleto.pago,
            value: `R$ ${boleto.valor.toFixed(2)}`,
            start: startDate,
            end: startDate,
          };
        }) : [];
        console.log('Events processados:', boletosJson);
        setBoletos(boletosJson);
      } catch (error) {
        console.error('Erro ao buscar boletos:', error);
        setBoletos([]);
      }
    };
    fetchBoletos();

  }, []);

  useEffect(() => {
      document.title = "Boletos";
    }, []);

  return (
    <div className="boletos">
      <HeaderPadrao/>
      
      <div className="conteudo">
        <span>Pagamentos</span>
        <br />
        <div className="card-pagamentos">
          <div className="filtros">
            <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
              <option value="proximo">Próximo mês</option>
              <option value="0">Janeiro</option>
              <option value="1">Fevereiro</option>
              <option value="2">Março</option>
              <option value="3">Abril</option>
              <option value="4">Maio</option>
              <option value="5">Junho</option>
              <option value="6">Julho</option>
              <option value="7">Agosto</option>
              <option value="8">Setembro</option>
              <option value="9">Outubro</option>
              <option value="10">Novembro</option>
              <option value="11">Dezembro</option>
            </select>

            <select>
              <option>Status</option>
              <option>Pagos</option>
              <option>Em Aberto</option>
              <option>Atrasados</option>
            </select>

            <select>
              <option>Tipo</option>
              <option>Boletos Fornecedores</option>
              <option>Contas Consumo</option>
            </select>

            <div className="busca">
              <Search size={16} />
              <input placeholder="Busca por nome" />
            </div>

            <button 
              className="btn-calendario" 
              onClick={() =>
                navigate("/calendario", {
                  state: {
                    myEventsList: boletoLista,
                    initialDate: obterDataInicialCalendario(),
                  },
                })
              }
            >
                <CalendarDays size={20} />
                <h3> Painel</h3>
            </button>
          </div>

          <div className="lista">
            {boletosFiltrados.map((boleto) => (
              <div className="item-pagamento" key={boleto.id}>
                <div className="info-esquerda">
                  <div className="vencimento">Vencimento: {boleto.start.toLocaleDateString()}</div>

                  <div className="descricao">
                    {boleto.title}
                  </div>

                  <div className="valor">{boleto.value}</div>
                </div>

                <div className="lado-direito">
                  {boleto.status ? (
                    <button className="btn-pago">Pago ✓</button>
                  ) : (
                    <button className="btn-pendente">Pendente</button>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
  
}
