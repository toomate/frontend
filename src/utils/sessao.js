const chavesLocalStorageSessao = [
  "token",
  "authToken",
  "accessToken",
  "jwt",
  "usuarioNome",
  "usuarioId",
  "usuarioNomeCompleto",
];

const chavesSessionStorageSessao = ["token"];

export function limparSessaoAutenticacao() {
  chavesLocalStorageSessao.forEach((chave) => localStorage.removeItem(chave));
  chavesSessionStorageSessao.forEach((chave) => sessionStorage.removeItem(chave));
}

function decodificarPayloadJwt(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(payloadJson)));
  } catch {
    return null;
  }
}

export function lerRolesDoToken() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) return [];

  const payload = decodificarPayloadJwt(token);
  const valor = payload?.roles ?? payload?.role ?? payload?.authorities ?? [];

  if (Array.isArray(valor)) return valor.map(String);
  return String(valor).split(/[,\s]+/).filter(Boolean);
}

export function ehAdmin() {
  return lerRolesDoToken().includes("ROLE_ADMIN");
}
