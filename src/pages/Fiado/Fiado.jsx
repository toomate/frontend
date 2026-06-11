import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Filter, Plus, Search, LayoutGrid, List, FileText, ArrowDown, ArrowUp} from "lucide-react";
import { FiadoCard } from "../../components/FiadoCard/FiadoCard";
import { FiadoModal } from "../../components/FiadoModal/FiadoModal";
import { FiltroSelecaoMultipla } from "../../components/shared/FiltroSelecaoMultipla";
import "./Fiado.css";
import HeaderPadrao from '../../HeaderPadrao';
import { ArquivoApi, clientes, dividas } from "../../provider/Api";

export default function Fiado({ irPara }) {
  const navigate = useNavigate();
  const [fiados, setFiados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [ordenacao, setOrdenacao] = useState({ tipo: null, direcao: "asc" });
  const [filtroPagamento, setFiltroPagamento] = useState([]);
  const [visualizacao, setVisualizacao] = useState("cards");
  const [fiadoSelecionado, setFiadoSelecionado] = useState(null);

  useEffect(() => {
    const carregarClientesComDividas = async () => {
      setLoading(true);
      try {
        const clientesComDividas = await clientes.listarComDividas();
        const clientesNormalizados = Array.isArray(clientesComDividas)
          ? clientesComDividas.map((cliente) => ({
            ...cliente,
            dividas: Array.isArray(cliente.dividas) ? cliente.dividas : [],
          }))
          : [];

        setFiados(clientesNormalizados);
      } catch (error) {
        console.error("Erro ao carregar clientes com dívidas:", error);
        setFiados([]);
      } finally {
        setLoading(false);
      }
    };

    carregarClientesComDividas();
  }, []);

  // Calcula valor em aberto de um cliente
  const calcularAberto = (cliente) =>
    cliente.dividas
      .filter((d) => !d.pago)
      .reduce((acc, d) => acc + Number(d.valor), 0);

  const fiadoTemDividasEmAberto = (cliente) =>
    cliente.dividas.some((divida) => !divida.pago);

  const fiadoEstaPago = (cliente) =>
    cliente.dividas.length > 0 && cliente.dividas.every((divida) => divida.pago);

  // Última data de compra
  const ultimaData = (cliente) => {
    if (cliente.dividas.length === 0) return "";
    return cliente.dividas
      .map((d) => d.dataCompra)
      .sort()
      .pop();
  };

  // Filtra e ordena
  const fiadosFiltrados = fiados
    .filter((f) => {
      if (!pesquisa) return true;
      const termo = pesquisa.toLowerCase();
      return (
        f.nome.toLowerCase().includes(termo) ||
        f.telefone.toLowerCase().includes(termo) ||
        f.bairro.toLowerCase().includes(termo)
      );
    })
    .filter((f) => {
      if (filtroPagamento.length > 0 && !filtroPagamento.includes("pago") && !filtroPagamento.includes("naoPago")) {
        return true;
      }

      if (filtroPagamento.includes("pago") && !filtroPagamento.includes("naoPago")) {
        return fiadoEstaPago(f);
      }

      if (filtroPagamento.includes("naoPago") && !filtroPagamento.includes("pago")) {
        return fiadoTemDividasEmAberto(f);
      }

      if (filtroPagamento.length === 0) {
        return true;
      }

      return fiadoEstaPago(f) || fiadoTemDividasEmAberto(f);
    })
    .sort((a, b) => {
      if (ordenacao.tipo === "nome") {
        const comparison = a.nome.localeCompare(b.nome);
        return ordenacao.direcao === "asc" ? comparison : -comparison;
      }
      if (ordenacao.tipo === "valor") {
        const diff = calcularAberto(b) - calcularAberto(a);
        return ordenacao.direcao === "asc" ? diff : -diff;
      }
      if (ordenacao.tipo === "data") {
        const dA = ultimaData(a) || "";
        const dB = ultimaData(b) || "";

        const comparison = dA.localeCompare(dB);

      return ordenacao.direcao === "asc"
        ? comparison
        : -comparison;
        }
        return 0;
    });

  const toggleOrdenacao = (tipo) => {
    setOrdenacao((prev) => {
      if (prev.tipo === tipo) {
        return {
          tipo,
          direcao: prev.direcao === "asc" ? "desc" : "asc",
        };
      }

      return {
        tipo,
        direcao: "asc",
      };
    });
  };

  const abrirDetalhe = (fiado) => {
    setFiadoSelecionado(fiado);
  };

  const fecharDetalhe = () => {
    setFiadoSelecionado(null);
  };

  const atualizarDividaNoEstado = (listaClientes, idCliente, idsDividas, dataPagamento) =>
    listaClientes.map((cliente) => {
      if (cliente.idCliente !== idCliente) return cliente;

      return {
        ...cliente,
        dividas: cliente.dividas.map((divida) =>
          idsDividas.includes(divida.idDivida)
            ? { ...divida, pago: true, dataPagamento }
            : divida
        ),
      };
    });

  // Marca apenas a dívida clicada como paga
  const pagarDivida = async (idCliente, idDivida, comprovantePagamento) => {
    try {
      await dividas.atualizarEstado(idDivida);

      // Sobe o comprovante de pagamento (best-effort: a dívida já foi quitada)
      const arquivoPagamento = comprovantePagamento?.comprovante;
      if (arquivoPagamento) {
        try {
          await ArquivoApi.cadastrarComprovante({
            arquivo: arquivoPagamento,
            idEntidade: Number(idDivida),
            tipoEntidade: "DIVIDA",
            categoria: "PAGAMENTO",
          });
        } catch (erroUpload) {
          console.error("Pagamento registrado, mas o comprovante não pôde ser enviado:", erroUpload);
        }
      }

      const agora = new Date().toISOString();
      setFiados((prev) => atualizarDividaNoEstado(prev, idCliente, [idDivida], agora));

      setFiadoSelecionado((prev) => {
        if (!prev || prev.idCliente !== idCliente) return prev;
        const atualizado = atualizarDividaNoEstado([prev], idCliente, [idDivida], agora);
        return atualizado[0];
      });
    } catch (error) {
      console.error("Erro ao pagar dívida:", error);
    }
  };

  const desfazerPagamento = async (idCliente, idDivida) => {
    try {
      await dividas.atualizarEstado(idDivida);

      setFiados((prev) =>
        prev.map((cliente) => {
          if (cliente.idCliente !== idCliente) return cliente;

          return {
            ...cliente,
            dividas: cliente.dividas.map((divida) =>
              divida.idDivida === idDivida
                ? {
                    ...divida,
                    pago: false,
                    dataPagamento: null,
                  }
                : divida
            ),
          };
        })
      );

      setFiadoSelecionado((prev) => {
        if (!prev || prev.idCliente !== idCliente) return prev;

        return {
          ...prev,
          dividas: prev.dividas.map((divida) =>
            divida.idDivida === idDivida
              ? {
                  ...divida,
                  pago: false,
                  dataPagamento: null,
                }
              : divida
          ),
        };
      });
    } catch (error) {
      console.error("Erro ao desfazer pagamento:", error);
    }
  };

  // Marca todas as dívidas em aberto do cliente como pagas
  const pagarTodas = async (idCliente, comprovantePagamento) => {
    const cliente = fiados.find((c) => c.idCliente === idCliente);
    const idsDividasEmAberto = (cliente?.dividas || [])
      .filter((divida) => !divida.pago)
      .map((divida) => divida.idDivida);

    if (idsDividasEmAberto.length === 0) return;

    try {
      await Promise.all(idsDividasEmAberto.map((idDivida) => dividas.atualizarEstado(idDivida)));

      // Sobe o comprovante de pagamento para cada dívida quitada (best-effort)
      const arquivoPagamento = comprovantePagamento?.comprovante;
      if (arquivoPagamento) {
        await Promise.all(
          idsDividasEmAberto.map(async (idDivida) => {
            try {
              await ArquivoApi.cadastrarComprovante({
                arquivo: arquivoPagamento,
                idEntidade: Number(idDivida),
                tipoEntidade: "DIVIDA",
                categoria: "PAGAMENTO",
              });
            } catch (erroUpload) {
              console.error("Pagamento registrado, mas o comprovante não pôde ser enviado:", erroUpload);
            }
          })
        );
      }

      const agora = new Date().toISOString();
      setFiados((prev) => atualizarDividaNoEstado(prev, idCliente, idsDividasEmAberto, agora));

      setFiadoSelecionado((prev) => {
        if (!prev || prev.idCliente !== idCliente) return prev;
        const atualizado = atualizarDividaNoEstado([prev], idCliente, idsDividasEmAberto, agora);
        return atualizado[0];
      });
    } catch (error) {
      console.error("Erro ao pagar todas as dívidas:", error);
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return "—";
    const d = new Date(dataStr);
    if (isNaN(d.getTime())) return dataStr;
    return d.toLocaleDateString("pt-BR");
  };

  const renderSetaOrdenacao = (tipo) => {
    if (ordenacao.tipo !== tipo) return null;

    return ordenacao.direcao === "asc" ? (
      <ArrowDown size={16} />
    ) : (
      <ArrowUp size={16} />
    );
  };

  const opcoesFiltroPagamento = [
    { id: "pago", nome: "Pago" },
    { id: "naoPago", nome: "Não pago" },
  ];

  const aoAlternarFiltroPagamento = (valor) => {
    setFiltroPagamento([valor]);
  };

  const aoLimparFiltroPagamento = () => {
    setFiltroPagamento([]);
  };

  return (
    <div className="fiado-page">
      <HeaderPadrao titulo="Fiados" irPara={irPara} />

      {/* Barra de filtros */}
      <div className="fiado-filtros">
        <button
          className={`filtro-btn ${ordenacao.tipo === "nome" ? "active" : ""}`}
          onClick={() => toggleOrdenacao("nome")}
        >
          Nome
          <div>
            <Filter size={18} />
            {renderSetaOrdenacao("nome")}
          </div>
        </button>

        <button
          className={`filtro-btn ${ordenacao.tipo === "valor" ? "active" : ""}`}
          onClick={() => toggleOrdenacao("valor")}
        >
          Valor
          <div>
            <Filter size={18} />
            {renderSetaOrdenacao("valor")}
          </div>
        </button>

        <button
          className={`filtro-btn ${ordenacao.tipo === "data" ? "active" : ""}`}
          onClick={() => toggleOrdenacao("data")}
        >
          Data
          <div>
            <Filter size={18} />
            {renderSetaOrdenacao("data")}
          </div>
        </button>

        <FiltroSelecaoMultipla
          itens={opcoesFiltroPagamento}
          itensSelecionados={filtroPagamento}
          aoAlternarItem={aoAlternarFiltroPagamento}
          aoLimparSelecao={aoLimparFiltroPagamento}
          obterValorItem={(opcao) => opcao.id}
          obterRotuloItem={(opcao) => opcao.nome}
          rotuloTudo="Todos"
          rotuloTudoSelecionado="Todos"
          rotuloItemUnicoFallback="Todos"
          rotuloItensMuitos={(quantidade) => `${quantidade} selecionados`}
          classeBase="fiado-filtro"
          modoSelecao="single"
        />

        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${visualizacao === "cards" ? "active" : ""}`}
            onClick={() => setVisualizacao("cards")}
            title="Visualização em cards"
          >
            <LayoutGrid size={18} className="fiado-grid-icon" />
          </button>
          <button
            className={`view-toggle-btn ${visualizacao === "lista" ? "active" : ""}`}
            onClick={() => setVisualizacao("lista")}
            title="Visualização em lista"
          >
            <List size={18} className="fiado-list-icon" />
          </button>
        </div>

        <div className="fiado-search-wrapper">
          <div className="fiado-search-box fiado-search-input">
            <input
              className="fiado-search-field"
              type="text"
              placeholder="Pesquisar..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
                        <Search size={18} className="fiado-search-icon" />
          </div>
        </div>

        <button className={`view-toggle-btn ${visualizacao === "lista" ? "active" : ""}`}  
        onClick={() => navigate("/cadastro-fiado")}>
          Adicionar Fiado
          <Plus size={20} />
        </button>

      </div>

      {/* Conteúdo principal */}
      {loading ? (
        <div className="fiado-vazio">
          <p>Carregando...</p>
        </div>
      ) : fiadosFiltrados.length === 0 ? (
        <div className="fiado-vazio">
          <FileText size={48} />
          <p>Nenhum fiado encontrado</p>
        </div>
      ) : visualizacao === "cards" ? (
        <div className="fiado-cards-grid">
          {fiadosFiltrados.map((fiado) => (
            <FiadoCard key={fiado.idCliente} fiado={fiado} onAbrir={abrirDetalhe} />
          ))}
        </div>
      ) : (
        <div className="fiado-tabela-container">
          <div className="fiado-tabela-header">
            <span>Cliente</span>
            <span>Último Pedido</span>
            <span>Valor Aberto</span>
            <span>Data</span>
            <span>Status</span>
          </div>
          <div className="fiado-tabela-body">
            {fiadosFiltrados.map((fiado) => {
              const aberto = calcularAberto(fiado);
              const todasPagas = fiado.dividas.length > 0 && fiado.dividas.every((d) => d.pago);
              const ultimaDivida = fiado.dividas.length > 0
                ? [...fiado.dividas].sort((a, b) => b.dataCompra.localeCompare(a.dataCompra))[0]
                : null;

              return (
                <div
                  className="fiado-tabela-row"
                  key={fiado.idCliente}
                  onClick={() => abrirDetalhe(fiado)}
                >
                  <span>{fiado.nome}</span>
                  <span>{ultimaDivida ? ultimaDivida.pedido : "—"}</span>
                  <span>R$ {aberto.toFixed(2)}</span>
                  <span>{ultimaDivida ? formatarData(ultimaDivida.dataCompra) : "—"}</span>
                  <span>
                    <span className={`status-badge ${todasPagas ? "pago" : "aberto"}`}>
                      {todasPagas ? "Pago" : "Em aberto"}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de detalhe */}
      {fiadoSelecionado && (
        <FiadoModal
          fiado={fiadoSelecionado}
          onClose={fecharDetalhe}
          onPagarDivida={pagarDivida}
          onDesfazerPagamento={desfazerPagamento}
          onPagarTodas={pagarTodas}
        />
      )}
    </div>
  );
}