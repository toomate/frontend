import { React, useState } from "react";
import { Beef, BottleWine, ChevronDown, Leaf, Milk, Package, Wheat, TriangleAlert, CheckCircle } from "lucide-react";
import "./EstoqueGrupo.css"
import { EstoqueItem } from "../EstoqueItem/EstoqueItem";
import { useEffect } from "react";

export function EstoqueGrupo({ grupo, alterarValor, abrirDropdown, dropdownAbertoId }) {
    const [expandido, setExpandido] = useState(false);

    const pegarIcone = (categoria) => {
        switch (categoria.toLowerCase()) {
            case ("proteínas" || "proteinas"): return <Beef size={28} />;
            case ("laticínios" || "laticinios"): return <Milk size={28} />;
            case "hortifruti": return <Leaf size={28} style={{ color: "green" }} />;
            case ("grãos e secos" || "grãos"): return <Wheat size={28} style={{ color: "#a8987a" }} />;
            case ("bebidas" || "bebida"): return <BottleWine size={28} />
            default: return <Package size={28} />;
        }
    };

    const formatarData = (data) => {
        if (!data) return '';
        const d = new Date(data);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    return (<div className="grupo-geral">
        <div className="linha-estoque grupo-container" id={grupo.qtdTotal < grupo.qtdMinima ? "vencido" : ""}>
            <div className="insumo" onClick={() => setExpandido(!expandido)} ><div className="icone"><ChevronDown className="insumo-icone-value" style={{
                transform: expandido ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
            }} /></div>
                <div className="insumo-icon">{pegarIcone(grupo.categoria)}</div>
                <div className="insumo-nome">{grupo.insumo}</div>
            </div>
            <div className="qtdMinima">{grupo.qtdMinima}</div>
            <div className="qtd-total">{Math.floor(grupo.qtdTotal)}
                {grupo.qtdTotal < grupo.qtdMinima
                    ? (<TriangleAlert style={{ color: "darkred" }} />)
                    : (<CheckCircle style={{ color: "green" }} />)}
            </div>
            <div className="medida">{grupo.medida?.toUpperCase()}</div>
            <div className="dt-vencimento">{formatarData(grupo.dtVencimento)}</div><div className="controle"></div>
        </div>
        {expandido && (
            <EstoqueItem alterarValor={alterarValor} elementos={grupo.itens} nomeInsumo={grupo.insumo} abrirDropdown={abrirDropdown} dropdownAbertoId={dropdownAbertoId} />
        )}
    </div>

    )
}