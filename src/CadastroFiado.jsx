import React, { useEffect, useState } from "react";
import "./App.css";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FormModal from "./shared/components/common/FormModal";
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
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState("");
  const [valor, setValor] = useState("");
  const [dataPedido, setDataPedido] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [isCadastrando, setIsCadastrando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const clientesData = await clientes.listar();
        setListaClientes(Array.isArray(clientesData) ? clientesData : []);
      } catch {
        setListaClientes([]);
      }

      try {
        const pedidosData = await dividas.listarPedidos();
        setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
      } catch {
        setPedidos([]);
      }
    }

    carregarDados();
  }, []);

  async function carregarClientes() {
    try {
      const clientesData = await clientes.listar();
      setListaClientes(Array.isArray(clientesData) ? clientesData : []);
    } catch {
      setListaClientes([]);
    }
  }

  const opcoesClientes = listaClientes
    .map((cliente) => {

      const nome = String(cliente?.nome ?? cliente?.razaoSocial ?? "").trim();
      const idCliente = cliente?.idCliente;

      if (!nome || !idCliente) {
        return null;
      }

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
    const cep = String(novoCliente.cep ?? "").trim();
    const logradouro = String(novoCliente.logradouro ?? "").trim();
    const bairro = String(novoCliente.bairro ?? "").trim();

    if (!nome) {
      setErroModalCliente("Informe o nome do cliente.");
      return;
    }

    if (!telefone) {
      setErroModalCliente("Informe o telefone do cliente.");
      return;
    }

    if (cep && !/^\d{5}-\d{3}$/.test(cep)) {
      setErroModalCliente("CEP invalido. Use o formato 00000-000.");
      return;
    }

    try {
      setIsCadastrandoCliente(true);
      const clienteCriado = await clientes.criar({
        nome,
        telefone,
        cep: cep || null,
        logradouro: logradouro || null,
        bairro: bairro || null,
      });

      const clientesData = await clientes.listar();
      const clientesAtualizados = Array.isArray(clientesData) ? clientesData : [];
      setListaClientes(clientesAtualizados);

      const idClienteCriado = clienteCriado?.idCliente;
      const clienteSelecionadoNovo =
        clientesAtualizados.find(
          (cliente) =>
            idClienteCriado && Number(cliente?.idCliente) === Number(idClienteCriado)
        ) ??
        clientesAtualizados.find(
          (cliente) =>
            String(cliente?.nome ?? "").trim().toLowerCase() === nome.toLowerCase() &&
            String(cliente?.telefone ?? "").trim() === telefone
        ) ??
        null;

      setClienteSelecionado(clienteSelecionadoNovo);
      setNomeCliente(clienteSelecionadoNovo?.nome ?? nome);
      setNovoCliente({ nome: "", telefone: "", cep: "", logradouro: "", bairro: "" });
      setAbrirModalCliente(false);
    } catch {
      setErroModalCliente("Nao foi possivel cadastrar o cliente.");
    } finally {
      setIsCadastrandoCliente(false);
    }
  }

  async function cadastrarFiado(event) {
    event.preventDefault();
    setErroFormulario("");

    const nomeClienteFormatado = String(nomeCliente ?? "").trim();
    const pedidoFormatado = String(pedidoSelecionado ?? "").trim();
    const valorNumero = Number(valor);
    const clientePorNome = listaClientes.find(
      (cliente) =>
        String(cliente?.nome ?? "").trim().toLowerCase() === nomeClienteFormatado.toLowerCase()
    );
    const idCliente =
      clienteSelecionado?.idCliente ??
      clientePorNome?.idCliente;

    if (!idCliente) {
      setErroFormulario("Selecione um cliente valido.");
      return;
    }

    if (!pedidoFormatado) {
      setErroFormulario("Informe o pedido.");
      return;
    }

    if (!Number.isFinite(valorNumero) || valorNumero <= 0) {
      setErroFormulario("Informe um valor valido maior que zero.");
      return;
    }

    if (!dataPedido) {
      setErroFormulario("Informe a data do pedido.");
      return;
    }

    try {
      setIsCadastrando(true);

      await dividas.criar({
        valor: valorNumero,
        dataCompra: dataPedido,
        pedido: pedidoFormatado,
        idCliente: Number(idCliente),
        pago: false,
      });

      setNomeCliente("");
      setClienteSelecionado(null);
      setPedidoSelecionado("");
      setValor("");
      setDataPedido("");
      setAbrirModalSucesso(true);
    } catch (error) {
      if (error?.response?.status === 400) {
        setErroFormulario("Dados invalidos. Verifique os campos informados.");
      } else {
        setErroFormulario("Nao foi possivel cadastrar o fiado. Tente novamente.");
      }
    } finally {
      setIsCadastrando(false);
    }
  }

  const opcoesPedidos = pedidos
    .map((pedido) => {
      const textoPedido = String(pedido ?? "").trim();
      if (!textoPedido) {
        return null;
      }

      return {
        id: textoPedido,
        label: textoPedido,
      };
    })
    .filter(Boolean);

  return (
    <div className="container">
      <div className="box">

        <span className="titulo">Cadastro de Fiado</span>

        <div className="caixa">
          <form id={formId} onSubmit={cadastrarFiado}>

          {/* Nome do insumo */}
          <span>Nome do cliente</span>
          <div className="input-wrapper">
            <select
              className="selectNome"
              value={String(clienteSelecionado?.idCliente ?? "")}
              onChange={(e) => {
                const idSelecionado = String(e.target.value);
                const cliente = listaClientes.find(
                  (item) => String(item?.idCliente) === idSelecionado
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

          {/* Pedido */}
          <span>Pedido</span>
          <div className="input-wrapper1">
            <select
              className="selectPedido"
              value={pedidoSelecionado || ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setPedidoSelecionado(selectedValue);
              }}
            >
              <option value="">Selecione um pedido</option>
              {opcoesPedidos.map((pedido, index) => (
                <option key={index} value={pedido.label}>
                  {pedido.label}
                </option>
              ))}
            </select>
          </div>
          
          <span>Valor</span>
          <input
            type="text"
            placeholder="R$ 0,00"
            value={valor}
            onChange={(e) => {
              let v = e.target.value;

              // Remove tudo que não for número
              v = v.replace(/\D/g, "");

              // Converte para centavos
              const numero = Number(v) / 100;

              // Formata para moeda BRL
              const formatado = numero.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });

              setValor(formatado);
            }}
          />
          
          <span>Data do pedido</span>
          <input
            type="date"
            value={dataPedido}
            onChange={(e) => setDataPedido(e.target.value)}
          />

          {erroFormulario && (
            <span style={{ color: "#b3261e", fontSize: "14px" }}>{erroFormulario}</span>
          )}
        
          {/* Upload */}
          <div className="botao-upload">
            Enviar Nota Fiscal
            <label className="botao-upload-fiado">
              <input type="file" accept="image/*" />
            </label>
          </div>
          </form>
        </div>

        <div className="actions">
          <button className="btn btn-cancelar" onClick={() => navigate(-1)}>
            Voltar
          </button>

          <button className="btn" type="submit" form={formId} disabled={isCadastrando}>
            {isCadastrando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </div>

      {/* MODAL NOVA MARCA */}
      {abrirModalCliente && (
        <div className="modal-overlay">
          <div className="modal">

            <span className="titulo">Novo cliente</span>

            <input
              className="modal-input"
              type="text"
              placeholder="Nome do cliente"
              value={novoCliente.nome}
              onChange={(e) => setNovoCliente((prev) => ({ ...prev, nome: e.target.value }))}
            />

            <input
              className="modal-input"
              type="text"
              placeholder="Telefone"
              value={novoCliente.telefone}
              onChange={(e) => setNovoCliente((prev) => ({ ...prev, telefone: e.target.value }))}
            />

            <input
              className="modal-input"
              type="text"
              placeholder="CEP (00000-000)"
              value={novoCliente.cep}
              onChange={(e) => setNovoCliente((prev) => ({ ...prev, cep: e.target.value }))}
            />

            <input
              className="modal-input"
              type="text"
              placeholder="Logradouro"
              value={novoCliente.logradouro}
              onChange={(e) => setNovoCliente((prev) => ({ ...prev, logradouro: e.target.value }))}
            />

            <input
              className="modal-input"
              type="text"
              placeholder="Bairro"
              value={novoCliente.bairro}
              onChange={(e) => setNovoCliente((prev) => ({ ...prev, bairro: e.target.value }))}
            />

            {erroModalCliente && (
              <span style={{ color: "#b3261e", fontSize: "14px" }}>{erroModalCliente}</span>
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
                disabled={isCadastrandoCliente}
              >
                {isCadastrandoCliente ? "Salvando..." : "Salvar"} <Save size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUCESSO */}
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
