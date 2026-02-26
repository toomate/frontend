import axios from "axios";

var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsdWNhcyIsImlhdCI6MTc3MjA3NTk2OSwiZXhwIjoxNzcyNDM1OTY5fQ.Tdr8hJ1FB1pZJMQEgWjiXMIJDCbCsHEyNWwMWOPutKqMgMpjPxXiKBoesAL2ynO0poNTnWlT_6eqcq1bOa8Q2A"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export class boletos {

static async listarBoletos() {
    try {
        const response = await api.get('/boletos', token ? { headers: { Authorization: `Bearer ${token}` } } : {});
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar boletos:', error);
        throw error;
    }
};
}

export class Lote {
    static async dynamicGetEstoque(categoria, busca) {
        try {
            let parametro = categoria === "Geral" ? "" : `/${categoria}`

            if (busca.length > 0) {
                parametro = `/search?insumo=${busca}`
            }

            const response = await api.get(`/lotes/estoque${parametro}`)
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar o estoque:", error)
            throw error;
        }
    }

    static async atualizarQuantidade(mudancas) {
        try {
            const response = await api.patch('/lotes', mudancas)
            return response.data;
        } catch (error) {
            console.error("Erro ao tentar atualizar o estoque:", error)
            throw error;
        }
    }
}

export default api;