import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Boletos from "./Boletos";
import Cadastro from "./Cadastro";
import CadastroInsumo from "./CadastroInsumo";
import CadastroLote from "./CadastroLote";
import Dashboard from "./Dashboard";
import Fornecedor from "./Fornecedor";

import "./App.css";

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
        <Route path="/fornecedores" element={<Fornecedor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

