import { Button } from "../Button/Button.jsx";
import { Trash2, Edit3 } from "lucide-react"; // Importando ícones mais finos
import "./RotinaCard.css";

export default function RotinaCard({ nomeRotina, excluir, darBaixa }) {
    return (
        <div className="rotina-card-container">
            <div className="rotina-card-header">
                <div className="titulo-rotina-info">
                    <h3>Rotina - {nomeRotina}</h3>
                </div>
            </div>

            <div className="rotina-card-footer">
                <div className="acao-principal">
                    <Button texto="Dar Baixa" onClick={darBaixa} />
                </div>

                <div className="acoes-secundarias">
                    {/* Botão de excluir como ícone, seguindo o padrão do seu print */}
                    <button className="btn-icon-secundario delete" onClick={excluir} title="Excluir">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}