import React from "react";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./index.css";
import { Menu, CalendarDays, Search } from "lucide-react";

export default function Boletos({ irPara }) {
const [abrirCalendario, setAbrirCalendario] = useState(false);
const [dataSelecionada, setDataSelecionada] = useState(new Date());
  return (
    <div className="boletos">
      <header className="header">
        <div className="lado-esquerdo">
          <button className="hamburger-btn">
            <Menu size={28} color="#b88b09" />
          </button>

          <div className="logo-circulo"></div>

          <div className="restaurante">
            <div className="restaurante-name">Toomate Bistrô</div>
            <div className="restaurante-subnome">Kaio</div>
          </div>
        </div>

        <button onClick={() => irPara("login")} className="btn">
          Sair
        </button>
      </header>

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
              onClick={() => setAbrirCalendario(true)}
            >
              <CalendarDays size={20} />
            </button>
          </div>

          <div className="lista">
            <ItemPagamento />
            <ItemPagamento />
            <ItemPagamento />
          </div>
        </div>
      </div>
      {abrirCalendario && (
        <div className="modal-fullscreen">
          <header className="header">
            <div className="lado-esquerdo">
              <button className="hamburger-btn">
                <Menu size={28} color="#b88b09" />
              </button>

              <div className="logo-circulo"></div>

              <div className="restaurante">
                <div className="restaurante-name">Toomate Bistrô</div>
                <div className="restaurante-subnome">Kaio</div>
              </div>
            </div>

            <button onClick={() => setAbrirCalendario(false)} className="btn">
              Sair
            </button>
          </header>
          
          <div className="modal-body-calendario">
            <Calendar
              onChange={(date) => setDataSelecionada(date)}
              value={dataSelecionada}
              tileContent={({ date, view }) => {
                if (view === "month") {
                  return (
                    <div className="conteudo-dia">
                      <span className="status pago">Pago ✓</span>
                      <span className="nome-divida">Nome Divida</span>
                      <span className="valor">R$ 0000,00</span>
                    </div>
                  );
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
  
}

function ItemPagamento() {
  return (
    <div className="item-pagamento">
      <div className="info-esquerda">
        <div className="vencimento">Vencimento: dia / mes / ano</div>

        <div className="descricao">
          Informações do boleto (Razão Social e Produto)
        </div>

        <div className="valor">R$ Valor</div>
      </div>

      <div className="lado-direito">
        <button className="btn-pago">Pago ✓</button>
      </div>
    </div>
  );
}
