import { Button } from "../Button/Button";
import "./CardRotina.css"


export function CardRotina() {
    return (
        <div className="container-card-rotina">
            <div className="titulo-card-rotina">
                Cadastro de Rotina
            </div>
            <div className="input-container">
                Nome da Rotina:
                <input className="input-rotina" type="text" />
            </div>
            <div className="botoes">
                <Button texto="Salvar" />
                <Button texto="Cancelar" />
            </div>
        </div>
    )
}