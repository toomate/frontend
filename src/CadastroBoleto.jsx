import React, { useEffect, useState } from "react";
import "./App.css";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AutocompleteInput from "./components/common/AutocompleteInput";
import { boletos } from "./provider/Api";

export default function CadastroBoleto() {
  const navigate = useNavigate();

  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [novaCategoriaBoleto, setNovaCategoriaBoleto] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [isCadastrando, setIsCadastrando] = useState(false);

  async function cadastrarBoleto(event) {
    event.preventDefault();
    setErroFormulario("");

    try {
      setIsCadastrando(true);

      await boletos.criar({
        titulo,
        valor: parseFloat(valor),
        dataVencimento,
        categoria: categoriaSelecionada,
      });

      setAbrirModalSucesso(true);
      setTitulo("");
      setValor("");
      setDataVencimento("");
      setCategoriaSelecionada("");
    } catch (error) {
      console.error("Erro ao cadastrar boleto:", error);
      setErroFormulario("Nao foi possivel cadastrar o boleto. Tente novamente.");
    } finally {
      setIsCadastrando(false);
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

    carregarCategorias();
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
              <select
                className="selectCategoriaBoleto"
                value={categoriaSelecionada || ""}
                onChange={(e) => {
                  const selectedValue = e.target.value;

                  setCategoriaSelecionada(selectedValue);
                }}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria.label}>
                    {categoria.label}
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
