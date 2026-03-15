import { SearchIcon } from "lucide-react";
import { NavCategorias } from "./components/NavCategorias/NavCategorias";
import RotinaCard from "./components/RotinaCard/RotinaCard"
import { Search } from "./components/Search/Search";
import HeaderPadrao from "./HeaderPadrao";
import "./Rotinas.css"
import { useEffect, useState } from "react";
import { Rotinas as RotinasClass } from "./provider/Api";

export default function Rotinas() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Geral")
    const [categorias, setCategorias] = useState(["Geral", "Mercearia", "Proteinas", "Vegetais", "Graos", "Bebidas"])
    const [pesquisa, setPesquisa] = useState("")
    const [rotinas, setRotinas] = useState([])


    const pesquisar = (valor) => {
        setPesquisa(valor)
        if (valor.length > 0) {
            setCategoriaAtiva("Geral")
        }
    };

    useEffect(() => {
        RotinasClass.listar().then((response) => setRotinas(response));
    }, [])


    return (
        <div className="rotinas-container-geral">
            <HeaderPadrao />
            <div className="rotinas-container">
                <div className="nav-categorias-container">
                    <NavCategorias categoriaAtual={categoriaAtiva} aoMudarCategoria={setCategoriaAtiva} categorias={categorias} />
                    <Search Icone={SearchIcon} pesquisar={pesquisar} value={pesquisa} />
                </div>
            </div>
            <div className="rotina-container">
                <div className="rotina-grid">
                    <div className="rotinas-linhas">
                        {rotinas && (
                            rotinas.map(atual => (
                                <RotinaCard key={atual.id} nomeRotina={atual.titulo} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}