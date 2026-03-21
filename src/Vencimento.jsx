import { useEffect, useState } from "react";
import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import Kpi from "./components/Kpi/Kpi";
import LinhaTabela from "./components/LinhaTabela/LinhaTabela";
import HeaderPadrao from "./HeaderPadrao";
import { Lote } from "./provider/Api";
import "./Vencimento.css"
import { Vencimentos } from "./provider/Api";

export default function Vencimento() {

    const listaInsumos = Lote.listarLotes();
    const [insumos, setInsumos] = useState([]);
    const [insumosVencidos, setInsumosVencidos] = useState(0);
    const [insumosVencemHoje, setInsumosVencemHoje] = useState(0);
    const [insumosVencem7Dias, setInsumosVencem7Dias] = useState(0);

    function calcularStatus(dataValidade) {
        const hoje = new Date();
        const dataVencimento = new Date(dataValidade);
        const diasRestantes = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
        if (diasRestantes < 0) {
            return "Vencido";
        } 
        else if (diasRestantes === 0) {
            return "Vence Hoje";
        }
        else if (diasRestantes <= 7) {
            return "Vence em 7 Dias";
        } else {
            return "Dentro do Prazo";
        }
    }

    function calcularKpis(insumos) {
        let vencidos = 0;
        let vencemHoje = 0;
        let vencem7Dias = 0;

        insumos.forEach((insumo) => {
            if (insumo.status === "Vencido") {
                vencidos++;
            } else if (insumo.status === "Vence Hoje") {
                vencemHoje++;
            } else if (insumo.status === "Vence em 7 Dias") {
                vencem7Dias++;
            }
        });

        setInsumosVencidos(vencidos);
        setInsumosVencemHoje(vencemHoje);
        setInsumosVencem7Dias(vencem7Dias);
    }

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
                    status: calcularStatus(lote.dataValidade)
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

    useEffect(() => {
        calcularKpis(insumos);
    }, [insumos]);

    const cards = [{
        nome: "Insumos Vencidos",
        valor: insumosVencidos
    },
    {
        nome: "Vencem Hoje",
        valor: insumosVencemHoje
    },
    {
        nome: "Próximos 7 Dias",
        valor: insumosVencem7Dias
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
                            <LinhaTabela elementos={vencimento} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}