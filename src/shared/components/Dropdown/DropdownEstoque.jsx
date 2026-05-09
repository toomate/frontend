import { Plus } from "lucide-react";
import "./DropdownEstoque.css"
import { useNavigate } from "react-router-dom";

export default function DropdownEstoque(atual) {
    const navigate = useNavigate()
    const navegar = () => {
        navigate("/cadastro-lote", {state: {insumo: atual}})
    }
    return (
        <>
            <div className="dropdown-container">
                <div className="dropdown-linha" onClick={navegar}>
                    <Plus/>
                    <span>Cadastrar Novo Lote</span>
                </div>
            </div>
        </>
    )
}
