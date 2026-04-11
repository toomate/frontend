import { ChevronLeft, ChevronRight, CircleSmall } from "lucide-react";
import "./SeletorPaginas.css";
import React from "react"


export default function SeletorPaginas({ avancar, voltar, selecionar, numPages, paginaSelecionada }) {
    return (
        < div className="seletor-container" >
            {numPages > 1 && (
                <React.Fragment>
                    <div className="seletor-anterior" onClick={voltar}><ChevronLeft size={32} className="icone-left" /></div>
                    {gerarPaginas(numPages).map(pagAtual => (
                        <div className="pagina" id={`${pagAtual === paginaSelecionada ? "ativa" : ""}`} key={pagAtual} title={`Página ${pagAtual}`} onClick={() => selecionar(pagAtual)}><CircleSmall size={32} className="icone-circulo" /></div>
                    ))}
                    <div className="seletor-posterior" onClick={avancar}><ChevronRight size={32} className="icone-right" /></div>
                </React.Fragment>
            )}
        </div >
    )

    function gerarPaginas(numPages) {
        const array = [];
        for (let i = 0; i < numPages; i++) {
            array.push(i);
        }

        return array;
    }
}