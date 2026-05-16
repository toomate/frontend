import React from "react"

function obterClasseUrgencia(texto) {
    const textoNormalizado = String(texto ?? "").toLowerCase()

    if (textoNormalizado.includes("hoje")) {
        return "kpi-card-urgencia-hoje"
    }

    if (textoNormalizado.includes("semana")) {
        return "kpi-card-urgencia-semana"
    }

    if (textoNormalizado.includes("venc") || textoNormalizado.includes("atras")) {
        return "kpi-card-urgencia-vencido"
    }

    return "kpi-card-urgencia-neutra"
}

export default function Kpi(props) {
  
    return (
        <>
            <div className="status">
                {props.kpis?.map((kpi, index) => <React.Fragment key={kpi.id ?? `${kpi.titulo ?? kpi.nome}-${index}`}>
                    <div className={`card ${obterClasseUrgencia(kpi.titulo ?? kpi.nome)}`}>
                        <span>{kpi.titulo ?? kpi.nome}</span>
                        <span className="numero">{kpi.valor}</span>
                    </div>
                </React.Fragment>)}
            </div>

        </>
    )
}