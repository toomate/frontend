import React from "react"

export default function Kpi(props) {
  
    return (
        <>
            <div className="status">
                {props.kpis?.map((kpi) => <React.Fragment key={kpi.id}>
                    <div className="card">
                        <span>{kpi.titulo}</span>
                        <span className="numero">{kpi.valor}</span>
                    </div>
                </React.Fragment>)}
            </div>

        </>
    )
}