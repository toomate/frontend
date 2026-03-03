import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Boletos from "./Boletos";
import Cadastro from "./Cadastro";
import CadastroInsumo from "./CadastroInsumo";
import CadastroLote from "./CadastroLote";
import Dashboard from "./Dashboard";
import Calendario from "./components/Calendario/calendario";
import CalendarioDetail from "./components/Calendario/calendarioDetail";
import Fiado from "./fiado";

import "./App.css";
import { Estoque } from "./Estoque";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/boletos" element={<Boletos />} />
         <Route path="/cadastro" element={<Cadastro />} />
         <Route path="/cadastro-insumo" element={<CadastroInsumo />} />
         <Route path="/cadastro-lote" element={<CadastroLote />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/calendario" element={<Calendario />} />
         <Route path="/calendarioDetalhes" element={<CalendarioDetail />} />
         <Route path="/fiado" element={<Fiado />} />
      </Routes>
     </BrowserRouter>
  );
}

export default App;

