import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../../provider/Api";

const USUARIOS_POR_PAGINA = 7;

function normalizarUsername(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function usernameEhValido(valor) {
  return /^[a-z0-9]+$/.test(String(valor ?? ""));
}

function normalizarBooleano(valor) {
  return valor === true || valor === "true" || valor === 1 || valor === "1";
}

function normalizarTextoSeguro(valor, fallback = "") {
  const texto = String(valor ?? "").trim();
  return texto || fallback;
}

function normalizarUsuario(usuario, indice) {
  const id = Number(usuario?.id ?? usuario?.idUsuario) || indice + 1;
  return {
    id,
    nome: normalizarTextoSeguro(usuario?.nome ?? usuario?.nomeCompleto, `Usuário ${id}`),
    username: normalizarTextoSeguro(
      usuario?.apelido ?? usuario?.username ?? usuario?.login,
      `usuario.${id}`
    ),
    ehAdmin: normalizarBooleano(
      usuario?.administrador ?? usuario?.ehAdmin ?? usuario?.admin
    ),
  };
}

function montarDadosEdicao(usuario) {
  return {
    nome: usuario.nome ?? "",
    username: usuario.username ?? "",
    ehAdmin: Boolean(usuario.ehAdmin),
    senha: "",
    confirmarSenha: "",
  };
}

export default function GerenciamentoUsuariosAdmin({ aoSalvarUsuario }) {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erroCarregar, setErroCarregar] = useState("");

  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [dadosEdicao, setDadosEdicao] = useState({
    nome: "",
    username: "",
    ehAdmin: false,
    senha: "",
    confirmarSenha: "",
  });
  const [erroSenha, setErroSenha] = useState("");
  const [erroSalvar, setErroSalvar] = useState("");
  const [avisoUsername, setAvisoUsername] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroCarregar("");
    try {
      const resposta = await AuthApi.listarUsuariosPaginado({
        pagina: paginaAtual,
        tamanho: USUARIOS_POR_PAGINA,
      });
      const conteudo = Array.isArray(resposta?.content) ? resposta.content : [];
      setUsuarios(conteudo.map(normalizarUsuario));
      setTotalPaginas(Math.max(1, resposta?.totalPages ?? 1));
      setTotalUsuarios(resposta?.totalElements ?? conteudo.length);
    } catch (e) {
      setErroCarregar("Não foi possível carregar os usuários.");
      setUsuarios([]);
      setTotalPaginas(1);
      setTotalUsuarios(0);
    } finally {
      setCarregando(false);
    }
  }, [paginaAtual]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const totalAdminsPagina = useMemo(
    () => usuarios.filter((usuario) => usuario.ehAdmin).length,
    [usuarios]
  );

  function abrirModalEdicao(usuario) {
    setUsuarioEmEdicao(usuario);
    setDadosEdicao(montarDadosEdicao(usuario));
  }

  function fecharModalEdicao() {
    setUsuarioEmEdicao(null);
    setDadosEdicao({
      nome: "",
      username: "",
      ehAdmin: false,
      senha: "",
      confirmarSenha: "",
    });
    setErroSenha("");
    setErroSalvar("");
    setAvisoUsername("");
    setSalvando(false);
  }

  function atualizarCampo(campo, valor) {
    let valorTratado = valor;

    if (campo === "username") {
      valorTratado = normalizarUsername(valor);
      setAvisoUsername(
        valorTratado !== valor
          ? "Username deve conter apenas letras minusculas e numeros."
          : ""
      );
    }

    setDadosEdicao((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valorTratado,
    }));

    if (campo === "senha" || campo === "confirmarSenha") {
      setErroSenha("");
    }
  }

  async function salvarEdicao() {
    if (!usuarioEmEdicao) return;

    setErroSalvar("");
    setErroSenha("");

    const nomeDigitado = String(dadosEdicao.nome ?? "").trim();
    const usernameDigitado = String(dadosEdicao.username ?? "").trim();
    const senhaDigitada = String(dadosEdicao.senha ?? "").trim();
    const confirmarSenhaDigitada = String(dadosEdicao.confirmarSenha ?? "").trim();

    const payloadAtualizacao = {
      ehAdmin: Boolean(dadosEdicao.ehAdmin),
    };

    if (nomeDigitado && nomeDigitado !== usuarioEmEdicao.nome) {
      payloadAtualizacao.nome = nomeDigitado;
    }

    if (usernameDigitado && usernameDigitado !== usuarioEmEdicao.username) {
      if (!usernameEhValido(usernameDigitado)) {
        setErroSenha(
          "Username deve conter apenas letras minusculas e numeros, sem espacos ou caracteres especiais."
        );
        return;
      }
      payloadAtualizacao.username = usernameDigitado;
    }

    const alterouNomeOuApelido =
      payloadAtualizacao.nome !== undefined ||
      payloadAtualizacao.username !== undefined;

    if (senhaDigitada || confirmarSenhaDigitada) {
      if (senhaDigitada !== confirmarSenhaDigitada) {
        setErroSenha("A confirmação de senha não confere.");
        return;
      }
    }

    if (alterouNomeOuApelido && !senhaDigitada) {
      setErroSenha("Para alterar nome ou apelido, informe e confirme a senha.");
      return;
    }

    if (senhaDigitada) {
      payloadAtualizacao.senha = senhaDigitada;
    }

    if (
      payloadAtualizacao.nome === undefined &&
      payloadAtualizacao.username === undefined &&
      payloadAtualizacao.senha === undefined &&
      payloadAtualizacao.ehAdmin === usuarioEmEdicao.ehAdmin
    ) {
      fecharModalEdicao();
      return;
    }

    try {
      setSalvando(true);
      await aoSalvarUsuario(usuarioEmEdicao.id, payloadAtualizacao);
      fecharModalEdicao();
      await carregar();
    } catch {
      setErroSalvar("Não foi possível salvar as alterações. Tente novamente.");
      setSalvando(false);
    }
  }

  return (
    <>
      <section className="admin-users-card admin-card">
        <header className="admin-users-header">
          <div>
            <h2>Gerenciamento de usuários</h2>
            <p>Visualize todos os usuários e edite dados de acesso pelo modal.</p>
          </div>
          <div className="admin-users-resumo">
            <span>{totalUsuarios} usuários</span>
            <span>{totalAdminsPagina} admins nesta página</span>
            <button
              type="button"
              className="admin-users-btn-salvar"
              onClick={() => navigate("/cadastro")}
            >
              Cadastrar usuário
            </button>
          </div>
        </header>

        {erroCarregar ? (
          <p className="admin-empty-list" style={{ color: "#c92c2c" }}>{erroCarregar}</p>
        ) : (
          <div className="admin-users-tabela-wrapper">
            <table className="admin-users-tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Apelido</th>
                  <th>Status</th>
                  <th>Alteração</th>
                </tr>
              </thead>
              <tbody>
                {carregando && usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-empty-list">Carregando...</td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-empty-list">Nenhum usuário encontrado.</td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.username}</td>
                      <td>
                        <span
                          className={`admin-users-status-badge ${
                            usuario.ehAdmin ? "is-admin" : "is-comum"
                          }`}
                        >
                          {usuario.ehAdmin ? "Admin" : "Comum"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-users-acao-btn"
                          onClick={() => abrirModalEdicao(usuario)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="admin-lancamentos-paginacao">
          <button
            type="button"
            className="admin-lancamentos-pag-btn"
            onClick={() => setPaginaAtual((p) => Math.max(0, p - 1))}
            disabled={carregando || paginaAtual <= 0}
          >
            Anterior
          </button>
          <span className="admin-lancamentos-pag-info">
            Página {paginaAtual + 1} de {totalPaginas}
          </span>
          <button
            type="button"
            className="admin-lancamentos-pag-btn"
            onClick={() => setPaginaAtual((p) => Math.min(totalPaginas - 1, p + 1))}
            disabled={carregando || paginaAtual + 1 >= totalPaginas}
          >
            Próxima
          </button>
        </div>
      </section>

      {usuarioEmEdicao ? (
        <div className="admin-users-modal-overlay" onClick={fecharModalEdicao}>
          <div
            className="admin-users-modal"
            onClick={(evento) => evento.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Editar usuário"
          >
            <header className="admin-users-modal-header">
              <h3>Editar usuário</h3>
              <p>Atualize nome, apelido de login, status e senha.</p>
            </header>

            <div className="admin-users-form-grid">
              <label className="admin-users-form-campo">
                <span>Nome</span>
                <input
                  type="text"
                  className="admin-users-input"
                  value={dadosEdicao.nome}
                  onChange={(evento) =>
                    atualizarCampo("nome", evento.target.value)
                  }
                />
              </label>

              <label className="admin-users-form-campo">
                <span>Apelido (username)</span>
                <input
                  type="text"
                  className="admin-users-input"
                  value={dadosEdicao.username}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={(evento) =>
                    atualizarCampo("username", evento.target.value)
                  }
                />
                {avisoUsername ? (
                  <small className="admin-users-aviso-username">{avisoUsername}</small>
                ) : null}
              </label>

              <label className="admin-users-form-campo">
                <span>Status</span>
                <select
                  className="admin-users-select"
                  value={dadosEdicao.ehAdmin ? "admin" : "comum"}
                  onChange={(evento) =>
                    atualizarCampo("ehAdmin", evento.target.value === "admin")
                  }
                >
                  <option value="comum">Comum</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <label className="admin-users-form-campo">
                <span>Senha</span>
                <input
                  type="password"
                  className="admin-users-input"
                  value={dadosEdicao.senha}
                  onChange={(evento) =>
                    atualizarCampo("senha", evento.target.value)
                  }
                  placeholder="Digite uma nova senha"
                />
              </label>

              <label className="admin-users-form-campo">
                <span>Confirmar senha</span>
                <input
                  type="password"
                  className="admin-users-input"
                  value={dadosEdicao.confirmarSenha}
                  onChange={(evento) =>
                    atualizarCampo("confirmarSenha", evento.target.value)
                  }
                  placeholder="Repita a nova senha"
                />
              </label>
            </div>

            {erroSenha ? (
              <p className="admin-users-erro-senha" role="alert">
                {erroSenha}
              </p>
            ) : null}

            {erroSalvar ? (
              <p className="admin-users-erro-senha" role="alert">
                {erroSalvar}
              </p>
            ) : null}

            <div className="admin-users-modal-actions">
              <button
                type="button"
                className="admin-users-btn-cancelar"
                onClick={fecharModalEdicao}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="admin-users-btn-salvar"
                onClick={salvarEdicao}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
