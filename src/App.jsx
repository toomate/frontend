import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Boletos from "./Boletos";
import Cadastro from "./Cadastro";
import CadastroInsumo from "./CadastroInsumo";
import CadastroLote from "./CadastroLote";
import Dashboard from "./Dashboard";
<<<<<<< HEAD
import Fornecedor from "./Fornecedor";
import Calendario from "./Calendario";
=======
import Calendario from "./components/Calendario/calendario";
import CalendarioDetail from "./components/Calendario/calendarioDetail";
>>>>>>> a00d9aa (Ao clicar no boleto é redirecionado a outra tela e passa o boleto para essa tela)

import "./App.css";
import { Estoque } from "./Estoque";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/boletos" element={<Boletos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro-insumo" element={<CadastroInsumo />} />
        <Route path="/cadastro-lote" element={<CadastroLote />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fornecedores" element={<Fornecedor />} />
         <Route path="/calendario" element={<Calendario />} />
         <Route path="/detalhes" element={<CalendarioDetail />} />
      </Routes>
     </BrowserRouter>
  );
}

export default App;

