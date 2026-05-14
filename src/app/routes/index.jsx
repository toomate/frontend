import { Route, Routes } from 'react-router-dom';
import Login from '../../features/auth/pages/Login';
import Cadastro from '../../features/auth/pages/Cadastro';
import Boletos from '../../features/boletos/pages/Boletos';
import CadastroBoleto from '../../features/boletos/pages/CadastroBoleto';
import Dashboard from '../../features/dashboard/pages/Dashboard';
import Calendario from '../../features/calendario/pages/Calendario';
import BoletoDetail from '../../features/calendario/components/BoletoDetail';
import { Estoque } from '../../features/estoque/pages/Estoque';
import CadastroInsumo from '../../features/estoque/pages/CadastroInsumo';
import CadastroLote from '../../features/estoque/pages/CadastroLote';
import Fornecedor from '../../features/fornecedores/pages/Fornecedor';
import CadastroFornecedor from '../../features/fornecedores/pages/CadastroFornecedor';
import Fiado from '../../features/fiado/pages/Fiado';
import CadastroFiado from '../../features/fiado/pages/CadastroFiado';
import Vencimento from '../../features/vencimentos/pages/Vencimento';
import Rotinas from '../../features/rotinas/pages/Rotinas';
import Leitor from '../../components/Leitor/Leitor';
import Admin from '../../features/admin/pages/Admin';
import RotaPrivada from '../guards/RotaPrivada';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route element={<RotaPrivada />}>
        <Route path='/boletos' element={<Boletos />} />
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path='/estoque' element={<Estoque />} />
        <Route path='/fornecedor' element={<Fornecedor />} />
        <Route path='/cadastro-insumo' element={<CadastroInsumo />} />
        <Route path='/cadastro-fornecedor' element={<CadastroFornecedor />} />
        <Route path='/cadastro-boleto' element={<CadastroBoleto />} />
        <Route path='/cadastro-fiado' element={<CadastroFiado />} />
        <Route path='/cadastro-lote' element={<CadastroLote />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/calendario' element={<Calendario />} />
        <Route path='/calendarioDetalhes' element={<BoletoDetail />} />
        <Route path='/fornecedores' element={<Fornecedor />} />
        <Route path='/vencimentos' element={<Vencimento />} />
        <Route path='/rotinas' element={<Rotinas />} />
        <Route path='/fiados' element={<Fiado />} />
        <Route path='/Fiados' element={<Fiado />} />
        <Route path='/leitor' element={<Leitor />} />
        <Route path='/admin' element={<Admin />} />
      </Route>
    </Routes>
  );
}
