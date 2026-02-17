import "./Cabecalho.css"

export function Cabecalho(props) {
    return (
        <div className="linha-estoque elemento-container">
            {props.elementos.map((atual) => <div key={atual} className="elemento">{atual}</div>)}
        </div>
    )
}