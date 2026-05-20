import React, { useEffect, useState } from "react";
import "./App.css";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clientes, dividas } from "./provider/Api";

export default function CadastroFiado() {
  const navigate = useNavigate();
  const formId = "cadastro-fiado-form";

  const [abrirModalCliente, setAbrirModalCliente] = useState(false);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);

  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    telefone: "",
    cep: "",
    logradouro: "",
    bairro: "",
  });

  const [erroModalCliente, setErroModalCliente] = useState("");
  const [isCadastrandoCliente, setIsCadastrandoCliente] = useState(false);

  const [nomeCliente, setNomeCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const [listaClientes, setListaClientes] = useState([]);

  const [pedidoSelecionado, setPedidoSelecionado] = useState("");
  const [valor, setValor] = useState("");
  const [dataPedido, setDataPedido] = useState("");

  const [erroFormulario, setErroFormulario] = useState("");
  const [isCadastrando, setIsCadastrando] = useState(false);

  const [pedidos, setPedidos] = useState([]);
  const [observacoesPedidos, setObservacoesPedidos] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const clientesData = await clientes.listar();
        setListaClientes(Array.isArray(clientesData) ? clientesData : []);
      } catch {
        setListaClientes([]);
      }
    }

    carregarDados();
  }, []);

  const opcoesClientes = listaClientes
    .map((cliente) => {
      const nome = String(cliente?.nome ?? "").trim();
      const idCliente = cliente?.idCliente;

      if (!nome || !idCliente) return null;

      return {
        id: String(idCliente),
        label: nome,
      };
    })
    .filter(Boolean);

  async function cadastrarClientePeloModal() {
    setErroModalCliente("");

    const nome = String(novoCliente.nome ?? "").trim();
    const telefone = String(novoCliente.telefone ?? "").trim();

    if (!nome) {
      setErroModalCliente("Informe o nome do cliente.");
      return;
    }

    if (!telefone) {
      setErroModalCliente("Informe o telefone.");
      return;
    }

    try {
      setIsCadastrandoCliente(true);

      const clienteCriado = await clientes.criar({
        nome,
        telefone,
      });

      const clientesAtualizados = await clientes.listar();

      setListaClientes(
        Array.isArray(clientesAtualizados)
          ? clientesAtualizados
          : []
      );

      setClienteSelecionado(clienteCriado);
      setNomeCliente(clienteCriado?.nome ?? nome);

      setNovoCliente({
        nome: "",
        telefone: "",
        cep: "",
        logradouro: "",
        bairro: "",
      });

      setAbrirModalCliente(false);

    } catch {
      setErroModalCliente("Nao foi possivel cadastrar o cliente.");
    } finally {
      setIsCadastrandoCliente(false);
    }
  }

