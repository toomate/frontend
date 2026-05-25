import axios from "axios";
import config from "../config";

const baseURL = config.API_URL;

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const metodo = String(config?.method ?? "get").toLowerCase();
  const urlBruta = String(config?.url ?? "");
  const rotaSemApi = urlBruta.replace(/^\/api/, "");
  const rotaSemQuery = rotaSemApi.split("?")[0];
  const rota = rotaSemQuery.replace(/\/+$/, "");
  const rotaPublicaSemToken =
    metodo === "post" && (rota === "/usuarios/login" || rota === "/usuarios");

  if (rotaPublicaSemToken) {
    return config;
  }

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

  static async listarCategorias() {
    try {
      const response = await requestComFallback({
        method: "get",
        url: "/boletos/categorias",
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar categorias de boletos:", error);
      throw error;
    }
  }

  static async criar(payload) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/boletos",
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar boleto:", error);
      throw error;
    }
  }

  static async buscarPorId(idBoleto) {
    try {
      const response = await requestComFallback({
        method: "get",
        url: `/boletos/${idBoleto}`,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar boleto por id:", error);
      throw error;
    }
  }

  static async atualizar(idBoleto, payload) {
    try {
      const response = await requestComFallback({
        method: "put",
        url: `/boletos/${idBoleto}`,
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar boleto:", error);
      throw error;
    }
  }

  static async marcarComoPago(idBoleto) {
    const boletoAtual = await boletos.buscarPorId(idBoleto);
    const payload = {
      ...boletoAtual,
      pago: true,
      dataPagamento: new Date().toISOString().slice(0, 10),
    };

    return boletos.atualizar(idBoleto, payload);
  }

  static async desmarcarComoPago(idBoleto) {
    const boletoAtual = await boletos.buscarPorId(idBoleto);
    const payload = {
      ...boletoAtual,
      pago: false,
      dataPagamento: null,
    };

    return boletos.atualizar(idBoleto, payload);
  }

}

export class AuthApi {
  static async login({ apelido, senha }) {
    const apelidoLimpo = String(apelido ?? "").trim();
    const senhaLimpa = String(senha ?? "").trim();

    try {
      const response = await requestComFallback({
        method: "post",
        url: "/usuarios/login",
        data: { apelido: apelidoLimpo, senha: senhaLimpa },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao autenticar usuario:", error);
      throw error;
    }
  }

  static async cadastrar({ nome, apelido, senha, administrador = true }) {
    const apelidoFormatado = String(apelido ?? "").trim().toLowerCase();

    try {
      const response = await requestComFallback({
        method: "post",
        url: "/usuarios",
        data: { nome, apelido: apelidoFormatado, senha, administrador },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar usuario:", error);
      throw error;
    }
  }

  static async listarUsuarios() {
    try {
      const response = await requestComFallback({
        method: "get",
        url: "/usuarios",
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar usuarios:", error);
      throw error;
    }
  }

  static async listarUsuariosPaginado({ pagina = 0, tamanho = 7 } = {}) {
    try {
      const response = await requestComFallback({
        method: "get",
        url: "/usuarios/paginado",
        params: { pagina, tamanho },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar usuarios paginado:", error);
      throw error;
    }
  }

  static async atualizarUsuario(idUsuario, payload) {
    const idNormalizado = Number(idUsuario);

    if (!Number.isFinite(idNormalizado) || idNormalizado <= 0) {
      throw new Error("Id de usuario invalido para atualizacao.");
    }

    const ehAdminNormalizado =
      payload?.ehAdmin !== undefined
        ? Boolean(payload.ehAdmin)
        : payload?.administrador !== undefined
        ? Boolean(payload.administrador)
        : undefined;

    const nome = String(payload?.nome ?? "").trim();
    const apelido = String(payload?.username ?? payload?.apelido ?? "")
      .trim()
      .toLowerCase();
    const senha = String(payload?.senha ?? "").trim();

    const atualizacaoCompleta =
      payload?.nome !== undefined ||
      payload?.username !== undefined ||
      payload?.apelido !== undefined ||
      payload?.senha !== undefined;

    const tentativas = atualizacaoCompleta
      ? [
          {
            method: "put",
            url: `/usuarios/${idNormalizado}`,
            data: {
              id: idNormalizado,
              nome,
              apelido,
              senha,
              administrador: ehAdminNormalizado,
            },
          },
          {
            method: "put",
            url: "/usuarios",
            data: {
              id: idNormalizado,
              nome,
              apelido,
              senha,
              administrador: ehAdminNormalizado,
            },
          },
        ]
      : [
          {
            method: "patch",
            url: `/usuarios/${idNormalizado}`,
            data: {
              administrador: ehAdminNormalizado,
              ehAdmin: ehAdminNormalizado,
              admin: ehAdminNormalizado,
              getadministrador: ehAdminNormalizado,
            },
          },
          {
            method: "patch",
            url: "/usuarios",
            data: {
              id: idNormalizado,
              administrador: ehAdminNormalizado,
              ehAdmin: ehAdminNormalizado,
              admin: ehAdminNormalizado,
              getadministrador: ehAdminNormalizado,
            },
          },
        ];

    if (atualizacaoCompleta && (!nome || !apelido || !senha)) {
      throw new Error(
        "Para atualizar nome, apelido ou senha, preencha nome, apelido e senha."
      );
    }

    let ultimoErro = null;

    for (const tentativa of tentativas) {
      try {
        const response = await requestComFallback(tentativa);
        return response.data;
      } catch (error) {
        ultimoErro = error;
      }
    }

    console.error("Erro ao atualizar usuario:", {
      idUsuario: idNormalizado,
      payload,
      atualizacaoCompleta,
      status: ultimoErro?.response?.status,
      data: ultimoErro?.response?.data,
      mensagem: ultimoErro?.message,
    });
    throw ultimoErro;
  }
}

export class AdminApi {
  static async listarLogs() {
    const rotasTentativa = ["/logs", "/logs/sistema", "/sistema/logs"];
    let ultimoErro = null;

    for (const rota of rotasTentativa) {
      try {
        const response = await requestComFallback({
          method: "get",
          url: rota,
        });
        return response.data;
      } catch (error) {
        ultimoErro = error;
      }
    }

    console.error("Erro ao listar logs do sistema:", ultimoErro);
    throw ultimoErro;
  }

  static async listarAuditLogs(data) {
    const url = data ? `/audit-logs?data=${data}` : "/audit-logs";
    const response = await requestComFallback({ method: "get", url });
    return response.data;
  }

  static async listarAuditLogsPaginado({ data, pagina = 0, tamanho = 20 } = {}) {
    try {
      const params = { pagina, tamanho };
      if (data) {
        params.data = data;
      }
      const response = await requestComFallback({
        method: "get",
        url: "/audit-logs/paginado",
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar audit logs paginado:", error);
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
        data: mudancas
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

  static async listarLotesPaginado({ pagina = 0, tamanho = 10, dataInicial, dataFinal } = {}) {
    try {
      const params = { pagina, tamanho };
      if (dataInicial) params.dataInicial = dataInicial;
      if (dataFinal) params.dataFinal = dataFinal;

      const response = await requestComFallback({
        method: "get",
        url: "/lotes/paginado",
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar lotes paginado:", error);
      throw error;
    }
  }

  static async resumoPeriodoLotes({ dataInicial, dataFinal } = {}) {
    try {
      const params = {};
      if (dataInicial) params.dataInicial = dataInicial;
      if (dataFinal) params.dataFinal = dataFinal;

      const response = await requestComFallback({
        method: "get",
        url: "/lotes/resumo-periodo",
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar resumo do período:", error);
      throw error;
    }
  }

  static async criar({payload}) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: `/lotes`,
        data: payload
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar os lotes:", error);
      throw error;
    }
  }
}

export class FornecedorApi {
  static async listar({ razaoSocial = "", pagina = 0, tamanho = 9 } = {}) {
    try {
      const params = {
        razaoSocial: razaoSocial || undefined,
        pagina,
        tamanho,
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

  static async listarPorCategoria(idCategoria, { pagina = 0, tamanho = 9 } = {}) {
    try {
      const response = await requestComFallback({
        method: "get",
        url: `/categorias/${idCategoria}/fornecedores`,
        params: { pagina, tamanho },
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

export class MarcaApi {
  static async listar() {
    try {
      const response = await requestComFallback({ method: "get", url: "/marcas" });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar marcas:", error);
      throw error;
    }
  }

  static async criar(payload) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/marcas",
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar marca:", error);
      throw error;
    }
  }
}

export class clientes {
  static async listar() {
    try {
      const response = await requestComFallback({
        method: "get",
        url: "/clientes",
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      throw error;
    }
  }

  static async listarComDividas() {
    try {
      const response = await requestComFallback({
        method: "get",
        url: "/clientes/com-dividas",
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar clientes com dívidas:", error);
      throw error;
    }
  }

  static async criar(payload) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/clientes",
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      throw error;
    }
  }

  static async listarComDividasEmAberto() {
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

export class dividas {
  static async listar() {
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

  static async atualizarEstado(idDivida) {
    try {
      const response = await requestComFallback({
        method: "put",
        url: `/dividas/atualizarEstado/${idDivida}`,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar estado da divida:", error);
      throw error;
    }
  }

  static async listarPedidos() {
    try {
      const response = await requestComFallback({
        method: "get",
        url: "/dividas/pedidos",
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar pedidos de dividas:", error);
      throw error;
    }
  }

  static async criar(payload) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/dividas",
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar divida:", error);
      throw error;
    }
  }
}

export class Rotinas {
  static async criar(titulo) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/rotinas",
        data: {
          titulo: titulo
        }
      })
      return response.data;
    } catch (err) {
      console.error("Erro:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code
      })
    }
  }

  static async associarInsumos(id, insumos) {
    try {
      const response = await requestComFallback({
        method: "put",
        url: "/rotinas/associar-rotina-insumo",
        data: {
          fkRotina: Number(id),
          insumos: insumos
        }
      })
      return response.data
    } catch (err) {
      console.error("Erro:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code
      })
    }
  }

  static async listar(pesquisa, pagina, tamanho) {
    try {
      let url = `/rotinas?`;
      if(pagina !== undefined && tamanho !== undefined){
        url += `pagina=${pagina}&tamanho=${tamanho}`;
      }
      
      if (pesquisa.length > 0) {
        url += `&titulo=${pesquisa}`
      }
      const response = await requestComFallback({
        method: "get",
        url: url
      })

      return response.data;
    } catch (err) {
      console.error("Erro:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code
      })
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
      console.error("Erro:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code
      })
      throw err;
    }
  }

  static async darBaixa(id) {
    try {
      await requestComFallback({
        method: "put",
        url: `/rotinas/baixa/${id}`
      })
    } catch (err) {
      console.error("Erro:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code
      })
      throw err;


    }
  }

}

export class insumos {
  static async listar() {
    try {
      const response = await requestComFallback({ method: "get", url: "/insumos" });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar insumos:", error);
      throw error;
    }
  }

  static async criar(payload) {
    try {
      const response = await requestComFallback({
        method: "post",
        url: "/insumos",
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar insumo:", error);
      throw error;
    }
  }

  static async listarUnidades() {
    try {
      const response = await requestComFallback({ method: "get", url: "/insumos/listarUnidades" });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      throw error;
    }
  }
}

export class Vencimentos {
  static async buscarEstoque() {
    try {
      const response = await requestComFallback({
        method: "get",
        url: "/lotes/estoque/vencimentos"
      })

      return response.data
    } catch (err) {
      console.error("Erro:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code
      })
      throw err;
    }
  }

  static async buscarKpis() {
    try {
      const response = await requestComFallback({
        method: "get",
        url: "/lotes/estoque/kpis"
      })
      return response.data
    } catch (err) {
      console.error("Erro:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code
      })
      throw err;
    }
  }
}

export default api;
