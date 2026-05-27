import { ChevronLeft, ChevronRight, CircleSmall } from "lucide-react";
import "./SeletorPaginas.css";
import React from "react"


export default function SeletorPaginas({ avancar, voltar, selecionar, numPages, paginaSelecionada }) {
    return (
        <div className="seletor-container">
            <div className="seletor-anterior" onClick={voltar}><ChevronLeft size={32} className="icone-left" /></div>
            {gerarPaginas(numPages).map(pagAtual => (
                <div className="pagina" id={`${pagAtual === paginaSelecionada ? "ativa" : ""}`} key={pagAtual} title={`Página ${pagAtual + 1}`} onClick={() => selecionar(pagAtual)}>
                    <CircleSmall size={32} className="icone-circulo" />
                    <span className="numero-pagina">{pagAtual + 1}</span>
                </div>
            ))}
            <div className="seletor-posterior" onClick={avancar}><ChevronRight size={32} className="icone-right" /></div>
        </div>
    )

    function gerarPaginas(numPages) {
        const array = [];
        for (let i = 0; i < numPages; i++) {
            array.push(i);
        }

        return array;
    }
}