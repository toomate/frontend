import { Button } from "../Button/Button";
import "./CardConfirmacao.css"


export function CardConfirmacao({ titulo, confirmar, fecharCard, loading}) {
    return (
        <div className="container-card-conf">
            <div className="titulo-card-conf">
                {titulo}
            </div>
            <div className="botoes">
                <Button texto={loading ? "Aguarde..." : "Sim"} onClick={confirmar} />
                <Button texto="Não" onClick={fecharCard} />
            </div>
        </div>
    )

}