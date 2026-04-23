# Frontend Toomate

Aplicacao web do Toomate para gestao de operacoes da loja, incluindo autenticacao, estoque, fornecedores, boletos, fiado, rotinas, calendario e painel administrativo.

## Tecnologias

- React 19
- Vite
- React Router DOM
- Axios
- ApexCharts / React ApexCharts
- React Big Calendar
- React Calendar
- Lucide React e React Icons
- ZXing Browser (leitura de codigo de barras)

## O que existe no projeto

### Modulos funcionais

- Login e controle de sessao com protecao de rotas privadas.
- Dashboard com indicadores e visualizacoes.
- Gestao de estoque e lotes.
- Gestao de insumos, categorias e marcas.
- Gestao de fornecedores.
- Gestao de boletos e calendario de vencimentos.
- Gestao de fiado (clientes, dividas e pedidos).
- Gestao de rotinas operacionais.
- Leitor de codigo de barras.
- Area administrativa (usuarios e logs do sistema).

### Rotas principais

- `/` login.
- `/dashboard` painel principal.
- `/estoque` estoque e itens.
- `/fornecedor` e `/fornecedores` fornecedores.
- `/boletos` listagem de boletos.
- `/cadastro`, `/cadastro-insumo`, `/cadastro-fornecedor`, `/cadastro-boleto`, `/cadastro-fiado`, `/cadastro-lote` telas de cadastro.
- `/calendario` e `/calendarioDetalhes` agenda e detalhe de boleto.
- `/vencimentos` vencimentos.
- `/Fiados` fiado.
- `/rotinas` rotinas.
- `/leitor` leitor de codigo de barras.
- `/admin` area administrativa.

## Estrutura de pastas

```text
frontend/
	public/
		config.js                # Configuracao publica da API para runtime
	src/
		components/              # Componentes reutilizaveis e modulos de UI
		pages/                   # Paginas por dominio (Boletos, Fiado, Vencimento)
		provider/Api.jsx         # Cliente HTTP e servicos da API
		utils/sessao.js          # Utilitarios de sessao/autenticacao
		App.jsx                  # Definicao de rotas
		RotaPrivada.jsx          # Guard de autenticacao
		main.jsx                 # Bootstrap da aplicacao
```

## Integracao com backend

A URL base da API e definida em `src/config.js`, com suporte a sobrescrita via `window.env.API_URL`.

Arquivo padrao de runtime:

- `public/config.js`

Valor default:

- `http://localhost:8080`

Se o backend expuser rotas com prefixo `/api`, o cliente tenta fallback automaticamente quando recebe `404` sem esse prefixo.

## Como executar localmente

### Pre-requisitos

- Node.js 18+
- npm 9+

### Passos

```bash
npm install
npm run dev
```

Aplicacao em ambiente de desenvolvimento:

- `http://localhost:5173`

## Scripts disponiveis

- `npm run dev` inicia o servidor de desenvolvimento (Vite).
- `npm run build` gera build de producao.
- `npm run preview` sobe preview local do build.
- `npm run lint` executa ESLint.

## Observacoes

- A aplicacao cria um usuario padrao na inicializacao quando necessario (tratando conflito `409`), conforme logica em `src/App.jsx`.
- Rotas privadas dependem de token salvo no navegador (`localStorage`/`sessionStorage`).
