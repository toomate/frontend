import { CheckCircle, CircleMinus, CirclePlus, Dot, Plus, TextCursorIcon, TriangleAlert } from "lucide-react";
import "./EstoqueItem.css"
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../Button/Button";
import { PiDotsThree } from "react-icons/pi";
import DropdownEstoque from "../Dropdown/DropdownEstoque";

export function EstoqueItem(props) {

    const formatarData = (data) => {
        if (!data) return '';
        const d = new Date(data);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    function truncar(numero) {
        const fator = 10 ** 1;
        return Math.trunc(numero * fator) / fator;
    }

    return (
        <>{props.elementos.map((atual) => <React.Fragment key={atual.idLote}>
            <div className="linha-estoque item-container">
                <div className="insumo-grupo">
                    <div className="item-nome">
                        {atual.quantidadeTotal < atual.quantidadeMinima
                            ? (<TriangleAlert style={{ color: "darkred" }} />)
                            : (<CheckCircle style={{ color: "green" }} />)}
                        {props.nomeInsumo} {atual.nomeMarca}
                    </div>
                </div>

                <div className="qtd-medida">
                    <span>{`${atual.quantidadeMedida}${atual.unidadeMedida}`}</span>
                </div>
                <div className="qtd-minima">{truncar(atual.quantidadeMinima)}</div>
                <div className="qtd-total">{atual.quantidadeTotal}</div>
                <div className="dt-vencimento">{formatarData(atual.dataValidade)}</div>

                <div className="controle-container">
                    <div className="controle">
                        <CircleMinus onClick={() => props.alterarValor(atual.idLote, 'subtrair')} size={20} />
                        <span
                            className="quantidade-total"
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            <input
                                class
                                type="Number" 
                                pattern="[0-9]*"
                                value={atual.quantidadeTotal}
                                onInput={(e) => props.alterarValor(atual.idLote, e.target.value)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    textAlign: 'center',
                                    margin: 0,
                                    width: '70px',
                                    appearance: 'textfield',
                                    outline: 'none',
                                    fontSize: 'inherit',
                                    color: 'inherit'
                                }}
                            />
                        </span>
                        <CirclePlus onClick={() => props.alterarValor(atual.idLote, 'somar')} size={20} />
                    </div>
                </div>

                <div className="botao-cadastrar">
                    <Button onClick={() => props.abrirDropdown(atual.idLote)} texto={<PiDotsThree size={30} />} />

                    {props.dropdownAbertoId === atual.idLote && (
                        <DropdownEstoque atual={{ insumoId: atual.idInsumo, insumoNome: props.nomeInsumo, marca: atual.idMarca }} />
                    )}
                </div>
            </div>
        </React.Fragment>)}
        </>
    )
}