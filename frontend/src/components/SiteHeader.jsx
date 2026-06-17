import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

// Cabeçalho do site. A nav muda conforme o estado de login (render condicional).
// `tagline` é o texto à direita do logo; `nav` permite sobrescrever os links.
export default function SiteHeader({ tagline, nav }) {
  const { isLogged, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">
          <img src="/assets/logo.svg" alt="logo demetrius&co" className="logo" />
          <span className="tagline">{tagline}</span>
        </div>
        <nav aria-label="principal">
          {nav ? nav : (
            isLogged ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/carrinho">Solicitar Serviço</Link>
                <Link to="/servicos/novo">Novo Serviço</Link>
                <a href="#" onClick={handleLogout}>Logout</a>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/cadastro">Cadastrar</Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
