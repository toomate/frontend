import React, { useEffect, useState } from "react";
import "./App.css";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CategoriaApi, insumos } from "./provider/Api";

export default function CadastroInsumo() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [nomeInsumo, setNomeInsumo] = useState("");
  const [idCategoria, setIdCategoria] = useState("0");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [mostrarSugestoesUnidade, setMostrarSugestoesUnidade] = useState(false);
  const [qtdMinima, setQtdMinima] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [isCadastrando, setIsCadastrando] = useState(false);

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
  }, []);


  const [abrirModalCategoria, setAbrirModalCategoria] = useState(false);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
  const [novaCategoriaRotatividade, setNovaCategoriaRotatividade] = useState("0");

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

  const medidasDisponiveis =
    Array.isArray(medidas) && medidas.length > 0 ? medidas : ["Kg", "Unidade", "Litro"];

  const medidasNormalizadas = Array.from(
    new Set(
      medidasDisponiveis
        .map((medida) => String(medida ?? "").trim())
        .filter(Boolean)
    )
  );

  const termoUnidade = unidadeMedida.trim().toLowerCase();
  const sugestoesUnidade = medidasNormalizadas
    .filter((medida) => medida.toLowerCase().includes(termoUnidade))
    .slice(0, 6);

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

            <button type="button" className="eye-btn1" onClick={() => setAbrirModalCategoria(true)}>
              <Plus size={18} />
            </button>
          </div>

          {/* Unidade */}
          <span>Unidade de Medida</span>
          <div className="input-wrapper" style={{ position: "relative" }}>
            <input
              className="selectUnidade"
              placeholder="Selecione ou digite"
              value={unidadeMedida}
              onFocus={() => setMostrarSugestoesUnidade(true)}
              onBlur={() => {
                setTimeout(() => setMostrarSugestoesUnidade(false), 120);
              }}
              onChange={(e) => {
                setUnidadeMedida(e.target.value);
                setMostrarSugestoesUnidade(true);
              }}
            />

            {mostrarSugestoesUnidade && sugestoesUnidade.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #d9d9d9",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  boxShadow: "0 6px 14px rgba(0, 0, 0, 0.08)",
                  maxHeight: "180px",
                  overflowY: "auto",
                  zIndex: 20,
                }}
              >
                {sugestoesUnidade.map((medida) => (
                  <button
                    key={medida}
                    type="button"
                    onMouseDown={() => {
                      setUnidadeMedida(medida);
                      setMostrarSugestoesUnidade(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {medida}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span>Quantidade Mínima</span>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={qtdMinima}
            onChange={(e) => setQtdMinima(e.target.value)}
          />

          {erroFormulario && (
            <span style={{ color: "#b3261e", fontSize: "14px" }}>{erroFormulario}</span>
          )}

          <div className="actions">
            <button type="button" className="btn btn-cancelar" onClick={() => navigate("/dashboard")}>
              Cancelar
            </button>

            <button type="submit" className="btn" disabled={isCadastrando}>
              {isCadastrando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
          </form>
        </div>
      </div>

      {/* MODAL NOVA CATEGORIA */}
      {abrirModalCategoria && (
        <div className="modal-overlay">
          <div className="modal">

            <span className="titulo">
              Nova Categoria de Insumo
            </span>

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

            <div className="modal-actions">
              <button
                className="btn btn-cancelar"
                onClick={() => setAbrirModalCategoria(false)}
              >
                Cancelar <Trash2 size={14} />
              </button>

              <button
                className="btn"
                onClick={async () => {
                  const nome = novaCategoriaNome.trim();
                  const rotatividade = novaCategoriaRotatividade;

                  if (!nome) return;
                  if (rotatividade !== "false" && rotatividade !== "true") return;

                  try {
                    await CategoriaApi.criar({
                      nome,
                      rotatividade: rotatividade === "true",
                    });
                    await fetchCategorias();
                    setAbrirModalCategoria(false);
                    setNovaCategoriaNome("");
                    setNovaCategoriaRotatividade("false");
                    setAbrirModalSucesso(true);
                  } catch {
                    setErroFormulario("Nao foi possivel cadastrar a categoria.");
                  }
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
