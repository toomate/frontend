import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function CardResumoAdmin({
  titulo,
  metrica,
  icone: Icone,
  iconeCor,
  className = "",
  rotuloAcao,
  aoClicarAcao,
  variacao,
  rotuloVariacao = "vs mês anterior",
  children,
}) {
  return (
    <article className={`admin-card ${className}`.trim()}>
      <div className="admin-card-head">
        <h2>{titulo}</h2>
        {Icone && (
          <span className="admin-card-icon" style={{ color: iconeCor }}>
            <Icone size={16} />
          </span>
        )}
      </div>

      <p className="admin-card-metric">{metrica}</p>

      {typeof variacao === "number" && (
        <p className={`admin-card-variation ${variacao < 0 ? "is-negative" : "is-positive"}`}>
          <span>{variacao < 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}</span>
          {`${variacao > 0 ? "+" : ""}${variacao.toFixed(1)}%`}
          <small>{rotuloVariacao}</small>
        </p>
      )}

      <div className="admin-card-content">{children}</div>

      {rotuloAcao && (
        <button
          type="button"
          className="admin-card-button"
          onClick={aoClicarAcao}
        >
          {rotuloAcao}
        </button>
      )}
    </article>
  );
}

