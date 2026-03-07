import { Button } from "../Button/Button.jsx"
import { Trash } from "lucide-react"
import "./RotinaCard.css"

export default function RotinaCard({nomeRotina}) {
    return (
        <>
            <div className="rotina-card-container">
                <div className="titulo-rotina-card">
                    <h3>Rotina - {nomeRotina}</h3>
                </div>
                <div className="botoes-rotina-card">
                    <Button texto="Dar Baixa" />
                    <Button texto="Excluir" Icone={Trash} />
                </div>
            </div>
        </>
    )
}