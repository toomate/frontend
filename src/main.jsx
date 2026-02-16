import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Navbar } from './components/navbar.jsx'
import { NavCategorias } from './components/NavCategorias.jsx'
import { Estoque } from './estoque.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <NavCategorias/> */}
    {/* <Estoque /> */}
  </StrictMode>,
)
