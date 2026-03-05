import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import Kpi from "./components/Kpi/Kpi";
import LinhaTabela from "./components/LinhaTabela/LinhaTabela";
import HeaderPadrao from "./HeaderPadrao";
import "./Vencimento.css"

export default function Vencimento() {

    const cards = [{
        nome: "Insumos Vencidos",
        valor: 1
    },
    {
        nome: "Vencem Hoje",
        valor: 1
    },
    {
        nome: "Próximos 7 Dias",
        valor: 1
    }
    ]

    return (
        <>
            <div className="vencimento-container">
                <HeaderPadrao />
                <div className="kpi-container">
                    <div className="kpi-container-interior">
                        <Kpi kpis={cards} />
                    </div>
                    <div className="tabela-container">
                        <Cabecalho elementos={["Insumo", "Marca", "Estoque Atual", "Data De Vencimento", "Dias Restantes", "Status"]} />
                        <div className="tabela-interior">
                            <LinhaTabela elementos={[["Arroz Tipo 1", "Camil", "04", "02/04/2005", "0", "Vencido"], ["Arroz Tipo 1", "Camil", "04", "02/04/2005", "0", "Vencido"]]} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}