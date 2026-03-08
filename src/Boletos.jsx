import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { Menu, CalendarDays, Search } from "lucide-react";
import HeaderPadrao from "./HeaderPadrao";
import Calendario from "./components/Calendario/calendario";
import { BiFontSize } from "react-icons/bi";

export default function Boletos({ irPara }) {
const navigate = useNavigate();
// const [abrirCalendario, setAbrirCalendario] = useState(false);

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
              onClick={() => navigate("/calendario")}
            >
                <CalendarDays size={20} />
                <h3> Painel</h3>
            </button>
          </div>

          <div className="lista">
            <div className="item-pagamento">
              <div className="info-esquerda">
                <div className="vencimento">Vencimento: 10/02/2026</div>

                <div className="descricao">
                  Aluguel
                </div>

                <div className="valor">R$ 8.000,00</div>
              </div>

              <div className="lado-direito">
                <button className="btn-pago">Pago ✓</button>
              </div>
            </div>
            
            <div className="item-pagamento">
              <div className="info-esquerda">
                <div className="vencimento">Vencimento: 15/02/2026</div>

                <div className="descricao">
                  Conta de Água
                </div>

                <div className="valor">R$ 716,49</div>
              </div>

              <div className="lado-direito">
                <button className="btn-pago">Pago ✓</button>
              </div>
            </div>

            <div className="item-pagamento">
              <div className="info-esquerda">
                <div className="vencimento">Vencimento: 20/02/2026</div>

                <div className="descricao">
                  Conta de Luz
                </div>

                <div className="valor">R$ 428,67</div>
              </div>

              <div className="lado-direito">
                <button className="btn-pago">Pago ✓</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
  
}
