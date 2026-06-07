import { useState, useEffect, useMemo, useLayoutEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./Boletos.css";
import { CalendarDays, Search } from "lucide-react";
import HeaderPadrao from "../../HeaderPadrao";
import BoletoDetail from "../../components/Calendario/boletoDetail";
import { boletos } from '../../provider/Api';
import { Plus } from 'lucide-react';
import SeletorPaginas from '../../components/Paginas/SeletorPaginas'

export default function Boletos() {
  const navigate = useNavigate();
  const [boletoLista, setBoletos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(4);
  const mesAtual = String(new Date().getMonth());
  const categorias = Array.from(new Set(boletoLista.map((b) => b.categoria).filter(Boolean)));
  const [filtroMes, setFiltroMes] = useState(mesAtual);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [selectedBoletos, setSelectedBoletos] = useState([]);
  const filtrosRef = useRef(null);
  const paginacaoRef = useRef(null);
  const listaRef = useRef(null);
  const itemMedidaRef = useRef(null);

  function abrirModalBoleto(boleto) {
    setSelectedBoletos([boleto]);
  }

  function atualizarStatusBoleto(idBoleto, pago) {
    setBoletos((estadoAtual) =>
      estadoAtual.map((boleto) =>
        boleto.id === idBoleto ? { ...boleto, status: pago } : boleto,
      ),
    );

    setSelectedBoletos((estadoAtual) =>
      estadoAtual.map((boleto) =>
        boleto.id === idBoleto ? { ...boleto, status: pago } : boleto,
      ),
    );
  }

  function obterDataInicialCalendario() {
    if (boletosFiltrados.length > 0) {
      return boletosFiltrados[0].start.toISOString();
    }

    const hoje = new Date();

    const mesSelecionado = Number(filtroMes);
    if (Number.isFinite(mesSelecionado)) {
      const dataMesSelecionado = new Date(hoje.getFullYear(), mesSelecionado, 1);
      return dataMesSelecionado.toISOString();
    }

    return hoje.toISOString();
  }

  function filtrarBoletosPorStatus(boletos, status) {
    if (!status) {
      return boletos;
    }
    if (status === "Pagos") {
      return boletos.filter((boleto) => boleto.status === true);
    } else if (status === "Em Aberto") {
      return boletos.filter((boleto) => boleto.status === false);
    } else if (status === "Atrasados") {
      const hoje = new Date();
      return boletos.filter((boleto) => boleto.status === false && boleto.start < hoje);
    }
  }

  function filtrarBoletosPorTipo(boletos, tipo) {
    if (!tipo) {
      return boletos;
    }
    return boletos.filter((boleto) => boleto.categoria === tipo);
  }


  function filtrarBoletosPorNome(boletos, pesquisa) {
    if (!pesquisa) {
      return boletos;
    }
    const termo = pesquisa.toLowerCase();
    return boletos.filter((boleto) =>
      boleto.title.toLowerCase().includes(termo) ||
      boleto.value.toLowerCase().includes(termo)
    );
  }

  const boletosFiltrados = useMemo(() => {
    const boletosFiltradosPorMes = boletoLista.filter((boleto) => {
      if (!(boleto.start instanceof Date) || Number.isNaN(boleto.start.getTime())) {
        return false;
      }

      const mesBoleto = boleto.start.getMonth();
      const anoBoleto = boleto.start.getFullYear();

      const mesSelecionado = Number(filtroMes);
      if (!Number.isFinite(mesSelecionado)) return true;

      return mesBoleto === mesSelecionado;
    });

    return filtrarBoletosPorNome(
      filtrarBoletosPorTipo(
        filtrarBoletosPorStatus(boletosFiltradosPorMes, filtroStatus),
        filtroTipo,
      ),
      pesquisa,
    );
  }, [boletoLista, filtroMes, filtroStatus, filtroTipo, pesquisa]);

  const totalPaginas = Math.max(1, Math.ceil(boletosFiltrados.length / itensPorPagina));
  const boletosPaginados = useMemo(
    () => boletosFiltrados.slice(paginaAtual * itensPorPagina, (paginaAtual + 1) * itensPorPagina),
    [boletosFiltrados, paginaAtual, itensPorPagina],
  );

  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        const boletosData = await boletos.listarBoletos();
        const boletosJson = Array.isArray(boletosData)
          ? boletosData.map((boleto) => {
          const startDate = new Date(boleto.dataVencimento + 'T00:00:00');
          return {
            id: boleto.idBoleto,
            title: boleto.descricao,
            status: boleto.pago,
            value: `R$ ${boleto.valor}`,
            start: startDate,
            end: startDate,
            categoria: boleto.categoria,
          };
        })
          : [];
        setBoletos(boletosJson);
      } catch (error) {
        console.error('Erro ao buscar boletos:', error);
        setBoletos([]);
      }
    };
    fetchBoletos();
  }, []);

  useEffect(() => {
    setPaginaAtual(0);
  }, [filtroMes, filtroStatus, filtroTipo, pesquisa]);


  const voltarPag = () => {
    if (paginaAtual > 0) {
      let pag = paginaAtual - 1;
      setPaginaAtual(pag)
    }
  }

  const avancarPag = () => {
    if (paginaAtual < totalPaginas - 1) {
      let pag = paginaAtual + 1;
      setPaginaAtual(pag)
    }
  }

  const selecionarPag = (numPag) => {
    setPaginaAtual(numPag);
  }

  // useLayoutEffect(() => {
  //   function recalcularItensPorPagina() {
  //     if (window.innerWidth <= 480) {
  //       setItensPorPagina(10);
  //       return;
  //     }

  //     const filtros = filtrosRef.current;
  //     const paginacao = paginacaoRef.current;
  //     const lista = listaRef.current;
  //     const item = itemMedidaRef.current;

  //     if (!filtros || !lista || !item) return;

  //     const viewportBottom = window.innerHeight;
  //     const listaTop = lista.getBoundingClientRect().top;
  //     const filtrosBottom = filtros.getBoundingClientRect().bottom;
  //     const paginacaoAltura = paginacao ? paginacao.getBoundingClientRect().height : 0;
  //     const alturaItem = item.getBoundingClientRect().height;
  //     const estiloLista = window.getComputedStyle(lista);
  //     const gapLista = Number.parseFloat(estiloLista.rowGap || estiloLista.gap || "0") || 0;

  //     const espacoUtil = Math.max(0, viewportBottom - listaTop - paginacaoAltura - (filtrosBottom - listaTop));
  //     const alturaLinha = Math.max(1, alturaItem + gapLista);
  //     const itensVisiveis = Math.max(1, Math.floor(espacoUtil / alturaLinha));

  //     setItensPorPagina(itensVisiveis);
  //   }

  //   recalcularItensPorPagina();

  //   const observer = new ResizeObserver(() => recalcularItensPorPagina());
  //   if (filtrosRef.current) observer.observe(filtrosRef.current);
  //   if (paginacaoRef.current) observer.observe(paginacaoRef.current);
  //   if (listaRef.current) observer.observe(listaRef.current);
  //   if (itemMedidaRef.current) observer.observe(itemMedidaRef.current);
  //   window.addEventListener("resize", recalcularItensPorPagina);

  //   return () => {
  //     observer.disconnect();
  //     window.removeEventListener("resize", recalcularItensPorPagina);
  //   };
  // }, [boletoLista.length]);

  useEffect(() => {
    const totalPaginasCalculado = Math.max(1, Math.ceil(boletosFiltrados.length / itensPorPagina));
    if (paginaAtual > totalPaginasCalculado - 1) {
      setPaginaAtual(Math.max(0, totalPaginasCalculado - 1));
    }
  }, [paginaAtual, itensPorPagina, boletosFiltrados.length]);

  useEffect(() => {
    document.title = "Boletos";
  }, []);

  return (
    <div className="boletos">
      <HeaderPadrao />

      <div className="conteudo">
        <br />
        <div className="card-pagamentos">
          <div className="filtros" ref={filtrosRef}>
            <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
              <option value={mesAtual}>Mês atual</option>
              <option value="0">Janeiro</option>
              <option value="1">Fevereiro</option>
              <option value="2">Março</option>
              <option value="3">Abril</option>
              <option value="4">Maio</option>
              <option value="5">Junho</option>
              <option value="6">Julho</option>
              <option value="7">Agosto</option>
              <option value="8">Setembro</option>
              <option value="9">Outubro</option>
              <option value="10">Novembro</option>
              <option value="11">Dezembro</option>
            </select>

            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Status</option>
              <option value="Pagos">Pagos</option>
              <option value="Em Aberto">Em Aberto</option>
              <option value="Atrasados">Atrasados</option>
            </select>

            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="">Tipo</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button
              className="btn-calendario"
              onClick={() =>
                navigate("/calendario", {
                  state: {
                    myEventsList: boletoLista,
                    initialDate: obterDataInicialCalendario(),
                  },
                })
              }
            >
            <CalendarDays size={20} />
            <h3>Painel</h3>
            </button>
              <button className="view-toggle-btn" 
              onClick={() => navigate("/cadastro-boleto")}>
                Adicionar Boleto
                <Plus size={20} />
            </button>


            <div className="busca">
              <Search className='searchBusca' size={16} />
              <input placeholder="Busca por nome" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
            </div>
          </div>

          <div className="lista" ref={listaRef}>
            {boletosPaginados.map((boleto) => (
              <div className="item-pagamento" key={boleto.id} ref={itemMedidaRef}>
                <div className="info-esquerda">
                  <div className="vencimento">Vencimento: {boleto.start.toLocaleDateString()}</div>

                  <div className="descricao">{boleto.title}</div>

                  <div className="valor">{boleto.value}</div>
                </div>

                <div className="lado-direito">
                  {boleto.status ? (
                    <button className="btn-pago" onClick={() => abrirModalBoleto(boleto)}>
                      Pago ✓
                    </button>
                  ) : (
                    <button className="btn-pendente" onClick={() => abrirModalBoleto(boleto)}>
                      Pendente
                    </button>
                  )}
                </div>
              </div>
            ))}
            {boletosFiltrados.length === 0 && (
              <div className="sem-resultados">Nenhum boleto encontrado para os filtros selecionados.</div>
            )}
          </div>

          {Math.max(1, Math.ceil(boletosFiltrados.length / itensPorPagina)) > 1 && (
            <div ref={paginacaoRef} className="paginacao-boletos">
              <SeletorPaginas numPages={totalPaginas} voltar={voltarPag} avancar={avancarPag} paginaSelecionada={paginaAtual} selecionar={selecionarPag} />
            </div>
          )}
        </div>
      </div>

      {selectedBoletos.length > 0 && (
        <div className="modal-overlay" onClick={() => setSelectedBoletos([])}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <BoletoDetail
              boletos={selectedBoletos}
              onClose={() => setSelectedBoletos([])}
              onStatusAtualizado={atualizarStatusBoleto}
            />
          </div>
        </div>
      )}
    </div>
  );
}