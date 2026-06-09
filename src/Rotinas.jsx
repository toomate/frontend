import { ArrowDown, ArrowLeft, ArrowUp, Save, SearchIcon, X } from "lucide-react";
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

    const abrirCard = (id) => {
        const rotina = rotinas.find(r => r.id === id);
        setCardConfirmacao(true)
        setRotinaSelecionada(rotina);
        setIdSelecionado(id)
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
        return (
            <div className="container-card">
                <div className="titulo-relatorio">
                    <div className="titulo-primario">Deseja Realizar a baixa desses insumos?</div>
                    <X className="icone-clicavel" onClick={fechar} />
                </div>
                <div className="produtos">
                    {props.insumos && props.insumos.length > 0 ? (props.insumos.map(atual => <React.Fragment key={atual.id}>
                        {console.log(atual)}
                        <div className="produto-linha">
                            <div className="produto">{atual.nome}</div><div className="info-linha"><ArrowDown size={20} style={{ color: "red" }} />{Math.abs(atual.quantidade)}{atual.unidadeMedida}</div>
                            <div className="icone-linha">
                            </div></div>
                    </React.Fragment>)) :
                        <div className="mensagem-vazio">Não há produtos!</div>}
                </div>
                <div className="botoes">
                    <Button texto={loading ? "Salvando..." : "Sim"} onClick={darBaixa} disabled={loading}></Button>
                    <Button texto={"Não"} onClick={fechar}></Button>
                </div>

            </div>
        )
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