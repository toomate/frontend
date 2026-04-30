import { Button } from "../../shared/components/Button/Button.jsx"
import { Trash } from "lucide-react"
import "./RotinaCard.css"

export default function RotinaCard({nomeRotina, excluir, darBaixa}) {
    return (
        <>
            <div className="rotina-card-container">
                <div className="titulo-rotina-card">
                    <h3>Rotina - {nomeRotina}</h3>
                </div>
                <div className="botoes-rotina-card">
                    <Button texto="Dar Baixa" onClick={darBaixa}/>
                    <Button texto="Excluir" onClick={excluir} Icone={Trash} />
                </div>
            </div>
        </>
    )
}