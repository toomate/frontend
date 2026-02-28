import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchX, TriangleAlert } from "lucide-react";
import HeaderPadrao from "./HeaderPadrao";
import { FornecedorToolbar } from "./components/fornecedores/FornecedorToolbar";
import { FiltroCategoriaFornecedor } from "./components/fornecedores/FiltroCategoriaFornecedor";
import { FornecedorCard } from "./components/fornecedores/FornecedorCard";
import { NovoFornecedorModal } from "./components/fornecedores/NovoFornecedorModal";
import { NovaCategoriaModal } from "./components/fornecedores/NovaCategoriaModal";
import { BaseModal } from "./components/common/BaseModal";
import { CategoriaApi, FornecedorApi } from "./provider/Api";
import "./Fornecedor.css";

const estadoInicialForm = {
  razaoSocial: "",
  telefone: "",
};

const estadoInicialCategoriaForm = {
  nome: "",
  rotatividade: "true",
};

const categoriaTodas = { id: "todas", nome: "Todas" };

function parseRotatividadeBinaria(valor) {
  if (valor === true || valor === "true") {
    return true;
  }

  if (valor === false || valor === "false") {
    return false;
  }

  return null;
}

function mapearCategorias(response) {
  const lista = Array.isArray(response) ? response : response?.categorias ?? [];

  const categorias = lista
    .map((item) => {
      if (typeof item === "string") {
        return { id: item, nome: item, rotatividade: null };
      }

      const id = item?.idCategoria ?? item?.id;
      const nome = item?.nome ?? item?.categoria ?? item?.descricao ?? "";
      if (!id || !String(nome).trim()) return null;

      const rotatividade =
        parseRotatividadeBinaria(item?.rotatividade) ??
        parseRotatividadeBinaria(item?.altaRotatividade) ??
        parseRotatividadeBinaria(item?.giroRapido);

      return { id: String(id), nome: String(nome).trim(), rotatividade };
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

  return [categoriaTodas, ...unicas];
}

function mapearFornecedor(item) {
  return {
    id: item.idFornecedor ?? item.id,
    razaoSocial: item.razaoSocial ?? item.nome ?? "Fornecedor sem nome",
    telefone: item.telefone ?? "",
    link: item.link ?? "",
    categoria: item.categoria ?? item.nomeCategoria ?? item.categoriaNome ?? "Sem categoria",
  };
}

export default function Fornecedor() {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState([categoriaTodas]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(categoriaTodas.id);
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
      const lista = mapearCategorias(response);
      setCategorias(lista.length > 0 ? lista : [categoriaTodas]);
    } catch {
      setCategorias([categoriaTodas]);
    }
  }, []);

  const carregarFornecedores = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const response =
        categoriaSelecionada === categoriaTodas.id
          ? await FornecedorApi.listar()
          : await FornecedorApi.listarPorCategoria(categoriaSelecionada);

      const lista = Array.isArray(response) ? response : response?.fornecedores ?? [];
      setFornecedores(lista.map(mapearFornecedor));
    } catch (error) {
      setErro("Nao foi possivel carregar os fornecedores.");
      setFornecedores([]);
    } finally {
      setCarregando(false);
    }
  }, [categoriaSelecionada]);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  useEffect(() => {
    carregarFornecedores();
  }, [carregarFornecedores]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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
      };

      if (modoModal === "editar" && fornecedorSelecionado?.id) {
        await FornecedorApi.atualizar(fornecedorSelecionado.id, payload);
      } else {
        await FornecedorApi.criar(payload);
        exibirToast("Fornecedor cadastrado com sucesso.");
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

  async function salvarCategoria() {
    const nomeCategoria = formCategoria.nome.trim();
    const rotatividade = parseRotatividadeBinaria(formCategoria.rotatividade);

    if (!nomeCategoria) {
      setErro("Informe o nome da categoria.");
      return;
    }

    if (rotatividade === null) {
      setErro("Selecione a rotatividade da categoria.");
      return;
    }

    try {
      setSalvandoCategoria(true);
      setErro("");

      await CategoriaApi.criar({ nome: nomeCategoria, rotatividade });
      fecharModalCategoria();
      await carregarCategorias();
      exibirToast("Categoria cadastrada com sucesso.");
    } catch (error) {
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
    } catch (error) {
      setErro("Nao foi possivel excluir o fornecedor.");
    } finally {
      setExcluindo(false);
    }
  }

  const fornecedoresRender = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    let lista = [...fornecedores];

    if (termo) {
      lista = lista.filter((fornecedor) =>
        fornecedor.razaoSocial.toLowerCase().includes(termo)
      );
    }

    if (ordenacao === "alfabetica_desc") {
      return lista.sort((a, b) => b.razaoSocial.localeCompare(a.razaoSocial));
    }

    return lista.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial));
  }, [fornecedores, busca, ordenacao]);

  return (
    <div className="fornecedores-page">
      <HeaderPadrao />

      {toast.visivel && <div className={`fornecedores-toast ${toast.tipo}`}>{toast.mensagem}</div>}

      <main className="fornecedores-content">
        <FornecedorToolbar
          busca={busca}
          aoBuscar={onBuscar}
          ordenacao={ordenacao}
          aoMudarOrdenacao={setOrdenacao}
          aoAdicionar={abrirModalCriacao}
          aoAdicionarCategoria={abrirModalCategoria}
        />

        <FiltroCategoriaFornecedor
          categorias={categorias}
          categoriaSelecionada={categoriaSelecionada}
          aoMudarCategoria={setCategoriaSelecionada}
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
              Tente ajustar os filtros ou a busca. Se preferir, cadastre um novo fornecedor no
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

      <NovaCategoriaModal
        aberto={modalCategoriaAberto}
        aoFechar={fecharModalCategoria}
        aoSalvar={salvarCategoria}
        form={formCategoria}
        aoMudar={onChangeFormCategoria}
        salvando={salvandoCategoria}
      />

      <BaseModal
        aberto={confirmacaoExclusaoAberta}
        onClose={fecharConfirmacaoExclusao}
        title="Excluir fornecedor?"
        width={360}
        className="fornecedores-modal-confirmacao"
        footer={
          <>
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
          </>
        }
      >
        <div className="fornecedores-confirmacao-icone">
          <TriangleAlert size={28} />
        </div>
        <p>
          Essa acao remove <strong>{fornecedorSelecionado?.razaoSocial}</strong> da sua lista.
        </p>
      </BaseModal>
    </div>
  );
}
