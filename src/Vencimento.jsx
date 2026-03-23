import { useEffect, useState } from "react";
import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import Kpi from "./components/Kpi/Kpi";
import LinhaTabela from "./components/LinhaTabela/LinhaTabela";
import HeaderPadrao from "./HeaderPadrao";
import { Lote } from "./provider/Api";
import "./Vencimento.css"

export default function Vencimento() {

    const listaInsumos = Lote.listarLotes();
    const [insumos, setInsumos] = useState([]);

    async function carregarInsumos() {
        try {
            const lotesData = await Lote.listarLotes();
            setInsumos(lotesData);
            var insumos = []
            lotesData.map((lote) => {
                var insumo = {
                    insumo: lote.marca.insumo.nome,
                    marca: lote.marca.nome,
                    estoque: lote.quantidadeMedida,
                    dtVencimento: lote.dataValidade,
                    diasRestantes: (Math.ceil((new Date(lote.dataValidade) - new Date()) / (1000 * 60 * 60 * 24)).toLocaleString()) < 1 ? 0 : Math.ceil((new Date(lote.dataValidade) - new Date()) / (1000 * 60 * 60 * 24)).toLocaleString(),
                    status: lote.dataValidade < new Date() ? "Vencido" : new Date(lote.dataValidade) - new Date() <= 7 * 24 * 60 * 60 * 1000 ? "Vence Logo" : "Dentro do Prazo"
                }
                insumos.push(insumo);
            });
            setInsumos(insumos);
        } catch (error) {
            console.error("Erro ao carregar insumos:", error);
        }
    }

    useEffect(() => {
        carregarInsumos();
    }, []);

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
                            <LinhaTabela elementos={insumos} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}