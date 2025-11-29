import { useState } from 'react'
import Cadastro from "./cadastro";
import Login from "./login";
import Index1 from "./Index1";
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
      {tela === "dashboard" && <Index1 irPara={irPara} />}
    </>
  )
}

export default App
