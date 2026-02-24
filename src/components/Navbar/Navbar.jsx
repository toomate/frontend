import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import "./Navbar.css"

export function Navbar() {
    const [user, setUser] = useState([])
    
    return (
        <div className="navbar-container">
            <div className="items">
                <div className="menu-icon"><Menu size={38} color="grey" /></div>
                <div className="nav-logo">
                    <div className="info-logo"></div>
                </div>
                <div className="user-info">
                    <div className="restaurante">
                        <div className="toomate">Toomate Bistrô</div>
                    </div>
                    <div className="info-name">
                        <div className="username">Usuário 1</div>
                    </div>
                </div>
            </div>
        </div>
    )
}