import { React, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./EstoqueGrupo.css"
import { EstoqueItem } from "../EstoqueItem/EstoqueItem";
import { useEffect } from "react";

export function EstoqueGrupo({ grupo, alterarValor}) {
    const [expandido, setExpandido] = useState(false);
    

    return (<div className="grupo-geral">
        <div className="linha-estoque grupo-container">
            <div className="insumo"><div className="icone" onClick={() => setExpandido(!expandido)}><ChevronDown className="insumo-icone-value" style={{
                transform: expandido ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
            }} /></div>
                <div className="insumo-nome">{grupo.insumo}</div>
            </div> <div className="qtd-total">{grupo.qtdTotal}</div> <div className="medida">{grupo.medida}</div> <div className="dt-vencimento">{grupo.dtVencimento}</div><div className="controle"></div>
        </div>
        {expandido && (
            <EstoqueItem alterarValor={alterarValor} elementos={grupo.itens} />
        )}
    </div>

    )
}