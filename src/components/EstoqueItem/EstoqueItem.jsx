import { CheckCircle, CircleMinus, CirclePlus, Dot, Plus, TextCursorIcon, TriangleAlert } from "lucide-react";
import "./EstoqueItem.css"
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../Button/Button";
import { PiDotsThree } from "react-icons/pi";
import DropdownEstoque from "../Dropdown/DropdownEstoque";

export function EstoqueItem(props) {
    console.log("ablubleblau", props.elementos)

    const formatarData = (data) => {
        if (!data) return '';
        const d = new Date(data);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    return (
        <>{props.elementos.map((atual) => <React.Fragment key={atual.idInsumo}>
            <div className="linha-estoque item-container">
                <div className="insumo-grupo">
                    <div className="item-nome">
                        {atual.quantidadeMedida < atual.quantidadeMinima
                            ? (<TriangleAlert style={{ color: "darkred" }} />)
                            : (<CheckCircle style={{ color: "green" }} />)}
                       {props.nomeInsumo} {atual.nomeMarca}
                    </div>
                </div>

                <div className="qtd-minima">{Math.floor(atual.quantidadeMinima)}</div>
                <div className="qtd-total">
                    <span>{Math.floor(atual.quantidadeMedida)}</span>
                </div>
                <div className="medida">{atual.unidadeMedida}</div>
                <div className="dt-vencimento">{formatarData(atual.dataValidade)}</div>

                <div className="controle-container">
                    <div className="controle">
                        <CircleMinus onClick={() => props.alterarValor(atual.idLote, 'subtrair')} size={20} />
                        {Math.floor(atual.quantidadeMedida)}
                        <CirclePlus onClick={() => props.alterarValor(atual.idLote, 'somar')} size={20} />
                    </div>
                </div>

                <div className="botao-cadastrar">
                    <Button onClick={() => props.abrirDropdown(atual.idLote)} texto={<PiDotsThree size={30} />} />

                    {props.dropdownAbertoId === atual.idLote && (
                        <DropdownEstoque atual={{insumoId: atual.idInsumo, insumoNome: props.nomeInsumo, marca: atual.idMarca}}/>
                    )}
                </div>
            </div>
        </React.Fragment>)}
        </>
    )
}