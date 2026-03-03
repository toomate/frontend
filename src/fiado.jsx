import React, { useEffect, useState } from "react";
import {
  Filter,
  Plus,
  Search,
  LayoutGrid,
  List,
  FileText,
} from "lucide-react";
import { Navbar } from "./components/Navbar/Navbar";
import { FiadoCard } from "./components/FiadoCard/FiadoCard";
import { FiadoModal } from "./components/FiadoModal/FiadoModal";
import "./fiado.css";

// Dados mock para demonstração
const FIADOS_MOCK = [
  {
    id: 1,
    nome: "João da Silva",
    valorTotal: 245.5,
    contato: "(11) 99999-1234",
    endereco: "Rua das Flores, 123",
    pedidos: [
      { descricao: "Almoço executivo", valor: 45.0, data: "01/03/2026" },
      { descricao: "Marmitex grande", valor: 35.5, data: "05/03/2026" },
      { descricao: "Suco natural + prato feito", valor: 42.0, data: "10/03/2026" },
      { descricao: "Feijoada completa", valor: 55.0, data: "15/03/2026" },
      { descricao: "Sobremesa + café", valor: 18.0, data: "20/03/2026" },
      { descricao: "Marmitex média", valor: 50.0, data: "25/03/2026" },
    ],
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    valorTotal: 180.0,
    contato: "(11) 98888-5678",
    endereco: "Av. Brasil, 456",
    pedidos: [
      { descricao: "Prato do dia", valor: 38.0, data: "02/03/2026" },
      { descricao: "Salada especial", valor: 32.0, data: "08/03/2026" },
      { descricao: "Frango grelhado", valor: 55.0, data: "14/03/2026" },
      { descricao: "Marmitex pequena", valor: 55.0, data: "22/03/2026" },
    ],
  },
  {
    id: 3,
    nome: "Carlos Santos",
    valorTotal: 320.0,
    contato: "(11) 97777-9012",
    endereco: "Rua Augusta, 789",
    pedidos: [
      { descricao: "Rodízio completo", valor: 89.0, data: "03/03/2026" },
      { descricao: "Porção + bebidas", valor: 65.0, data: "12/03/2026" },
      { descricao: "Almoço executivo x2", valor: 90.0, data: "18/03/2026" },
      { descricao: "Jantar especial", valor: 76.0, data: "28/03/2026" },
    ],
  },
  {
    id: 4,
    nome: "Ana Pereira",
    valorTotal: 95.0,
    contato: "(11) 96666-3456",
    endereco: "Rua Consolação, 321",
    pedidos: [
      { descricao: "Marmitex + suco", valor: 42.0, data: "07/03/2026" },
      { descricao: "Prato feito", valor: 53.0, data: "19/03/2026" },
    ],
  },
  {
    id: 5,
    nome: "Pedro Almeida",
    valorTotal: 410.75,
    contato: "(11) 95555-7890",
    endereco: "Rua Paulista, 1010",
    pedidos: [
      { descricao: "Almoço completo", valor: 68.0, data: "01/03/2026" },
      { descricao: "Jantar p/ 2", valor: 145.0, data: "09/03/2026" },
      { descricao: "Sobremesas variadas", valor: 52.75, data: "16/03/2026" },
      { descricao: "Feijoada + caipirinha", valor: 75.0, data: "23/03/2026" },
      { descricao: "Marmitex grande x2", valor: 70.0, data: "27/03/2026" },
    ],
  },
  {
    id: 6,
    nome: "Lucia Ferreira",
    valorTotal: 150.0,
    contato: "(11) 94444-1122",
    endereco: "Rua XV de Novembro, 55",
    pedidos: [
      { descricao: "Salada + wrap", valor: 38.0, data: "04/03/2026" },
      { descricao: "Prato do dia", valor: 42.0, data: "11/03/2026" },
      { descricao: "Marmitex + sobremesa", valor: 70.0, data: "21/03/2026" },
    ],
  },
];

