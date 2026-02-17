import React, { useState } from "react";
import { Navbar } from "./components/Navbar/Navbar";
import { NavCategorias } from "./components/NavCategorias/NavCategorias";
import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import { Search } from "./components/Search/Search";
import { Save, Bookmark, SearchIcon, Plus, ScanBarcode } from "lucide-react";
import { Button } from "./components/Button/Button";
import "./Estoque.css"
import { EstoqueGrupo } from "./components/EstoqueGrupo/EstoqueGrupo";
import { EstoqueItem } from "./components/EstoqueItem/EstoqueItem";

export function Estoque() {

    const dados = [
        {
            id: 1,
            insumo: "Arroz",
            qtd: 13,
            medida: "KG",
            dtVencimento: "10/07/2004",
            itens: [
                {
                    id: 10,
                    nome: "Tio João",
                    qtd: 13,
                    medida: "KG",
                    dtVencimento: "10/07/2004",
                    estoque: 12
                }
            ]
        },
        {
            id: 2,
            insumo: "Feijão",
            qtd: 113,
            medida: "KG",
            dtVencimento: "11/07/2004",
            itens: [
                {
                    id: 10,
                    nome: "Camil",
                    qtd: 13,
                    medida: "KG",
                    dtVencimento: "10/07/2004",
                    estoque: 12
                }
            ]
        }
    ]


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
                    <NavCategorias />
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
                    {dados.map(dado => (
                        <EstoqueGrupo key={dado.id} grupo={dado}/>
                    ))}
                </div>
            </div>
        </div>
    )


}