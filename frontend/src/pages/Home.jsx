import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import TerminalBar from '../components/TerminalBar.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

export default function Home() {
  const { isLogged, logout } = useAuth();

  return (
    <div className="index-page">
      <TerminalBar left="~/demetrius&co/home" right="238 clientes online" />
      <SiteHeader tagline={<>Infra de TI<br />Desde os anos do modem 56k</>} />

      <main>
        <table className="portal-grid" role="presentation">
          <tbody>
            <tr>
              {/* ===== LEFT SIDEBAR ===== */}
              <td className="col-left">
                <section className="yg-panel sidebar">
                  <div className="yg-title">Inside demetrius&co</div>
                  <ul className="yg-sidebar-list">
                    <li><a href="#historia">História da Casa</a></li>
                    <li><a href="#video">Vídeo Institucional</a></li>
                    <li><a href="#galeria">Instalações</a></li>
                    <li><a href="#servicos">Serviços</a></li>
                    <li><a href="#fundadores">Fundadores</a></li>
                    <li><a href="#contato">Contato</a></li>
                    {isLogged && <li><Link to="/carrinho">Nova Solicitação</Link></li>}
                  </ul>
                </section>

                <section className="yg-panel sidebar">
                  <div className="yg-title">Minha Conta</div>
                  <div className="yg-body" style={{ textAlign: 'center' }}>
                    {!isLogged ? (
                      <div>
                        <p style={{ marginBottom: '6px' }}><strong>Você não está logado.</strong></p>
                        <p style={{ fontSize: '10px', color: '#555', marginBottom: '8px' }}>Entre para abrir chamados e acompanhar suas solicitações.</p>
                        <p><Link to="/login">Fazer Login</Link> · <Link to="/cadastro">Cadastrar</Link></p>
                      </div>
                    ) : (
                      <div>
                        <p style={{ marginBottom: '6px' }}><strong style={{ color: '#070' }}>Você está logado.</strong></p>
                        <p style={{ fontSize: '10px', color: '#555', marginBottom: '8px' }}>Sessão ativa. Acompanhe suas solicitações no carrinho.</p>
                        <p><Link to="/carrinho">Minhas Solicitações</Link></p>
                        <p style={{ marginTop: '6px' }}>
                          <a href="#" onClick={e => { e.preventDefault(); logout(); }}><strong>Sair da Conta »</strong></a>
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                <section className="yg-panel sidebar">
                  <div className="yg-title">Domínio da Semana</div>
                  <div className="yg-body" style={{ textAlign: 'center' }}>
                    <div style={{ background: '#0a1128', border: '1px solid var(--panel-border)', padding: '10px 6px', color: '#ffcc00', fontWeight: 'bold', fontSize: '11px' }}>
                      <div style={{ fontFamily: "'Courier New', monospace", fontSize: '18px' }}>$ uptime</div>
                      <div style={{ fontSize: '10px', color: '#fff', marginTop: '4px' }}>99.997% — 4 data centers privados</div>
                    </div>
                    <p className="small" style={{ marginTop: '6px' }}><a href="#servicos">Ver nossos serviços »</a></p>
                  </div>
                </section>
              </td>

              {/* ===== CENTER MAIN ===== */}
              <td className="col-main">
                <section className="hero yg-panel">
                  <div className="yg-title">demetrius&co Presents</div>
                  <div className="yg-body flush yg-featured">
                    <table className="featured-grid" role="presentation">
                      <tbody>
                        <tr>
                          <td><a className="tile-link" href="#servicos">Cloud</a><span className="tile-sub">AWS · GCP</span></td>
                          <td><a className="tile-link" href="#servicos">Cybersec</a><span className="tile-sub">Pentest</span></td>
                          <td><a className="tile-link" href="#servicos">Redes</a><span className="tile-sub">Corporativas</span></td>
                          <td rowSpan={2} className="brand-cell">
                            <span className="ribbon">FEATURED</span>
                            <span className="wordmark">demetrius<span className="amp">&amp;</span>co</span>
                            <span className="wordmark-sub">nós rodamos<br />seu back-office</span>
                            <span className="now-available">Suporte, cloud, segurança<br />e redes — 24/7</span>
                            {isLogged && <Link className="cta" to="/carrinho">Solicitar »</Link>}
                          </td>
                        </tr>
                        <tr>
                          <td><a className="tile-link" href="#servicos">Infra</a><span className="tile-sub">Servidores</span></td>
                          <td><a className="tile-link" href="#servicos">DevOps</a><span className="tile-sub">CI/CD</span></td>
                          <td><a className="tile-link" href="#servicos">Squad</a><span className="tile-sub">Dev sob demanda</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="hero-sub">
                    Suporte, cloud, segurança e redes — <strong>24/7</strong>, com a mesma mão de obra <em>raiz</em> que configurou o primeiro servidor da sua cidade em 1998.
                  </p>
                </section>

                <section id="historia" className="yg-panel historia">
                  <div className="yg-title">História da Casa <span className="meta">// desde 1998</span></div>
                  <div className="yg-body">
                    <div className="historia-box">
                      <p>Em 1998, num <strong>quartinho</strong> de 9 m² nos fundos de uma locadora de vídeo em Niterói, os três sócios da demetrius&co instalaram seu primeiro Pentium II com 64MB de RAM e começaram a prestar suporte técnico para pequenos comércios do bairro.</p>
                      <p>Em 2004, já éramos 8 pessoas e atendíamos 120 clientes de pequeno e médio porte. Fomos a <strong>primeira empresa</strong> da região a oferecer backup em fita DAT com monitoramento remoto via modem discado.</p>
                      <p>Hoje, 27 anos depois, operamos 4 data centers privados, 200+ servidores em produção e um time de 38 engenheiros. Continuamos achando que a melhor infra é aquela que o cliente <strong>não precisa lembrar que existe</strong>.</p>
                    </div>
                  </div>
                </section>

                <section id="video" className="yg-panel">
                  <div className="yg-title">Vídeo Institucional</div>
                  <div className="yg-body">
                    <div className="video-wrapper">
                      <iframe
                        src="https://www.youtube.com/embed/TibnEtHdJxc"
                        title="vídeo institucional demetrius&co"
                        allowFullScreen
                        loading="lazy"></iframe>
                    </div>
                  </div>
                </section>

                <section id="galeria" className="yg-panel">
                  <div className="yg-title">Nossas Instalações <span className="meta">4 fotos</span></div>
                  <div className="yg-body flush">
                    <table className="galeria-table" role="presentation">
                      <tbody>
                        <tr>
                          <td><img src="/assets/galeria/foto1.jpg" alt="open space do escritório" /><span className="cap">Open-space</span></td>
                          <td><img src="/assets/galeria/foto2.jpg" alt="workspace de desenvolvimento" /><span className="cap">Lab de Devs</span></td>
                        </tr>
                        <tr>
                          <td><img src="/assets/galeria/foto3.jpg" alt="equipe em reunião" /><span className="cap">Time de Ops</span></td>
                          <td><img src="/assets/galeria/foto4.jpg" alt="sala de servidores" /><span className="cap">Sala de Racks</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section id="servicos" className="yg-panel servicos">
                  <div className="yg-title">O Que Fazemos</div>
                  <div className="yg-body flush">
                    <table className="servicos-split" role="presentation">
                      <tbody>
                        <tr>
                          <td>
                            <div className="servicos-col-title">Serviços de Infra</div>
                            <ul className="servicos-list">
                              <li><img src="/assets/servicos/cloud.svg" alt="" className="icon" /><div><span className="s-name">Cloud &amp; Hosting</span><span className="s-count"> · migração AWS/GCP zero-downtime</span></div></li>
                              <li><img src="/assets/servicos/server.svg" alt="" className="icon" /><div><span className="s-name">Gestão de Infra</span><span className="s-count"> · operação 24/7 de servidores</span></div></li>
                              <li><img src="/assets/servicos/network.svg" alt="" className="icon" /><div><span className="s-name">Redes &amp; Conectividade</span><span className="s-count"> · projeto de redes corporativas</span></div></li>
                            </ul>
                          </td>
                          <td>
                            <div className="servicos-col-title">Dev &amp; Cybersec</div>
                            <ul className="servicos-list">
                              <li className="featured"><img src="/assets/servicos/shield.svg" alt="" className="icon" /><div><span className="s-name">Cybersec</span><span className="s-new">[novo]</span><span className="s-count"> · pentest e resposta a incidentes</span></div></li>
                              <li><img src="/assets/servicos/code.svg" alt="" className="icon" /><div><span className="s-name">Dev Sob Demanda</span><span className="s-count"> · squads back / front</span></div></li>
                              <li><img src="/assets/servicos/server.svg" alt="" className="icon" /><div><span className="s-name">Monitoramento</span><span className="s-count"> · 99.997% uptime garantido</span></div></li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section id="fundadores" className="yg-panel">
                  <div className="yg-title">Fundadores <span className="meta">// quem começou tudo, em 1998</span></div>
                  <div className="yg-body flush">
                    <table className="founders-table">
                      <caption>// quem começou tudo, em 1998</caption>
                      <thead>
                        <tr><th scope="col">Cargo</th><th scope="col">Nome</th><th scope="col">Breve CV</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>CEO &amp; co-fundador</td><td>Demetrius Souza</td><td>Engenheiro elétrico pela UFF (1996). <strong>15 anos</strong> de consultoria para redes corporativas antes de fundar a casa.</td></tr>
                        <tr><td>CTO &amp; co-fundador</td><td>Theo Moura</td><td>Ciência da computação pela UERJ (1997). Ex-Embratel. Especialista em redes e <em>sysadmin</em> unix.</td></tr>
                        <tr><td>COO &amp; co-fundador</td><td>Rafael Menezes</td><td>Administração pela PUC-Rio (1998). Responsável pelo caixa, pelos contratos e pelos primeiros 20 clientes.</td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </td>

              {/* ===== RIGHT SIDEBAR ===== */}
              <td className="col-right">
                <section className="yg-panel sidebar">
                  <div className="yg-title">Em Destaque</div>
                  <div className="yg-body flush yg-featured-game">
                    <div className="img-frame">
                      <span className="title">Pentest Unlimited</span>
                      <div className="pseudo-poster"></div>
                      <span className="subtitle">Auditoria completa em 10 dias</span>
                    </div>
                    {isLogged && <p style={{ padding: '6px 8px', textAlign: 'center' }}><Link to="/carrinho"><strong>Solicitar Agora »</strong></Link></p>}
                  </div>
                </section>

                <section className="yg-panel sidebar">
                  <div className="yg-title">Formas de Pagamento</div>
                  <div className="yg-body" style={{ textAlign: 'center' }}>
                    <div className="payments" style={{ justifyContent: 'center' }}>
                      <img src="/assets/pagamentos/visa.svg" alt="Visa" />
                      <img src="/assets/pagamentos/master.svg" alt="Mastercard" />
                      <img src="/assets/pagamentos/pix.svg" alt="Pix" />
                      <img src="/assets/pagamentos/boleto.svg" alt="Boleto" />
                    </div>
                    <p className="tiny muted" style={{ marginTop: '6px' }}>Faturamento mensal PJ disponível</p>
                  </div>
                </section>
              </td>
            </tr>
          </tbody>
        </table>
      </main>

      <footer id="contato" className="site-footer">
        <div className="container">
          <table className="footer-table" role="presentation">
            <tbody>
              <tr>
                <td>
                  <h3>// Contatos</h3>
                  <ul>
                    <li><a href="tel:+552133445566">(21) 3344-5566</a></li>
                    <li><a href="tel:+5521999887766">(21) 99988-7766 (zap)</a></li>
                    <li><a href="mailto:contato@demetrius.co">contato@demetrius.co</a></li>
                  </ul>
                </td>
                <td>
                  <h3>// Endereço</h3>
                  <p>Av. Marquês do Paraná, 303<br />Sala 1402 — Centro<br />Niterói / RJ — 24030-210<br />Brasil</p>
                </td>
                <td>
                  <h3>// Pagamentos</h3>
                  <div className="payments">
                    <img src="/assets/pagamentos/visa.svg" alt="Visa" />
                    <img src="/assets/pagamentos/master.svg" alt="Mastercard" />
                    <img src="/assets/pagamentos/pix.svg" alt="Pix" />
                    <img src="/assets/pagamentos/boleto.svg" alt="Boleto" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="footer-bottom">Copyright © 1998–2026 demetrius&co. Todos os direitos guardados num servidor que a gente cuida.</p>
        </div>
      </footer>
    </div>
  );
}
