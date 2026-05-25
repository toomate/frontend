import { React, useState } from "react";
import { Beef, BottleWine, Menu, Leaf, Milk, Package, Wheat, ShoppingCart, Fish, UtensilsCrossed, Sandwich, CookingPot, Droplet, ChevronDown, TriangleAlert, CheckCircle } from "lucide-react";
import "./EstoqueGrupo.css"
import { EstoqueItem } from "../EstoqueItem/EstoqueItem";
import { useEffect } from "react";

export function EstoqueGrupo({ grupo, alterarValor, abrirDropdown, dropdownAbertoId }) {
    const [expandido, setExpandido] = useState(false);
    const UM_DIA_EM_MS = 24 * 60 * 60 * 1000;
    const UMA_SEMANA_EM_MS = 7 * UM_DIA_EM_MS;

    const classificarValidadeGrupo = (itens = []) => {
        let encontrouAlerta = false;

        for (const item of itens) {
            const dataValidade = item?.dataValidade;
            if (!dataValidade) continue;

            const vencimento = new Date(String(dataValidade).includes("T") ? dataValidade : `${dataValidade}T00:00:00`);
            if (Number.isNaN(vencimento.getTime())) continue;

            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const diferenca = vencimento.getTime() - hoje.getTime();
            if (diferenca < 0) {
                return "vencido";
            }

            if (diferenca <= UMA_SEMANA_EM_MS) {
                encontrouAlerta = true;
            }
        }

        return encontrouAlerta ? "alerta" : "";
    };

    const statusValidade = classificarValidadeGrupo(grupo?.itens);

    const pegarIcone = (categoria) => {
        switch (categoria.toLowerCase()) {
            case "proteínas":
            case "proteinas":
            case "protenas":
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
            case "oleos e gorduras":
            case "óleos e gordura":
            case "óleos e gorduras":
            case "leos e gordura":
            case "leos e gorduras":
            case "gordura":
                return <Droplet size={28} />


            case "frios":
            case "embutidos":
            case "frios e embutidos":
                return <Sandwich size={28} />;

            case "laticínios":
            case "laticinios":
            case "laticnios":
            case "laticã­nios":
                return <Milk size={28} />;

            case "hortifruti":
                return <Leaf size={28} />;

            case "grãos e secos":
            case "graos e secos":
            case "gros e secos":
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
            <div className="dt-vencimento">
                {statusValidade && (
                    <span className={`badge-validade badge-validade-${statusValidade}`}>V</span>
                )}
            </div><div className="controle"></div>
        </div>
        {expandido && (
            <EstoqueItem alterarValor={alterarValor} elementos={grupo.itens} nomeInsumo={grupo.insumo} abrirDropdown={abrirDropdown} dropdownAbertoId={dropdownAbertoId} />
        )}
    </div>

    )
}