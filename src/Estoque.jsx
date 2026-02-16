import React, { useState } from "react";
import { Navbar } from "./components/navbar";
import { NavCategorias } from "./components/NavCategorias";
import { Save, Bookmark } from "lucide-react";
import { Button } from "./components/Button";

export function Estoque() {
    return (
        <div className="estoque-container">
            <Navbar />
            <NavCategorias />
            <Button texto="Rotinas" Icone={Bookmark} />
            <Button texto="Salvar" Icone={Save} />
        </div>
    )
}