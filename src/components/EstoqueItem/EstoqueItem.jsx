import { CheckCircle, CircleMinus, CirclePlus, Dot, Plus, TextCursorIcon, TriangleAlert } from "lucide-react";
import "./EstoqueItem.css"
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../Button/Button";
import { PiDotsThree } from "react-icons/pi";
import DropdownEstoque from "../Dropdown/DropdownEstoque";

export function EstoqueItem(props) {
    const UM_DIA_EM_MS = 24 * 60 * 60 * 1000;
    const UMA_SEMANA_EM_MS = 7 * UM_DIA_EM_MS;

    const formatarData = (data) => {
        if (!data) return '';
        const d = new Date(data);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const obterClasseValidade = (dataValidade) => {
        if (!dataValidade) return "";

        const vencimento = new Date(`${dataValidade}`.includes("T") ? dataValidade : `${dataValidade}T00:00:00`);
        if (Number.isNaN(vencimento.getTime())) return "";

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const diferencaDias = Math.ceil((vencimento.getTime() - hoje.getTime()) / UM_DIA_EM_MS);

        if (diferencaDias < 0) return "dt-vencimento-vencido";
        if (vencimento.getTime() - hoje.getTime() <= UMA_SEMANA_EM_MS) return "dt-vencimento-alerta";
        return "";
    };

    function truncar(numero) {
        const fator = 10 ** 1;
        return Math.trunc(numero * fator) / fator;
    }

    const mostrarExcluir = (original) => {
        return original && Number(original.quantidadeTotal) <= 0;
    }

    return (
        <>{props.elementos
            .map((atual) => <React.Fragment key={atual.idLote}>
                <div className="linha-estoque item-container" id={atual.quantidadeTotal <= 0 ? "abaixo" : ""}>
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
                    <div className={`dt-vencimento ${obterClasseValidade(atual.dataValidade)}`}>{formatarData(atual.dataValidade)}</div>

                    <div className="controle-container">
                        <div className="controle">
                            {mostrarExcluir(props.loteOriginal(atual.idLote)) ? (<><button onClick={() => props.excluirLote(atual.idLote)} className="btn">Excluir</button></>) : (<><CircleMinus onClick={() => props.alterarValor(atual.idLote, 'subtrair')} size={20} />
                                <span
                                    className="quantidade-total"
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}>
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
                                <CirclePlus onClick={() => props.alterarValor(atual.idLote, 'somar')} size={20} /></>)}
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