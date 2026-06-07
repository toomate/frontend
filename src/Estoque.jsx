import React, { useCallback, useEffect, useState } from "react";
import { NavCategorias } from "./components/NavCategorias/NavCategorias";
import { Cabecalho } from "./components/Cabecalho/Cabecalho";
import { Search } from "./components/Search/Search";
import { Save, Bookmark, SearchIcon, Plus, ScanBarcode } from "lucide-react";
import { Button } from "./components/Button/Button";
import "./Estoque.css"
import { CategoriaApi, Lote, insumos } from "./provider/Api";
import { EstoqueGrupo } from "./components/EstoqueGrupo/EstoqueGrupo";
import { CardRelatorio } from "./components/CardRelatorio/CardRelatorio";
import { CardConfirmacao } from "./components/CardConfirmacao/CardConfirmacao";
import HeaderPadrao from "./HeaderPadrao";
import { CardRotina } from "./components/CardRotina/CardRotina";
import { useNavigate } from "react-router-dom";
import { Rotinas } from "./provider/Api";
import SeletorPaginas from "./components/Paginas/SeletorPaginas"


export function Estoque() {
    const [grupoMax, setGrupoMax] = useState([])
    const [grupo, setGrupo] = useState([])
    const [categorias, setCategorias] = useState([
        "Geral",
        "Proteínas",
        "Hortifruti",
        "Frios e Embutidos",
        "Temperos e Condimentos",
        "Bebidas",
        "Pescados",
        "Laticínios",
        "Grãos e Secos",
        "Óleos e Gorduras",
    ])
    const [categoriasAtivas, setCategoriasAtivas] = useState([])
    const [pesquisa, setPesquisa] = useState("")
    const [mudancas, setMudancas] = useState([])
    const [exibirRelatorio, setExibirRelatorio] = useState(false);
    const [cardRemocao, setCardRemocao] = useState(false);
    const [cardExclusao, setCardExclusao] = useState(false);
    const [cardRotina, setCardRotina] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState(0);
    const [idInsumoSelecionado, setIdInsumoSelecionado] = useState(0);
    const [titulo, setTitulo] = useState("")
    const [dropdownAbertoId, setDropdownAbertoId] = useState(null);
    const [loading, setLoading] = useState({ rotina: false, relatorio: false, exclusao: false });
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [pagina, setPagina] = useState(0);

    const carregarEstoque = useCallback(async () => {
        if (categoriasAtivas.length >= 2) {
            const respostas = await Promise.all(
                categoriasAtivas.map((cat) => Lote.dynamicGetEstoque(cat, pesquisa, 0))
            );
            const vistos = new Set();
            const todos = respostas
                .flatMap((r) => (Array.isArray(r?.conteudo) ? r.conteudo : Array.isArray(r) ? r : []))
                .filter((item) => {
                    const chave = item?.fkInsumo;
                    if (chave == null || vistos.has(chave)) return false;
                    vistos.add(chave);
                    return true;
                });
            setGrupo(todos);
            setGrupoMax(todos);
            setTotalPaginas(0);
            return todos;
        }

        const categoria = categoriasAtivas[0] ?? "Geral";
        const dados = await Lote.dynamicGetEstoque(categoria, pesquisa, pagina);
        if (dados?.total > 0) {
            setGrupo(dados.conteudo);
            setGrupoMax(dados.conteudo);
            setTotalPaginas(dados.totalPaginas);
            return dados.conteudo;
        }
        setGrupo([]);
        setGrupoMax([]);
        setTotalPaginas(0);
        return [];
    }, [categoriasAtivas, pesquisa, pagina]);


    const abrirCardExclusao = (idInsumo) => {
        setIdInsumoSelecionado(idInsumo);
        setCardExclusao(true);
    }

    const abrirDropdown = (idLote) => {
        setDropdownAbertoId(prev => prev === idLote ? null : idLote);
    }

    const navigate = useNavigate();

    const pesquisar = (valor) => {
        setPesquisa(valor)
        if (valor.length > 0) {
            setCategoriasAtivas([])
        }
    };

    const alternarCategoria = (categoria) => {
        if (categoria === "Geral") {
            setCategoriasAtivas([])
            setPagina(0)
            return
        }
        setCategoriasAtivas((atual) => {
            const proxima = atual.includes(categoria)
                ? atual.filter((c) => c !== categoria)
                : [...atual, categoria]
            return proxima
        })
        setPagina(0)
    }

    const limparCategorias = () => {
        setCategoriasAtivas([])
        setPagina(0)
    }

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
            console.log("mudancas", mudancas)
            setLoading({ rotina: true })
            const res = await Rotinas.criar(titulo)
            const id = res.id;
            const insumosRotina = mudancas.map(atual => ({
                insumoId: atual.insumoId,
                quantidadeInsumo: Math.abs(atual.diferenca) * atual.quantidadeMedida,
                unidadeMedida: atual.unidadeMedida
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

    const excluirInsumo = async (idInsumo) => {
        try {
            setLoading({ exclusao: true })
            await insumos.excluirInsumo(idInsumo);
            await carregarEstoque()

            setCardExclusao(false);
            setIdSelecionado(null);
        } catch (error) {
            console.error("Erro ao excluir insumo:", error)
            throw error;
        } finally {
            setLoading({ exclusao: false })
        }
    }


    const salvarAlteracoes = async () => {
        try {
            setLoading({ relatorio: true })
            await Lote.atualizarQuantidade(mudancas)
            await carregarEstoque()
            setExibirRelatorio(false)
            setMudancas([])
        } catch (error) {
            console.error("Erro ao salvar alterações:", error)
            throw error;
        } finally {
            setLoading({ relatorio: false })
        }
    }

    const recalcularGrupo = (mudancasAtualizadas) => {
        let novoGrupo = JSON.parse(JSON.stringify(grupoMax))

        mudancasAtualizadas.forEach(m => {
            novoGrupo = novoGrupo.map(item => ({
                ...item,
                itens: item.itens.map(i =>
                    i.idLote === m.id
                        ? { ...i, quantidadeTotal: m.quantidadeTotal }
                        : i
                )
            }))
        })

        setGrupo(novoGrupo)
    }

    const removerAlteracao = () => {
        const novoArray = mudancas.filter((e) => e.id !== Number(idSelecionado))
        setMudancas(novoArray)
        recalcularGrupo(novoArray)
        setCardRemocao(false)
    }

    const obterItemLote = (listaGrupos, idLote) => {
        return listaGrupos.find((item) => item.itens.some((atual) => atual.idLote === idLote))
            ?.itens.find((atual) => atual.idLote === idLote);
    }
 

    const qtdMaxima = (idLote) => {
        const item = obterItemLote(grupoMax, idLote);
        return item ? Number(item.quantidadeTotal) : null;
    }

    const alterarQuantidade = (idLote, operacao) => {
        let novaQtd = null;
        let nomeProduto = null;
        let idInsumo = null;
        let diferenca = null;
        let unidadeMedida = null;
        let quantidadeMedida = null;
        const quantidadeMaxima = qtdMaxima(idLote);

        const novoGrupo = grupo.map(item => {
            const itensAtualizados = item.itens.map(atual => {
                if (atual.idLote === idLote) {
                    const quantidadeAtual = Number(atual.quantidadeTotal ?? 0);
                    const quantidadeSolicitada = operacao === "somar"
                        ? quantidadeAtual + 1
                        : operacao === "subtrair"
                            ? quantidadeAtual - 1
                            : Number(operacao);

                    novaQtd = Number.isFinite(quantidadeSolicitada)
                        ? quantidadeSolicitada
                        : quantidadeAtual;

                    if (novaQtd < 0) novaQtd = 0;

                    if (Number.isFinite(quantidadeMaxima)) {
                        novaQtd = Math.min(novaQtd, quantidadeMaxima);
                    }

                    diferenca = novaQtd - quantidadeAtual;

                    nomeProduto = atual.nomeMarca
                    idInsumo = atual.idInsumo
                    unidadeMedida = atual.unidadeMedida
                    quantidadeMedida = atual.quantidadeMedida

                    return {
                        ...atual,
                        quantidadeTotal: novaQtd
                    }

                }
                return atual
            })

            return { ...item, itens: itensAtualizados }
        })
        setGrupo(novoGrupo)
        if (diferenca === 0) return;
        setMudancas(prev => {
            const existente = prev.find(m => m.id === idLote)

            if (existente && novaQtd === Number(obterItemLote(grupoMax, idLote)?.quantidadeTotal ?? 0)) {
                return prev.filter(m => m.id !== idLote)
            }

            if (existente) {
                return prev.map(m =>
                    m.id === idLote
                        ? {
                            ...m, quantidadeTotal: novaQtd,
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
                    quantidadeTotal: novaQtd,
                    unidadeMedida: unidadeMedida,
                    quantidadeMedida: quantidadeMedida,
                    diferenca: diferenca
                }
            ]
        })
    }

    useEffect(() => {
        document.title = "Estoque";
    }, []);

    useEffect(() => {
        carregarEstoque();
    }, [carregarEstoque]);

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

    function ButtonPlus({ nome, onClick }) {
        return (

            <div className="plus-container">
                <div className="plus-icon-container" onClick={onClick}>
                    {nome}
                    <div className="plus-icon"><Plus />
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className="estoque-container">
            {exibirRelatorio && (
                <div className="escurecer">
                    <CardRelatorio props={mudancas.filter(m => m.diferenca !== 0)}
                        fechar={() => setExibirRelatorio(false)} salvarAlteracoes={salvarAlteracoes} loading={loading.relatorio} abrirCardRemocao={abrirCardRemocao} abrirCardRotina={abrirCardRotina} />
                </div>
            )}
            {cardRemocao && (
                <div className="escurecer">
                    <CardConfirmacao titulo={"Deseja descartar as alterações?"} fecharCard={() => { setCardRemocao(false) }} confirmar={removerAlteracao} />
                </div>
            )}
            {cardExclusao && (
                <div className="escurecer">
                    <CardConfirmacao titulo={"Deseja excluir o lote?"} fecharCard={() => { setCardExclusao(false) }} confirmar={() => excluirInsumo(idInsumoSelecionado)} loading={loading.exclusao} />
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
                        <ButtonPlus nome="Adicionar Insumo" onClick={() => { navigate("/cadastro-insumo") }} />
                        <ButtonPlus nome="Adicionar Lote" onClick={() => { navigate("/cadastro-lote") }} />
                        <ButtonPlus nome="Adicionar Fornecedor" onClick={() => { navigate("/cadastro-fornecedor") }} />
                        <Button texto="Rotinas" Icone={Bookmark} onClick={() => { navigate("/rotinas") }} />
                        <Button onClick={abrirCard} texto="Salvar" Icone={Save} />
                        <button className="botoes-container-icon" onClick={() => { navigate("/leitor") }}>
                            <span>QR Code</span>
                            <ScanBarcode style={{ cursor: "pointer" }} color="black" size={28} />
                        </button>
                        <div className="container-search">
                            <Search Icone={SearchIcon} pesquisar={pesquisar} value={pesquisa} />
                        </div>
                    </div>
                </div>
                <div className="nav-categorias-container">
                    <NavCategorias
                        categoriasAtivas={categoriasAtivas}
                        aoAlternarCategoria={alternarCategoria}
                        aoLimparCategorias={limparCategorias}
                        categorias={categorias}
                    />
                </div>
                <div className="insumos-container">
                    <Cabecalho elementos={["Insumo", "Qtd. Medida", "Qtd. Mínima", "Qtd. Atual", "Data de Vencimento", "Controle"]} />
                    <div className="grupo-insumos-container">
                        {grupo.length > 0 ? grupo.map(atual => (
                            <EstoqueGrupo key={atual.fkInsumo} grupo={atual} alterarValor={alterarQuantidade} abrirDropdown={abrirDropdown}
                                dropdownAbertoId={dropdownAbertoId} excluirInsumo={abrirCardExclusao}
                            />
                        )) : <div className="mensagemErro">Não há produtos cadastrados!</div>}
                    </div>
                    {totalPaginas > 0 && categoriasAtivas.length < 2 && (
                        <div className="estoque-seletor">
                            <SeletorPaginas numPages={totalPaginas} voltar={voltarPag} avancar={avancarPag} paginaSelecionada={pagina} selecionar={selecionarPag}></SeletorPaginas>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )


}
