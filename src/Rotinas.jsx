import { SearchIcon } from "lucide-react";
import { NavCategorias } from "./components/NavCategorias/NavCategorias";
import RotinaCard from "./components/RotinaCard/RotinaCard"
import { Search } from "./components/Search/Search";
import HeaderPadrao from "./HeaderPadrao";
import "./Rotinas.css"
import { useState } from "react";

export default function Rotinas() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Geral")
    const [categorias, setCategorias] = useState(["Geral", "Mercearia", "Proteinas", "Vegetais", "Graos", "Bebidas"])
    const [pesquisa, setPesquisa] = useState("")


    const pesquisar = (valor) => {
        setPesquisa(valor)
        if (valor.length > 0) {
            setCategoriaAtiva("Geral")
        }
    };


    return (
        <div className="rotinas-container-geral">
            <HeaderPadrao />
            <div className="rotinas-container">
                <div className="rotina-wrapper">
                    <div className="rotina-toolbar">
                        <NavCategorias categoriaAtual={categoriaAtiva} aoMudarCategoria={setCategoriaAtiva} categorias={categorias} />
                        <Search Icone={SearchIcon} pesquisar={pesquisar} value={pesquisa} />
                    </div>
                </div>
                <div className="rotina-container">
                    <div className="rotina-grid">
                        <div className="rotinas-linhas">
                            <RotinaCard nomeRotina="Rotina 1" />
                            <RotinaCard nomeRotina="Rotina 2" />
                            <RotinaCard nomeRotina="Rotina 2" />
                            <RotinaCard nomeRotina="Rotina 3" />
                            <RotinaCard nomeRotina="Rotina 3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}