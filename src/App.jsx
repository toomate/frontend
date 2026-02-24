import { useState } from 'react'
import Cadastro from "./cadastro";
import Login from "./login";
import Index from "./Index";
import CadastroInsumo from './CadastroInsumo';
import CadastroLote from './CadastroLote';
import Boletos from './Boletos';
import Fiado from './fiado';
import './App.css'


function App() {
  const [tela, setTela] = useState("cadastro");

  function irPara(t) {
    setTela(t);
  }

  return (
    <>
      {tela === "cadastro" && <Cadastro irPara={irPara} />}
      {tela === "login" && <Login irPara={irPara} />}
      {tela === "dashboard" && <Index irPara={irPara} />}
      {tela === "cadastroInsumo" && <CadastroInsumo irPara={irPara} />}
      {tela === "cadastroLote" && <CadastroLote irPara={irPara} />}
      {tela === "boletos" && <Boletos irPara={irPara} />}
      {tela === "fiados" && <Fiado irPara={irPara} />}
    </>
  )
}

export default App
