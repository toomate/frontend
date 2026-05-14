import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthApi } from '../provider/Api';
import AppRoutes from './routes';
import './styles/App.css';

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
          nome: 'Toomate',
          apelido: 'toomate',
          senha: 'toomate123',
          administrador: true,
        });
      } catch (error) {
        const status = error?.response?.status;

        if (status !== 409) {
          console.error('Falha ao garantir usuario padrao na inicializacao:', error);
        }
      }
    }

    garantirUsuarioPadrao();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
