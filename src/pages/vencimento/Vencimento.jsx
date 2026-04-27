import { useEffect, useState } from "react";
import { Cabecalho } from "../../components/Cabecalho/Cabecalho";
import Kpi from "../../components/Kpi/Kpi";
import LinhaTabela from "../../components/LinhaTabela/LinhaTabela";
import HeaderPadrao from "../../HeaderPadrao";
import "./Vencimento.css"
import { Vencimentos } from "../../provider/Api";

export default function Vencimento() {
    const [vencimento, setVencimento] = useState([])
    const [kpis, setKpis] = useState([])
    const [paginaAtual, setPaginaAtual] = useState(1)
    const itensPorPagina = 10

    useEffect(() => {
        Vencimentos.buscarEstoque().then((res) => setVencimento(res));
        Vencimentos.buscarKpis().then((res) => setKpis(res));
    }, [])

    useEffect(() => {
        const totalPaginas = Math.max(1, Math.ceil(vencimento.length / itensPorPagina))

        setPaginaAtual((paginaAnterior) => {
            if (paginaAnterior > totalPaginas) {
                return totalPaginas
            }

            if (paginaAnterior < 1) {
                return 1
            }

            return paginaAnterior
        })
    }, [vencimento])

    useEffect(() => {
        document.title = "Vencimentos";
      }, []);

    const totalPaginas = Math.max(1, Math.ceil(vencimento.length / itensPorPagina))
    const indiceInicial = (paginaAtual - 1) * itensPorPagina
    const indiceFinal = indiceInicial + itensPorPagina
    const vencimentosPaginados = vencimento.slice(indiceInicial, indiceFinal)
    const temRegistros = vencimento.length > 0

    function irParaPagina(proximaPagina) {
        setPaginaAtual(Math.min(Math.max(proximaPagina, 1), totalPaginas))
    }

    return (
        <>
            <HeaderPadrao />
            <div className="vencimento-container">
                <div className="kpi-container">
                    <div className="kpi-container-interior">
                        <Kpi kpis={kpis} />
                    </div>
                    <div className="tabela-container">
                        <Cabecalho elementos={["Insumo", "Marca", "Estoque Atual", "Data De Vencimento", "Dias Restantes", "Status"]} />
                        <div className="tabela-interior">
                            <LinhaTabela elementos={vencimentosPaginados} />
                        </div>
                        <div className="tabela-paginacao">
                            <div className="tabela-paginacao-resumo">
                                {temRegistros
                                    ? `Mostrando ${indiceInicial + 1}-${Math.min(indiceFinal, vencimento.length)} de ${vencimento.length}`
                                    : "Nenhum registro encontrado"}
                            </div>
                            <div className="tabela-paginacao-acoes">
                                <button
                                    type="button"
                                    className="botao-paginacao"
                                    onClick={() => irParaPagina(paginaAtual - 1)}
                                    disabled={paginaAtual <= 1}
                                >
                                    Anterior
                                </button>
                                <span className="tabela-paginacao-pagina">
                                    Página {paginaAtual} de {totalPaginas}
                                </span>
                                <button
                                    type="button"
                                    className="botao-paginacao"
                                    onClick={() => irParaPagina(paginaAtual + 1)}
                                    disabled={paginaAtual >= totalPaginas}
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}