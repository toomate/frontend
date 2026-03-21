import { SearchIcon } from "lucide-react";
import { NavCategorias } from "./components/NavCategorias/NavCategorias";
import RotinaCard from "./components/RotinaCard/RotinaCard"
import { Search } from "./components/Search/Search";
import HeaderPadrao from "./HeaderPadrao";
import "./Rotinas.css"
import { useEffect, useState } from "react";
import { Rotinas as RotinasClass } from "./provider/Api";
import { CardConfirmacao } from "./components/CardConfirmacao/CardConfirmacao";

export default function Rotinas() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Geral")
    const [categorias, setCategorias] = useState(["Geral", "Mercearia", "Proteinas", "Vegetais", "Graos", "Bebidas"])
    const [pesquisa, setPesquisa] = useState("")
    const [cardRemocao, setCardRemocao] = useState(false)
    const [cardConfirmacao, setCardConfirmacao] = useState(false)
    const [rotinas, setRotinas] = useState([])
    const [idSelecionado, setIdSelecionado] = useState("")

    const abrirCardRemocao = (id) => {
        setCardRemocao(true)
        setIdSelecionado(id)
    }

    const pesquisar = (valor) => {
        setPesquisa(valor)
    };

    const abrirCard = (id) => {
        setCardConfirmacao(true)
        setIdSelecionado(id)
    }

    const darBaixa = async () => {
        try {
            await RotinasClass.darBaixa(idSelecionado)
        } catch (err) {
            if(err.status === 400){
                alert(err.response.data.message)
            }
        }
        setCardConfirmacao(false)
    }

    const excluirRotina = () => {
        RotinasClass.excluirRotina(idSelecionado)
        setCardRemocao(false)
        setRotinas(rotinas.filter(rotina => rotina.id !== idSelecionado));
    }

    useEffect(() => {
        RotinasClass.listar(pesquisa).then((response) => setRotinas(response));
    }, [pesquisa])


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
                    <NavCategorias categoriaAtual={categoriaAtiva} aoMudarCategoria={setCategoriaAtiva} categorias={categorias} />
                    <Search Icone={SearchIcon} pesquisar={pesquisar} value={pesquisa} />
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
        </div>
    )
}