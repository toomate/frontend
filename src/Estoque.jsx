import React, { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar/Navbar";
import { NavCategorias } from "./components/NavCategorias/NavCategorias";
import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import { Search } from "./components/Search/Search";
import { Save, Bookmark, SearchIcon, Plus, ScanBarcode } from "lucide-react";
import { Button } from "./components/Button/Button";
import "./Estoque.css"
import { EstoqueGrupo } from "./components/EstoqueGrupo/EstoqueGrupo";
import { api, dynamicGetEstoque } from "./provider/Api";
import { CardRelatorio } from "./components/CardRelatorio/CardRelatorio";

export function Estoque() {
    const [grupo, setGrupo] = useState([])
    const [categoriaAtiva, setCategoriaAtiva] = useState("Geral")
    const [pesquisa, setPesquisa] = useState("")
    const [mudancas, setMudancas] = useState([])
    const [exibirRelatorio, setExibirRelatorio] = useState(false);

    const pesquisar = (valor) => {
        setPesquisa(valor)
        if (valor.length > 0) {
            setCategoriaAtiva("Geral")
        }
    };


    const abrirCard = () => {
        setExibirRelatorio(true)
    }

    const alterarQuantidade = (idLote, operacao) => {
        let novaQtd = null;
        let nomeProduto = null;

        const novoGrupo = grupo.map(item => {
            const itensAtualizados = item.itens.map(atual => {
                if (atual.idLote === idLote) {
                    novaQtd = operacao === 'somar' ? atual.quantidadeMedida + 1 : atual.quantidadeMedida - 1
                    nomeProduto = atual.nomeMarca

                    return {
                        ...atual,
                        quantidadeMedida: novaQtd
                    }

                }
                return atual
            })
            return { ...item, itens: itensAtualizados }
        })
        setGrupo(novoGrupo)

        setMudancas(prev => {
            const existente = prev.find(m => m.id === idLote)
            if (existente) {
                return prev.map(m =>
                    m.id === idLote
                        ? { ...m, quantidadeMedida: novaQtd }
                        : m
                )
            }

            return [
                ...prev,
                {
                    id: idLote,
                    produto: nomeProduto,
                    quantidadeMedida: novaQtd
                }
            ]
        })
    }

    useEffect(() => {
        dynamicGetEstoque(categoriaAtiva, pesquisa).then((res) => setGrupo(res));
    }, [categoriaAtiva, pesquisa])

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
            {exibirRelatorio && (
                <div className="escurecer">
                    <CardRelatorio props={mudancas}
                        fechar={() => setExibirRelatorio(false)} />
                </div>
            )}  
            <div className="nav-header">
                <Navbar />
            </div>
            <div className="categoria-container">
                
                <div className="nav-categorias-container">
                    <NavCategorias categoriaAtual={categoriaAtiva} aoMudarCategoria={setCategoriaAtiva} />
                </div>
                <div className="botoes-container">
                    <Search Icone={SearchIcon} pesquisar={pesquisar} value={pesquisa} />
                    <ButtonPlus />
                    <Button texto="Rotinas" Icone={Bookmark} />
                    <Button onClick={abrirCard} texto="Salvar" Icone={Save} />
                    <ScanBarcode color="black" size={30} />
                </div>
                <div className="insumos-container">
                    <Cabecalho elementos={["Insumo", "Qtd. Total", "Un. de Medida", "Data de Vencimento", "Controle"]} />
                    {grupo.length > 0 ? grupo.map(atual => (
                        <EstoqueGrupo key={atual.fkInsumo} grupo={atual} alterarValor={alterarQuantidade} />
                    )) : <div className="mensagemErro">Não há produtos cadastrados!</div>}
                </div>
            </div>
        </div>
    )


}