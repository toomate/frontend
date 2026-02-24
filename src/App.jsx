import { useState } from 'react'
import Cadastro from "./cadastro";
import Login from "./login";
import Dashboard from "./Dashboard";
import CadastroInsumo from './CadastroInsumo';
import CadastroLote from './CadastroLote';
import Boletos from './Boletos';
import './App.css'

function App() {
  const [tela, setTela] = useState("login");

  function irPara(t) {
    setTela(t);
  }

  return (
    <>
      {tela === "login" && <Login irPara={irPara} />}
      {tela === "Index" && <Index irPara={irPara} />}
      {tela === "Cadastro" && <Cadastro irPara={irPara} />}
      {tela === "Dashboard" && <Dashboard irPara={irPara} />}
      {tela === "Boletos" && <Boletos irPara={irPara} />}
      {tela === "CadastroInsumo" && <CadastroInsumo irPara={irPara} />}
      {tela === "CadastroLote" && <CadastroLote irPara={irPara} />}
    </>
  )
}

export default App