export default function Fiado({ irPara }) {
  const [fiados, setFiados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [ordenacao, setOrdenacao] = useState(null); // "nome" | "valor" | "data"
  const [visualizacao, setVisualizacao] = useState("cards"); // "cards" | "lista"
  const [fiadoSelecionado, setFiadoSelecionado] = useState(null);
  const [modalNovo, setModalNovo] = useState(false);

  // Form state para novo fiado
  const [novoFiado, setNovoFiado] = useState({
    nome: "",
    contato: "",
    endereco: "",
    descricaoPedido: "",
    valorPedido: "",
  });

  useEffect(() => {
    // Simula carregamento dos dados (substituir por chamada à API)
    const timer = setTimeout(() => {
      setFiados(FIADOS_MOCK);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filtra e ordena
  const fiadosFiltrados = fiados
    .filter((f) => {
      if (!pesquisa) return true;
      const termo = pesquisa.toLowerCase();
      return (
        f.nome.toLowerCase().includes(termo) ||
        f.contato.toLowerCase().includes(termo)
      );
    })
    .sort((a, b) => {
      if (ordenacao === "nome") return a.nome.localeCompare(b.nome);
      if (ordenacao === "valor") return b.valorTotal - a.valorTotal;
      if (ordenacao === "data") {
        const ultimaDataA =
          a.pedidos.length > 0
            ? a.pedidos[a.pedidos.length - 1].data
            : "00/00/0000";
        const ultimaDataB =
          b.pedidos.length > 0
            ? b.pedidos[b.pedidos.length - 1].data
            : "00/00/0000";
        return ultimaDataB.localeCompare(ultimaDataA);
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

  const handleNovoFiadoChange = (campo, valor) => {
    setNovoFiado((prev) => ({ ...prev, [campo]: valor }));
  };

  const salvarNovoFiado = () => {
    if (!novoFiado.nome.trim()) return;

    const novo = {
      id: Date.now(),
      nome: novoFiado.nome,
      valorTotal: Number(novoFiado.valorPedido) || 0,
      contato: novoFiado.contato,
      endereco: novoFiado.endereco,
      pedidos: novoFiado.descricaoPedido
        ? [
            {
              descricao: novoFiado.descricaoPedido,
              valor: Number(novoFiado.valorPedido) || 0,
              data: new Date().toLocaleDateString("pt-BR"),
            },
          ]
        : [],
    };

    setFiados((prev) => [...prev, novo]);
    setNovoFiado({
      nome: "",
      contato: "",
      endereco: "",
      descricaoPedido: "",
      valorPedido: "",
    });
    setModalNovo(false);
  };

  return (
    <div className="fiado-page">
      <Navbar />

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
          <Plus size={22} color="#c3c3c3" />
        </button>

        {/* Toggle visualização */}
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${visualizacao === "cards" ? "active" : ""}`}
            onClick={() => setVisualizacao("cards")}
            title="Visualização em cards"
          >
            <LayoutGrid size={20} />
          </button>
          <button
            className={`view-toggle-btn ${visualizacao === "lista" ? "active" : ""}`}
            onClick={() => setVisualizacao("lista")}
            title="Visualização em lista"
          >
            <List size={20} />
          </button>
        </div>

        {/* Barra de pesquisa */}
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
        /* Visualização em Cards */
        <div className="fiado-cards-grid">
          {fiadosFiltrados.map((fiado) => (
            <FiadoCard key={fiado.id} fiado={fiado} onAbrir={abrirDetalhe} />
          ))}
        </div>
      ) : (
        /* Visualização em Lista/Tabela */
        <div className="fiado-tabela-container">
          <div className="fiado-tabela-header">
            <span>Cliente</span>
            <span>Pedido</span>
            <span>Valor</span>
            <span>Data</span>
            <span>Status</span>
          </div>
          <div className="fiado-tabela-body">
            {fiadosFiltrados.map((fiado) => (
              <div
                className="fiado-tabela-row"
                key={fiado.id}
                onClick={() => abrirDetalhe(fiado)}
              >
                <span>{fiado.nome}</span>
                <span>
                  {fiado.pedidos.length > 0
                    ? fiado.pedidos[fiado.pedidos.length - 1].descricao
                    : "—"}
                </span>
                <span>R$ {Number(fiado.valorTotal).toFixed(2)}</span>
                <span>
                  {fiado.pedidos.length > 0
                    ? fiado.pedidos[fiado.pedidos.length - 1].data
                    : "—"}
                </span>
                <span>
                  <span className="status-badge aberto">Em aberto</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de detalhe do fiado */}
      {fiadoSelecionado && (
        <FiadoModal fiado={fiadoSelecionado} onClose={fecharDetalhe} />
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
                  Contato
                  <input
                    type="text"
                    value={novoFiado.contato}
                    onChange={(e) =>
                      handleNovoFiadoChange("contato", e.target.value)
                    }
                    placeholder="(11) 99999-0000"
                  />
                </label>
                <label>
                  Endereço
                  <input
                    type="text"
                    value={novoFiado.endereco}
                    onChange={(e) =>
                      handleNovoFiadoChange("endereco", e.target.value)
                    }
                    placeholder="Rua exemplo, 123"
                  />
                </label>
              </div>

              <div className="novo-fiado-form-row">
                <label>
                  Descrição do pedido
                  <input
                    type="text"
                    value={novoFiado.descricaoPedido}
                    onChange={(e) =>
                      handleNovoFiadoChange("descricaoPedido", e.target.value)
                    }
                    placeholder="Ex: Almoço executivo"
                  />
                </label>
                <label>
                  Valor (R$)
                  <input
                    type="number"
                    value={novoFiado.valorPedido}
                    onChange={(e) =>
                      handleNovoFiadoChange("valorPedido", e.target.value)
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
