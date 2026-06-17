import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isValidEmail, validatePassword, PASSWORD_RULES_TEXT } from '../validators.js';
import { trocarSenha } from '../api.js';
import TerminalBar from '../components/TerminalBar.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import MsgBox from '../components/MsgBox.jsx';

export default function TrocaSenha() {
  const [login, setLogin] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novaSenha2, setNovaSenha2] = useState('');
  const [msg, setMsg] = useState(null);

  function validate() {
    const errors = [];
    const l = login.trim();
    if (!l) errors.push('login não preenchido.');
    else if (!isValidEmail(l)) errors.push('login precisa ter formato de e-mail válido.');

    if (!senhaAtual) errors.push('senha atual não preenchida.');
    if (!novaSenha) errors.push('nova senha não preenchida.');
    if (!novaSenha2) errors.push('confirmação da nova senha não preenchida.');

    if (novaSenha) {
      const p = validatePassword(novaSenha);
      if (!p.ok) p.reasons.forEach(r => errors.push(r));
    }
    if (novaSenha && novaSenha2 && novaSenha !== novaSenha2) {
      errors.push('nova senha e confirmação não conferem.');
    }
    return errors;
  }

  async function handleTrocar() {
    const errs = validate();
    if (errs.length) {
      setMsg({ text: '> ' + errs.join('\n> '), kind: 'error' });
      return;
    }
    setMsg({ text: '> trocando senha…' });
    const r = await trocarSenha(login.trim(), senhaAtual, novaSenha);
    if (r.status === 'ok') {
      setMsg({ text: '> Senha trocada com sucesso.', kind: 'ok' });
      setSenhaAtual(''); setNovaSenha(''); setNovaSenha2('');
    } else {
      setMsg({ text: '> ' + (r.mensagem || 'erro ao trocar senha.'), kind: 'error' });
    }
  }

  function handleLimpar() {
    setLogin(''); setSenhaAtual(''); setNovaSenha(''); setNovaSenha2('');
    setMsg(null);
  }

  return (
    <div className="troca-page">
      <TerminalBar left="~/demetrius&co/auth/troca-senha" right="ssl: ok" />
      <SiteHeader
        tagline={<>Área do Cliente<br />Recuperação de Senha</>}
        nav={<><Link to="/">Home</Link><Link to="/login">Login</Link></>}
      />

      <main className="form-page">
        <section className="form-panel yg-panel" aria-labelledby="page-title">
          <div className="panel-head">
            <img src="/assets/logo.svg" alt="logo demetrius&co" className="logo" />
            <h1 id="page-title">Troca de Senha</h1>
            <p>redefinir acesso</p>
          </div>

          <div className="panel-body">
            <div className="field">
              <label htmlFor="login">Login (email)</label>
              <input type="email" id="login" placeholder="voce@empresa.com.br"
                value={login} onChange={e => setLogin(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="senhaAtual">Senha Atual</label>
              <input type="password" id="senhaAtual"
                value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="novaSenha">Nova Senha</label>
              <input type="password" id="novaSenha"
                value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="novaSenha2">Confirmação da Nova Senha</label>
              <input type="password" id="novaSenha2"
                value={novaSenha2} onChange={e => setNovaSenha2(e.target.value)} />
            </div>

            <div className="field">
              <label>Regras de Composição</label>
              <div className="rules-box">{PASSWORD_RULES_TEXT}</div>
            </div>

            <div className="actions">
              <button type="button" onClick={handleTrocar}>Trocar Senha</button>
              <button type="button" onClick={handleLimpar}>Limpar</button>
            </div>

            <MsgBox msg={msg} />

            <div className="extra-links">
              <Link to="/login">« Voltar para Login</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter>Copyright © 1998–2026 demetrius&co. Conexão segura via SSL.</SiteFooter>
    </div>
  );
}
