import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const getBoletos = async () => {
    try {
        const response = await api.get('/boletos');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar boletos:', error);
        throw error;
    }
};

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
}

export default api;