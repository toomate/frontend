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

    const insumos = [{
        insumo: "Arroz Tipo 1",
        marca: "Camil",
        estoque: 4,
        dtVencimento: "28/02/2026",
        diasRestantes: 0,
        status: "Vencido"
    },
    {
        insumo: "Feijão Carioca",
        marca: "Camil",
        estoque: 8,
        dtVencimento: "20/03/2026",
        diasRestantes: 3,
        status: "Vence Logo"
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
                            <LinhaTabela elementos={insumos} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}