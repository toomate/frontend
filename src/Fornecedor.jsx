import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchX, TriangleAlert, Trash2, Save } from "lucide-react";
import HeaderPadrao from "./HeaderPadrao";
import { FornecedorToolbar } from "./components/fornecedores/FornecedorToolbar";
import { FornecedorCard } from "./components/fornecedores/FornecedorCard";
import SeletorPaginas from "./components/Paginas/SeletorPaginas";
import { NovoFornecedorModal } from "./components/fornecedores/NovoFornecedorModal";
import { NovaCategoriaModal } from "./components/fornecedores/NovaCategoriaModal";
import { BaseModal } from "./components/common/BaseModal";
import { CategoriaApi, FornecedorApi } from "./provider/Api";
import "./Fornecedor.css";

const ITENS_POR_PAGINA = 9;

const estadoInicialForm = {
  razaoSocial: "",
  telefone: "",
  linkWhatsapp: "",
};

const estadoInicialCategoriaForm = {
  nome: "",
};

function mapearCategorias(response) {
  const lista = Array.isArray(response) ? response : response?.categorias ?? [];

  const categorias = lista
    .map((item) => {
      if (typeof item === "string") {
        return { id: item, nome: item };
      }

      const id = item?.idCategoria ?? item?.id;
      const nome = item?.nome ?? item?.categoria ?? item?.descricao ?? "";
      if (!id || !String(nome).trim()) return null;

      return { id: String(id), nome: String(nome).trim() };
    })
    .filter(Boolean);

  const unicas = [];
  const vistos = new Set();
  categorias.forEach((categoria) => {
    if (!vistos.has(categoria.id)) {
      vistos.add(categoria.id);
      unicas.push(categoria);
    }
  });

  return unicas;
}

function mapearFornecedor(item) {
  return {
    id: item.idFornecedor ?? item.id,
    razaoSocial: item.razaoSocial ?? item.nome ?? "Fornecedor sem nome",
    telefone: item.telefone ?? "",
    linkWhatsapp: item.linkWhatsapp ?? item.link ?? "",
    categoria: item.categoria ?? item.nomeCategoria ?? item.categoriaNome ?? "Sem categoria",
  };
}


