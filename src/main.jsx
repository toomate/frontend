import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { Navbar } from './components/Navbar/Navbar.jsx'
import { NavCategorias } from './components/NavCategorias/NavCategorias.jsx'
import { Estoque } from './Estoque.jsx'
import { Button } from './components/Button/Button.jsx'
import { Bookmark, SearchIcon } from 'lucide-react'
import { Search } from './components/Search/Search.jsx'
import { Cabecalho } from './app/layouts/Cabecalho/Cabecalho.jsx'
import { EstoqueGrupo } from './components/EstoqueGrupo/EstoqueGrupo.jsx'
import { EstoqueItem } from './components/EstoqueItem/EstoqueItem.jsx'
import { CardRelatorio } from './shared/components/CardRelatorio/CardRelatorio.jsx'
import { CardConfirmacao } from './shared/components/CardConfirmacao/CardConfirmacao.jsx'
import CadastroInsumo from './CadastroInsumo.jsx'
import CadastroLote from './CadastroLote.jsx'
import { CardRotina } from "./shared/components/CardRotina/CardRotina.jsx"
import Vencimento from './pages/vencimento/Vencimento.jsx'
import LinhaTabela from './components/LinhaTabela/LinhaTabela.jsx'



createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <App />
  </StrictMode>,
)
