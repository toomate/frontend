import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ImageOff, Search, X } from "lucide-react";
import { ArquivoApi } from "../../provider/Api";
import "./AdminComprovantes.css";

// categoria (discriminador do backend) -> rótulo + classe de cor da tag
const CONFIG_CATEGORIA = {
  NOTA_FISCAL: { rotulo: "Nota Fiscal", classe: "nf" },
  CONSUMO: { rotulo: "Consumo", classe: "consumo" },
  PAGAMENTO: { rotulo: "Pagamento", classe: "pagamento" },
};

const ABAS = [
  { id: "compra", rotulo: "Compra (Nota Fiscal)" },
  { id: "fiado", rotulo: "Fiado" },
  { id: "boletos", rotulo: "Boletos" },
];

function abaDoComprovante(comprovante) {
  const tipo = String(comprovante.tipoEntidade ?? "").toLowerCase();
  if (tipo === "divida") return "fiado";
  if (tipo === "lote") return "compra";
  if (tipo === "boleto") return "boletos";
  return "outros";
}

function subtipoFiado(comprovante) {
  return String(comprovante.categoria ?? "").toUpperCase() === "PAGAMENTO"
    ? "pagamento"
    : "consumo";
}

function configCategoria(comprovante) {
  const chave = String(comprovante.categoria ?? "").toUpperCase();
  return CONFIG_CATEGORIA[chave] ?? { rotulo: "Comprovante", classe: "nf" };
}

