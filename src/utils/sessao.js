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
