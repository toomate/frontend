import React, { useEffect, useState } from "react";
import {
  Filter,
  Plus,
  Search,
  LayoutGrid,
  List,
  FileText,
} from "lucide-react";
import { FiadoCard } from "./components/FiadoCard/FiadoCard";
import { FiadoModal } from "./components/FiadoModal/FiadoModal";
import "./fiado.css";
import HeaderPadrao from './HeaderPadrao';

// Dados mock alinhados com a modelagem: cliente + divida
const CLIENTES_MOCK = [
  {
    idCliente: 1,
    nome: "João da Silva",
    telefone: "(11) 99999-1234",
    cep: "01001-000",
    logradouro: "Rua das Flores, 123",
    bairro: "Centro",
    dividas: [
      { idDivida: 1, valor: 45.00, dataCompra: "2026-03-01T12:00:00", dataPagamento: null, pedido: "Almoço executivo", pago: 0, fkCliente: 1 },
      { idDivida: 2, valor: 35.50, dataCompra: "2026-03-05T12:00:00", dataPagamento: null, pedido: "Marmitex grande", pago: 0, fkCliente: 1 },
      { idDivida: 3, valor: 42.00, dataCompra: "2026-03-10T12:00:00", dataPagamento: "2026-03-12T10:00:00", pedido: "Suco natural + prato feito", pago: 1, fkCliente: 1 },
      { idDivida: 4, valor: 55.00, dataCompra: "2026-03-15T12:00:00", dataPagamento: null, pedido: "Feijoada completa", pago: 0, fkCliente: 1 },
      { idDivida: 5, valor: 18.00, dataCompra: "2026-03-20T12:00:00", dataPagamento: null, pedido: "Sobremesa + café", pago: 0, fkCliente: 1 },
      { idDivida: 6, valor: 50.00, dataCompra: "2026-03-25T12:00:00", dataPagamento: null, pedido: "Marmitex média", pago: 0, fkCliente: 1 },
    ],
  },
  {
    idCliente: 2,
    nome: "Maria Oliveira",
    telefone: "(11) 98888-5678",
    cep: "04001-000",
    logradouro: "Av. Brasil, 456",
    bairro: "Jardins",
    dividas: [
      { idDivida: 7, valor: 38.00, dataCompra: "2026-03-02T12:00:00", dataPagamento: null, pedido: "Prato do dia", pago: 0, fkCliente: 2 },
      { idDivida: 8, valor: 32.00, dataCompra: "2026-03-08T12:00:00", dataPagamento: "2026-03-10T09:00:00", pedido: "Salada especial", pago: 1, fkCliente: 2 },
      { idDivida: 9, valor: 55.00, dataCompra: "2026-03-14T12:00:00", dataPagamento: null, pedido: "Frango grelhado", pago: 0, fkCliente: 2 },
      { idDivida: 10, valor: 55.00, dataCompra: "2026-03-22T12:00:00", dataPagamento: null, pedido: "Marmitex pequena", pago: 0, fkCliente: 2 },
    ],
  },
  {
    idCliente: 3,
    nome: "Carlos Santos",
    telefone: "(11) 97777-9012",
    cep: "01310-000",
    logradouro: "Rua Augusta, 789",
    bairro: "Consolação",
    dividas: [
      { idDivida: 11, valor: 89.00, dataCompra: "2026-03-03T12:00:00", dataPagamento: null, pedido: "Rodízio completo", pago: 0, fkCliente: 3 },
      { idDivida: 12, valor: 65.00, dataCompra: "2026-03-12T12:00:00", dataPagamento: null, pedido: "Porção + bebidas", pago: 0, fkCliente: 3 },
      { idDivida: 13, valor: 90.00, dataCompra: "2026-03-18T12:00:00", dataPagamento: null, pedido: "Almoço executivo x2", pago: 0, fkCliente: 3 },
      { idDivida: 14, valor: 76.00, dataCompra: "2026-03-28T12:00:00", dataPagamento: null, pedido: "Jantar especial", pago: 0, fkCliente: 3 },
    ],
  },
  {
    idCliente: 4,
    nome: "Ana Pereira",
    telefone: "(11) 96666-3456",
    cep: "01301-000",
    logradouro: "Rua Consolação, 321",
    bairro: "Consolação",
    dividas: [
      { idDivida: 15, valor: 42.00, dataCompra: "2026-03-07T12:00:00", dataPagamento: "2026-03-09T11:00:00", pedido: "Marmitex + suco", pago: 1, fkCliente: 4 },
      { idDivida: 16, valor: 53.00, dataCompra: "2026-03-19T12:00:00", dataPagamento: "2026-03-20T15:00:00", pedido: "Prato feito", pago: 1, fkCliente: 4 },
    ],
  },
  {
    idCliente: 5,
    nome: "Pedro Almeida",
    telefone: "(11) 95555-7890",
    cep: "01311-000",
    logradouro: "Rua Paulista, 1010",
    bairro: "Bela Vista",
    dividas: [
      { idDivida: 17, valor: 68.00, dataCompra: "2026-03-01T12:00:00", dataPagamento: null, pedido: "Almoço completo", pago: 0, fkCliente: 5 },
      { idDivida: 18, valor: 145.00, dataCompra: "2026-03-09T12:00:00", dataPagamento: null, pedido: "Jantar p/ 2", pago: 0, fkCliente: 5 },
      { idDivida: 19, valor: 52.75, dataCompra: "2026-03-16T12:00:00", dataPagamento: null, pedido: "Sobremesas variadas", pago: 0, fkCliente: 5 },
      { idDivida: 20, valor: 75.00, dataCompra: "2026-03-23T12:00:00", dataPagamento: null, pedido: "Feijoada + caipirinha", pago: 0, fkCliente: 5 },
      { idDivida: 21, valor: 70.00, dataCompra: "2026-03-27T12:00:00", dataPagamento: null, pedido: "Marmitex grande x2", pago: 0, fkCliente: 5 },
    ],
  },
  {
    idCliente: 6,
    nome: "Lucia Ferreira",
    telefone: "(11) 94444-1122",
    cep: "01020-000",
    logradouro: "Rua XV de Novembro, 55",
    bairro: "Sé",
    dividas: [
      { idDivida: 22, valor: 38.00, dataCompra: "2026-03-04T12:00:00", dataPagamento: null, pedido: "Salada + wrap", pago: 0, fkCliente: 6 },
      { idDivida: 23, valor: 42.00, dataCompra: "2026-03-11T12:00:00", dataPagamento: "2026-03-13T10:00:00", pedido: "Prato do dia", pago: 1, fkCliente: 6 },
      { idDivida: 24, valor: 70.00, dataCompra: "2026-03-21T12:00:00", dataPagamento: null, pedido: "Marmitex + sobremesa", pago: 0, fkCliente: 6 },
    ],
  },
];

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
    // Substituir por chamada à API futuramente
    const timer = setTimeout(() => {
      setFiados(CLIENTES_MOCK);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
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

  // Marcar uma dívida como paga
  const pagarDivida = (idCliente, idDivida) => {
    const agora = new Date().toISOString();
    setFiados((prev) =>
      prev.map((c) => {
        if (c.idCliente !== idCliente) return c;
        return {
          ...c,
          dividas: c.dividas.map((d) =>
            d.idDivida === idDivida
              ? { ...d, pago: 1, dataPagamento: agora }
              : d
          ),
        };
      })
    );
    // Atualiza o modal se está aberto
    setFiadoSelecionado((prev) => {
      if (!prev || prev.idCliente !== idCliente) return prev;
      return {
        ...prev,
        dividas: prev.dividas.map((d) =>
          d.idDivida === idDivida
            ? { ...d, pago: 1, dataPagamento: agora }
            : d
        ),
      };
    });
  };

  // Marcar todas as dívidas de um cliente como pagas
  const pagarTodas = (idCliente) => {
    const agora = new Date().toISOString();
    setFiados((prev) =>
      prev.map((c) => {
        if (c.idCliente !== idCliente) return c;
        return {
          ...c,
          dividas: c.dividas.map((d) =>
            d.pago ? d : { ...d, pago: 1, dataPagamento: agora }
          ),
        };
      })
    );
    setFiadoSelecionado((prev) => {
      if (!prev || prev.idCliente !== idCliente) return prev;
      return {
        ...prev,
        dividas: prev.dividas.map((d) =>
          d.pago ? d : { ...d, pago: 1, dataPagamento: agora }
        ),
      };
    });
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
