import { CircleMinus, CirclePlus } from "lucide-react";
import "./EstoqueItem.css"
import React from "react";

export function EstoqueItem(props) {
    console.log(props.elementos)
    return (
        <div className="linha-item item-container">
            {props.elementos.map((atual) => <React.Fragment key={atual.id}>
                <div className="espaco-icone">
                </div>
                <div className="item-nome">{atual.nome}</div>
                <div className="qtd-total">{atual.qtd}</div>
                <div className="medida">{atual.medida}</div>
                <div className="dt-vencimento">{atual.dtVencimento}</div>
                <div className="controle-container">
                    <div className="controle"><CirclePlus size={15} /> {atual.estoque} <CircleMinus size={15} /></div>
                </div>
            </React.Fragment>)}
        </div>
    )
}