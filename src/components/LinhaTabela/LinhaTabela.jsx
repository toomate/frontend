import "./LinhaTabela.css"

export default function LinhaTabela(props) {
    console.log(props.elementos)
    return (
        <>
            {props && (props.elementos.map((atual) =>
                <div className="tabela-insumo-container">
                    {atual.map((elemento, index) =>
                        <div key={index} className="linha-tabela linha-estoque">
                            {elemento}
                        </div>
                    )}
                </div>
            ))

            }
        </>
    )
}