import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { listarServicos, listarSolicitacoes, atualizarSolicitacoes } from '../api.js';
import { toLocalYMD, todayPlusDays } from '../format.js';
import TerminalBar from '../components/TerminalBar.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import MsgBox from '../components/MsgBox.jsx';
import LinhaSolicitacao from './carrinho/LinhaSolicitacao.jsx';
import NovaSolicitacaoForm from './carrinho/NovaSolicitacaoForm.jsx';

export default function Carrinho() {
  const { user, isLogged } = useAuth();
  const navigate = useNavigate();

  const [servicos, setServicos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [servicoId, setServicoId] = useState('');
  const [msg, setMsg] = useState(null);

  // proteção de rota — sem login, volta para /login.
  useEffect(() => {
    if (!isLogged) navigate('/login');
  }, [isLogged, navigate]);

  // carga inicial: serviços (catálogo) e solicitações do usuário logado.
  useEffect(() => {
    if (!user) return;
    listarServicos().then(r => {
      const lista = r.servicos || [];
      setServicos(lista);
      if (lista.length) setServicoId(String(lista[0].id));
    });
    listarSolicitacoes(user.login).then(r => setSolicitacoes(r.solicitacoes || []));
  }, [user]);

  const labelDe = (id) => {
    const s = servicos.find(x => String(x.id) === String(id));
    return s ? s.label : '(serviço removido)';
  };

  function incluir() {
    const s = servicos.find(x => String(x.id) === String(servicoId));
    if (!s) return;
    const nova = {
      servicoId: s.id,
      data: toLocalYMD(new Date()),
      status: 'EM ELABORAÇÃO',
      preco: s.preco,
      prevista: toLocalYMD(todayPlusDays(s.prazo))
    };
    setSolicitacoes(prev => [...prev, nova]);
  }

  function excluir(idx) {
    setSolicitacoes(prev => prev.filter((_, i) => i !== idx));
  }

  async function salvar() {
    setMsg({ text: '> salvando solicitações…' });
    const r = await atualizarSolicitacoes(user.login, solicitacoes);
    if (r.status === 'ok') {
      // recarrega do servidor para refletir ids gerados
      const fresh = await listarSolicitacoes(user.login);
      setSolicitacoes(fresh.solicitacoes || []);
      setMsg({ text: '> Solicitações atualizadas com sucesso.', kind: 'ok' });
    } else {
      setMsg({ text: '> ' + (r.mensagem || 'erro ao salvar.'), kind: 'error' });
    }
  }

  if (!user) return null;

  return (
    <div className="cart-page">
      <TerminalBar left="~/demetrius&co/clientes/carrinho" right="sess: ativa · 238 clientes online" />
      <SiteHeader tagline={<>Área do Cliente<br />Nova Solicitação</>} />

      <main>
        <table className="portal-grid" role="presentation">
          <tbody>
            <tr>
              {/* ===== LEFT SIDEBAR ===== */}
              <td className="col-left">
                <section className="yg-panel sidebar" aria-label="usuário logado">
                  <div className="yg-title">Minha Conta</div>
                  <ul className="user-summary-list">
                    <li><span className="lbl">Login</span><span className="val">{user.login}</span></li>
                    <li><span className="lbl">Status</span><span className="val"><strong className="red">• ativa</strong></span></li>
                  </ul>
                </section>

                <section className="yg-panel sidebar">
                  <div className="yg-title">Atalhos</div>
                  <ul className="yg-sidebar-list">
                    <li><a href="#tabela-pedidos">Minhas Solicitações</a></li>
                    <li><a href="#nova">Nova Solicitação</a></li>
                    <li><Link to="/servicos/novo">Cadastrar Serviço de TI</Link></li>
                    <li><Link to="/troca-senha">Trocar Senha</Link></li>
                    <li><Link to="/">Voltar para Home</Link></li>
                  </ul>
                </section>

                <section className="yg-panel sidebar">
                  <div className="yg-title">Suporte</div>
                  <div className="yg-body small">
                    <p><strong>(21) 3344-5566</strong></p>
                    <p className="muted">24/7 · português</p>
                    <p style={{ marginTop: '4px' }}><a href="mailto:suporte@demetrius.co">suporte@demetrius.co</a></p>
                  </div>
                </section>
              </td>

              {/* ===== CENTER MAIN ===== */}
              <td className="col-main">
                <section className="yg-panel">
                  <div className="yg-title">Minhas Solicitações <span className="meta">histórico</span></div>
                  <div className="yg-body flush">
                    <table className="cart-table" id="tabela-pedidos">
                      <thead>
                        <tr>
                          <th>Data Pedido</th>
                          <th>Nº</th>
                          <th>Serviço</th>
                          <th>Status</th>
                          <th>Preço</th>
                          <th>Data Prevista</th>
                          <th>&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solicitacoes.map((s, i) => (
                          <LinhaSolicitacao
                            key={s.id ?? `novo-${i}`}
                            solic={s}
                            servLabel={labelDe(s.servicoId)}
                            onExcluir={() => excluir(i)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="yg-body" style={{ textAlign: 'right' }}>
                    <button type="button" onClick={salvar}>Atualizar Solicitações</button>
                  </div>
                </section>

                <NovaSolicitacaoForm
                  servicos={servicos}
                  servicoId={servicoId}
                  onSelect={setServicoId}
                  onIncluir={incluir}
                />

                <div style={{ padding: '0 10px' }}>
                  <MsgBox msg={msg} />
                </div>
              </td>

              {/* ===== RIGHT SIDEBAR ===== */}
              <td className="col-right">
                <section className="yg-panel sidebar">
                  <div className="yg-title">Dica do Sysadmin</div>
                  <div className="yg-body small">
                    <p style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>» Backup first.</p>
                    <p className="muted">Toda nova solicitação de infra já inclui snapshot automático dos 7 dias anteriores, grátis.</p>
                  </div>
                </section>

                <section className="yg-panel sidebar">
                  <div className="yg-title">Uptime Atual</div>
                  <div className="yg-body" style={{ textAlign: 'center' }}>
                    <div style={{ background: '#0a1128', border: '1px solid var(--panel-border)', padding: '8px', color: '#ffcc00' }}>
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: '16px', fontWeight: 'bold' }}>99.997%</div>
                      <div style={{ fontSize: '9px', color: '#fff', marginTop: '2px' }}>últimos 90 dias</div>
                    </div>
                  </div>
                </section>
              </td>
            </tr>
          </tbody>
        </table>
      </main>

      <SiteFooter>Copyright © 1998–2026 demetrius&co. · Sessão registrada em log seguro.</SiteFooter>
    </div>
  );
}
