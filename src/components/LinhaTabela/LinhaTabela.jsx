import "./LinhaTabela.css"

export default function LinhaTabela(props) {
    return (
        <>
<<<<<<< HEAD
            {props && (props.elementos.map((atual, index) =>
                <div
                    key={`${atual.insumo}-${atual.marca}-${atual.dtVencimento}-${index}`}
                    className="tabela-insumo-container"
                    id={atual.status === "Vencido" ? "vencido" : ""}
                >
=======
            {props && (props.elementos.map((atual) =>
                <div key={atual.id} className="tabela-insumo-container" id={atual.status === "Vencido" ? "vencido" : ""}>
>>>>>>> eb82114 (adicionando integração das kpis de vencimento)
                        <div className="linha-tabela linha-estoque">
                            {atual.insumo}
                        </div>
                        <div className="linha-tabela linha-estoque">
                            {atual.marca}
                        </div>
                        <div className="linha-tabela linha-estoque">
                            {atual.estoqueAtual}
                        </div>
                        <div className="linha-tabela linha-estoque">
                            {atual.dtVencimento}
                        </div>
                        <div className="linha-tabela linha-estoque">
                            {atual.diasRestantes}
                        </div>
                        <div className="linha-tabela linha-estoque">
                            {atual.status}
                        </div>
                </div>
            ))

            }
        </>
    )
}