function normalizar(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

// "YYYY-MM-DD" -> "DD/MM/YYYY" sem shift de fuso
function formatarData(data) {
  if (!data) return "";
  const match = String(data).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  return String(data);
}

function formatarValor(valor) {
  if (valor === null || valor === undefined || valor === "") return "";
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return "";
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CartaoComprovante({ comprovante, aoAbrir }) {
  const [urlImagem, setUrlImagem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    let urlCriada = null;

    async function carregarImagem() {
      setCarregando(true);
      setErro(false);
      try {
        const url = await ArquivoApi.buscarImagemUrl(
          comprovante.nomeBucket,
          comprovante.chave
        );
        if (!ativo) {
          URL.revokeObjectURL(url);
          return;
        }
        urlCriada = url;
        setUrlImagem(url);
      } catch {
        if (ativo) setErro(true);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarImagem();

    return () => {
      ativo = false;
      if (urlCriada) URL.revokeObjectURL(urlCriada);
    };
  }, [comprovante.nomeBucket, comprovante.chave]);

  const categoria = configCategoria(comprovante);
  const podeAbrir = Boolean(urlImagem) && !erro;
  const ehFiado = abaDoComprovante(comprovante) === "fiado";

  return (
    <button
      type="button"
      className="comprovante-card"
      onClick={() => podeAbrir && aoAbrir({ ...comprovante, urlImagem })}
      disabled={!podeAbrir}
    >
      <div className="comprovante-thumb">
        {carregando ? (
          <span className="comprovante-thumb-spinner" aria-label="Carregando" />
        ) : erro ? (
          <span className="comprovante-thumb-erro">
            <ImageOff size={24} />
            Indisponível
          </span>
        ) : (
          <img src={urlImagem} alt={comprovante.titulo || "Comprovante"} loading="lazy" />
        )}

        <div className="comprovante-thumb-tags">
          <span className={`comprovante-tag comprovante-tag-${categoria.classe}`}>
            {categoria.rotulo}
          </span>
          {ehFiado && comprovante.pago !== null && comprovante.pago !== undefined && (
            <span
              className={`comprovante-tag comprovante-tag-status ${
                comprovante.pago ? "pago" : "aberto"
              }`}
            >
              {comprovante.pago ? "Pago" : "Em aberto"}
            </span>
          )}
        </div>
      </div>

      <div className="comprovante-info">
        <span className="comprovante-titulo" title={comprovante.titulo}>
          {comprovante.titulo || "Sem identificação"}
        </span>
        {comprovante.subtitulo && (
          <span className="comprovante-subtitulo" title={comprovante.subtitulo}>
            {comprovante.subtitulo}
          </span>
        )}
        <span className="comprovante-rodape">
          {comprovante.dataReferencia && (
            <span>{formatarData(comprovante.dataReferencia)}</span>
          )}
          {formatarValor(comprovante.valor) && (
            <strong>{formatarValor(comprovante.valor)}</strong>
          )}
        </span>
      </div>
    </button>
  );
}

export default function AdminComprovantes() {
  const [comprovantes, setComprovantes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [aba, setAba] = useState("compra");
  const [busca, setBusca] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [filtroPago, setFiltroPago] = useState("todos"); // todos | pago | aberto
  const [filtroSubtipo, setFiltroSubtipo] = useState("todos"); // todos | consumo | pagamento

  const [gruposFechados, setGruposFechados] = useState({});
  const [comprovanteAberto, setComprovanteAberto] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function buscar() {
      setCarregando(true);
      setErro("");
      try {
        const dados = await ArquivoApi.listarComprovantes();
        if (!ativo) return;
        setComprovantes(Array.isArray(dados) ? dados : []);
      } catch {
        if (!ativo) return;
        setErro("Não foi possível carregar os comprovantes.");
        setComprovantes([]);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscar();
    return () => {
      ativo = false;
    };
  }, []);

  // Fecha o lightbox com Esc
  useEffect(() => {
    if (!comprovanteAberto) return;
    function aoTeclar(evento) {
      if (evento.key === "Escape") setComprovanteAberto(null);
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [comprovanteAberto]);

  const contagensAba = useMemo(() => {
    const total = { compra: 0, fiado: 0, boletos: 0, outros: 0 };
    comprovantes.forEach((c) => {
      const id = abaDoComprovante(c);
      total[id] = (total[id] ?? 0) + 1;
    });
    return total;
  }, [comprovantes]);

  const ehFiado = aba === "fiado";

  // Pipeline de filtragem da aba atual
  const comprovantesFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return comprovantes
      .filter((c) => abaDoComprovante(c) === aba)
      .filter((c) => {
        if (!termo) return true;
        const alvo = normalizar(
          `${c.titulo ?? ""} ${c.subtitulo ?? ""} ${c.grupo ?? ""} ${c.nomeOriginal ?? ""}`
        );
        return alvo.includes(termo);
      })
      .filter((c) => {
        const data = String(c.dataReferencia ?? "");
        if (dataInicial && (!data || data < dataInicial)) return false;
        if (dataFinal && (!data || data > dataFinal)) return false;
        return true;
      })
      .filter((c) => {
        if (!ehFiado) return true;
        if (filtroPago === "pago" && c.pago !== true) return false;
        if (filtroPago === "aberto" && c.pago === true) return false;
        if (filtroSubtipo !== "todos" && subtipoFiado(c) !== filtroSubtipo) return false;
        return true;
      });
  }, [comprovantes, aba, busca, dataInicial, dataFinal, ehFiado, filtroPago, filtroSubtipo]);

  // Agrupamento por cliente (fiado) / fornecedor (compra)
  const grupos = useMemo(() => {
    const mapa = new Map();
    comprovantesFiltrados.forEach((c) => {
      const chave = c.grupo || "Outros";
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave).push(c);
    });

    return Array.from(mapa.entries())
      .map(([nome, itens]) => ({
        nome,
        itens: [...itens].sort((a, b) =>
          String(b.dataReferencia ?? "").localeCompare(String(a.dataReferencia ?? ""))
        ),
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [comprovantesFiltrados]);

  const buscaAtiva = normalizar(busca).length > 0;

  function grupoEstaAberto(nome) {
    if (buscaAtiva) return true; // busca força expandir os resultados
    return !gruposFechados[nome];
  }

  function alternarGrupo(nome) {
    setGruposFechados((atual) => ({ ...atual, [nome]: !atual[nome] }));
  }

  function trocarAba(novaAba) {
    setAba(novaAba);
    setBusca("");
    setFiltroPago("todos");
    setFiltroSubtipo("todos");
    setGruposFechados({});
  }

  const placeholderBusca =
    aba === "fiado"
      ? "Buscar por cliente ou pedido..."
      : aba === "boletos"
        ? "Buscar por descrição ou categoria..."
        : "Buscar por insumo, marca ou fornecedor...";

  return (
    <section className="admin-card admin-comprovantes-card">
      <header className="admin-comprovantes-header">
        <h2>Comprovantes</h2>
        <p>Notas fiscais de compra e comprovantes de fiado (consumo e pagamento).</p>
      </header>

      {/* Abas principais */}
      <div className="admin-comprovantes-abas" role="tablist">
        {ABAS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={aba === item.id}
            className={`admin-comprovantes-aba ${aba === item.id ? "ativo" : ""}`}
            onClick={() => trocarAba(item.id)}
          >
            {item.rotulo}
            <span className="admin-comprovantes-aba-contagem">
              {contagensAba[item.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Busca + filtros */}
      <div className="admin-comprovantes-filtros">
        <div className="admin-comprovantes-busca">
          <Search size={16} />
          <input
            type="text"
            placeholder={placeholderBusca}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button type="button" onClick={() => setBusca("")} aria-label="Limpar busca">
              <X size={15} />
            </button>
          )}
        </div>

        <div className="admin-comprovantes-filtro-data">
          <label>
            De
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
            />
          </label>
          <label>
            Até
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Filtros extras só do fiado */}
      {ehFiado && (
        <div className="admin-comprovantes-chips">
          <div className="admin-comprovantes-chip-grupo">
            {[
              { id: "todos", rotulo: "Todos" },
              { id: "consumo", rotulo: "Consumo" },
              { id: "pagamento", rotulo: "Pagamento" },
            ].map((opcao) => (
              <button
                key={opcao.id}
                type="button"
                className={`admin-comprovantes-chip ${filtroSubtipo === opcao.id ? "ativo" : ""}`}
                onClick={() => setFiltroSubtipo(opcao.id)}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>
          <div className="admin-comprovantes-chip-grupo">
            {[
              { id: "todos", rotulo: "Pago e aberto" },
              { id: "aberto", rotulo: "Em aberto" },
              { id: "pago", rotulo: "Pago" },
            ].map((opcao) => (
              <button
                key={opcao.id}
                type="button"
                className={`admin-comprovantes-chip ${filtroPago === opcao.id ? "ativo" : ""}`}
                onClick={() => setFiltroPago(opcao.id)}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados agrupados */}
      <div className="admin-comprovantes-resultados">
        {carregando ? (
          <p className="admin-empty-list">Carregando comprovantes...</p>
        ) : erro ? (
          <p className="admin-empty-list" style={{ color: "#c92c2c" }}>
            {erro}
          </p>
        ) : grupos.length > 0 ? (
          grupos.map((grupo) => {
            const aberto = grupoEstaAberto(grupo.nome);
            return (
              <div className="comprovante-grupo" key={grupo.nome}>
                <button
                  type="button"
                  className={`comprovante-grupo-cabecalho ${aberto ? "aberto" : ""}`}
                  onClick={() => alternarGrupo(grupo.nome)}
                  aria-expanded={aberto}
                >
                  <ChevronDown size={18} className="comprovante-grupo-chevron" />
                  <span className="comprovante-grupo-nome">{grupo.nome}</span>
                  <span className="comprovante-grupo-contagem">{grupo.itens.length}</span>
                </button>

                {aberto && (
                  <div className="admin-comprovantes-grid">
                    {grupo.itens.map((comprovante) => (
                      <CartaoComprovante
                        key={comprovante.id}
                        comprovante={comprovante}
                        aoAbrir={setComprovanteAberto}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="admin-empty-list">Nenhum comprovante encontrado.</p>
        )}
      </div>

      {/* Lightbox */}
      {comprovanteAberto && (
        <div
          className="comprovante-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setComprovanteAberto(null)}
        >
          <div className="comprovante-lightbox-conteudo" onClick={(e) => e.stopPropagation()}>
            <div className="comprovante-lightbox-topo">
              <div className="comprovante-lightbox-titulo">
                <span
                  className={`comprovante-tag comprovante-tag-${configCategoria(comprovanteAberto).classe}`}
                >
                  {configCategoria(comprovanteAberto).rotulo}
                </span>
                <div className="comprovante-lightbox-textos">
                  <span className="comprovante-titulo">
                    {comprovanteAberto.titulo || "Comprovante"}
                  </span>
                  {comprovanteAberto.subtitulo && (
                    <span className="comprovante-subtitulo">{comprovanteAberto.subtitulo}</span>
                  )}
                  <span className="comprovante-lightbox-meta">
                    {[
                      formatarData(comprovanteAberto.dataReferencia),
                      formatarValor(comprovanteAberto.valor),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="comprovante-lightbox-fechar"
                onClick={() => setComprovanteAberto(null)}
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="comprovante-lightbox-imagem">
              <img
                src={comprovanteAberto.urlImagem}
                alt={comprovanteAberto.titulo || "Comprovante"}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
