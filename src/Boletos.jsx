import React from "react";
import { Menu, CalendarDays, Search } from "lucide-react";

  return (
    <div className="boletos">
      <header className="header">
        <div className="lado-esquerdo">
          <button className="hamburger-btn">
          </button>

          <div className="logo-circulo"></div>

          <div className="restaurante">
            <div className="restaurante-name">Toomate Bistrô</div>
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

            <button className="btn-calendario">
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
