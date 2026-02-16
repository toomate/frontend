import { Bookmark } from "lucide-react";
import "./Button.css"

export function Button({ texto, Icone }) {
    return (
        <div className="button-container">
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