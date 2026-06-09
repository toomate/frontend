import { ArrowDown, ArrowLeft, ArrowUp, Save, SearchIcon, X, Package} from "lucide-react";
import { NavCategorias } from "./components/NavCategorias/NavCategorias";
import RotinaCard from "./components/RotinaCard/RotinaCard"
import { Search } from "./components/Search/Search";
import HeaderPadrao from "./HeaderPadrao";
import "./Rotinas.css"
import { useEffect, useState } from "react";
import { Rotinas as RotinasClass } from "./provider/Api";
import { CardConfirmacao } from "./components/CardConfirmacao/CardConfirmacao";
import { Button } from "./components/Button/Button";
import React from "react";
import { useNavigate } from "react-router-dom";
import SeletorPaginas from "./components/Paginas/SeletorPaginas";
import { CardRelatorio } from "./components/CardRelatorio/CardRelatorio";

export default function Rotinas() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Geral")
    const [categorias, setCategorias] = useState(["Geral", "Mercearia", "Proteinas", "Vegetais", "Graos", "Bebidas"])
    const [pesquisa, setPesquisa] = useState("")
    const [insumosGrupo, setInsumosGrupo] = useState([])
    const [pagina, setPagina] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [ordenacao, setOrdenacao] = useState("alfabetica")
    const [cardRemocao, setCardRemocao] = useState(false)
    const [cardConfirmacao, setCardConfirmacao] = useState(false)
    const [rotinas, setRotinas] = useState([])
    const [idSelecionado, setIdSelecionado] = useState("")
    const [rotinaSelecionada, setRotinaSelecionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const tamanho = useTamanhoPagina({ mobile: 4, tablet: 8, desktop: 12 });

    const abrirCardRemocao = (id) => {
        setCardRemocao(true)
        setIdSelecionado(id)
    }

    useEffect(() => {
        setPagina(0);
    }, [tamanho]);

    const voltarPag = () => {
        if (pagina > 0) {
            let pag = pagina - 1;
            setPagina(pag)
        }
    }

    const avancarPag = () => {
        if (pagina < totalPaginas - 1) {
            let pag = pagina + 1;
            setPagina(pag)
        }
    }

    const selecionarPag = (numPag) => {
        setPagina(numPag);
    }

    const navigate = useNavigate();

    const pesquisar = (valor) => {
        setPesquisa(valor)
    };

    const abrirCard = async (id) => {
        const rotina = rotinas.find(r => r.id === id);
        setCardConfirmacao(true)
        setIdSelecionado(id)
        const preview = await mostrarPreview(id);

        setRotinaSelecionada(preview);

    }

    const darBaixa = async () => {
        try {
            setLoading(true)
            const res = await RotinasClass.darBaixa(idSelecionado)
            console.log("resposta", res)
        } catch (err) {
            if (err.status === 400) {
                alert(err.response.data.message)
            }
        } finally {
            setLoading(false)
        }
        setCardConfirmacao(false)
    }

    const excluirRotina = async () => {
        await RotinasClass.excluirRotina(idSelecionado)
        setCardRemocao(false)
        const response = await RotinasClass.listar(pesquisa, pagina, tamanho);

        setRotinas(response.conteudo);
        setTotalPaginas(response.totalPaginas);
    }

    const mostrarPreview = async (id) => {
        const response = await RotinasClass.mostrarPreview(id);
        return response;
    }

    useEffect(() => {
        RotinasClass.listar(pesquisa, pagina, tamanho).then((response) => {
            setRotinas(response.conteudo);
            setTotalPaginas(response.totalPaginas);
        });
    }, [pesquisa, pagina, tamanho])

    useEffect(() => {
        document.title = "Rotinas";
    }, []);


    function RelatorioRotina({ props = [], fechar, confirmar, loading }) {
        const formatarData = (data) => {
            if (!data) return '';
            const match = String(data).match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (match) return `${match[3]}/${match[2]}/${match[1]}`;
            return String(data);
        };
        const itensComLote = props?.itens?.filter((item) => item?.lotes?.length > 0) ?? [];

        return (
            <div className="rr-overlay">
                <div className="rr-modal" role="dialog" aria-modal="true" aria-labelledby="rr-titulo">

                    <div className="rr-header">
                        <p className="rr-titulo" id="rr-titulo">
                            Deseja realizar a baixa desses insumos?
                        </p>
                        <button className="rr-fechar" onClick={fechar} aria-label="Fechar">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="rr-body">
                        {itensComLote.length === 0 ? (
                            <div className="rr-vazio">Nenhum insumo com estoque disponível.</div>
                        ) : (
                            itensComLote.map((item) => (
                                <div className="rr-card" key={item.insumoId}>

                                    <div className="rr-card-header">
                                        <span className="rr-insumo-nome">{item.nomeInsumo}</span>
                                        <span className="rr-total">
                                            <ArrowDown size={13} aria-hidden="true" />
                                            {item.quantidadeNecessaria}&nbsp;{item.unidadeMedida} do estoque
                                        </span>
                                    </div>

                                    <div className="rr-lotes">
                                        {item.lotes.map((lote) => (
                                            <div className="rr-lote-row" key={lote.loteId}>
                                                <div className="rr-lote-info">
                                                    <Package size={13} className="rr-lote-icone" aria-hidden="true" />
                                                    <span className="rr-lote-marca">{lote.marca}</span>
                                                    <span className="rr-lote-validade">
                                                        venc.&nbsp;{formatarData(lote.validade)}
                                                    </span>
                                                </div>
                                                <span className="rr-lote-qtd">
                                                    {lote.quantidadeConsumida}&nbsp;{lote.unidadeMedida}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            ))
                        )}
                    </div>

                    <div className="rr-footer">
                        <Button className="rr-btn rr-btn-cancelar" texto={"Não"} onClick={fechar} disabled={loading}/>
                        <Button className="rr-btn rr-btn-confirmar" texto={loading ? "Salvando..." : "Sim"} onClick={confirmar} disabled={loading}/>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="rotinas-container-geral">
            {cardConfirmacao && (
                <div className="escurecer">
                    <RelatorioRotina props={rotinaSelecionada} confirmar={() => darBaixa()} fechar={() => setCardConfirmacao(false)} loading={loading} />
                </div>
            )}
            {cardRemocao && (
                <div className="escurecer">
                    <CardConfirmacao titulo={"Deseja excluir a rotina?"} confirmar={() => excluirRotina()} fecharCard={() => setCardRemocao(false)} />
                </div>
            )}
            <HeaderPadrao />
            <div className="rotinas-container">
                <div className="nav-categorias-container">
                    {/* <div className="botao-voltar">
                        <Button Icone={ArrowLeft} texto={"Voltar"} onClick={() => { navigate("/estoque") }} />
                    </div> */}
                    <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className="fornecedores-select">
                        <option value="alfabetica">A → Z</option>
                        <option value="alfabetica_desc">Z → A</option>
                    </select>
                    <div className="ipt-pesquisar">
                        <Search Icone={SearchIcon} pesquisar={pesquisar} value={pesquisa} />
                    </div>
                </div>
            </div>
            <div className="rotina-container">
                <div className="rotinas-linhas">
                    {rotinas && [...rotinas]
                        .sort((a, b) => {
                            const t1 = a?.titulo ?? "";
                            const t2 = b?.titulo ?? "";

                            if (ordenacao === "alfabetica_desc") {
                                return t2.localeCompare(t1); // Z → A
                            }

                            return t1.localeCompare(t2); // A → Z (padrão)
                        })
                        .map(atual => (
                            <RotinaCard key={atual.id} darBaixa={() => abrirCard(atual.id)} nomeRotina={atual.titulo} excluir={() => abrirCardRemocao(atual.id)} />
                        ))
                    }
                </div>
            </div>
            <div className="rotina-seletor">
                <SeletorPaginas numPages={totalPaginas} voltar={voltarPag} avancar={avancarPag} paginaSelecionada={pagina} selecionar={selecionarPag}></SeletorPaginas>
            </div>
        </div>
    )


}

export function useTamanhoPagina({ mobile = 4, tablet = 8, desktop = 12 } = {}) {
    function calcular() {
        const w = window.innerWidth;
        if (w <= 768) return mobile;
        if (w <= 1024) return tablet;
        return desktop;
    }

    const [tamanho, setTamanho] = useState(calcular);

    useEffect(() => {
        function aoRedimensionar() {
            setTamanho(calcular());
        }

        window.addEventListener("resize", aoRedimensionar);
        return () => window.removeEventListener("resize", aoRedimensionar);
    }, []);

    return tamanho;
}