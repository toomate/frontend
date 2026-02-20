import { Bookmark, SquarePen, Save, X } from "lucide-react"
import { Button } from "../Button/Button"
import React from "react"
import "./CardRelatorio.css"

export function CardRelatorio({ props = [] }) {
    console.log(props)
    return (
        <div className="container-card">
            <div className="titulo-relatorio">Relatório de Mudanças</div>
            <div className="produtos">
                {props && props.length > 0 ? (props.map(atual => <React.Fragment key={atual.id}>
                    <div className="produto-linha">
                        <div className="produto">{atual.produto}</div><div className="info-linha">{atual.quantidadeMedida}</div><div className="icone-linha"><X /></div></div>
                </React.Fragment>)) :
                <div className="mensagem-vazio">Não há produtos!</div> }
            </div>
            <div className="botoes">
                <Button texto={"Editar"} Icone={SquarePen}></Button>
                <Button texto={"Guardar"} Icone={Bookmark}></Button>
                <Button texto={"Salvar"} Icone={Save}></Button>
            </div>

        </div>
    )
}