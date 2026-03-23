import React, { useEffect, useState } from "react";
import {
  Filter,
  Plus,
  Search,
  LayoutGrid,
  List,
  FileText,
} from "lucide-react";
import { FiadoCard } from "../FiadoCard/FiadoCard";
import { FiadoModal } from "../FiadoModal/FiadoModal";
import "./Fiado.css";
import HeaderPadrao from '../../HeaderPadrao';
import { clientes, dividas } from "../../provider/Api";

export default function Fiado({ irPara }) {
  const [fiados, setFiados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [ordenacao, setOrdenacao] = useState(null);
  const [visualizacao, setVisualizacao] = useState("cards");
  const [fiadoSelecionado, setFiadoSelecionado] = useState(null);
  const [modalNovo, setModalNovo] = useState(false);

  const [novoFiado, setNovoFiado] = useState({
    nome: "",
    telefone: "",
    cep: "",
    logradouro: "",
    bairro: "",
    pedido: "",
    valor: "",
  });

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
    .sort((a, b) => {
      if (ordenacao === "nome") return a.nome.localeCompare(b.nome);
      if (ordenacao === "valor") return calcularAberto(b) - calcularAberto(a);
      if (ordenacao === "data") {
        const dA = ultimaData(a) || "";
        const dB = ultimaData(b) || "";
        return dB.localeCompare(dA);
      }
      return 0;
    });

  const toggleOrdenacao = (tipo) => {
    setOrdenacao((prev) => (prev === tipo ? null : tipo));
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
  const pagarDivida = async (idCliente, idDivida) => {
    try {
      await dividas.atualizarEstado(idDivida);

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

  // Marca todas as dívidas em aberto do cliente como pagas
  const pagarTodas = async (idCliente) => {
    const cliente = fiados.find((c) => c.idCliente === idCliente);
    const idsDividasEmAberto = (cliente?.dividas || [])
      .filter((divida) => !divida.pago)
      .map((divida) => divida.idDivida);

    if (idsDividasEmAberto.length === 0) return;

    try {
      await Promise.all(idsDividasEmAberto.map((idDivida) => dividas.atualizarEstado(idDivida)));

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

  const handleNovoFiadoChange = (campo, valor) => {
    setNovoFiado((prev) => ({ ...prev, [campo]: valor }));
  };

  const salvarNovoFiado = () => {
    if (!novoFiado.nome.trim()) return;

    const novoCliente = {
      idCliente: Date.now(),
      nome: novoFiado.nome,
      telefone: novoFiado.telefone,
      cep: novoFiado.cep,
      logradouro: novoFiado.logradouro,
      bairro: novoFiado.bairro,
      dividas: novoFiado.pedido
        ? [
            {
              idDivida: Date.now() + 1,
              valor: Number(novoFiado.valor) || 0,
              dataCompra: new Date().toISOString(),
              dataPagamento: null,
              pedido: novoFiado.pedido,
              pago: 0,
              fkCliente: Date.now(),
            },
          ]
        : [],
    };

    setFiados((prev) => [...prev, novoCliente]);
    setNovoFiado({
      nome: "",
      telefone: "",
      cep: "",
      logradouro: "",
      bairro: "",
      pedido: "",
      valor: "",
    });
    setModalNovo(false);
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return "—";
    const d = new Date(dataStr);
    if (isNaN(d.getTime())) return dataStr;
    return d.toLocaleDateString("pt-BR");
  };

  return (
    <div className="fiado-page">
      <HeaderPadrao titulo="Fiados" irPara={irPara} />

      {/* Barra de filtros */}
      <div className="fiado-filtros">
        <button
          className={`filtro-btn ${ordenacao === "nome" ? "active" : ""}`}
          onClick={() => toggleOrdenacao("nome")}
        >
          Nome
          <Filter size={18} />
        </button>

        <button
          className={`filtro-btn ${ordenacao === "valor" ? "active" : ""}`}
          onClick={() => toggleOrdenacao("valor")}
        >
          Valor
          <Filter size={18} />
        </button>

        <button
          className={`filtro-btn ${ordenacao === "data" ? "active" : ""}`}
          onClick={() => toggleOrdenacao("data")}
        >
          Data
          <Filter size={18} />
        </button>

        <button className="add-btn" onClick={() => setModalNovo(true)}>
          <Plus size={20} color="#fff" />
        </button>

        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${visualizacao === "cards" ? "active" : ""}`}
            onClick={() => setVisualizacao("cards")}
            title="Visualização em cards"
          > 
          </button>
          <button
            className={`view-toggle-btn ${visualizacao === "lista" ? "active" : ""}`}
            onClick={() => setVisualizacao("lista")}
            title="Visualização em lista"
          >  
          </button>
        </div>

        <div className="fiado-search-wrapper">
          <div className="fiado-search-box">
            <input
              className="fiado-search-input"
              type="text"
              placeholder="Pesquisar..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
            <Search size={18} className="fiado-search-icon" />
          </div>
        </div>
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
          onPagarTodas={pagarTodas}
        />
      )}

      {/* Modal de novo fiado */}
      {modalNovo && (
        <div className="fiado-modal-overlay" onClick={() => setModalNovo(false)}>
          <div
            className="novo-fiado-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Novo Fiado</h2>
            <div className="novo-fiado-form">
              <label>
                Nome do cliente
                <input
                  type="text"
                  value={novoFiado.nome}
                  onChange={(e) => handleNovoFiadoChange("nome", e.target.value)}
                  placeholder="Ex: João da Silva"
                />
              </label>

              <div className="novo-fiado-form-row">
                <label>
                  Telefone
                  <input
                    type="text"
                    value={novoFiado.telefone}
                    onChange={(e) =>
                      handleNovoFiadoChange("telefone", e.target.value)
                    }
                    placeholder="(11) 99999-0000"
                  />
                </label>
                <label>
                  CEP
                  <input
                    type="text"
                    value={novoFiado.cep}
                    onChange={(e) =>
                      handleNovoFiadoChange("cep", e.target.value)
                    }
                    placeholder="00000-000"
                  />
                </label>
              </div>

              <div className="novo-fiado-form-row">
                <label>
                  Logradouro
                  <input
                    type="text"
                    value={novoFiado.logradouro}
                    onChange={(e) =>
                      handleNovoFiadoChange("logradouro", e.target.value)
                    }
                    placeholder="Rua exemplo, 123"
                  />
                </label>
                <label>
                  Bairro
                  <input
                    type="text"
                    value={novoFiado.bairro}
                    onChange={(e) =>
                      handleNovoFiadoChange("bairro", e.target.value)
                    }
                    placeholder="Centro"
                  />
                </label>
              </div>

              <div className="novo-fiado-form-row">
                <label>
                  Descrição do pedido
                  <input
                    type="text"
                    value={novoFiado.pedido}
                    onChange={(e) =>
                      handleNovoFiadoChange("pedido", e.target.value)
                    }
                    placeholder="Ex: Almoço executivo"
                  />
                </label>
                <label>
                  Valor (R$)
                  <input
                    type="number"
                    value={novoFiado.valor}
                    onChange={(e) =>
                      handleNovoFiadoChange("valor", e.target.value)
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </label>
              </div>

              <div className="novo-fiado-actions">
                <button
                  className="btn-cancelar"
                  onClick={() => setModalNovo(false)}
                >
                  Cancelar
                </button>
                <button className="btn-salvar" onClick={salvarNovoFiado}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}