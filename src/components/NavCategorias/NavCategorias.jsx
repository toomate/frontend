import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import "./NavCategorias.css"

export function NavCategorias({categoriaAtual, aoMudarCategoria}) {
    const categorias = ["Geral", "Mercearia", "Proteínas", "Vegetais", "Grãos", "Bebidas"]
    console.log(categoriaAtual)
    return (
        <div className="categorias-container">
            <div className="categorias">
                <div className="categoria-menu">
                    <div className="menu-categoria"><Menu size={38} color="#6B4423" /></div>
                </div>
                {categorias.map((atual) => (
                    <div key={atual} id={categoriaAtual === atual ? "active" : ""}
                        className="categoria"
                        onClick={() => aoMudarCategoria(atual)}>
                        {atual}
                    </div>
                ))}
            </div>
        </div>
    )
}