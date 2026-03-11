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

  return (
    <div className="boletos">
      <HeaderPadrao/>
      
      <div className="conteudo">
        <span>Pagamentos</span>
        <br />
        <div className="card-pagamentos">
          <div className="filtros">
            <select>
              <option>Próximo mês</option>
              <option>Janeiro</option>
              <option>Fevereiro</option>
              <option>Março</option>
              <option>Abril</option>
              <option>Maio</option>
              <option>Junho</option>
              <option>Julho</option>
              <option>Agosto</option>
              <option>Setembro</option>
              <option>Outubro</option>
              <option>Novembro</option>
              <option>Dezembro</option>
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
              onClick={() => navigate("/calendario", { state: { myEventsList: boletoLista } })}
            >
                <CalendarDays size={20} />
                <h3> Painel</h3>
            </button>
          </div>

          <div className="lista">
            {boletoLista.map((boleto) => (
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
