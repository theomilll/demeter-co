import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isValidEmail } from '../validators.js';
import { autenticar } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import TerminalBar from '../components/TerminalBar.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import MsgBox from '../components/MsgBox.jsx';

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState(null);
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const errors = [];
    const l = login.trim();
    if (!l) errors.push('login não preenchido.');
    else if (!isValidEmail(l)) errors.push('login precisa ter formato de e-mail válido.');
    if (!senha) errors.push('senha não preenchida.');
    return errors;
  }

  async function handleEntrar() {
    const errs = validate();
    if (errs.length) {
      setMsg({ text: '> ' + errs.join('\n> '), kind: 'error' });
      return;
    }
    setMsg({ text: '> autenticando…' });
    const r = await autenticar(login.trim(), senha);
    if (r.autenticado) {
      setMsg({ text: '> Login efetuado com sucesso. redirecionando…', kind: 'ok' });
      setAuth({ login: login.trim() });
      setTimeout(() => navigate('/'), 600);
    } else {
      setMsg({ text: '> Login ou senha inválidos.', kind: 'error' });
    }
  }

  function handleLimpar() {
    setLogin('');
    setSenha('');
    setMsg(null);
  }

  return (
    <div className="login-page">
      <TerminalBar left="~/demetrius&co/auth/login" right="ssl: ok · 238 clientes online" />
      <SiteHeader
        tagline={<>Área do Cliente<br />Login Seguro</>}
        nav={<><Link to="/">Home</Link><Link to="/cadastro">Cadastrar</Link></>}
      />

      <main className="form-page">
        <section className="form-panel yg-panel" aria-labelledby="page-title">
          <div className="panel-head">
            <img src="/assets/logo.svg" alt="logo demetrius&co" className="logo" />
            <h1 id="page-title">Login de Clientes</h1>
            <p>acesse sua área</p>
          </div>

          <div className="panel-body">
            <div className="field">
              <label htmlFor="login">Login (email)</label>
              <input type="email" id="login" autoComplete="email" placeholder="voce@empresa.com.br"
                value={login} onChange={e => setLogin(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input type="password" id="senha" autoComplete="current-password" placeholder="••••••••"
                value={senha} onChange={e => setSenha(e.target.value)} />
            </div>

            <div className="actions">
              <button type="button" onClick={handleEntrar}>Realizar Login</button>
              <button type="button" onClick={handleLimpar}>Limpar</button>
            </div>

            <MsgBox msg={msg} />

            <div className="extra-links">
              <Link to="/troca-senha">Trocar Senha</Link>
              <span className="muted"> · </span>
              <Link to="/cadastro">Cadastrar Novo Cliente</Link>
              <br />
              <Link to="/" style={{ marginTop: '6px', display: 'inline-block' }}>« Voltar para Home</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter>Copyright © 1998–2026 demetrius&co. Área restrita a clientes cadastrados.</SiteFooter>
    </div>
  );
}
