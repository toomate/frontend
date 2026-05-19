import { React, useState } from "react";
import { Beef, BottleWine, Menu, Leaf, Milk, Package, Wheat, ShoppingCart, Fish, UtensilsCrossed, Sandwich, CookingPot, Droplet, ChevronDown, TriangleAlert, CheckCircle } from "lucide-react";
import "./EstoqueGrupo.css"
import { EstoqueItem } from "../EstoqueItem/EstoqueItem";
import { useEffect } from "react";

export function EstoqueGrupo({ grupo, alterarValor, abrirDropdown, dropdownAbertoId }) {
    const [expandido, setExpandido] = useState(false);

    const pegarIcone = (categoria) => {
        switch (categoria.toLowerCase()) {
            case "proteínas":
            case "proteinas":
            case "carnes":
            case "carnes e aves":
            case "aves":
                return <Beef size={28} />;

            case "mercearia":
                return <ShoppingCart size={28} />;

            case "pescados":
            case "peixes":
            case "frutos do mar":
                return <Fish size={28} />;

            case "temperos":
            case "condimentos":
            case "temperos e condimentos":
                return <CookingPot size={28} />

            case "oleos":
            case "óleos":
            case "oleos e gordura":
            case "óleos e gordura":
            case "gordura":
                return <Droplet size={28} />


            case "frios":
            case "embutidos":
            case "frios e embutidos":
                return <Sandwich size={28} />;

            case "laticínios":
            case "laticinios":
            case "laticã­nios":
                return <Milk size={28} />;

            case "hortifruti":
                return <Leaf size={28} />;

            case "grãos e secos":
            case "graos e secos":
            case "grãos":
            case "graos":
            case "grãos e cereais":
            case "graos e cereais":
            case "grã£os e cereais":
            case "grã£os e secos":
            case "grã£os":
            case "cereais":
                return <Wheat size={28} />;

            case "bebidas":
            case "bebida":
                return <BottleWine size={28} />;

            default:
                return <Package size={28} />;
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

    function truncar(numero) {
        const fator = 10 ** 1;
        return Math.trunc(numero * fator) / fator;
    }

    return (<div className="grupo-geral">
        <div className="linha-estoque grupo-container" onClick={() => setExpandido(!expandido)} id={grupo.qtdAtual < grupo.qtdMinima ? "vencido" : ""}>
            <div className="insumo" ><div className="icone"><ChevronDown className="insumo-icone-value" style={{
                transform: expandido ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
            }} /></div>
                <div className="insumo-icon">{pegarIcone(grupo.categoria)}</div>
                <div className="insumo-nome">{grupo.insumo}</div>
            </div>
            <div className="qtd-medida">
            </div>
            <div className="qtd-minima">{`${grupo.qtdMinima}`}</div>
            <div className="volume">{grupo.qtdAtual}{grupo.qtdAtual < grupo.qtdMinima
                ? (<TriangleAlert style={{ color: "darkred" }} />)
                : (<CheckCircle style={{ color: "green" }} />)}</div>
            <div className="dt-vencimento">{formatarData(grupo.dtVencimento)}</div><div className="controle"></div>
        </div>
        {expandido && (
            <EstoqueItem alterarValor={alterarValor} elementos={grupo.itens} nomeInsumo={grupo.insumo} abrirDropdown={abrirDropdown} dropdownAbertoId={dropdownAbertoId} />
        )}
    </div>

    )
}