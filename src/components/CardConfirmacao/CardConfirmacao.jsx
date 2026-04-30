import { Button } from "../../shared/components/Button/Button";
import "./CardConfirmacao.css"


export function CardConfirmacao({ titulo, confirmar, fecharCard }) {
    return (
        <div className="container-card-conf">
            <div className="titulo-card-conf">
                {titulo}
            </div>
            <div className="botoes">
                <Button texto="Sim" onClick={confirmar} />
                <Button texto="Não" onClick={fecharCard} />
            </div>
        </div>
    )

}