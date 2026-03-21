import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login";
import Boletos from "./Boletos";
import Cadastro from "./cadastro";
import { Estoque } from "./Estoque";
import Fornecedor from "./Fornecedor";
import CadastroBoleto from "./CadastroBoleto";
import CadastroFiado from "./CadastroFiado";
import CadastroFornecedor from "./CadastroFornecedor";
import CadastroInsumo from "./CadastroInsumo";
import CadastroLote from "./CadastroLote";
import Dashboard from "./components/Dashboard/Dashboard";
import Calendario from "./components/Calendario/calendario";
import CalendarioDetail from "./components/Calendario/calendarioDetail";
import "./App.css";
import Vencimento from "./Vencimento";
import RotinaCard from "./components/RotinaCard/RotinaCard";
import Rotinas from "./Rotinas";
import Fiado from "./Fiado";
import Leitor from "./components/Leitor/Leitor";
import Admin from "./Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/boletos" element={<Boletos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/fornecedor" element={<Fornecedor />} />
        <Route path="/cadastro-fornecedor" element={<CadastroFornecedor />} />
        <Route path="/cadastro-insumo" element={<CadastroInsumo />} />
        <Route path="/cadastro-lote" element={<CadastroLote />} />
        <Route path="/cadastro-boleto" element={<CadastroBoleto />} />
        <Route path="/cadastro-fiado" element={<CadastroFiado />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/calendarioDetalhes" element={<CalendarioDetail />} />
        <Route path="/fornecedores" element={<Fornecedor />} />
        <Route path="/vencimentos" element={<Vencimento />} />
        <Route path="/rotinas" element={<Rotinas/>} />
        <Route path="/Fiados" element={<Fiado/>} />
        <Route path="/fiados" element={<Fiado/>} />
        <Route path="/leitor" element={<Leitor />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

