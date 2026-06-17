import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cadastrarServico } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import TerminalBar from '../components/TerminalBar.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import MsgBox from '../components/MsgBox.jsx';

// Página nova (AV2): cadastra um serviço de TI com os mesmos dados usados no carrinho
// (nome/label, preço, prazo). Validação de obrigatoriedade feita no próprio React.
export default function CadastroServico() {
  const [label, setLabel] = useState('');
  const [preco, setPreco] = useState('');
  const [prazo, setPrazo] = useState('');
  const [msg, setMsg] = useState(null);
  const { isLogged } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const errors = [];
    if (!label.trim()) errors.push('nome do serviço não preenchido.');
    if (preco === '' || preco === null) errors.push('preço não preenchido.');
    else if (isNaN(Number(preco)) || Number(preco) <= 0) errors.push('preço precisa ser um número maior que zero.');
    if (prazo === '' || prazo === null) errors.push('prazo não preenchido.');
    else if (!Number.isInteger(Number(prazo)) || Number(prazo) <= 0) errors.push('prazo precisa ser um inteiro maior que zero.');
    return errors;
  }

  async function handleIncluir() {
    const errs = validate();
    if (errs.length) {
      setMsg({ text: '> ' + errs.join('\n> '), kind: 'error' });
      return;
    }
    setMsg({ text: '> cadastrando serviço…' });
    const r = await cadastrarServico({ label: label.trim(), preco: Number(preco), prazo: Number(prazo) });
    if (r.status === 'ok') {
      setMsg({ text: '> Serviço cadastrado com sucesso.', kind: 'ok' });
      setLabel(''); setPreco(''); setPrazo('');
    } else {
      setMsg({ text: '> ' + (r.mensagem || 'erro ao cadastrar serviço.'), kind: 'error' });
    }
  }

  function handleLimpar() {
    setLabel(''); setPreco(''); setPrazo('');
    setMsg(null);
  }

  return (
    <div className="cadastro-page">
      <TerminalBar left="~/demetrius&co/admin/novo-servico" right="form: novo_servico_ti" />
      <SiteHeader
        tagline={<>Área do Cliente<br />Novo Serviço de TI</>}
        nav={isLogged ? undefined : <><Link to="/">Home</Link><Link to="/carrinho">Carrinho</Link></>}
      />

      <main className="form-page">
        <section className="form-panel yg-panel" aria-labelledby="page-title">
          <div className="panel-head">
            <img src="/assets/logo.svg" alt="logo demetrius&co" className="logo" />
            <h1 id="page-title">Cadastro de Serviço de TI</h1>
            <p>preencha todos os campos</p>
          </div>

          <div className="panel-body">
            <div className="field full">
              <label htmlFor="label">Nome do Serviço</label>
              <input type="text" id="label" placeholder="ex.: Backup gerenciado em nuvem"
                value={label} onChange={e => setLabel(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="preco">Preço (R$)</label>
              <input type="number" id="preco" min="0" step="0.01" placeholder="ex.: 1990.00"
                value={preco} onChange={e => setPreco(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="prazo">Prazo de Atendimento (dias)</label>
              <input type="number" id="prazo" min="1" step="1" placeholder="ex.: 5"
                value={prazo} onChange={e => setPrazo(e.target.value)} />
            </div>

            <div className="actions">
              <button type="button" onClick={handleIncluir}>Incluir</button>
              <button type="button" onClick={handleLimpar}>Limpar</button>
              <button type="button" onClick={() => navigate('/carrinho')}>Ir para o Carrinho</button>
            </div>

            <MsgBox msg={msg} />
          </div>
        </section>
      </main>

      <SiteFooter>Copyright © 1998–2026 demetrius&co. Catálogo de serviços gerenciado internamente.</SiteFooter>
    </div>
  );
}
