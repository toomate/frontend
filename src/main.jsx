import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Navbar } from './components/Navbar/Navbar.jsx'
import { NavCategorias } from './components/NavCategorias/NavCategorias.jsx'
import { Estoque } from './estoque.jsx'
import { Button } from './components/Button/Button.jsx'
import { Bookmark, SearchIcon } from 'lucide-react'
import { Search } from './components/Search/Search.jsx'
import { Cabecalho } from './components/Cabecalho/Cabecalho.jsx'
import { EstoqueGrupo } from './components/EstoqueGrupo/EstoqueGrupo.jsx'
import { EstoqueItem } from './components/EstoqueItem/EstoqueItem.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Estoque />
  </StrictMode>,
)
