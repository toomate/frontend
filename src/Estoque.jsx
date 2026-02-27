import React, { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar/Navbar";
import { NavCategorias } from "./components/NavCategorias/NavCategorias";
import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import { Search } from "./components/Search/Search";
import { Save, Bookmark, SearchIcon, Plus, ScanBarcode } from "lucide-react";
import { Button } from "./components/Button/Button";
import "./Estoque.css"
import { CategoriaApi, Lote } from "./provider/Api";
import { EstoqueGrupo } from "./components/EstoqueGrupo/EstoqueGrupo";
import { CardRelatorio } from "./components/CardRelatorio/CardRelatorio";
import { CardConfirmacao } from "./components/CardConfirmacao/CardConfirmacao";

export function Estoque() {
    const [grupo, setGrupo] = useState([])
    const [categorias, setCategorias] = useState(["Geral", "Mercearia", "Proteinas", "Vegetais", "Graos", "Bebidas"])
    const [categoriaAtiva, setCategoriaAtiva] = useState("Geral")
    const [pesquisa, setPesquisa] = useState("")
    const [mudancas, setMudancas] = useState([])
    const [exibirRelatorio, setExibirRelatorio] = useState(false);
    const [cardRemocao, setCardRemocao] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState(0);

    const pesquisar = (valor) => {
        setPesquisa(valor)
        if (valor.length > 0) {
            setCategoriaAtiva("Geral")
        }
    };


    const abrirCard = () => {
        setExibirRelatorio(true)
    }

    const abrirCardRemocao = (id) => {
        console.log("aqui")
        setCardRemocao(true)
        console.log(cardRemocao)
        setIdSelecionado(id)
        console.log(idSelecionado)
    }

    const salvarAlteracoes = async () => {
        try {
            await Lote.atualizarQuantidade(mudancas)
            await Lote.dynamicGetEstoque(categoriaAtiva, pesquisa).then((res) => setGrupo(res))
            setExibirRelatorio(false)
        } catch (error) {
            console.error("Erro ao salvar alterações:", error)
            throw error;
        }
    }

    const removerAlteracao = () => {
        const novoArray = mudancas.filter((e) => e.id !== Number(idSelecionado))
        setMudancas(novoArray)
        setCardRemocao(false)
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
        Lote.dynamicGetEstoque(categoriaAtiva, pesquisa).then((res) => setGrupo(res));
    }, [categoriaAtiva, pesquisa])

    useEffect(() => {
        CategoriaApi.listar()
            .then((response) => {
                const lista = Array.isArray(response) ? response : response?.categorias ?? [];
                const normalizada = lista
                    .map((item) => typeof item === "string" ? item : item?.nome ?? item?.categoria ?? item?.descricao ?? "")
                    .map((item) => item.trim())
                    .filter(Boolean);

                if (normalizada.length > 0) {
                    setCategorias(["Geral", ...new Set(normalizada.filter((item) => item !== "Geral"))])
                }
            })
            .catch(() => {
                // Mantem fallback local caso a API de categorias falhe.
            });
    }, [])

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
                        fechar={() => setExibirRelatorio(false)} salvarAlteracoes={salvarAlteracoes} abrirCardRemocao={abrirCardRemocao} />
                </div>
            )}
            {cardRemocao && (
                <div className="escurecer">
                    <CardConfirmacao titulo={"Deseja descartar as alterações?"} fecharCard={() => {setCardRemocao(false)}} confirmar={removerAlteracao} />
                </div>
            )}
            <div className="nav-header">
                <Navbar />
            </div>
            <div className="categoria-container">

                <div className="nav-categorias-container">
                    <NavCategorias categoriaAtual={categoriaAtiva} aoMudarCategoria={setCategoriaAtiva} categorias={categorias} />
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
