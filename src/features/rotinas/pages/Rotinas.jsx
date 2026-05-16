import { ArrowLeft, SearchIcon } from "lucide-react";
import { NavCategorias } from "../../../components/NavCategorias/NavCategorias";
import RotinaCard from "../../../components/RotinaCard/RotinaCard"
import { Search } from "../../../shared/components/Search/Search";
import HeaderPadrao from "./HeaderPadrao";
import "./Rotinas.css"
import { useEffect, useState } from "react";
import { Rotinas as RotinasClass } from "../../../provider/Api";
import { CardConfirmacao } from "../../../shared/components/CardConfirmacao/CardConfirmacao";
import { Button } from "../../../shared/components/Button/Button";
import { useNavigate } from "react-router-dom";
import SeletorPaginas from "../../../components/Paginas/SeletorPaginas";

export default function Rotinas() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Geral")
    const [categorias, setCategorias] = useState(["Geral", "Mercearia", "Proteinas", "Vegetais", "Graos", "Bebidas"])
    const [pesquisa, setPesquisa] = useState("")
    const [pagina, setPagina] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [tamanho, setTamanho] = useState(16)
    const [cardRemocao, setCardRemocao] = useState(false)
    const [cardConfirmacao, setCardConfirmacao] = useState(false)
    const [rotinas, setRotinas] = useState([])
    const [idSelecionado, setIdSelecionado] = useState("")

    const abrirCardRemocao = (id) => {
        setCardRemocao(true)
        setIdSelecionado(id)
    }

    const voltarPag = () => {
        if (pagina > 0) {
            let pag = pagina - 1;
            setPagina(pag)
        }
    }

    const avancarPag = () => {
        if (pagina <= totalPaginas) {
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
        setCardConfirmacao(true)
        setIdSelecionado(id)
    }

    const darBaixa = async () => {
        try {
            const res = await RotinasClass.darBaixa(idSelecionado)
            console.log("resposta", res)
        } catch (err) {
            if (err.status === 400) {
                alert(err.response.data.message)
            }
        }
        setCardConfirmacao(false)
    }

    const excluirRotina = async () => {
        await RotinasClass.excluirRotina(idSelecionado)
        setCardRemocao(false)
        const response = await RotinasClass.listar(busca, pagina, tamanho);

        setRotinas(response.conteudo);
        setTotalPaginas(response.totalPaginas);
    }

    useEffect(() => {
        RotinasClass.listar(pesquisa, pagina, tamanho).then((response) => {
            setRotinas(response.conteudo);
            setTotalPaginas(response.totalPaginas)
        });
    }, [pesquisa, pagina, rotinas])

    useEffect(() => {
        document.title = "Rotinas";
    }, []);


    return (
        <div className="rotinas-container-geral">
            {cardConfirmacao && (
                <div className="escurecer">
                    <CardConfirmacao titulo={"Deseja realizar baixa?"} confirmar={() => darBaixa()} fecharCard={() => setCardConfirmacao(false)} />
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
                    <div className="botao-voltar">
                        <Button Icone={ArrowLeft} texto={"Voltar"} onClick={() => { navigate("/estoque") }} />
                    </div>   
                    <div className="ipt-pesquisar">
                        <Search Icone={SearchIcon} pesquisar={pesquisar} value={pesquisa} />
                    </div>
                </div>
            </div>
            <div className="rotina-container">
                <div className="rotinas-linhas">
                    {rotinas && (
                        rotinas.map(atual => (
                            <RotinaCard key={atual.id} darBaixa={() => abrirCard(atual.id)} nomeRotina={atual.titulo} excluir={() => abrirCardRemocao(atual.id)} />
                        ))
                    )}
                </div>
            </div>
            <div className="rotina-seletor">
                <SeletorPaginas numPages={totalPaginas} voltar={voltarPag} avancar={avancarPag} paginaSelecionada={pagina} selecionar={selecionarPag}></SeletorPaginas>
            </div>
        </div>
    )
}