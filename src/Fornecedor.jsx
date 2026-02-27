import { useCallback, useEffect, useMemo, useState } from "react";
import { SearchX, TriangleAlert } from "lucide-react";
import HeaderPadrao from "./HeaderPadrao";
import { FornecedorToolbar } from "./components/fornecedores/FornecedorToolbar";
import { FornecedorCard } from "./components/fornecedores/FornecedorCard";
import { NovoFornecedorModal } from "./components/fornecedores/NovoFornecedorModal";
import { FornecedorApi } from "./provider/Api";
import "./Fornecedor.css";

const estadoInicialForm = {
  razaoSocial: "",
  telefone: "",
  link: "",
};

function mapearFornecedor(item) {
  return {
    id: item.idFornecedor ?? item.id,
    razaoSocial: item.razaoSocial ?? item.nome ?? "Fornecedor sem nome",
    telefone: item.telefone ?? "",
    link: item.link ?? "",
  };
}

export default function Fornecedor() {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("alfabetica");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState("criar");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [confirmacaoExclusaoAberta, setConfirmacaoExclusaoAberta] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [form, setForm] = useState(estadoInicialForm);

  const carregarFornecedores = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const response = await FornecedorApi.listar({ razaoSocial: busca });
      const lista = Array.isArray(response) ? response : response?.fornecedores ?? [];
      setFornecedores(lista.map(mapearFornecedor));
    } catch (error) {
      setErro("Nao foi possivel carregar os fornecedores.");
      setFornecedores([]);
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  useEffect(() => {
    carregarFornecedores();
  }, [carregarFornecedores]);

  function onBuscar(valor) {
    setBusca(valor);
  }

  function limparForm() {
    setForm(estadoInicialForm);
  }

  function abrirModalCriacao() {
    setModoModal("criar");
    setFornecedorSelecionado(null);
    limparForm();
    setModalAberto(true);
  }

  function abrirModalEdicao(fornecedor) {
    setModoModal("editar");
    setFornecedorSelecionado(fornecedor);
    setForm({
      razaoSocial: fornecedor.razaoSocial ?? "",
      telefone: fornecedor.telefone ?? "",
      link: fornecedor.link ?? "",
    });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setFornecedorSelecionado(null);
    limparForm();
  }

  function abrirConfirmacaoExclusao(fornecedor) {
    setFornecedorSelecionado(fornecedor);
    setConfirmacaoExclusaoAberta(true);
  }

  function fecharConfirmacaoExclusao() {
    setConfirmacaoExclusaoAberta(false);
    setFornecedorSelecionado(null);
  }

  function onChangeForm(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function salvarFornecedor() {
    if (!form.razaoSocial.trim()) {
      setErro("Informe a razao social para salvar.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      const payload = {
        razaoSocial: form.razaoSocial.trim(),
        telefone: form.telefone.trim(),
        link: form.link.trim(),
      };

      if (modoModal === "editar" && fornecedorSelecionado?.id) {
        await FornecedorApi.atualizar(fornecedorSelecionado.id, payload);
      } else {
        await FornecedorApi.criar(payload);
      }

      fecharModal();
      await carregarFornecedores();
    } catch (error) {
      setErro(
        modoModal === "editar"
          ? "Nao foi possivel atualizar o fornecedor."
          : "Nao foi possivel salvar o fornecedor."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirFornecedor() {
    if (!fornecedorSelecionado?.id) {
      setErro("Fornecedor invalido para exclusao.");
      return;
    }

    try {
      setExcluindo(true);
      setErro("");
      await FornecedorApi.excluir(fornecedorSelecionado.id);
      fecharConfirmacaoExclusao();
      await carregarFornecedores();
    } catch (error) {
      setErro("Nao foi possivel excluir o fornecedor.");
    } finally {
      setExcluindo(false);
    }
  }

  const fornecedoresRender = useMemo(() => {
    const lista = [...fornecedores];

    if (ordenacao === "alfabetica_desc") {
      return lista.sort((a, b) => b.razaoSocial.localeCompare(a.razaoSocial));
    }

    return lista.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial));
  }, [fornecedores, ordenacao]);

  return (
    <div className="fornecedores-page">
      <HeaderPadrao />

      <main className="fornecedores-content">
        <FornecedorToolbar
          busca={busca}
          aoBuscar={onBuscar}
          ordenacao={ordenacao}
          aoMudarOrdenacao={setOrdenacao}
          aoAdicionar={abrirModalCriacao}
        />

        {erro && <p className="fornecedores-erro">{erro}</p>}

        {carregando ? (
          <p className="fornecedores-mensagem">Carregando fornecedores...</p>
        ) : fornecedoresRender.length > 0 ? (
          <section className="fornecedores-grid">
            {fornecedoresRender.map((fornecedor) => (
              <FornecedorCard
                key={fornecedor.id ?? fornecedor.razaoSocial}
                fornecedor={fornecedor}
                onEditar={abrirModalEdicao}
                onExcluir={abrirConfirmacaoExclusao}
              />
            ))}
          </section>
        ) : (
          <section className="fornecedores-empty-state">
            <div className="fornecedores-empty-icon">
              <SearchX size={30} />
            </div>
            <h3>Nenhum fornecedor encontrado</h3>
            <p>
              Tente ajustar a busca. Se preferir, cadastre um novo fornecedor no
              botao <strong>+</strong>.
            </p>
          </section>
        )}
      </main>

      <NovoFornecedorModal
        aberto={modalAberto}
        aoFechar={fecharModal}
        aoSalvar={salvarFornecedor}
        form={form}
        aoMudar={onChangeForm}
        salvando={salvando}
        titulo={modoModal === "editar" ? "Editar fornecedor" : "Novo fornecedor"}
        textoBotao={modoModal === "editar" ? "Atualizar" : "Salvar"}
      />

      {confirmacaoExclusaoAberta && (
        <div className="fornecedores-modal-overlay" role="presentation">
          <div
            className="fornecedores-modal fornecedores-modal-confirmacao"
            role="dialog"
            aria-modal="true"
          >
            <div className="fornecedores-confirmacao-icone">
              <TriangleAlert size={28} />
            </div>
            <h3>Excluir fornecedor?</h3>
            <p>
              Essa acao remove <strong>{fornecedorSelecionado?.razaoSocial}</strong>
              {" "}da sua lista.
            </p>
            <div className="fornecedores-modal-actions">
              <button
                type="button"
                className="fornecedores-btn-cancelar"
                onClick={fecharConfirmacaoExclusao}
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="fornecedores-btn-salvar fornecedores-btn-excluir"
                onClick={excluirFornecedor}
                disabled={excluindo}
              >
                {excluindo ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
