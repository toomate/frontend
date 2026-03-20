import { useMemo, useState } from "react";

function normalizarUsername(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function usernameEhValido(valor) {
  return /^[a-z0-9]+$/.test(String(valor ?? ""));
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

export default function GerenciamentoUsuariosAdmin({ usuarios, aoSalvarUsuario }) {
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

  const totalAdmins = useMemo(
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
            <span>{usuarios.length} usuários</span>
            <span>{totalAdmins} admins</span>
          </div>
        </header>

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
              {usuarios.map((usuario) => (
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
              ))}
            </tbody>
          </table>
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



