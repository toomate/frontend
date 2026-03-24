import { CircleMinus, CirclePlus, TextCursorIcon } from "lucide-react";
import "./EstoqueItem.css"
import React from "react";

export function EstoqueItem(props) {
    return (
        <>{props.elementos.map((atual) => <React.Fragment key={atual.idInsumo}>
            <div className="linha-estoque item-container" id={atual.quantidadeMedida < 3 ? "vencido" : ""}>
                <div className="insumo-grupo">
                    <div className="icone"></div>
                    <div className="item-nome">{atual.nomeMarca}</div>
                </div>
                <div className="qtd-total">{atual.quantidadeMedida}</div>
                <div className="medida">{atual.unidadeMedida}</div>
                <div className="dt-vencimento">{atual.dataValidade}</div>
                <div className="controle-container">
                    <div className="controle"><CircleMinus className="circle-minus-icon" onClick={() => props.alterarValor(atual.idLote, 'subtrair')} size={20} />{atual.quantidadeMedida}<CirclePlus className="circle-plus-icon" onClick={() => props.alterarValor(atual.idLote, 'somar')} size={20} /></div>
                </div>
            </div>
        </React.Fragment>)}
        </>
    )
}