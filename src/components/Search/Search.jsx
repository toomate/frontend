import "./Search.css"

export function Search({Icone, pesquisar, value}) {
    return (
        <div className="search-container">
            <div className="search">
                <input value={value} className="search-input" placeholder="Pesquisar..." type="text" onChange={(e) => pesquisar(e.target.value)} />
            </div>
            {Icone &&
                <div className="search-icon"><Icone size={28} color={"#6B4423"} strokeWidth={1}/></div>
            }
        </div> 

    )
}