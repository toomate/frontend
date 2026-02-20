import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
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

export default api;
