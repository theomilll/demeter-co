// carrinho.js — solicitação de serviços TI.
// Valores fixos nessa versão, como pedido no PDF.

(function () {
  // catálogo de serviços (preço em BRL, prazo em dias)
  const SERVICOS = {
    'suporte_basico':  { label: 'Suporte técnico — plano básico',       preco: 890.00,  prazo: 3 },
    'suporte_24_7':    { label: 'Suporte técnico — plano 24/7',          preco: 2450.00, prazo: 1 },
    'migracao_cloud':  { label: 'Migração para cloud (AWS/GCP)',         preco: 12500.00, prazo: 30 },
    'pentest':         { label: 'Auditoria de segurança / pentest',      preco: 8900.00, prazo: 14 },
    'rede_corp':       { label: 'Projeto de rede corporativa',           preco: 6400.00, prazo: 21 },
    'dev_squad':       { label: 'Squad de devs (mensal)',                preco: 42000.00, prazo: 7 }
  };

  // fixtures de histórico (PDF: valores fictícios fixos)
  const HISTORICO = [
    { data: '2026-01-12', num: 1001, serv: 'Suporte técnico — plano básico',    status: 'CONCLUÍDO',     preco: 890.00,  prevista: '2026-01-15' },
    { data: '2026-02-03', num: 1014, serv: 'Migração para cloud (AWS/GCP)',     status: 'EM EXECUÇÃO',   preco: 12500.00, prevista: '2026-03-05' },
    { data: '2026-02-28', num: 1022, serv: 'Auditoria de segurança / pentest',  status: 'AGENDADO',      preco: 8900.00, prevista: '2026-03-14' },
    { data: '2026-03-10', num: 1030, serv: 'Projeto de rede corporativa',       status: 'EM ELABORAÇÃO', preco: 6400.00, prevista: '2026-03-31' }
  ];

  const $tbody = document.getElementById('tbody-pedidos');
  const $sel   = document.getElementById('servico');
  const $preco = document.getElementById('out-preco');
  const $prazo = document.getElementById('out-prazo');
  const $data  = document.getElementById('out-data');
  const $btn   = document.getElementById('btn-incluir');
  const $logout = document.getElementById('btn-logout');

  function fmtBRL(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function fmtDate(d) {
    if (typeof d === 'string') {
      const match = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        return `${match[3]}/${match[2]}/${match[1]}`;
      }
    }

    const dt = (d instanceof Date) ? d : new Date(d);
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yy = dt.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }

  function toLocalYMD(d) {
    const dt = (d instanceof Date) ? d : new Date(d);
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  }

  function todayPlusDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  // popula combo de serviços
  Object.keys(SERVICOS).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = SERVICOS[key].label;
    $sel.appendChild(opt);
  });

  function atualizarLabels() {
    const s = SERVICOS[$sel.value];
    $preco.textContent = fmtBRL(s.preco);
    $prazo.textContent = s.prazo + ' dias úteis';
    $data.textContent  = fmtDate(todayPlusDays(s.prazo));
  }

  $sel.addEventListener('change', atualizarLabels);
  atualizarLabels();

  // helper DOM seguro
  function td(text) {
    const el = document.createElement('td');
    el.textContent = text;
    return el;
  }

  function renderLinha(p) {
    const tr = document.createElement('tr');
    tr.appendChild(td(fmtDate(p.data)));
    tr.appendChild(td('#' + p.num));
    tr.appendChild(td(p.serv));
    tr.appendChild(td(p.status));
    tr.appendChild(td(fmtBRL(p.preco)));
    tr.appendChild(td(fmtDate(p.prevista)));

    const tdBtn = document.createElement('td');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-del';
    btn.textContent = 'excluir';
    btn.addEventListener('click', () => tr.parentNode.removeChild(tr));
    tdBtn.appendChild(btn);
    tr.appendChild(tdBtn);
    return tr;
  }

  // histórico ordenado crescente por data do pedido
  HISTORICO
    .slice()
    .sort((a, b) => a.data.localeCompare(b.data))
    .forEach(p => $tbody.appendChild(renderLinha(p)));

  // botão incluir — adiciona nova linha
  let proxNum = 1100;
  $btn.addEventListener('click', function () {
    const s = SERVICOS[$sel.value];
    const hoje = new Date();
    const prevista = todayPlusDays(s.prazo);
    const nova = {
      data: toLocalYMD(hoje),
      num: proxNum++,
      serv: s.label,
      status: 'EM ELABORAÇÃO',
      preco: s.preco,
      prevista: toLocalYMD(prevista)
    };
    $tbody.appendChild(renderLinha(nova));
  });

  // logout
  if ($logout) {
    $logout.addEventListener('click', function (e) {
      e.preventDefault();
      setLogged(false);
      window.location.href = 'index.html';
    });
  }
})();
