import { Button } from "../Button/Button";
import "./CardRotina.css"


export function CardRotina({fecharCard, setTitulo, salvarRotina}) {
    return (
        <div className="container-card-rotina">
            <div className="titulo-card-rotina">
                Cadastro de Rotina
            </div>
            <div className="input-container">
                <span className="nome-rotina">Nome da Rotina:</span>
                <div className="input-card">
                    <input onChange={(e) => setTitulo(e.target.value)} className="input-rotina" type="text" />
                </div>
            </div>
            <div className="botoes">
                <Button onClick={salvarRotina} texto="Salvar" />
                <Button onClick={fecharCard} texto="Cancelar" />
            </div>
        </div>
    )
}