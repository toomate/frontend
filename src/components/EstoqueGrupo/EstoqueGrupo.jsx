import { React, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./EstoqueGrupo.css"
import { EstoqueItem } from "../EstoqueItem/EstoqueItem";
import { useEffect } from "react";

export function EstoqueGrupo({ grupo, alterarValor}) {
    const [expandido, setExpandido] = useState(false);
    
    const formatarData = (data) => {
        if (!data) return '';
        const d = new Date(data);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    return (<div className="grupo-geral">
        <div className="linha-estoque grupo-container">
            <div className="insumo"><div className="icone" onClick={() => setExpandido(!expandido)}><ChevronDown className="insumo-icone-value" style={{
                transform: expandido ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
            }} /></div>
                <div className="insumo-nome">{grupo.insumo}</div>
            </div> <div className="qtd-total">{Math.floor(grupo.qtdTotal)}</div> <div className="medida">{grupo.medida}</div> <div className="dt-vencimento">{formatarData(grupo.dtVencimento)}</div><div className="controle"></div>
        </div>
        {expandido && (
            <EstoqueItem alterarValor={alterarValor} elementos={grupo.itens} />
        )}
    </div>

    )
}