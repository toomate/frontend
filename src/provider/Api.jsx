import axios from "axios";
import config from "../config";

const baseURL = config.API_URL;

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function requestComFallback(config) {
  try {
    return await api.request(config);
  } catch (error) {
    const status = error?.response?.status;
    const url = config?.url;

    if (status === 404 && typeof url === "string" && !url.startsWith("/api/")) {
      return api.request({ ...config, url: `/api${url}` });
    }

    throw error;
  }
}

export class boletos {

  static async listarBoletos() {
    try {
      const response = await requestComFallback({
        method: "get",
        url: "/boletos",
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar boletos:', error);
      throw error;
    }
  };
}

export class AuthApi {
  static async login({ apelido, senha }) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/usuarios/login",
        data: { apelido, senha },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao autenticar usuario:", error);
      throw error;
    }
  }

  static async cadastrar({ nome, apelido, senha, administrador = true }) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/usuarios",
        data: { nome, apelido, senha, administrador },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar usuario:", error);
      throw error;
    }
  }
}

export class Lote {
  static async dynamicGetEstoque(categoria, busca) {
    try {
      let parametro = categoria === "Geral" ? "" : `/${categoria}`;

      if (busca.length > 0) {
        parametro = `/search?insumo=${busca}`;
      }

      const response = await requestComFallback({
        method: "get",
        url: `/lotes/estoque${parametro}`,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar o estoque:", error);
      throw error;
    }
  }

  static async atualizarQuantidade(mudancas) {
    try {
      const response = await requestComFallback({
        method: "patch",
        url: "/lotes",
        data: mudancas,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao tentar atualizar o estoque:", error);
      throw error;
    }
  }

  static async listarLotes() {
    try {
      const response = await requestComFallback({
        method: "get",
        url: `/lotes`,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar os lotes:", error);
      throw error;
    }
  }
}

export class FornecedorApi {
  static async listar({ razaoSocial = "" } = {}) {
    try {
      const params = {
        razaoSocial: razaoSocial || undefined,
      };

      const response = await requestComFallback({
        method: "get",
        url: "/fornecedores",
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      throw error;
    }
  }

  static async listarPorCategoria(idCategoria) {
    try {
      const response = await requestComFallback({
        method: "get",
        url: `/categorias/${idCategoria}/fornecedores`,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fornecedores por categoria:", error);
      throw error;
    }
  }

  static async criar(payload) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/fornecedores",
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
      throw error;
    }
  }

  static async atualizar(idFornecedor, payload) {
    try {
      const response = await requestComFallback({
        method: "put",
        url: `/fornecedores/${idFornecedor}`,
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw error;
    }
  }

  static async excluir(idFornecedor) {
    try {
      const response = await requestComFallback({
        method: "delete",
        url: `/fornecedores/${idFornecedor}`,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      throw error;
    }
  }
}

export class CategoriaApi {
  static async listar() {
    try {
      const response = await requestComFallback({ method: "get", url: "/categorias" });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      throw error;
    }
  }

  static async criar(payload) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/categorias",
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar categoria:", error);
      throw error;
    }
  }
}

export class clientes{
  static async listarComDividasEmAberto(){
        try {
      const response = await requestComFallback({
        method: "get",
        url: `/clientes/aberto`
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  }
}

export class dividas{
  static async listar(){
        try {
      const response = await requestComFallback({
        method: "get",
        url: "/dividas"
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar dividas:", error);
      throw error;
    }
  }
}

export class Rotinas {
  static async listar(){
    try{
      const response = await requestComFallback({
        method: "get",
        url: "/rotinas"
      })

      return response.data;
    } catch (err) {
      console.error("Erro ao buscar rotinas:", err.getMessage())
      throw err;
    }
  }

  static async excluirRotina(id) {
    try {
      await requestComFallback({
        method: "delete",
        url: `/rotinas/${id}`
      })

    } catch (err) {
      console.log("Erro ao excluir rotina:", err)
      throw err;
    }
  }
}

export default api;