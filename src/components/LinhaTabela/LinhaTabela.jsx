import "./LinhaTabela.css"
import { AlertTriangle, CheckCircle2, CircleDot, Skull } from "lucide-react"

function formatarData(dataOriginal) {
    if (!dataOriginal) {
        return "-"
    }

    const data = new Date(dataOriginal)

    if (Number.isNaN(data.getTime())) {
        return String(dataOriginal)
    }

    return new Intl.DateTimeFormat("pt-BR").format(data)
}

function obterDiasRestantes(diasRestantes) {
    const numero = Number(diasRestantes)
    return Number.isFinite(numero) ? numero : null
}

function obterClasseUrgencia(diasRestantes, statusBruto = "") {
    const numero = obterDiasRestantes(diasRestantes)
    const statusNormalizado = String(statusBruto ?? "").toLowerCase()

    if (numero !== null && numero < 0) {
        return "badge-status-vencido"
    }

    if (numero === 0 || statusNormalizado.includes("hoje")) {
        return "badge-status-hoje"
    }

    if (statusNormalizado.includes("vencid")) {
        return "badge-status-vencido"
    }

    if (numero !== null && numero <= 7) {
        return "badge-status-alerta"
    }

    if (statusNormalizado.includes("ok") || statusNormalizado.includes("valid") || statusNormalizado.includes("normal")) {
        return "badge-status-normal"
    }

    return "badge-status-neutro"
}

function renderizarDiasRestantes(diasRestantes, statusBruto = "") {
    const numero = obterDiasRestantes(diasRestantes)
    const classeUrgencia = obterClasseUrgencia(diasRestantes, statusBruto)

    if (numero === null) {
        return <span className="badge-status badge-status-neutro">{diasRestantes ?? "-"}</span>
    }

    if (numero < 0) {
        return (
            <span className={`badge-status ${classeUrgencia}`}>
                <Skull size={16} strokeWidth={2.2} />
                <span className="badge-texto">Vencido há {Math.abs(numero)} dia{Math.abs(numero) === 1 ? "" : "s"}</span>
            </span>
        )
    }

    if (numero === 0) {
        return (
            <span className={`badge-status ${classeUrgencia}`}>
                <AlertTriangle size={16} strokeWidth={2.2} />
                <span className="badge-texto">Hoje</span>
            </span>
        )
    }

    return (
        <span className={`badge-status ${classeUrgencia}`}>
            {numero} dia{numero === 1 ? "" : "s"}
        </span>
    )
}

function renderizarStatus(atual) {
    const statusBruto = String(atual.status ?? "").trim()
    const diasRestantes = obterDiasRestantes(atual.diasRestantes)
    const statusNormalizado = statusBruto.toLowerCase()

    if (diasRestantes !== null && diasRestantes < 0) {
        return (
            <span className="badge-status badge-status-vencido">
                <Skull size={16} strokeWidth={2.2} />
                <span className="badge-texto">Vencido</span>
            </span>
        )
    }

    if (diasRestantes === 0 || statusNormalizado.includes("hoje")) {
        return (
            <span className="badge-status badge-status-hoje">
                <AlertTriangle size={16} strokeWidth={2.2} />
                <span className="badge-texto">Hoje</span>
            </span>
        )
    }

    if (statusNormalizado.includes("vencid")) {
        return (
            <span className="badge-status badge-status-vencido">
                <Skull size={16} strokeWidth={2.2} />
                <span className="badge-texto">Vencido</span>
            </span>
        )
    }

    if (diasRestantes !== null && diasRestantes <= 7) {
        return (
            <span className="badge-status badge-status-alerta">
                <CircleDot size={16} strokeWidth={2.2} />
                <span className="badge-texto">A vencer</span>
            </span>
        )
    }

    if (statusNormalizado.includes("ok") || statusNormalizado.includes("valid") || statusNormalizado.includes("normal")) {
        return (
            <span className="badge-status badge-status-normal">
                <CheckCircle2 size={16} strokeWidth={2.2} />
                <span className="badge-texto">{statusBruto || "OK"}</span>
            </span>
        )
    }

    return <span className="badge-status badge-status-neutro">{statusBruto || "-"}</span>
}

export default function LinhaTabela(props) {
    const elementos = Array.isArray(props.elementos) ? props.elementos : []

    return (
        <>
            {elementos.map((atual) => {
                const diasRestantes = obterDiasRestantes(atual.diasRestantes)
                const estaVencido = (diasRestantes !== null && diasRestantes < 0) || String(atual.status ?? "").toLowerCase().includes("vencid")

                return (
                <div key={atual.id} className="tabela-insumo-container" id={estaVencido ? "vencido" : ""}>
                        <div className="linha-tabela linha-estoque" data-label="Insumo">
                            <span className="linha-valor">{atual.insumo}</span>
                        </div>
                        <div className="linha-tabela linha-estoque" data-label="Marca">
                            <span className="linha-valor">{atual.marca}</span>
                        </div>
                        <div className="linha-tabela linha-estoque" data-label="Estoque Atual">
                            <span className="linha-valor">{atual.estoqueAtual}</span>
                        </div>
                        <div className="linha-tabela linha-estoque" data-label="Data de Vencimento">
                            <span className="linha-valor">{formatarData(atual.dtVencimento)}</span>
                        </div>
                        <div className="linha-tabela linha-estoque" data-label="Dias Restantes">
                            <span className="linha-valor">{renderizarDiasRestantes(atual.diasRestantes, atual.status)}</span>
                        </div>
                        <div className="linha-tabela linha-estoque" data-label="Status">
                            <span className="linha-valor">{renderizarStatus(atual)}</span>
                        </div>
                </div>
                )
            })}
        </>
    )
}