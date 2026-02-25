import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cadastro from "./cadastro";
import Login from "./login";
import Dashboard from "./Dashboard";
import CadastroInsumo from "./CadastroInsumo";
import CadastroLote from "./CadastroLote";
import Boletos from "./Boletos";
import Index from "./Index";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/index" element={<Index />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/boletos" element={<Boletos />} />
        <Route path="/cadastro-insumo" element={<CadastroInsumo />} />
        <Route path="/cadastro-lote" element={<CadastroLote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;