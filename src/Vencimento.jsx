import { useEffect, useState } from "react";
import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import Kpi from "./components/Kpi/Kpi";
import LinhaTabela from "./components/LinhaTabela/LinhaTabela";
import HeaderPadrao from "./HeaderPadrao";
import { Lote } from "./provider/Api";
import "./Vencimento.css"
import { Vencimentos } from "./provider/Api";

export default function Vencimento() {
    const [vencimento, setVencimento] = useState([])
    const [kpis, setKpis] = useState([])

    useEffect(() => {
        Vencimentos.buscarEstoque().then((res) => setVencimento(res));
        Vencimentos.buscarKpis().then((res) => setKpis(res));
    }, [])

    useEffect(() => {
        document.title = "Vencimentos";
      }, []);

    return (
        <>
            <div className="vencimento-container">
                <HeaderPadrao />
                <div className="kpi-container">
                    <div className="kpi-container-interior">
                        <Kpi kpis={kpis} />
                    </div>
                    <div className="tabela-container">
                        <Cabecalho elementos={["Insumo", "Marca", "Estoque Atual", "Data De Vencimento", "Dias Restantes", "Status"]} />
                        <div className="tabela-interior">
                            <LinhaTabela elementos={vencimento} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}