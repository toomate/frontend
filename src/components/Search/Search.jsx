import "./Search.css"

export function Search({texto, Icone}) {
    return (
        <div className="search-container">
            <div className="search">
                <input name={texto} className="search-input" type="text" />
            </div>
            {Icone &&
                <div className="search-icon"><Icone size={20} color={"#6B4423"} strokeWidth={0.8}/></div>
            }
        </div>

    )
}