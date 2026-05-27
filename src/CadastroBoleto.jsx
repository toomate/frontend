import React, { useEffect, useState } from "react";
import "./CadastroBoleto.css";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { NovoFornecedorModal } from "./components/fornecedores/NovoFornecedorModal";
import { data, useNavigate } from "react-router-dom";
import AutocompleteInput from "./components/common/AutocompleteInput";
import { boletos, FornecedorApi } from "./provider/Api";

export default function CadastroBoleto() {
  const navigate = useNavigate();

  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [novaCategoriaBoleto, setNovaCategoriaBoleto] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [fornecedorValue, setFornecedorValue] = useState("");
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [isCadastrando, setIsCadastrando] = useState(false);
  const [modalFornecedorAberto, setModalFornecedorAberto] = useState(false);
  const [salvandoFornecedor, setSalvandoFornecedor] = useState(false);

  const [formFornecedor, setFormFornecedor] = useState({
    razaoSocial: "",
    telefone: "",
  });

  async function cadastrarBoleto(event) {
    event.preventDefault();
    setErroFormulario("");

    try {
      setIsCadastrando(true);

      // Converte a string formatada (ex: "R$ 1.234,56") para número
      const valorNumerico = Number((valor || "").replace(/\D/g, "")) / 100;

      if (isNaN(valorNumerico)) {
        setErroFormulario("Valor inválido");
        setIsCadastrando(false);
        return;
      }

      // tenta resolver fornecedor pela string digitada caso nao exista selecao
      let escolhido = fornecedorSelecionado;
      if (!escolhido && fornecedorValue) {
        const encontrado = (fornecedores || []).find(
          (f) => String(f.label ?? "").trim().toLowerCase() === String(fornecedorValue ?? "").trim().toLowerCase()
        );
        if (encontrado) escolhido = encontrado;
      }

      const payload = {
        descricao: titulo,
        categoria: categoriaSelecionada,
        pago: false,
        dataVencimento: dataVencimento,
        dataPagamento: null,
        valor: valorNumerico,
      };

      if (escolhido) {
        const idNum = Number(escolhido.id);
        payload.idFornecedor = Number.isFinite(idNum) ? idNum : escolhido.id;
      }

      console.debug("Criando boleto payload:", { payload, escolhido });

      await boletos.criar(payload);

      setAbrirModalSucesso(true);
      setTitulo("");
      setValor("");
      setDataVencimento("");
      setCategoriaSelecionada("");
      setFornecedorSelecionado(null);
      setFornecedorValue("");
    } catch (error) {
      console.error("Erro ao cadastrar boleto:", error);
      setErroFormulario("Nao foi possivel cadastrar o boleto. Tente novamente.");
    } finally {
      setIsCadastrando(false);
    }

  }

  function abrirModalFornecedor() {
    setFormFornecedor({
      razaoSocial: "",
      telefone: "",
    });

    setModalFornecedorAberto(true);
  }

  function fecharModalFornecedor() {
    setModalFornecedorAberto(false);

    setFormFornecedor({
      razaoSocial: "",
      telefone: "",
    });
  }

  function onChangeFornecedor(event) {
    const { name, value } = event.target;

    setFormFornecedor((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function salvarFornecedor() {
    if (!formFornecedor.razaoSocial.trim()) {
      return;
    }

    try {
      setSalvandoFornecedor(true);

      const payload = {
        razaoSocial: formFornecedor.razaoSocial.trim(),
        telefone: formFornecedor.telefone.trim(),
      };

      const response = await FornecedorApi.criar(payload);

      const novoFornecedor = {
        id: String(
          response?.idFornecedor ??
          response?.id ??
          formFornecedor.razaoSocial
        ),
        label: formFornecedor.razaoSocial.trim(),
      };

      setFornecedores((prev) => [...prev, novoFornecedor]);

      setFornecedorSelecionado(novoFornecedor);
      setFornecedorValue(novoFornecedor.label);

      fecharModalFornecedor();
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
    } finally {
      setSalvandoFornecedor(false);
    }
  }


  useEffect(() => {
    async function carregarCategorias() {
      try {
        const categoriasData = await boletos.listarCategorias();

        const categoriasNormalizadas = Array.isArray(categoriasData)
          ? categoriasData
              .map((categoria, index) => {
                if (typeof categoria === "string") {
                  const texto = categoria.trim();
                  return texto
                    ? { id: `${texto}-${index}`, label: texto }
                    : null;
                }

                const texto = String(
                  categoria?.nome ?? categoria?.categoria ?? categoria?.descricao ?? ""
                ).trim();

                if (!texto) return null;

                return {
                  id: String(categoria?.idCategoria ?? categoria?.id ?? `${texto}-${index}`),
                  label: texto,
                };
              })
              .filter(Boolean)
          : [];

        setCategorias(categoriasNormalizadas);
      } catch {
        setCategorias([]);
      }
    }

    async function carregarFornecedores() {
      try {
        const resposta = await FornecedorApi.listar({ pagina: 0, tamanho: 1000 });

        function extrairLista(res) {
          if (Array.isArray(res)) return res;
          const chaves = ["fornecedores", "data", "content", "conteudo"];
          for (const chave of chaves) {
            if (Array.isArray(res?.[chave])) return res[chave];
          }
          return [];
        }

        const data = extrairLista(resposta);

        const lista = (data ?? [])
          .map((f, i) => {
            const label = String(f?.razaoSocial ?? f?.nome ?? f?.fantasia ?? "").trim();
            if (!label) return null;
            const id = String(
              f?.id ?? f?.idFornecedor ?? f?.fkFornecedor ?? `${label}-${i}`
            );
            return { id, label };
          })
          .filter(Boolean);

        setFornecedores(lista);
      } catch {
        setFornecedores([]);
      }
    }

    carregarCategorias();
    carregarFornecedores();
  }, []);

  return (
    <div className="container">
      <div className="box">
        <form onSubmit={cadastrarBoleto}>

        <span className="titulo">Cadastro de Boleto</span>

        <div className="caixa">
            <span>Título</span>
            <input type="text" placeholder="Conta de luz" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

            <span>Categoria</span>
            <div className="input-wrapper">
              <AutocompleteInput
                options={categorias}
                value={categoriaSelecionada}
                onValueChange={(v) => setCategoriaSelecionada(v)}
                onSelect={(opcao) => {
                  if (opcao) {
                    setCategoriaSelecionada(opcao.label);
                  }
                }}
                placeholder="Insira uma categoria"
                className="selectCategoriaBoleto"
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setAbrirModal(true)}
              >
                <Plus size={18} />
              </button>
            </div>

            {categoriaSelecionada?.trim().toLowerCase() === "boletos fornecedores" && (
              <>
                <span>Fornecedor</span>

                <div className="input-wrapper">
                  <AutocompleteInput
                    options={fornecedores}
                    value={fornecedorValue}
                    onValueChange={(v) => {
                      setFornecedorValue(v);
                      setFornecedorSelecionado(null);
                    }}
                    onSelect={(opcao) => {
                      if (opcao) {
                        setFornecedorSelecionado(opcao);
                        setFornecedorValue(opcao.label);
                      }
                    }}
                    placeholder="Insira um fornecedor"
                    className="selectFornecedorBoleto"
                  />

                    <button
                      type="button"
                      className="eye-btn"
                      onClick={abrirModalFornecedor}
                    >
                      <Plus size={18} />
                    </button>
                </div>
              </>
            )}

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
            
            <span>Data de Vencimento</span>
            <input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} />
        </div>

        <div className="actions">
          <button type="button" className="btn btn-cancelar" onClick={() => navigate(-1)}>
            Voltar
          </button>

          <button className="btn" type="submit" disabled={isCadastrando}>
            {isCadastrando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
        </form>
      </div>

      {/* MODAL NOVA MARCA */}
      {abrirModal && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="titulo">Nova categoria de boleto</span>

            <input
              className="modal-input"
              type="text"
              placeholder="Categoria do boleto"
              value={novaCategoriaBoleto}
              onChange={(e) => setNovaCategoriaBoleto(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn btn-cancelar"
                onClick={() => setAbrirModal(false)}
              >
                Cancelar <Trash2 size={14} />
              </button>

              <button
                className="btn"
                onClick={() => {
                  setAbrirModal(false);
                  setAbrirModalSucesso(true);
                }}
              >
                Salvar <Save size={14} />
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
              onClick={() => {
                setAbrirModalSucesso(false);
                navigate("/boletos");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* MODAL NOVO FORNECEDOR */}
      {modalFornecedorAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="titulo">Novo fornecedor</span>

            <input
              className="modal-input"
              type="text"
              name="nome"
              placeholder="Nome do fornecedor"
              value={formFornecedor.nome}
              onChange={onChangeFornecedor}
            />

            <input
              className="modal-input"
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={formFornecedor.telefone}
              onChange={onChangeFornecedor}
            />

            <div className="modal-actions">
              <button
                className="btn btn-cancelar"
                onClick={fecharModalFornecedor}
              >
                Cancelar <Trash2 size={14} />
              </button>

              <button
                className="btn"
                onClick={salvarFornecedor}
                disabled={salvandoFornecedor}
              >
                {salvandoFornecedor ? "Salvando..." : "Salvar"}{" "}
                <Save size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