export default function Fornecedor() {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [ordenacao, setOrdenacao] = useState("alfabetica");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [modalCategoriaAberto, setModalCategoriaAberto] = useState(false);
  const [modoModal, setModoModal] = useState("criar");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [confirmacaoExclusaoAberta, setConfirmacaoExclusaoAberta] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvandoCategoria, setSalvandoCategoria] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [form, setForm] = useState(estadoInicialForm);
  const [formCategoria, setFormCategoria] = useState(estadoInicialCategoriaForm);
  const [toast, setToast] = useState({ visivel: false, tipo: "sucesso", mensagem: "" });
  const toastTimerRef = useRef(null);

  useEffect(() => {
    document.title = "Fornecedores";
  }, []);

  function exibirToast(mensagem, tipo = "sucesso") {
    setToast({ visivel: true, tipo, mensagem });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visivel: false }));
    }, 2600);
  }

  const carregarCategorias = useCallback(async () => {
    try {
      const response = await CategoriaApi.listar();
      setCategorias(mapearCategorias(response));
    } catch {
      setCategorias([]);
    }
  }, []);

  const carregarFornecedores = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      let itens;

      if (categoriasSelecionadas.length === 0) {
        const response = await FornecedorApi.listar({pagina: paginaAtual});
        itens = Array.isArray(response) ? response : response?.conteudo ?? response?.fornecedores ?? [];
        setTotalPaginas(response.totalPaginas)
      } else {
        const respostas = await Promise.all(
          categoriasSelecionadas.map((id) => FornecedorApi.listarPorCategoria(id, { tamanho: 999 }))
        );
        const todos = respostas.flatMap((r) =>
          Array.isArray(r) ? r : r?.conteudo ?? r?.fornecedores ?? []
        );
        const vistos = new Set();
        itens = todos.filter((item) => {
          const id = item.idFornecedor ?? item.id;
          if (vistos.has(id)) return false;
          vistos.add(id);
          return true;
        });
      }

      setFornecedores(itens.map(mapearFornecedor));
    } catch {
      setErro("Nao foi possivel carregar os fornecedores.");
      setFornecedores([]);
    } finally {
      setCarregando(false);
    }
  }, [categoriasSelecionadas, paginaAtual]);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  useEffect(() => {
    carregarFornecedores();
  }, [carregarFornecedores, paginaAtual]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function aoToggleCategoria(id) {
    setCategoriasSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function aoLimparCategorias() {
    setCategoriasSelecionadas([]);
  }

  function aoToggleFornecedor(id) {
    setFornecedoresSelecionados((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function aoLimparFornecedores() {
    setFornecedoresSelecionados([]);
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

  function abrirModalCategoria() {
    setFormCategoria(estadoInicialCategoriaForm);
    setModalCategoriaAberto(true);
  }

  function abrirModalEdicao(fornecedor) {
    setModoModal("editar");
    setFornecedorSelecionado(fornecedor);
    setForm({
      razaoSocial: fornecedor.razaoSocial ?? "",
      telefone: fornecedor.telefone ?? "",
      linkWhatsapp: fornecedor.linkWhatsapp ?? "",
    });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setFornecedorSelecionado(null);
    limparForm();
  }

  function fecharModalCategoria() {
    setModalCategoriaAberto(false);
    setFormCategoria(estadoInicialCategoriaForm);
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

  function onChangeFormCategoria(event) {
    const { name, value } = event.target;
    setFormCategoria((prev) => ({ ...prev, [name]: value }));
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
        linkWhatsapp: form.linkWhatsapp.trim(),
      };

      if (modoModal === "editar" && fornecedorSelecionado?.id) {
        await FornecedorApi.atualizar(fornecedorSelecionado.id, payload);
      } else {
        await FornecedorApi.criar(payload);
        exibirToast("Fornecedor cadastrado com sucesso.");
      }

      fecharModal();
      await carregarFornecedores();
    } catch {
      setErro(
        modoModal === "editar"
          ? "Nao foi possivel atualizar o fornecedor."
          : "Nao foi possivel salvar o fornecedor."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function salvarCategoria() {
    const nomeCategoria = formCategoria.nome.trim();

    if (!nomeCategoria) {
      setErro("Informe o nome da categoria.");
      return;
    }

    try {
      setSalvandoCategoria(true);
      setErro("");

      await CategoriaApi.criar({ nome: nomeCategoria });
      fecharModalCategoria();
      await carregarCategorias();
      exibirToast("Categoria cadastrada com sucesso.");
    } catch {
      setErro("Nao foi possivel cadastrar a categoria.");
    } finally {
      setSalvandoCategoria(false);
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
    } catch {
      setErro("Nao foi possivel excluir o fornecedor.");
    } finally {
      setExcluindo(false);
    }
  }


  return (
    <div className="fornecedores-page">
      <HeaderPadrao />

      {toast.visivel && <div className={`fornecedores-toast ${toast.tipo}`}>{toast.mensagem}</div>}


      <main className="fornecedores-content">
        {/* 1º bloco: Toolbar */}
        <div className="fornecedores-bloco-toolbar">
          <FornecedorToolbar
            busca={busca}
            aoBuscar={setBusca}
            ordenacao={ordenacao}
            aoMudarOrdenacao={setOrdenacao}
            aoAdicionar={abrirModalCriacao}
            aoAdicionarCategoria={abrirModalCategoria}
            categorias={categorias}
            categoriasSelecionadas={categoriasSelecionadas}
            aoToggleCategoria={aoToggleCategoria}
            aoLimparCategorias={aoLimparCategorias}
            fornecedores={fornecedores}
            fornecedoresSelecionados={fornecedoresSelecionados}
            aoToggleFornecedor={aoToggleFornecedor}
            aoLimparFornecedores={aoLimparFornecedores}
          />
        </div>
        {/* 3º bloco: Cards */}
        <div className="fornecedores-bloco-cards">
          {erro && <p className="fornecedores-erro">{erro}</p>}

          {carregando ? (
            <p className="fornecedores-mensagem">Carregando fornecedores...</p>
          ) : fornecedores.length > 0 ? (
            <section className="fornecedores-grid">
              {fornecedores.map((fornecedor) => (
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
                Tente ajustar os filtros ou a busca. Se preferir, cadastre um novo fornecedor no
                botao <strong>+</strong>.
              </p>
            </section>
          )}
        </div>
      </main>

      {/* MODAL NOVO/EDITAR FORNECEDOR */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="titulo">
              {modoModal === "editar"
                ? "Editar fornecedor"
                : "Novo fornecedor"}
            </span>

            <input
              className="modal-input"
              type="text"
              name="razaoSocial"
              placeholder="Razão social"
              value={form.razaoSocial}
              onChange={onChangeForm}
            />

            <input
              className="modal-input"
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={form.telefone}
              onChange={onChangeForm}
            />

            <input
              className="modal-input"
              type="text"
              name="linkWhatsapp"
              placeholder="Link do WhatsApp"
              value={form.linkWhatsapp}
              onChange={onChangeForm}
            />

            <div className="modal-actions">
              <button
                className="btn btn-cancelar"
                onClick={fecharModal}
              >
                Cancelar <Trash2 size={14} />
              </button>

              <button
                className="btn"
                onClick={salvarFornecedor}
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : modoModal === "editar"
                  ? "Atualizar"
                  : "Salvar"}{" "}
                <Save size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA CATEGORIA */}
      {modalCategoriaAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="titulo">
              Nova categoria
            </span>

            <input
              className="modal-input"
              type="text"
              name="nome"
              placeholder="Nome da categoria"
              value={formCategoria.nome}
              onChange={onChangeFormCategoria}
            />

            <div className="modal-actions">
              <button
                className="btn btn-cancelar"
                onClick={fecharModalCategoria}
              >
                Cancelar <Trash2 size={14} />
              </button>

              <button
                className="btn"
                onClick={salvarCategoria}
                disabled={salvandoCategoria}
              >
                {salvandoCategoria
                  ? "Salvando..."
                  : "Salvar"}{" "}
                <Save size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO EXCLUSÃO */}
      {confirmacaoExclusaoAberta && (
        <div className="modal-overlay">
          <div className="modal">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <TriangleAlert size={50} />
            </div>

            <span className="titulo">
              Excluir fornecedor?
            </span>

            <p
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Essa ação remove{" "}
              <strong>
                {fornecedorSelecionado?.razaoSocial}
              </strong>{" "}
              da sua lista.
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-cancelar"
                onClick={fecharConfirmacaoExclusao}
                disabled={excluindo}
              >
                Cancelar <Trash2 size={14} />
              </button>

              <button
                className="btn"
                onClick={excluirFornecedor}
                disabled={excluindo}
              >
                {excluindo
                  ? "Excluindo..."
                  : "Excluir"}{" "}
                <TriangleAlert size={14} />
              </button>
            </div>
          </div>
        </div>
        )}

      {/* 2º bloco: Paginação */}
      <div className="fornecedores-bloco-paginacao">
        <div className="fornecedores-paginacao">
          <SeletorPaginas
            avancar={() =>
              setPaginaAtual((p) => Math.min(p + 1, totalPaginas - 1))
            }
            voltar={() =>
              setPaginaAtual((p) => Math.max(p - 1, 0))
            }
            selecionar={setPaginaAtual}
            numPages={totalPaginas}
            paginaSelecionada={paginaAtual}
          />
        </div>
      </div>
    </div>
  );
}
