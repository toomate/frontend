import React, { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar/Navbar";
import { NavCategorias } from "./components/NavCategorias/NavCategorias";
import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import { Search } from "./components/Search/Search";
import { Save, Bookmark, SearchIcon, Plus, ScanBarcode } from "lucide-react";
import { Button } from "./components/Button/Button";
import "./Estoque.css"
import { EstoqueGrupo } from "./components/EstoqueGrupo/EstoqueGrupo";
import { api } from "./provider/Api";

export function Estoque() {
    const [grupo, setGrupo] = useState([])
    const [categoriaAtiva, setCategoriaAtiva] = useState("Geral")
    const parametro = categoriaAtiva === "Geral" ? "" : `/${categoriaAtiva}`

    useEffect(() => {
        api.get(`/lotes/estoque${parametro}`)
        .then((res) => {
            console.log("console", res.data)
            setGrupo(res.data)
        })
    }, [categoriaAtiva])

    function ButtonPlus() {
        return (
            <div className="plus-container">
                <div className="plus-icon-container">
                    <div className="plus-icon"><Plus color="#F8ECC6" /></div>
                </div>
            </div>
        )
    }

    return (
        <div className="estoque-container">
            <div className="nav-header">
                <Navbar />
            </div>
            <div className="categoria-container">
                <div className="nav-categorias-container">
                    <NavCategorias categoriaAtual={categoriaAtiva} aoMudarCategoria={setCategoriaAtiva} />
                </div>
                <div className="botoes-container">
                    <Search Icone={SearchIcon} />
                    <ButtonPlus />
                    <Button texto="Rotinas" Icone={Bookmark} />
                    <Button texto="Salvar" Icone={Save} />
                    <ScanBarcode color="black" size={30} />
                </div>
                <div className="insumos-container">
                    <Cabecalho elementos={["Insumo", "Qtd. Total", "Un. de Medida", "Data de Vencimento", "Controle"]} />
                    {grupo.length > 0 ? grupo.map(atual => (
                        <EstoqueGrupo key={atual.fkInsumo} grupo={atual}/>
                    )) : <div className="mensagemErro">Não há produtos cadastrados!</div>}
                </div>
            </div>
        </div>
    )


}