function adicionarPedido() {
  setErroFormulario("");

  const pedidoFormatado = String(pedidoSelecionado ?? "").trim();

  const valorNumero = Number(
    String(valor)
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^\d.]/g, "")
  );

  if (!pedidoFormatado) {
    setErroFormulario("Informe o pedido.");
    return;
  }

  if (!Number.isFinite(valorNumero) || valorNumero <= 0) {
    setErroFormulario("Informe um valor valido.");
    return;
  }

  if (!dataPedido) {
    setErroFormulario("Informe a data.");
    return;
  }

  const novoPedido = {
    pedido: pedidoFormatado,
    valor: valorNumero,
    dataPedido,
  };

  const novaLista = [...pedidos, novoPedido].sort(
    (a, b) => new Date(a.dataPedido) - new Date(b.dataPedido)
  );

  setPedidos(novaLista);

  const textoFormatado = novaLista
    .map((item, index) => {
      const [ano, mes, dia] = item.dataPedido.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const valorFormatado = item.valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return `Pedido: ${index + 1}
      Descrição: ${item.pedido}
      Valor: ${valorFormatado}
      Data: ${dataFormatada}
      ──────────────────────────────────`;
    })
    .join("\n");

  setObservacoesPedidos(textoFormatado);

  // limpa campos
  setPedidoSelecionado("");
  setValor("");
  setDataPedido("");
}

  async function cadastrarFiado(event) {
    event.preventDefault();

    setErroFormulario("");

    const idCliente = clienteSelecionado?.idCliente;

    if (!idCliente) {
      setErroFormulario("Selecione um cliente.");
      return;
    }

    const listaFinal = [...pedidos];

    if (pedidoSelecionado && valor && dataPedido) {
      const valorNumero = Number(
        String(valor)
          .replace(/\./g, "")
          .replace(",", ".")
          .replace(/[^\d.]/g, "")
      );

      listaFinal.push({
        pedido: pedidoSelecionado,
        valor: valorNumero,
        dataPedido,
      });
    }

    if (listaFinal.length === 0) {
      setErroFormulario("Adicione pelo menos um pedido.");
      return;
    }

    try {
      setIsCadastrando(true);

      for (const item of listaFinal) {
        await dividas.criar({
          valor: item.valor,
          dataCompra: item.dataPedido,
          pedido: item.pedido,
          idCliente: Number(idCliente),
          pago: false,
        });
      }

      setPedidos([]);
      setObservacoesPedidos("");

      setPedidoSelecionado("");
      setValor("");
      setDataPedido("");

      setAbrirModalSucesso(true);

    } catch {
      setErroFormulario("Nao foi possivel cadastrar.");
    } finally {
      setIsCadastrando(false);
    }
  }

  return (
    <div className="container">
      <div className="box">

        <span className="titulo">Cadastro de Fiado</span>

        <div className="caixa">
          <form id={formId} onSubmit={cadastrarFiado}>

            <span>Cliente</span>

            <div className="input-wrapper">
              <select
                className="selectNome"
                value={String(clienteSelecionado?.idCliente ?? "")}
                onChange={(e) => {
                  const cliente =
                    listaClientes.find(
                      (item) =>
                        String(item?.idCliente) === String(e.target.value)
                    ) ?? null;

                  setClienteSelecionado(cliente);
                  setNomeCliente(cliente?.nome ?? "");
                }}
              >
                <option value="">Selecione</option>

                {opcoesClientes.map((opcao) => (
                  <option key={opcao.id} value={opcao.id}>
                    {opcao.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="eye-btn"
                onClick={() => {
                  setErroModalCliente("");
                  setAbrirModalCliente(true);
                }}
              >
                <Plus size={18} />
              </button>
            </div>

            <span>Pedido</span>

            <input
              type="text"
              placeholder="Digite o pedido"
              value={pedidoSelecionado}
              onChange={(e) => setPedidoSelecionado(e.target.value)}
            />

            <span>Valor</span>

            <input
              type="text"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => {
                let v = e.target.value;

                v = v.replace(/\D/g, "");

                const numero = Number(v) / 100;

                const formatado = numero.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });

                setValor(formatado);
              }}
            />

            <span>Data</span>

            <input
              type="date"
              value={dataPedido}
              onChange={(e) => setDataPedido(e.target.value)}
            />

            {erroFormulario && (
              <span className="erro-texto">
                {erroFormulario}
              </span>
            )}

            <div className="botao-upload">
              Enviar Nota Fiscal

              <label className="botao-upload-fiado">
                <input type="file" accept="image/*" />
              </label>
            </div>
          </form>
        </div>

        <button
          type="button"
          className="adiciionar-pedido-btn"
          onClick={adicionarPedido}
        >
          Adicionar Pedido
        </button>

        <div className="pedidos-box">
          <h3>Pedidos adicionados</h3>

          {pedidos.length === 0 ? (
            <span>Nenhum pedido adicionado.</span>
          ) : (
            <textarea
              className="pedidos-textarea"
              value={observacoesPedidos}
              readOnly
              rows={10}
            />
          )}
        </div>

        <div className="actions">
          <button
            className="btn btn-cancelar"
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>

          <button
            className="btn"
            type="submit"
            form={formId}
            disabled={isCadastrando}
          >
            {isCadastrando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </div>

      {abrirModalCliente && (
        <div className="modal-overlay">
          <div className="modal">

            <span className="titulo">Novo cliente</span>

            <input
              className="modal-input"
              type="text"
              placeholder="Nome"
              value={novoCliente.nome}
              onChange={(e) =>
                setNovoCliente((prev) => ({
                  ...prev,
                  nome: e.target.value,
                }))
              }
            />

            <input
              className="modal-input"
              type="text"
              placeholder="Telefone"
              value={novoCliente.telefone}
              onChange={(e) =>
                setNovoCliente((prev) => ({
                  ...prev,
                  telefone: e.target.value,
                }))
              }
            />

            {erroModalCliente && (
              <span className="erro-texto">
                {erroModalCliente}
              </span>
            )}

            <div className="modal-actions">

              <button
                className="btn btn-cancelar"
                onClick={() => setAbrirModalCliente(false)}
              >
                Cancelar <Trash2 size={14} />
              </button>

              <button
                className="btn"
                onClick={cadastrarClientePeloModal}
              >
                {isCadastrandoCliente ? "Salvando..." : "Salvar"}
                <Save size={14} />
              </button>

            </div>
          </div>
        </div>
      )}

      {abrirModalSucesso && (
        <div className="modal-overlay">
          <div className="modal modal-sucesso">

            <CheckCircle size={80} className="icone-sucesso" />

            <span className="titulo">
              Cadastro realizado com sucesso!
            </span>

            <button
              className="btn"
              onClick={() => setAbrirModalSucesso(false)}
            >
              OK
            </button>

          </div>
        </div>
      )}
    </div>
  );
}