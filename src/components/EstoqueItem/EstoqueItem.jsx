import { CircleMinus, CirclePlus } from "lucide-react";
import "./EstoqueItem.css"
import React from "react";

export function EstoqueItem(props) {
    console.log(props.elementos)
    return (
        <>{props.elementos.map((atual) => <React.Fragment key={atual.idInsumo}>
            <div className="linha-estoque item-container">
                <div className="insumo-grupo">
                    <div className="item-nome">{atual.nomeMarca}</div>
                </div>
                <div className="qtd-total">{atual.quantidadeMedida}</div>
                <div className="medida">{atual.unidadeMedida}</div>
                <div className="dt-vencimento">{atual.dataValidade}</div>
                <div className="controle-container">
                    <div className="controle"><CirclePlus size={15} /> {atual.quantidadeMedida} <CircleMinus size={15} /></div>
                </div>
            </div>
        </React.Fragment>)}
        </>
    )
}