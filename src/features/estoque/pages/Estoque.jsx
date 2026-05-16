import React, { useEffect, useState } from "react";
import { NavCategorias } from "../../../components/NavCategorias/NavCategorias";
import { Cabecalho } from "../../../app/layouts/Cabecalho/Cabecalho";
import { Search } from "../../../shared/components/Search/Search";
import { Save, Bookmark, SearchIcon, Plus, ScanBarcode } from "lucide-react";
import { Button } from "../../../shared/components/Button/Button";
import "./Estoque.css"
import { CategoriaApi, Lote } from "../../../provider/Api";
import { EstoqueGrupo } from "../../../components/EstoqueGrupo/EstoqueGrupo";
import { CardRelatorio } from "../../../shared/components/CardRelatorio/CardRelatorio";
import { CardConfirmacao } from "../../../shared/components/CardConfirmacao/CardConfirmacao";
import HeaderPadrao from "../../../HeaderPadrao";
import { CardRotina } from "../../../shared/components/CardRotina/CardRotina";
import { useNavigate } from "react-router-dom";
import { Rotinas } from "../../../provider/Api";


export function Estoque() {
    const [grupo, setGrupo] = useState([])
    const [categorias, setCategorias] = useState(["Geral", "Mercearia", "Proteinas", "Vegetais", "Graos", "Bebidas"])
    const [categoriaAtiva, setCategoriaAtiva] = useState("Geral")
    const [pesquisa, setPesquisa] = useState("")
    const [mudancas, setMudancas] = useState([])
    const [exibirRelatorio, setExibirRelatorio] = useState(false);
    const [cardRemocao, setCardRemocao] = useState(false);
    const [cardRotina, setCardRotina] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState(0);
    const [titulo, setTitulo] = useState("")
    const [dropdownAbertoId, setDropdownAbertoId] = useState(null);
    const [maxCategoriasFixas, setMaxCategoriasFixas] = useState(0);
    const [loading, setLoading] = useState({rotina: false, relatorio: false});

    const calcularDeficit = (item) => {
        const qtdMinima = Number(item?.qtdMinima ?? 0);
        const qtdTotal = Number(item?.qtdTotal ?? 0);

        if (!Number.isFinite(qtdMinima) || !Number.isFinite(qtdTotal)) {
            return 0;
        }

        return qtdMinima - qtdTotal;
    };

    const calcularRazaoEstoqueMinimo = (item) => {
        const qtdMinima = Number(item?.qtdMinima ?? 0);
        const qtdTotal = Number(item?.qtdTotal ?? 0);

        if (!Number.isFinite(qtdMinima) || !Number.isFinite(qtdTotal)) {
            return Number.POSITIVE_INFINITY;
        }

        if (qtdMinima <= 0) {
            return Number.POSITIVE_INFINITY;
        }

        return qtdTotal / qtdMinima;
    };

    const grupoOrdenado = [...grupo].sort((a, b) => {
        const razaoA = calcularRazaoEstoqueMinimo(a);
        const razaoB = calcularRazaoEstoqueMinimo(b);

        if (razaoA !== razaoB) {
            return razaoA - razaoB;
        }

        const deficitA = calcularDeficit(a);
        const deficitB = calcularDeficit(b);

        if (deficitA !== deficitB) {
            return deficitB - deficitA;
        }

        const nomeA = String(a?.insumo ?? "");
        const nomeB = String(b?.insumo ?? "");
        return nomeA.localeCompare(nomeB, "pt-BR");
    });


    const abrirDropdown = (idLote) => {
        setDropdownAbertoId(prev => prev === idLote ? null : idLote);
    }


    const navigate = useNavigate();

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
        setCardRemocao(true)
        setIdSelecionado(id)
    }

    const abrirCardRotina = () => {
        if (mudancas.length <= 0) {
            alert("nenhuma mudança")
            return
        }

        setCardRotina(true)
    }

    const criarRotina = async (titulo) => {
        try {
            setLoading({rotina: true})
            const res = await Rotinas.criar(titulo)
            const id = res.id;
            const insumosRotina = mudancas.map(atual => ({
                insumoId: atual.insumoId,
                quantidadeMedida: Math.abs(atual.diferenca)
            }))
            await Rotinas.associarInsumos(id, insumosRotina)
            setCardRotina(false)
        } catch (err) {
            console.error(err)
            throw error;
        } finally {
            setLoading({ rotina: false })
        }
    }


    const salvarAlteracoes = async () => {
        try {
            setLoading({relatorio: true})
            await Lote.atualizarQuantidade(mudancas)
            await Lote.dynamicGetEstoque(categoriaAtiva, pesquisa).then((res) => setGrupo(res))
            setExibirRelatorio(false)
            setMudancas([])
        } catch (error) {
            console.error("Erro ao salvar alterações:", error)
            throw error;
        } finally {
            setLoading({ relatorio: false })
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
        let idInsumo = null;
        let diferenca = null;
        const novoGrupo = grupo.map(item => {
            const itensAtualizados = item.itens.map(atual => {
                if (atual.idLote === idLote) {
                    novaQtd = operacao === 'somar'
                        ? atual.quantidadeMedida + 1
                        : atual.quantidadeMedida - 1

                    if (novaQtd < 0) novaQtd = 0;

                    diferenca = novaQtd - atual.quantidadeMedida
                    nomeProduto = atual.nomeMarca
                    idInsumo = atual.idInsumo

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
                        ? {
                            ...m, quantidadeMedida: novaQtd,
                            diferenca: m.diferenca + diferenca
                        }
                        : m
                )
            }

            return [
                ...prev,
                {
                    id: idLote,
                    insumoId: idInsumo,
                    produto: nomeProduto,
                    quantidadeMedida: novaQtd,
                    diferenca: diferenca
                }
            ]
        })
    }

    useEffect(() => {
        document.title = "Estoque";
    }, []);

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
            });
    }, [])

    useEffect(() => {
        function handleClickFora(event) {
            if (!event.target.closest(".botao-cadastrar")) {
                setDropdownAbertoId(null);
            }
        }

        document.addEventListener("mousedown", handleClickFora);

        return () => {
            document.removeEventListener("mousedown", handleClickFora);
        };
    }, []);

    function ButtonPlus() {
        return (
            
            <div className="plus-container">
                <div className="plus-icon-container">
                    Adicionar Insumo 
                    <div className="plus-icon"><Plus onClick={() => { navigate("/cadastro-insumo") }} />
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        const mobile = window.matchMedia("(max-width: 480px)");

        const update = () => {
            if (mobile.matches) setMaxCategoriasFixas(0);
            else setMaxCategoriasFixas(10);
        };

        update();

        mobile.addEventListener("change", update);

        return () => {
            mobile.removeEventListener("change", update);
        };
    }, []);

    return (
        <div className="estoque-container">
            {exibirRelatorio && (
                <div className="escurecer">
                    <CardRelatorio props={mudancas}
                        fechar={() => setExibirRelatorio(false)} salvarAlteracoes={salvarAlteracoes} loading={loading.relatorio} abrirCardRemocao={abrirCardRemocao} abrirCardRotina={abrirCardRotina} />
                </div>
            )}
            {cardRemocao && (
                <div className="escurecer">
                    <CardConfirmacao titulo={"Deseja descartar as alterações?"} fecharCard={() => { setCardRemocao(false) }} confirmar={removerAlteracao} />
                </div>
            )}

            {cardRotina && (
                <div className="escurecer">
                    <CardRotina setTitulo={setTitulo} salvarRotina={() => { criarRotina(titulo) }} loading={loading.rotina} fecharCard={() => { setCardRotina(false) }} />
                </div>
            )}
            <div className="nav-header">
                <HeaderPadrao />
            </div>
            <div className="categoria-container">
                <div className="button-secund">
                    <div className="botoes-container">
                        <ButtonPlus />
                        <Button texto="Rotinas" Icone={Bookmark} onClick={() => { navigate("/rotinas") }} />
                        <Button onClick={abrirCard} texto="Salvar" Icone={Save} />
                        <div className="botoes-container-icon">
                            QR Code
                            <ScanBarcode style={{cursor: "pointer"}} color="black" size={28} 
                            onClick={() => { navigate("/leitor") }} />
                        </div>
                        <div className="container-search">
                            <Search Icone={SearchIcon} pesquisar={pesquisar} value={pesquisa} />
                        </div>
                    </div>
                </div>
                <div className="nav-categorias-container">
                    <NavCategorias categoriaAtual={categoriaAtiva} aoMudarCategoria={setCategoriaAtiva} categorias={categorias} maxCategoriasFixas={maxCategoriasFixas} />
                </div>
                <div className="insumos-container">
                    <Cabecalho elementos={["Insumo", "Qtd. Mínima", "Qtd. Total", "Un. de Medida", "Data de Vencimento", "Controle"]} />
                    <div className="grupo-insumos-container">
                        {grupoOrdenado.length > 0 ? grupoOrdenado.map(atual => (
                            <EstoqueGrupo key={atual.fkInsumo} grupo={atual} alterarValor={alterarQuantidade} abrirDropdown={abrirDropdown}
                                dropdownAbertoId={dropdownAbertoId}
                            />
                        )) : <div className="mensagemErro">Não há produtos cadastrados!</div>}
                    </div>
                </div>
            </div>
        </div>
    )


}
