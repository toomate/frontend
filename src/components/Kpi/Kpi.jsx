import React from "react"

export default function Kpi(props) {
  
    return (
        <>
            <div className="status">
                {props.kpis?.map((kpi, index) => <React.Fragment key={kpi.id ?? `${kpi.titulo ?? kpi.nome}-${index}`}>
                    <div className="card">
                        <span>{kpi.titulo ?? kpi.nome}</span>
                        <span className="numero">{kpi.valor}</span>
                    </div>
                </React.Fragment>)}
            </div>

        </>
    )
}