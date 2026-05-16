import React, { useEffect, useState } from "react";
import { Plus, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import FormModal from "../../../shared/components/common/FormModal";
import { CategoriaApi, insumos } from "../../../provider/Api";

export default function CadastroInsumo() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [nomeInsumo, setNomeInsumo] = useState("");
  const [idCategoria, setIdCategoria] = useState("0");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [qtdMinima, setQtdMinima] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [isCadastrando, setIsCadastrando] = useState(false);
  const location = useLocation();
  const [successType, setSuccessType] = useState("");

  function parseQuantidade(valor) {
    if (valor === null || valor === undefined || valor === "") {
      return null;
    }

    const texto = String(valor).trim().replace(",", ".");
    const match = texto.match(/\d+(\.\d+)?/);

    if (!match) {
      return null;
    }

    const numero = Number(match[0]);

    if (!Number.isFinite(numero) || numero < 0 || !Number.isInteger(numero)) {
      return null;
    }

    return String(numero);
  }

  async function fetchCategorias() {
    try {
      const categoriasData = await CategoriaApi.listar();
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    } catch {
      setCategorias([]);
    }
  }

  async function fetchMedidas() {
    try {
      const medidasData = await insumos.listarUnidades();
      setMedidas(Array.isArray(medidasData) ? medidasData : []);
    } catch {
      setMedidas([]);
    }
  }


  useEffect(() => {
    fetchCategorias();
    fetchMedidas();

    const produtoSalvo = sessionStorage.getItem("produto");

    if (!produtoSalvo) {
      return;
    }

    try {
      const produto = JSON.parse(produtoSalvo);

      const nome = String(produto?.nome ?? "").trim();
      const unidade = String(produto?.unidade ?? "").trim();
      const quantidade = parseQuantidade(produto?.quantidade);

      if (nome) {
        setNomeInsumo(nome);
      }

      if (unidade) {
        setUnidadeMedida(unidade);
      }

      if (quantidade !== null) {
        setQtdMinima(quantidade);
      }
    } catch {
      // Ignora dados invalidos no sessionStorage
    } finally {
      sessionStorage.removeItem("produto");
    }

    // Note: do not remove `sessionStorage.fromLeitor` here — keep it available
    // so click-time handlers can check it (the redirector should set it).
  }, []);


  const [abrirModalCategoria, setAbrirModalCategoria] = useState(false);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
  const [novaCategoriaRotatividade, setNovaCategoriaRotatividade] = useState("false");
  const [erroModalCategoria, setErroModalCategoria] = useState("");
  const [isCadastrandoCategoria, setIsCadastrandoCategoria] = useState(false);

  async function cadastrarInsumo(event) {
    event.preventDefault();
    setErroFormulario("");

    const nome = nomeInsumo.trim();
    const categoriaNumero = Number(idCategoria);
    const quantidadeMinimaNumero = Number(qtdMinima);
    const unidade = unidadeMedida.trim();

    if (!nome) {
      setErroFormulario("Informe o nome do insumo.");
      return;
    }

    if (!Number.isFinite(categoriaNumero) || categoriaNumero <= 0) {
      setErroFormulario("Selecione uma categoria valida.");
      return;
    }

    if (!Number.isFinite(quantidadeMinimaNumero) || quantidadeMinimaNumero < 0) {
      setErroFormulario("Informe uma quantidade minima valida.");
      return;
    }

    if (!unidade) {
      setErroFormulario("Informe a unidade de medida.");
      return;
    }

    try {
      setIsCadastrando(true);
      await insumos.criar({
        nome,
        qtdMinima: quantidadeMinimaNumero,
        unidadeMedida: unidade,
        fkCategoria: categoriaNumero,
      });

      setNomeInsumo("");
      setIdCategoria("0");
      setUnidadeMedida("");
      setQtdMinima("");
      setSuccessType("insumo");
      setAbrirModalSucesso(true);
      fetchMedidas();
    } catch (error) {
      if (error?.response?.status === 409) {
        setErroFormulario("Ja existe um insumo com esse nome.");
      } else {
        setErroFormulario("Nao foi possivel cadastrar o insumo. Tente novamente.");
      }
    } finally {
      setIsCadastrando(false);
    }
  }

  const medidasDisponiveisBase =
    Array.isArray(medidas) && medidas.length > 0 ? medidas : ["Kg", "Unidade", "Litro"];

  const medidasDisponiveis = unidadeMedida
    ? [...medidasDisponiveisBase, unidadeMedida]
    : medidasDisponiveisBase;

  const medidasNormalizadas = Array.from(
    new Set(
      medidasDisponiveis
        .map((medida) => String(medida ?? "").trim())
        .filter(Boolean)
    )
  );

  const opcoesUnidade = medidasNormalizadas.map((medida) => ({
    id: medida,
    label: medida,
  }));

  return (
    <div className="container">
      <div className="box">

        <span className="titulo">Cadastro de Insumo</span>

        <div className="caixa">
          <form onSubmit={cadastrarInsumo}>

          <span>Nome do Insumo</span>
          <input
            type="text"
            placeholder="Ex: Arroz"
            value={nomeInsumo}
            onChange={(e) => setNomeInsumo(e.target.value)}
          />

          {/* Categoria */}
          <span>Categoria do Insumo</span>
          <div className="input-wrapper">
            <select
              className="selectCategoria"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
            >
              <option value={"0"}>Selecione</option>
              {(categorias ?? []).map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nome}</option>
              ))}
            </select>

            <button
              type="button"
              className="eye-btn1"
              onClick={() => {
                setErroModalCategoria("");
                setNovaCategoriaRotatividade("false");
                setAbrirModalCategoria(true);
              }}
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Unidade */}
          <span>Unidade de Medida</span>
          <select
            className="selectUnidade"
            value={unidadeMedida}
            onChange={e => {
              setUnidadeMedida(e.target.value);
            }}
          >
            <option value="" disabled>Selecione</option>
            {opcoesUnidade.map(opcao => (
              <option key={opcao.id} value={opcao.label}>{opcao.label}</option>
            ))}
          </select>

          <span>Quantidade Mínima</span>
          <input
            type="number"
            step="1"
            min="0"
            placeholder="0"
            value={qtdMinima}
            onChange={(e) => setQtdMinima(e.target.value)}
          />

          {erroFormulario && (
            <span style={{ color: "#b3261e", fontSize: "14px" }}>{erroFormulario}</span>
          )}

          <div className="actions">
            <button
              type="button"
              className="btn btn-cancelar"
              onClick={() => {
                const fromLeitor = location?.state?.fromLeitor === true || sessionStorage.getItem("fromLeitor") === "true";
                console.log("fromLeitor:", fromLeitor);
                if (fromLeitor) {
                  sessionStorage.removeItem("fromLeitor");
                  navigate(-2);
                } else {
                  navigate(-1);
                }
              }}
            >
              Voltar
            </button>

            <button type="submit" className="btn" disabled={isCadastrando}>
              {isCadastrando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
          </form>
        </div>
      </div>

      {/* MODAL NOVA CATEGORIA */}
      <FormModal
        open={abrirModalCategoria}
        title="Nova Categoria de Insumo"
        onClose={() => {
          setErroModalCategoria("");
          setAbrirModalCategoria(false);
        }}
        isSaving={isCadastrandoCategoria}
        errorMessage={erroModalCategoria}
        onSave={async () => {
          setErroModalCategoria("");
          const nome = novaCategoriaNome.trim();
          const rotatividade = novaCategoriaRotatividade;

          if (!nome) {
            setErroModalCategoria("Informe o nome da categoria.");
            return;
          }

          if (rotatividade !== "false" && rotatividade !== "true") {
            setErroModalCategoria("Selecione uma rotatividade valida.");
            return;
          }

          try {
            setIsCadastrandoCategoria(true);
            await CategoriaApi.criar({
              nome,
              rotatividade: rotatividade === "true",
            });
            await fetchCategorias();
            setAbrirModalCategoria(false);
            setNovaCategoriaNome("");
            setNovaCategoriaRotatividade("false");
            setSuccessType("categoria");
            setAbrirModalSucesso(true);
          } catch {
            setErroModalCategoria("Nao foi possivel cadastrar a categoria.");
          } finally {
            setIsCadastrandoCategoria(false);
          }
        }}
      >
        <input
          className="modal-input"
          type="text"
          placeholder="Nome da categoria"
          value={novaCategoriaNome}
          onChange={(e) => setNovaCategoriaNome(e.target.value)}
        />

        <select
          className="modal-input"
          value={novaCategoriaRotatividade}
          onChange={(e) => setNovaCategoriaRotatividade(e.target.value)}
        >
          <option value="false">Rotatividade baixa</option>
          <option value="true">Rotatividade alta</option>
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
              onClick={() => {
                const fromLeitor = location?.state?.fromLeitor === true || sessionStorage.getItem("fromLeitor") === "true";
                if (fromLeitor && successType === "insumo") {
                  navigate(-2);
                } else {
                  setAbrirModalSucesso(false);
                }
              }}
            >
              OK
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
