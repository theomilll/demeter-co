import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import TrocaSenha from './pages/TrocaSenha.jsx';
import Carrinho from './pages/Carrinho.jsx';
import CadastroServico from './pages/CadastroServico.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/troca-senha" element={<TrocaSenha />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/servicos/novo" element={<CadastroServico />} />
    </Routes>
  );
}
