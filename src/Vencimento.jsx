import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import Kpi from "./components/Kpi/Kpi";
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
                    </div>
                </div>
            </div>

        </>
    )
}