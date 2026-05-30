import React, { useState } from "react";
import "./App.css";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FornecedorApi } from "./provider/Api";

export default function CadastroFornecedor() {
  const navigate = useNavigate();

  const [abrirModalSucesso, setAbrirModalSucesso] = useState(false);
  const [razaoSocial, setRazaoSocial] = useState("");
  const [telefone, setTelefone] = useState("");
  const [linkWhatsapp, setLinkWhatsapp] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [isCadastrando, setIsCadastrando] = useState(false);

  async function cadastrarFornecedor(event) {
    event.preventDefault();
    setErroFormulario("");

    const razaoSocialLimpa = razaoSocial.trim();
    const telefoneLimpo = telefone.replace(/\D/g, "");

    if (!razaoSocialLimpa) {
      setErroFormulario("Informe a razao social.");
      return;
    }

    if (!telefoneLimpo) {
      setErroFormulario("Informe o telefone.");
      return;
    }

    try {
      setIsCadastrando(true);
      await FornecedorApi.criar({
        razaoSocial: razaoSocialLimpa,
        telefone: telefoneLimpo,
      });

      setRazaoSocial("");
      setTelefone("");
      setLinkWhatsapp("");
      setAbrirModalSucesso(true);
    } catch (error) {
      if (error?.response?.status === 409) {
        setErroFormulario("Ja existe fornecedor com essa razao social.");
      } else {
        setErroFormulario("Nao foi possivel cadastrar o fornecedor. Tente novamente.");
      }
    } finally {
      setIsCadastrando(false);
    }
  }

  return (
    <div className="container">
      
      <div className="box">

        <span className="titulo">Cadastro de Fornecedor</span>

        <div className="caixa">
          <form onSubmit={cadastrarFornecedor}>
          <span>Razão Social</span>
          <input
            type="text"
            placeholder="Nome do Estabelecimento"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
          />
          
          <span>Telefone</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="(XX) XXXXX-XXXX"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <span>Link do Whatsapp</span>
          <input
            type="text"
            placeholder="www.linkwhatsapp.com/nomefornecedor"
            value={linkWhatsapp}
            onChange={(e) => setLinkWhatsapp(e.target.value)}
          />

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
                navigate(-1);
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
