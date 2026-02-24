import { Bookmark } from "lucide-react";
import "./Button.css"

export function Button({ texto, Icone, onClick }) {
    return (
        <div className="button-container" onClick={onClick}>
            {texto && (
                <div className={`button-value ${!Icone ? "no-icon" : ""}`}>
                    {texto}
                </div>
            )}
            {Icone && (
                <div className="icon-container">
                    <div className="button-icon"><Icone /></div>
                </div>
            )}
        </div>
    )
}