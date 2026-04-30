import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

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

    const vencidos = [];
    const vencendoBreve = [];

    const vistos = new Set();

    (lancamentos ?? []).forEach((l) => {
      if (!l.dataValidadeIso) return;
      const chave = `${l.insumo}||${l.marca}||${l.dataValidadeIso}`;
      if (vistos.has(chave)) return;
      vistos.add(chave);

      const venc = new Date(`${l.dataValidadeIso}T00:00:00`);
      if (venc < hoje) {
        vencidos.push(l);
      } else if (venc <= limite) {
        vencendoBreve.push(l);
      }
    });

    vencidos.sort((a, b) => a.dataValidadeIso.localeCompare(b.dataValidadeIso));
    vencendoBreve.sort((a, b) => a.dataValidadeIso.localeCompare(b.dataValidadeIso));

    return { vencidos, vencendoBreve };
  }, [lancamentos]);

  const total = vencidos.length + vencendoBreve.length;

  return (
    <article className="admin-card admin-chart-card admin-alertas-card">
      <div className="admin-chart-header">
        <h2 style={{ "--icon-color": "#e07b00" }}>
          <AlertTriangle size={17} style={{ color: "#e07b00" }} />
          Alertas de validade
        </h2>
        <p>Lotes vencidos ou vencendo nos próximos 7 dias</p>
      </div>

      {total === 0 ? (
        <div className="admin-alertas-vazio">
          <span>Nenhum alerta de validade no momento.</span>
        </div>
      ) : (
        <div className="admin-alertas-lista">
          {vencidos.length > 0 && (
            <div className="admin-alertas-grupo">
              <span className="admin-alertas-grupo-titulo vencido">
                Vencidos ({vencidos.length})
              </span>
              {vencidos.map((l, i) => (
                <div key={i} className="admin-alerta-item vencido">
                  <div className="admin-alerta-info">
                    <strong>{l.insumo}</strong>
                    <span>{l.marca}</span>
                  </div>
                  <span className="admin-alerta-badge vencido">
                    {Math.abs(diasRestantes(l.dataValidadeIso))}d atrás
                  </span>
                </div>
              ))}
            </div>
          )}

          {vencendoBreve.length > 0 && (
            <div className="admin-alertas-grupo">
              <span className="admin-alertas-grupo-titulo aviso">
                Vencendo em breve ({vencendoBreve.length})
              </span>
              {vencendoBreve.map((l, i) => {
                const dias = diasRestantes(l.dataValidadeIso);
                return (
                  <div key={i} className="admin-alerta-item aviso">
                    <div className="admin-alerta-info">
                      <strong>{l.insumo}</strong>
                      <span>{l.marca}</span>
                    </div>
                    <span className="admin-alerta-badge aviso">
                      {dias === 0 ? "hoje" : `${dias}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
