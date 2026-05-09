import { Bookmark, SquarePen, Save, X, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "../../shared/components/Button/Button"
import React from "react"
import "./CardRelatorio.css"

export function CardRelatorio({ props = [], fechar, salvarAlteracoes, abrirCardRemocao, abrirCardRotina, loading }) {
    return (
        <div className="container-card">
            <div className="titulo-relatorio">
                <div className="titulo-primario">Relatório de Mudanças</div>
                <X div className="icone-clicavel" onClick={fechar} />
            </div>
            <div className="produtos">
                {props && props.length > 0 ? (props.map(atual => <React.Fragment key={atual.id}>
                    <div className="produto-linha">
                        <div className="produto">{atual.produto}</div><div className="info-linha">{atual.diferenca > 0 ? (<ArrowUp size={20} style={{color: "green"}} />) : (<ArrowDown size={20} style={{color: "red"}}/>)}{Math.abs(atual.diferenca)}</div>
                        <div className="icone-linha"><X id={atual.id} onClick={() => abrirCardRemocao(atual.id)} className="icone-clicavel" />
                        </div></div>
                </React.Fragment>)) :
                    <div className="mensagem-vazio">Não há produtos!</div>}
            </div>
            <div className="botoes">
                <Button texto={"Editar"} Icone={SquarePen}></Button>
                <Button texto={"Guardar"} onClick={abrirCardRotina} Icone={Bookmark}></Button>
                <Button texto={loading ? "Salvando..." : "Salvar"} onClick={salvarAlteracoes} disabled={loading} Icone={Save}></Button>
            </div>

        </div>
    )
}
