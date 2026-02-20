import { Bookmark } from "lucide-react";
import "./Button.css"

export function Button({ texto, Icone, onClick}) {
    return (
        <div className="button-container" onClick={onClick}>
            {texto && (
                <div className="button-value">
                    {texto}
                </div>
            )}
            <div className="icon-container">
                {Icone && (
                    <div className="button-icon"><Icone /></div>
                )}
            </div>
        </div>
    )
}