import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login";
import Boletos from "./pages/Boletos/Boletos";
import Cadastro from "./cadastro";
import { Estoque } from "./Estoque";
import Fornecedor from "./Fornecedor";
import CadastroBoleto from "./CadastroBoleto";
import CadastroFiado from "./CadastroFiado";
import CadastroInsumo from "./CadastroInsumo";
import CadastroLote from "./CadastroLote";
import Dashboard from "./pages/Dashboard/Dashboard";
import Calendario from "./components/Calendario/calendario";
import BoletoDetail from "./components/Calendario/boletoDetail";
import "./App.css";
import Vencimento from "./pages/vencimento/Vencimento";
import RotinaCard from "./components/RotinaCard/RotinaCard";
import Rotinas from "./Rotinas";
import Fiado from "./pages/Fiado/Fiado";
import Leitor from "./components/Leitor/Leitor";
import Admin from "./Admin";
import RotaPrivada from "./RotaPrivada";
import { AuthApi } from "./provider/Api";
import { useEffect } from "react";

let usuarioPadraoInicializado = false;

function App() {
  useEffect(() => {
    if (usuarioPadraoInicializado) {
      return;
    }

    usuarioPadraoInicializado = true;

    async function garantirUsuarioPadrao() {
      try {
        await AuthApi.cadastrar({
          nome: "Toomate",
          apelido: "toomate",
          senha: "toomate123",
          administrador: true,
        });
      } catch (error) {
        const status = error?.response?.status;

        if (status !== 409) {
          console.error("Falha ao garantir usuario padrao na inicializacao:", error);
        }
      }
    }

    garantirUsuarioPadrao();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<RotaPrivada />}>
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/fornecedor" element={<Fornecedor />} />
          <Route path="/cadastro-insumo" element={<CadastroInsumo />} />
          <Route path="/cadastro-fornecedor" element={<CadastroFornecedor />} />
          <Route path="/cadastro-lote" element={<CadastroLote />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/calendarioDetalhes" element={<BoletoDetail />} />
          <Route path="/fornecedores" element={<Fornecedor />} />
          <Route path="/vencimentos" element={<Vencimento />} />
          <Route path="/rotinas" element={<Rotinas />} />
          <Route path="/leitor" element={<Leitor />} />
        </Route>
        <Route element={<RotaPrivada rolesPermitidas={["ROLE_ADMIN"]} />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/boletos" element={<Boletos />} />
          <Route path="/cadastro-boleto" element={<CadastroBoleto />} />
          <Route path="/Fiados" element={<Fiado />} />
          <Route path="/cadastro-fiado" element={<CadastroFiado />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

