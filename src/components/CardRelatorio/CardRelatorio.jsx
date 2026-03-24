import { Bookmark, SquarePen, Save, X } from "lucide-react"
import { Button } from "../Button/Button"
import React from "react"
import "./CardRelatorio.css"

export function CardRelatorio({ props = [], fechar, salvarAlteracoes, abrirCardRemocao, abrirCardRotina}) {
    return (
        <div className="container-card">
            <div className="titulo-relatorio">
                <div className="titulo-primario">Relatório de Mudanças</div>
                <X div className="icone-clicavel" onClick={fechar} />
            </div>
            <div className="produtos">
                {props && props.length > 0 ? (props.map(atual => <React.Fragment key={atual.id}>
                    <div className="produto-linha">
                        <div className="produto">{atual.produto}</div><div className="info-linha">{atual.quantidadeMedida > 0
                            ? `Adicionar ${atual.quantidadeMedida}${atual.unidadeMedida}`
                            : `Remoção ${Math.abs(atual.quantidadeMedida)}${atual.unidadeMedida}`}</div>
                        <div className="icone-linha"><X id={atual.id} onClick={() => abrirCardRemocao(atual.id)} className="icone-clicavel" />
                        </div></div>
                </React.Fragment>)) :
                <div className="mensagem-vazio">Não há produtos!</div> }
            </div>
            <div className="botoes">
                <Button texto={"Editar"} Icone={SquarePen}></Button>
                <Button texto={"Guardar"} onClick={abrirCardRotina} Icone={Bookmark}></Button>
                <Button texto={"Salvar"} onClick={salvarAlteracoes} Icone={Save}></Button>
            </div>

        </div>
    )
}