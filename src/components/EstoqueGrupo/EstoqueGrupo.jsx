import { React, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./EstoqueGrupo.css"
import { EstoqueItem } from "../EstoqueItem/EstoqueItem";

export function EstoqueGrupo({ grupo }) {
    console.log(grupo.insumo)
    const [expandido, setExpandido] = useState(false);
    return (<>
        <div className="linha-estoque grupo-container">
            <div className="insumo"><div className="icone" onClick={() => setExpandido(!expandido)}><ChevronDown style={{
                transform: expandido ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
            }} /></div>
                <div className="insumo-nome">{grupo.insumo}</div>
            </div> <div className="qtd-total">{grupo.qtd}</div> <div className="medida">{grupo.medida}</div> <div className="dt-vencimento">{grupo.dtVencimento}</div><div className="controle"></div>
        </div>
        {expandido && (
            <EstoqueItem elementos={grupo.itens} />
        )}
    </>

    )
}