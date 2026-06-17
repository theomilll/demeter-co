import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  isValidEmail, validatePassword, isValidName, isValidCPF,
  isAdult, isValidPhone, formatCpf, PASSWORD_RULES_TEXT
} from '../validators.js';
import { cadastrarCliente } from '../api.js';
import TerminalBar from '../components/TerminalBar.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import MsgBox from '../components/MsgBox.jsx';

const VAZIO = {
  email: '', senha: '', senha2: '', nome: '', cpf: '', nasc: '',
  tel: '', escolaridade: '2comp', civil: 'solteiro'
};

export default function Cadastro() {
  const [form, setForm] = useState(VAZIO);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  function set(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  function validate() {
    const errors = [];
    const email = form.email.trim();
    if (!email) errors.push('e-mail não preenchido.');
    else if (!isValidEmail(email)) errors.push('e-mail precisa ter formato válido.');

    if (!form.senha) errors.push('senha não preenchida.');
    if (!form.senha2) errors.push('confirmação de senha não preenchida.');
    if (form.senha) {
      const p = validatePassword(form.senha);
      if (!p.ok) p.reasons.forEach(r => errors.push(r));
    }
    if (form.senha && form.senha2 && form.senha !== form.senha2) {
      errors.push('senha e confirmação não conferem.');
    }

    const n = isValidName(form.nome);
    if (!n.ok) errors.push(n.reason);

    if (!form.cpf) errors.push('CPF não preenchido.');
    else if (!isValidCPF(form.cpf)) errors.push('CPF inválido (dígito verificador).');

    if (!form.nasc) errors.push('data de nascimento não preenchida.');
    else if (!isAdult(form.nasc)) errors.push('é preciso ter pelo menos 18 anos.');

    if (form.tel && !isValidPhone(form.tel)) {
      errors.push('telefone precisa ter formato nacional válido (10 ou 11 dígitos).');
    }
    return errors;
  }

  async function handleIncluir() {
    const errs = validate();
    if (errs.length) {
      setMsg({ text: '> ' + errs.join('\n> '), kind: 'error' });
      return;
    }
    setMsg({ text: '> cadastrando…' });
    const r = await cadastrarCliente({
      login: form.email.trim(),
      senha: form.senha,
      nome: form.nome.trim(),
      cpf: form.cpf,
      dataNascimento: form.nasc,
      telefone: form.tel,
      escolaridade: form.escolaridade,
      estadoCivil: form.civil
    });
    if (r.status === 'ok') {
      setMsg({ text: '> Cliente cadastrado com sucesso. redirecionando para login…', kind: 'ok' });
      setTimeout(() => navigate('/login'), 800);
    } else {
      setMsg({ text: '> ' + (r.mensagem || 'erro ao cadastrar.'), kind: 'error' });
    }
  }

  function handleLimpar() {
    setForm(VAZIO);
    setMsg(null);
  }

  return (
    <div className="cadastro-page">
      <TerminalBar left="~/demetrius&co/auth/cadastro" right="form: novo_cliente" />
      <SiteHeader
        tagline={<>Área do Cliente<br />Novo Cadastro</>}
        nav={<><Link to="/">Home</Link><Link to="/login">Login</Link></>}
      />

      <main className="form-page">
        <section className="form-panel yg-panel" aria-labelledby="page-title">
          <div className="panel-head">
            <img src="/assets/logo.svg" alt="logo demetrius&co" className="logo" />
            <h1 id="page-title">Cadastro de Clientes</h1>
            <p>preencha todos os campos</p>
          </div>

          <div className="panel-body">
            <div className="cadastro-grid">
              <div className="field full">
                <label htmlFor="email">E-mail (será seu login)</label>
                <input type="email" id="email" placeholder="voce@empresa.com.br"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha"
                  value={form.senha} onChange={e => set('senha', e.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="senha2">Confirmação de Senha</label>
                <input type="password" id="senha2"
                  value={form.senha2} onChange={e => set('senha2', e.target.value)} />
              </div>

              <div className="field full">
                <label>Regras de composição da senha</label>
                <div className="rules-box">{PASSWORD_RULES_TEXT}</div>
              </div>

              <div className="field full">
                <label htmlFor="nome">Nome Completo</label>
                <input type="text" id="nome" placeholder="ex.: Maria Silva"
                  value={form.nome} onChange={e => set('nome', e.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" inputMode="numeric" maxLength={14} placeholder="NNN.NNN.NNN-NN"
                  value={form.cpf} onChange={e => set('cpf', formatCpf(e.target.value))} />
              </div>

              <div className="field">
                <label htmlFor="nasc">Data de Nascimento</label>
                <input type="date" id="nasc"
                  value={form.nasc} onChange={e => set('nasc', e.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="tel">Telefone / WhatsApp (opcional)</label>
                <input type="tel" id="tel" placeholder="(21) 99988-7766"
                  value={form.tel} onChange={e => set('tel', e.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="escolaridade">Escolaridade</label>
                <select id="escolaridade" value={form.escolaridade}
                  onChange={e => set('escolaridade', e.target.value)}>
                  <option value="1inc">1º grau incompleto</option>
                  <option value="1comp">1º grau completo</option>
                  <option value="2comp">2º grau completo</option>
                  <option value="superior">nível superior</option>
                  <option value="pos">pós-graduado</option>
                </select>
              </div>

              <div className="field full">
                <label>Estado Civil</label>
                <div className="radio-group">
                  {[['solteiro', 'Solteiro(a)'], ['casado', 'Casado(a)'],
                    ['divorciado', 'Divorciado(a)'], ['viuvo', 'Viúvo(a)']].map(([v, lbl]) => (
                    <label key={v}>
                      <input type="radio" name="civil" value={v}
                        checked={form.civil === v} onChange={e => set('civil', e.target.value)} /> {lbl}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="actions">
              <button type="button" onClick={handleIncluir}>Incluir</button>
              <button type="button" onClick={handleLimpar}>Limpar</button>
              <button type="button" onClick={() => navigate(-1)}>Voltar</button>
            </div>

            <MsgBox msg={msg} />
          </div>
        </section>
      </main>

      <SiteFooter>Copyright © 1998–2026 demetrius&co. Seus dados são criptografados e armazenados conforme LGPD.</SiteFooter>
    </div>
  );
}
