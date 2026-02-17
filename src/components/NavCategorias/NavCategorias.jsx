import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import "./NavCategorias.css"

export function NavCategorias() {
    return (
        <div className="categorias-container">
            <div className="categorias">
                <div className="categoria-menu">
                    <div className="menu-categoria"><Menu size={38} color="#6B4423" /></div>
                </div>
                <div className="categoria" id="active">Geral</div>
                <div className="categoria">Mercearia</div>
                <div className="categoria">Proteínas</div>
                <div className="categoria">Vegetais</div>
                <div className="categoria">Grãos</div>
                <div className="categoria">Bebidas</div>
            </div>
        </div>
    )
}