import { useMemo, useState } from "react";
import { AlertTriangle, ChevronRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

function diasRestantes(dataIso) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc = new Date(`${dataIso}T00:00:00`);
  return Math.ceil((venc - hoje) / (24 * 60 * 60 * 1000));
}

export default function AdminAlertas({ lancamentos }) {
  const { vencidos, vencendoBreve } = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const limite = new Date(hoje.getTime() + SETE_DIAS_MS);

    const grupos = new Map();

    (lancamentos ?? []).forEach((l) => {
      if (!l.dataValidadeIso) return;

      const venc = new Date(`${l.dataValidadeIso}T00:00:00`);
      const ehVencido = venc < hoje;
      const ehVencendoBreve = !ehVencido && venc <= limite;

      if (!ehVencido && !ehVencendoBreve) return;

      const chave = `${l.insumo}||${l.marca}`;
      const grupo = grupos.get(chave);

      if (!grupo) {
        grupos.set(chave, {
          insumo: l.insumo,
          marca: l.marca,
          totalVencidos: ehVencido ? 1 : 0,
          totalVencendoBreve: ehVencendoBreve ? 1 : 0,
          loteMaisUrgenteVencido: ehVencido ? l : null,
          loteMaisUrgenteVencendo: ehVencendoBreve ? l : null,
        });
        return;
      }

      if (ehVencido) {
        grupo.totalVencidos += 1;
        if (
          !grupo.loteMaisUrgenteVencido ||
          l.dataValidadeIso < grupo.loteMaisUrgenteVencido.dataValidadeIso
        ) {
          grupo.loteMaisUrgenteVencido = l;
        }
      } else {
        grupo.totalVencendoBreve += 1;
        if (
          !grupo.loteMaisUrgenteVencendo ||
          l.dataValidadeIso < grupo.loteMaisUrgenteVencendo.dataValidadeIso
        ) {
          grupo.loteMaisUrgenteVencendo = l;
        }
      }
    });

    const vencidos = [];
    const vencendoBreve = [];

    grupos.forEach((grupo) => {
      if (grupo.totalVencidos > 0) {
        vencidos.push({
          ...grupo.loteMaisUrgenteVencido,
          totalLotes: grupo.totalVencidos,
          totalOutros: grupo.totalVencendoBreve,
        });
      } else if (grupo.totalVencendoBreve > 0) {
        vencendoBreve.push({
          ...grupo.loteMaisUrgenteVencendo,
          totalLotes: grupo.totalVencendoBreve,
          totalOutros: 0,
        });
      }
    });

    vencidos.sort((a, b) => a.dataValidadeIso.localeCompare(b.dataValidadeIso));
    vencendoBreve.sort((a, b) => a.dataValidadeIso.localeCompare(b.dataValidadeIso));

    return { vencidos, vencendoBreve };
  }, [lancamentos]);

  const total = vencidos.length + vencendoBreve.length;
  const [abaAtiva, setAbaAtiva] = useState("vencidos");
  const itensAba = abaAtiva === "vencidos" ? vencidos : vencendoBreve;
  const navegar = useNavigate();

  function irParaVencimentos(insumo) {
    const params = insumo ? `?insumo=${encodeURIComponent(insumo)}` : "";
    navegar(`/vencimentos${params}`);
  }

  return (
    <article className="admin-card admin-chart-card admin-alertas-card">
      <div className="admin-chart-header admin-alertas-header">
        <div>
          <h2 style={{ "--icon-color": "#e07b00" }}>
            <AlertTriangle size={17} style={{ color: "#e07b00" }} />
            Alertas de validade
          </h2>
          <p>Lotes vencidos ou vencendo nos próximos 7 dias</p>
        </div>
        <button
          type="button"
          className="admin-alertas-ver-todos"
          onClick={() => irParaVencimentos(null)}
        >
          Ver todos
          <ExternalLink size={13} />
        </button>
      </div>

      {total === 0 ? (
        <div className="admin-alertas-vazio">
          <span>Nenhum alerta de validade no momento.</span>
        </div>
      ) : (
        <>
          <div className="admin-alertas-abas" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={abaAtiva === "vencidos"}
              className={`admin-alertas-aba vencido ${abaAtiva === "vencidos" ? "ativa" : ""}`}
              onClick={() => setAbaAtiva("vencidos")}
            >
              Vencidos
              <span className="admin-alertas-aba-contagem">{vencidos.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={abaAtiva === "vencendoBreve"}
              className={`admin-alertas-aba aviso ${abaAtiva === "vencendoBreve" ? "ativa" : ""}`}
              onClick={() => setAbaAtiva("vencendoBreve")}
            >
              Vencendo em breve
              <span className="admin-alertas-aba-contagem">{vencendoBreve.length}</span>
            </button>
          </div>

          <div className="admin-alertas-lista">
            {itensAba.length === 0 ? (
              <div className="admin-alertas-vazio">
                <span>
                  {abaAtiva === "vencidos"
                    ? "Nenhum lote vencido."
                    : "Nenhum lote vencendo nos próximos 7 dias."}
                </span>
              </div>
            ) : abaAtiva === "vencidos" ? (
              itensAba.map((l, i) => (
                <button
                  type="button"
                  key={i}
                  className="admin-alerta-item vencido"
                  onClick={() => irParaVencimentos(l.insumo)}
                  title={`Ver ${l.insumo} em Vencimentos`}
                >
                  <div className="admin-alerta-info">
                    <strong>
                      {l.insumo}
                      {l.totalLotes > 1 ? (
                        <span className="admin-alerta-contagem">{l.totalLotes} lotes</span>
                      ) : null}
                    </strong>
                    <span>
                      {l.marca}
                      {l.totalOutros > 0
                        ? ` · +${l.totalOutros} vencendo em breve`
                        : ""}
                    </span>
                  </div>
                  <span className="admin-alerta-badge vencido">
                    {Math.abs(diasRestantes(l.dataValidadeIso))}d atrás
                  </span>
                  <ChevronRight size={14} className="admin-alerta-chevron" />
                </button>
              ))
            ) : (
              itensAba.map((l, i) => {
                const dias = diasRestantes(l.dataValidadeIso);
                return (
                  <button
                    type="button"
                    key={i}
                    className="admin-alerta-item aviso"
                    onClick={() => irParaVencimentos(l.insumo)}
                    title={`Ver ${l.insumo} em Vencimentos`}
                  >
                    <div className="admin-alerta-info">
                      <strong>
                        {l.insumo}
                        {l.totalLotes > 1 ? (
                          <span className="admin-alerta-contagem">{l.totalLotes} lotes</span>
                        ) : null}
                      </strong>
                      <span>{l.marca}</span>
                    </div>
                    <span className="admin-alerta-badge aviso">
                      {dias === 0 ? "hoje" : `${dias}d`}
                    </span>
                    <ChevronRight size={14} className="admin-alerta-chevron" />
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </article>
  );
}
