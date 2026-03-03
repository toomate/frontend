import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Boletos from "./Boletos";
import Cadastro from "./Cadastro";
import CadastroBoleto from "./CadastroBoleto";
import CadastroFiado from "./CadastroFiado";
import CadastroFornecedor from "./CadastroFornecedor";
import CadastroInsumo from "./CadastroInsumo";
import CadastroLote from "./CadastroLote";
import Dashboard from "./Dashboard";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/boletos" element={<Boletos />} /> */}
        {/* <Route path="/cadastro" element={<Cadastro />} /> */}
        {/* <Route path="/CadastroBoleto" element={<CadastroBoleto />} /> */}
        {/* <Route path="/CadastroFiado" element={<CadastroFiado />} /> */}
        {/* <Route path="/CadastroFornecedor" element={<CadastroFornecedor />} /> */}
        {/* <Route path="/CadastroInsumo" element={<CadastroInsumo />} /> */}
        {/* <Route path="/CadastroLote" element={<CadastroLote />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;