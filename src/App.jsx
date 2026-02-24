import { useState } from 'react'
import Cadastro from "./cadastro";
import Login from "./login";
import Index1 from "./Index1";
import CadastroInsumo from './CadastroInsumo';
import CadastroLote from './CadastroLote';
import Boletos from './Boletos';
import './App.css'


function App() {
  const [tela, setTela] = useState("Boletos");

  function irPara(t) {
    setTela(t);
  }

  return (
    <>
      {tela === "Boletos" && <Boletos irPara={irPara} />}
      {/* {tela === "cadastro" && <Cadastro irPara={irPara} />}
      {tela === "login" && <Login irPara={irPara} />}
      {tela === "dashboard" && <Index1 irPara={irPara} />}
      {tela === "boletos" && <Boletos irPara={irPara} />} */}
    </>
  )
}

export default App
