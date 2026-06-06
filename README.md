# Toomate — Frontend

Aplicação web do **Toomate**, sistema de gestão para restaurantes e estabelecimentos do setor de alimentação. Oferece controle de estoque por lotes, gestão de fornecedores e insumos, calendário de boletos, fiados, rotinas operacionais, leitura de código de barras e um painel administrativo com KPIs, gráficos e auditoria.

Este repositório contém apenas a SPA (React + Vite). O back-end (API REST em Spring Boot) e o banco de dados são mantidos em projetos separados — consulte [Integração com a API](#integração-com-a-api).

---

## Sumário

- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Como executar](#como-executar)
  - [Desenvolvimento local](#desenvolvimento-local)
  - [Build de produção](#build-de-produção)
  - [Docker](#docker)
- [Configuração](#configuração)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Roteamento](#roteamento)
- [Integração com a API](#integração-com-a-api)
- [Autenticação e usuário padrão](#autenticação-e-usuário-padrão)
- [Scripts](#scripts)
- [Convenções](#convenções)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Linguagem / Framework | React 19, JSX |
| Build | Vite 7 |
| Roteamento | React Router DOM 7 |
| HTTP | Axios |
| Gráficos | ApexCharts (`react-apexcharts`) |
| Calendário | React Big Calendar, React Calendar |
| Ícones | Lucide React, React Icons |
| Leitor de código de barras | `@zxing/browser` |
| Qualidade | ESLint 9 |
| Servidor de produção (imagem Docker) | nginx (`nginx:stable-alpine`) |

---

## Pré-requisitos

- **Node.js 20+** e **npm 10+** (a imagem Docker usa `node:20-slim` no build)
- API Toomate rodando e acessível (padrão `http://localhost:8080`)
- Opcional: Docker 24+ para rodar o frontend em container

---

## Como executar

### Desenvolvimento local

```bash
npm install
npm run dev
```

A SPA fica disponível em **http://localhost:5173** e proxia chamadas para a `API_URL` definida em `public/config.js`.

### Build de produção

```bash
npm run build
npm run preview   # opcional — sobe o build localmente
```

O artefato gerado fica em `dist/`.

### Docker

A imagem segue um build multi-stage: compila com Node e serve o estático via nginx. O `entrypoint.sh` injeta variáveis de ambiente em runtime no `config.js`, então a mesma imagem serve para qualquer ambiente.

```bash
docker build -t toomate-frontend .
docker run --rm -p 8080:80 \
  -e API_URL=http://host.docker.internal:8080 \
  -e VITE_WAHA_API_URL=http://host.docker.internal:3000 \
  -e VITE_WAHA_API_KEY=<sua-chave> \
  toomate-frontend
```

A aplicação fica em **http://localhost:8080**.

---

## Configuração

A SPA lê configuração em runtime de `window.env`, montado pelo `entrypoint.sh` da imagem Docker a partir das variáveis de ambiente do container.

| Variável | Descrição | Default |
|---|---|---|
| `API_URL` | URL base da API REST do Toomate | `http://localhost:8080` |
| `VITE_WAHA_API_URL` | URL base do serviço WAHA (WhatsApp) | `http://localhost:3000` |
| `VITE_WAHA_API_KEY` | Chave de API do WAHA | `null` |

Em desenvolvimento, os valores default vivem em [`public/config.js`](public/config.js). A resolução acontece em [`src/config.js`](src/config.js) e segue a ordem: `window.env.X` → `window.X` → `import.meta.env.VITE_X` → default.

---

## Estrutura de pastas

```
frontend/
├── public/
│   └── config.js              # Configuração pública carregada em runtime
├── src/
│   ├── components/            # Componentes reutilizáveis e módulos de UI
│   │   ├── admin/             # Painel administrativo (cards, gráficos, listas)
│   │   ├── Cabecalho/         # Cabeçalho fixo das listagens
│   │   ├── Calendario/        # Calendário de boletos e detalhe
│   │   ├── EstoqueGrupo/      # Agrupamento de itens de estoque
│   │   ├── Kpi/               # Card de KPI numérico
│   │   ├── Leitor/            # Leitor de código de barras (zxing)
│   │   ├── LinhaTabela/       # Linha genérica de tabela
│   │   ├── Paginas/           # Seletor de páginas reutilizável
│   │   └── RotinaCard/        # Card de rotina operacional
│   ├── pages/
│   │   ├── Boletos/           # Listagem de boletos
│   │   ├── Dashboard/         # Painel inicial pós-login
│   │   ├── Fiado/             # Gestão de fiados
│   │   └── vencimento/        # Lotes próximos do vencimento
│   ├── provider/
│   │   └── Api.jsx            # Cliente HTTP central (axios) + serviços por domínio
│   ├── utils/
│   │   └── sessao.js          # Helpers de sessão/token
│   ├── App.jsx                # Definição de rotas e bootstrap de usuário padrão
│   ├── RotaPrivada.jsx        # Guard de autenticação e autorização por papel
│   ├── main.jsx               # Entry point do Vite
│   └── *.jsx / *.css          # Telas top-level (Login, Estoque, Fornecedor, ...)
├── Dockerfile                 # Build multi-stage (Node + nginx)
├── entrypoint.sh              # Injeta config em runtime no container
├── eslint.config.js
├── vite.config.js
└── package.json
```

---

## Roteamento

Todas as rotas estão definidas em [`src/App.jsx`](src/App.jsx). O acesso é controlado pelo componente `RotaPrivada`, que valida token de sessão e, quando necessário, papel (`rolesPermitidas`).

### Rotas públicas

| Rota | Tela |
|---|---|
| `/` | Login |

### Rotas autenticadas (qualquer usuário)

| Rota | Tela |
|---|---|
| `/dashboard` | Painel inicial |
| `/estoque` | Estoque por lotes |
| `/fornecedor`, `/fornecedores` | Fornecedores |
| `/vencimentos` | Lotes próximos do vencimento (suporta `?insumo=<nome>` para filtrar) |
| `/rotinas` | Rotinas operacionais |
| `/leitor` | Leitor de código de barras |
| `/calendario`, `/calendarioDetalhes` | Calendário de boletos e detalhe |
| `/cadastro-insumo`, `/cadastro-fornecedor`, `/cadastro-lote` | Cadastros |

### Rotas administrativas (`ROLE_ADMIN`)

| Rota | Tela |
|---|---|
| `/admin` | Painel administrativo (dashboard, lançamentos, usuários, logs, relatórios, WhatsApp) |
| `/cadastro` | Cadastro de usuário |
| `/boletos` | Boletos |
| `/cadastro-boleto` | Novo boleto |
| `/Fiados` | Gestão de fiados |
| `/cadastro-fiado` | Novo fiado |

---

## Integração com a API

O cliente HTTP central está em [`src/provider/Api.jsx`](src/provider/Api.jsx). Características principais:

- **Token automático**: lê de `localStorage`/`sessionStorage` (`token`, `authToken`, `jwt`, `accessToken`) e injeta no header `Authorization: Bearer <token>`, exceto em rotas públicas (`POST /usuarios/login` e `POST /usuarios`).
- **Fallback de prefixo `/api`**: se uma chamada retorna `404` e a URL não começa com `/api/`, o cliente repete a requisição com o prefixo (`/usuarios` → `/api/usuarios`). Útil quando o backend está atrás de um gateway.
- **Serviços por domínio**: o arquivo expõe classes utilitárias por entidade — `AuthApi`, `Lote`, `boletos`, `FornecedorApi`, `CategoriaApi`, `MarcaApi`, `clientes`, `dividas`, `Rotinas`, `insumos`, `Vencimentos`, `AdminApi`.

### Endpoints paginados consumidos pelo painel admin

| Aba | Endpoint | Tamanho de página | Notas |
|---|---|---|---|
| Lançamentos | `GET /lotes/paginado?pagina&tamanho&dataInicial&dataFinal` | 10 | Total fixo do período vem de `GET /lotes/resumo-periodo` |
| Usuários | `GET /usuarios/paginado?pagina&tamanho` | 7 | Recarrega a página após editar |
| Logs | `GET /audit-logs/paginado?data&pagina&tamanho` | 20 | Trocar data reseta para página 0 |

Os endpoints sem `/paginado` (`GET /lotes`, `GET /usuarios`, `GET /audit-logs`) continuam disponíveis e são usados pelos agregados (gráficos, KPIs, alertas) que precisam da série histórica completa.

---

## Autenticação e usuário padrão

Na primeira carga da aplicação, [`App.jsx`](src/App.jsx) tenta cadastrar um usuário administrador padrão:

| Campo | Valor |
|---|---|
| Nome | `Toomate` |
| Apelido | `toomate` |
| Senha | `toomate123` |
| Administrador | `true` |

Se o backend responder `409 Conflict` (usuário já existe), o erro é silenciosamente ignorado. Este comportamento existe para facilitar o primeiro login em ambientes recém-provisionados — **troque a senha em produção**.

Rotas autenticadas exigem um token JWT válido em `localStorage` ou `sessionStorage`. Rotas com `rolesPermitidas` verificam o papel decodificado do token.

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite (HMR) em `http://localhost:5173` |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Sobe o build de produção localmente para validação |
| `npm run lint` | Roda o ESLint sobre todo o projeto |

---

## Convenções

- **Estilo de código**: ESLint com `eslint-plugin-react-hooks` e `eslint-plugin-react-refresh`. Roda no CI via `npm run lint`.
- **Branches**: trabalhe a partir de `main`. Convenção: `feat/<nome-curto>` para features, `fix/<nome-curto>` para correções.
- **Commits**: mensagens descritivas em português, no infinitivo ou no presente (ex.: `Paginação no admin, alertas com abas e ajustes na tela de vencimentos`).
- **Pull Requests**: descrição com **Summary** (3-5 bullets do que mudou) e **Test plan** (checklist do que precisa ser validado).
