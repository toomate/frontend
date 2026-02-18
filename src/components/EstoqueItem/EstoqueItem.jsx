import { CircleMinus, CirclePlus } from "lucide-react";
import "./EstoqueItem.css"
import React from "react";

export function EstoqueItem(props) {
    console.log(props.elementos)
    return (
        <div className="linha-item item-container">
            {props.elementos.map((atual) => <React.Fragment key={atual.idInsumo}>
                <div className="espaco-icone">
                </div>
                <div className="item-nome">{atual.nomeMarca}</div>
                <div className="qtd-total">{atual.quantidadeMedida}</div>
                <div className="medida">{atual.unidadeMedida}</div>
                <div className="dt-vencimento">{atual.dataValidade}</div>
                <div className="controle-container">
                    <div className="controle"><CirclePlus size={15} /> {atual.quantidadeMedida} <CircleMinus size={15} /></div>
                </div>
            </React.Fragment>)}
        </div>
    )
}