import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { Cabecalho } from "../../components/Cabecalho/Cabecalho";
import Kpi from "../../components/Kpi/Kpi";
import LinhaTabela from "../../components/LinhaTabela/LinhaTabela";
import SeletorPaginas from "../../components/Paginas/SeletorPaginas";
import HeaderPadrao from "../../HeaderPadrao";
import "./Vencimento.css"
import { Vencimentos } from "../../provider/Api";

function normalizar(valor) {
    return String(valor ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim();
}


export default function Vencimento() {
    const [vencimento, setVencimento] = useState([])
    const [kpis, setKpis] = useState([])
    const [paginaAtual, setPaginaAtual] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [totalElementos, setTotalElementos] = useState(0)
    const [usaPaginacaoServidor, setUsaPaginacaoServidor] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const itensPorPagina = 10

    const filtroInsumo = searchParams.get("insumo") ?? ""

    const selecionarPag = (numPag) => {
        setPaginaAtual(numPag);
    }

    const voltarPag = () => {
        if (paginaAtual > 0) {
            let pag = paginaAtual - 1;
            setPaginaAtual(pag)
        }
    }

    const avancarPag = () => {
        if (paginaAtual < totalPaginas - 1) {
            let pag = paginaAtual + 1;
            setPaginaAtual(pag)
        }
    }

    const carregarVencimentos = useCallback(async (pagina = paginaAtual) => {
        const resposta = await Vencimentos.buscarEstoque({
            pagina: paginaAtual,
            tamanho: itensPorPagina,
        });

        if (Array.isArray(resposta)) {
            setUsaPaginacaoServidor(false);
            setVencimento(resposta);
            setTotalElementos(resposta.length);
            setTotalPaginas(Math.max(1, Math.ceil(resposta.length / itensPorPagina)));
            return;
        }

        const conteudo = Array.isArray(resposta?.conteudo) ? resposta.conteudo : [];

        setUsaPaginacaoServidor(true);
        setVencimento(conteudo);
        setTotalElementos(Number(resposta?.total ?? conteudo.length));
        setTotalPaginas(Math.max(1, Number(resposta?.totalPaginas ?? 1)));
    }, [paginaAtual, itensPorPagina]);

    useEffect(() => {
        carregarVencimentos();
        Vencimentos.buscarKpis().then((res) => setKpis(res));
    }, [carregarVencimentos])

    const vencimentoFiltrado = useMemo(() => {
        if (!filtroInsumo) return vencimento
        const alvo = normalizar(filtroInsumo)
        return vencimento.filter((item) => normalizar(item.insumo) === alvo)
    }, [vencimento, filtroInsumo])

    useEffect(() => {
        const paginasCalculadas = usaPaginacaoServidor
            ? totalPaginas
            : Math.max(1, Math.ceil(vencimentoFiltrado.length / itensPorPagina))

        setPaginaAtual((paginaAnterior) => {
            if (paginaAnterior >= paginasCalculadas) {
                return Math.max(0, paginasCalculadas - 1)
            }

            if (paginaAnterior < 0) {
                return 0
            }
            return paginaAnterior
        })
    }, [vencimentoFiltrado, totalPaginas, usaPaginacaoServidor])

    useEffect(() => {
        document.title = "Vencimentos";
      }, []);

    const indiceInicial = paginaAtual * itensPorPagina
    const indiceFinal = indiceInicial + itensPorPagina
    const vencimentosPaginados = usaPaginacaoServidor
        ? vencimentoFiltrado
        : vencimentoFiltrado.slice(indiceInicial, indiceFinal)
    const temRegistros = usaPaginacaoServidor
        ? totalElementos > 0
        : vencimentoFiltrado.length > 0

    function irParaPagina(proximaPagina) {
        setPaginaAtual(
            Math.min(
                Math.max(proximaPagina, 0),
                totalPaginas - 1
            )
        )
    }

    function limparFiltro() {
        const novosParams = new URLSearchParams(searchParams)
        novosParams.delete("insumo")
        setSearchParams(novosParams)
        setPaginaAtual(0)
    }

    return (
        <>
            <HeaderPadrao />
            <div className="vencimento-container">
                <div className="kpi-container">
                    <div className="kpi-container-interior">
                        <Kpi kpis={kpis} />
                    </div>
                    {filtroInsumo && (
                        <div className="vencimento-filtro-banner">
                            <span>
                                Filtrando por insumo: <strong>{filtroInsumo}</strong>
                            </span>
                            <button
                                type="button"
                                className="vencimento-filtro-limpar"
                                onClick={limparFiltro}
                            >
                                <X size={14} />
                                Limpar filtro
                            </button>
                        </div>
                    )}
                    <div className="tabela-container">
                        <Cabecalho elementos={["Insumo", "Marca", "Estoque Atual", "Data De Vencimento", "Dias Restantes", "Status"]} />
                        <div className="tabela-interior">
                            <LinhaTabela elementos={vencimentosPaginados} />
                        </div>
                        <div className="tabela-paginacao">
                            <div className="tabela-paginacao-resumo">
                                {temRegistros
                                    ? `Mostrando ${indiceInicial + 1}-${Math.min(indiceFinal, usaPaginacaoServidor ? totalElementos : vencimentoFiltrado.length)} de ${usaPaginacaoServidor ? totalElementos : vencimentoFiltrado.length}`
                                    : filtroInsumo
                                        ? `Nenhum registro para "${filtroInsumo}"`
                                        : "Nenhum registro encontrado"}
                            </div>
                            <div className="tabela-paginacao-acoes">
                                <SeletorPaginas avancar={avancarPag} voltar={voltarPag} selecionar={selecionarPag} paginaSelecionada={paginaAtual} numPages={totalPaginas} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}