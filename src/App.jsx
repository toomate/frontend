import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Boletos from "./Boletos";
import Cadastro from "./Cadastro";
import { Estoque } from "./Estoque";
import Fornecedor from "./Fornecedor";
import CadastroBoleto from "./CadastroBoleto";
import CadastroFiado from "./CadastroFiado";
import CadastroInsumo from "./CadastroInsumo";
import CadastroLote from "./CadastroLote";
import Dashboard from "./Dashboard";
import Calendario from "./components/Calendario/calendario";
import CalendarioDetail from "./components/Calendario/calendarioDetail";
import "./App.css";
import Vencimento from "./Vencimento";
import RotinaCard from "./components/RotinaCard/RotinaCard";
import Rotinas from "./Rotinas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/boletos" element={<Boletos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/fornecedor" element={<Fornecedor />} />
        <Route path="/cadastro-insumo" element={<CadastroInsumo />} />
        <Route path="/cadastro-lote" element={<CadastroLote />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/calendarioDetalhes" element={<CalendarioDetail />} />
        <Route path="/fornecedores" element={<Fornecedor />} />
        <Route path="/vencimentos" element={<Vencimento />} />
        <Route path="/rotinas" element={<Rotinas/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

