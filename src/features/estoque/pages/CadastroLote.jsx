import React, { useEffect, useState } from "react";
import { Plus, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FormModal from "../../../shared/components/common/FormModal";
import { FornecedorApi, Lote, MarcaApi, insumos } from "../../../provider/Api";
import { useLocation } from "react-router-dom";

export default function CadastroLote() {
  const navigate = useNavigate();
  const [listaInsumos, setListaInsumos] = useState([]);
  const [listaMarcas, setListaMarcas] = useState([]);
  const [listaFornecedores, setListaFornecedores] = useState([]);
  const [insumoSelecionado, setInsumoSelecionado] = useState("");
  const [idInsumoSelecionado, setIdInsumoSelecionado] = useState(null);
  const [idMarcaSelecionada, setIdMarcaSelecionada] = useState("0");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [isCadastrando, setIsCadastrando] = useState(false);
  const [arquivoNotaFiscal, setArquivoNotaFiscal] = useState(null);

  const [abrirModal, setAbrirModal] = useState(null);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [novaMarca, setNovaMarca] = useState("");
  const [novoIdInsumoMarca, setNovoIdInsumoMarca] = useState("0");
  const [novoInsumoMarcaTexto, setNovoInsumoMarcaTexto] = useState("");
  const [novoIdFornecedorMarca, setNovoIdFornecedorMarca] = useState("0");
  const [erroModalMarca, setErroModalMarca] = useState("");
  const [isCadastrandoMarca, setIsCadastrandoMarca] = useState(false);

  const location = useLocation();

  const dados = location.state?.insumo;
  useEffect(() => {
    if (dados) {
      console.log(dados)
      setInsumoSelecionado(dados.atual.insumoNome)
      setIdInsumoSelecionado(dados.atual.insumoId)
      setIdMarcaSelecionada(dados.atual.marca)
    }
  }, [dados])
 

  async function fetchInsumos() {
    try {
      const response = await insumos.listar();
      setListaInsumos(Array.isArray(response) ? response : []);
    } catch {
      setListaInsumos([]);
    }
  }

  async function fetchMarcas() {
    try {
      const response = await MarcaApi.listar();
      setListaMarcas(Array.isArray(response) ? response : []);
    } catch {
      setListaMarcas([]);
    }
  }

  async function fetchFornecedores() {
    try {
      const response = await FornecedorApi.listar();
      setListaFornecedores(Array.isArray(response) ? response : []);
    } catch {
      setListaFornecedores([]);
    }
  }

  useEffect(() => {
    fetchInsumos();
    fetchMarcas();
    fetchFornecedores();
  }, []);

  useEffect(() => {
    if (abrirModal === "marca") {
      setErroModalMarca("");
      setNovaMarca("");
      setNovoIdInsumoMarca(idInsumoSelecionado ? String(idInsumoSelecionado) : "0");
      const insumoAtual = (listaInsumos ?? []).find(
        (insumo) => Number(insumo?.idInsumo) === Number(idInsumoSelecionado)
      );
      setNovoInsumoMarcaTexto(insumoAtual?.nome ?? "");
      setNovoIdFornecedorMarca("0");
    }
  }, [abrirModal, idInsumoSelecionado, listaInsumos]);

  const opcoesInsumo = (listaInsumos ?? []).map((insumo) => ({
    id: String(insumo?.idInsumo ?? ""),
    label: String(insumo?.nome ?? ""),
    idInsumo: insumo?.idInsumo ?? null,
  }));

  const marcasFiltradas = (listaMarcas ?? []).filter((marca) => {
    if (!idInsumoSelecionado) return true;
    return Number(marca?.insumo?.idInsumo) === Number(idInsumoSelecionado);
  });

  async function cadastrarLote(event) {
    event.preventDefault();
    setErroFormulario("");

    const idMarca = Number(idMarcaSelecionada);
    const preco = Number(precoUnitario);
    const qtd = Number(quantidade);
    const idUsuario = Number(localStorage.getItem("usuarioId"));

    if (!idInsumoSelecionado) {
      setErroFormulario("Selecione um insumo valido no autocomplete.");
      return;
    }

    if (!Number.isFinite(idMarca) || idMarca <= 0) {
      setErroFormulario("Selecione uma marca valida.");
      return;
    }

    if (!Number.isFinite(preco) || preco <= 0) {
      setErroFormulario("Informe um preco unitario valido.");
      return;
    }

    if (!dataValidade) {
      setErroFormulario("Informe a data de validade.");
      return;
    }

    if (!Number.isFinite(qtd) || qtd <= 0) {
      setErroFormulario("Informe uma quantidade valida.");
      return;
    }

    if (!Number.isFinite(idUsuario) || idUsuario <= 0) {
      setErroFormulario("Nao foi possivel identificar o usuario logado. Faca login novamente.");
      return;
    }

    const hoje = new Date();
    const dataEntrada = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
      hoje.getDate()
    ).padStart(2, "0")}`;

    try {
      setIsCadastrando(true);
      await Lote.criar({
        payload: {
          dataValidade,
          precoUnitario: preco,
          quantidadeMedida: qtd,
          dataEntrada,
          fkMarca: idMarca,
          fkUsuario: idUsuario,
        },
      });

      setInsumoSelecionado("");
      setIdInsumoSelecionado(null);
      setIdMarcaSelecionada("0");
      setPrecoUnitario("");
      setDataValidade("");
      setQuantidade("");
      setArquivoNotaFiscal(null);
      setAbrirModalSucesso(true);
    } catch (error) {
      if (error?.response?.status === 409) {
        setErroFormulario("Ja existe um lote com esses dados.");
      } else {
        setErroFormulario("Nao foi possivel cadastrar o lote. Tente novamente.");
      }
    } finally {
      setIsCadastrando(false);
    }
  }

  async function cadastrarMarcaPeloModal() {
    setErroModalMarca("");
    const nome = novaMarca.trim();
    const fkInsumo = Number(novoIdInsumoMarca);
    const fkFornecedor = Number(novoIdFornecedorMarca);

    if (!nome) {
      setErroModalMarca("Informe o nome da marca.");
      return;
    }

    if (!Number.isFinite(fkInsumo) || fkInsumo <= 0) {
      setErroModalMarca("Selecione um insumo valido para a marca.");
      return;
    }

    if (!Number.isFinite(fkFornecedor) || fkFornecedor <= 0) {
      setErroModalMarca("Selecione um fornecedor valido para a marca.");
      return;
    }

    try {
      setIsCadastrandoMarca(true);
      const marcaCriada = await MarcaApi.criar({
        nome,
        fkInsumo,
        fkFornecedor,
      });

      await fetchMarcas();
      setAbrirModal(null);
      setNovaMarca("");
      setNovoIdInsumoMarca("0");
      setNovoInsumoMarcaTexto("");
      setNovoIdFornecedorMarca("0");

      if (marcaCriada?.idMarca) {
        setIdMarcaSelecionada(String(marcaCriada.idMarca));
      }

      if (fkInsumo > 0) {
        const insumoDaMarca = (listaInsumos ?? []).find((insumo) => Number(insumo?.idInsumo) === fkInsumo);
        if (insumoDaMarca) {
          setInsumoSelecionado(String(insumoDaMarca.nome ?? ""));
          setIdInsumoSelecionado(fkInsumo);
        }
      }

      setAbrirModalSucesso(true);
    } catch (error) {
      if (error?.response?.status === 409) {
        setErroModalMarca("Ja existe uma marca com esse nome para o insumo selecionado.");
      } else {
        setErroModalMarca("Nao foi possivel cadastrar a marca.");
      }
    } finally {
      setIsCadastrandoMarca(false);
    }
  }

  return (
    <div className="container">
      <div className="box">

        <span className="titulo">Cadastro de Lote</span>

        <div className="caixa">
          <form onSubmit={cadastrarLote}>

          {/* Nome do insumo */}
          <span>Nome</span>
          <div className="input-wrapper">
            <select
              className="selectNome"
              value={idInsumoSelecionado ?? ""}
              onChange={(e) => {
                const selectedId = Number(e.target.value);

                const insumo = listaInsumos.find(
                  (i) => Number(i.idInsumo) === selectedId
                );

                setIdInsumoSelecionado(selectedId || null);
                setInsumoSelecionado(insumo?.nome ?? "");
                setIdMarcaSelecionada("0");
              }}
            >
              <option value="">Selecione um insumo</option>
              {listaInsumos.map((insumo) => (
                <option key={insumo.idInsumo} value={insumo.idInsumo}>
                  {insumo.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Marca */}
          <span>Marca</span>
          <div className="input-wrapper">
            <select
              className="selectMarca"
              value={idMarcaSelecionada}
              onChange={(e) => setIdMarcaSelecionada(e.target.value)}
            >
              <option value="0">Marca do Insumo</option>
              {marcasFiltradas.map((marca) => (
                <option key={marca.idMarca} value={marca.idMarca}>{marca.nome}</option>
              ))}
            </select>

            <button type="button" className="eye-btn2" onClick={() => setAbrirModal("marca")}>
              <Plus size={18} />
            </button>
          </div>
          
          <span>Preço unitário</span>
          <input
            type="text"
            placeholder="R$ 0,00"
            value={precoUnitario}
            onChange={(e) => {
              let valor = e.target.value;

              // Remove tudo que não for número
              valor = valor.replace(/\D/g, "");

              // Converte para centavos
              const numero = Number(valor) / 100;

              // Formata para moeda BR
              const formatado = numero.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });

              setPrecoUnitario(formatado);
            }}
          />
          
          <span>Data de validade</span>
          <input type="date" value={dataValidade} onChange={(e) => setDataValidade(e.target.value)} />

          <span>Quantidade</span>
          <input
            type="number"
            step="1"
            min="0"
            placeholder="0"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          {/* Upload */}
          <div className="botao-upload">
            Enviar Nota Fiscal
            <label className="botao-upload-lote">
              <input type="file" accept="image/*" onChange={(e) => setArquivoNotaFiscal(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <br />
          {arquivoNotaFiscal && (
            <span style={{ fontSize: "14px" }}>Arquivo selecionado: {arquivoNotaFiscal.name}</span>
          )}

          {erroFormulario && (
            <span style={{ color: "#b3261e", fontSize: "14px" }}>{erroFormulario}</span>
          )}

          <div className="actions">
            <button type="button" className="btn btn-cancelar" onClick={() => navigate(-1)}>
              Voltar
            </button>

            <button type="submit" className="btn" disabled={isCadastrando}>
              {isCadastrando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
          </form>
        </div>
      </div>

      {/* MODAL NOVA MARCA */}
      <FormModal
        open={Boolean(abrirModal)}
        title="Nova marca de insumo"
        onClose={() => setAbrirModal(null)}
        onSave={cadastrarMarcaPeloModal}
        isSaving={isCadastrandoMarca}
        errorMessage={erroModalMarca}
      >
        <input
          className="modal-input"
          type="text"
          placeholder="Nome da marca"
          value={novaMarca}
          onChange={(e) => setNovaMarca(e.target.value)}
        />

        <select
          className="modal-input"
          value={novoIdInsumoMarca}
          onChange={e => {
            const selectedId = e.target.value;
            setNovoIdInsumoMarca(selectedId);
            const found = (opcoesInsumo ?? []).find(opcao => String(opcao.id) === String(selectedId));
            setNovoInsumoMarcaTexto(found ? found.label : "");
          }}
        >
          <option value="0" disabled>Selecione o insumo</option>
          {(opcoesInsumo ?? []).map(opcao => (
            <option key={opcao.id} value={opcao.id}>{opcao.label}</option>
          ))}
        </select>

        <select
          className="modal-input"
          value={novoIdFornecedorMarca}
          onChange={(e) => setNovoIdFornecedorMarca(e.target.value)}
        >
          <option value="0">Selecione o fornecedor</option>
          {(listaFornecedores ?? []).map((fornecedor) => (
            <option key={fornecedor.idFornecedor} value={fornecedor.idFornecedor}>{fornecedor.razaoSocial}</option>
          ))}
        </select>
      </FormModal>

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
