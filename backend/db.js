// db.js — abre/cria o banco SQLite, cria as tabelas e faz o seed inicial.
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'data.sqlite'));
db.pragma('foreign_keys = ON');

// ------------------------------------------------------------------
// Tabelas
// ------------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS cliente (
    login            TEXT PRIMARY KEY,
    senha            TEXT NOT NULL,
    nome             TEXT NOT NULL,
    cpf              TEXT NOT NULL,
    data_nascimento  TEXT NOT NULL,
    telefone         TEXT,
    escolaridade     TEXT,
    estado_civil     TEXT
  );

  CREATE TABLE IF NOT EXISTS servico_ti (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    label  TEXT NOT NULL,
    preco  REAL NOT NULL,
    prazo  INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS solicitacao (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_login TEXT NOT NULL,
    servico_id    INTEGER NOT NULL,
    data          TEXT NOT NULL,
    status        TEXT NOT NULL,
    preco         REAL NOT NULL,
    prevista      TEXT NOT NULL,
    FOREIGN KEY (cliente_login) REFERENCES cliente(login),
    FOREIGN KEY (servico_id)    REFERENCES servico_ti(id)
  );
`);

// ------------------------------------------------------------------
// Seed — só roda quando as tabelas estão vazias.
// Dados baseados nos fixtures da AV1 (js/carrinho.js).
// ------------------------------------------------------------------
function seed() {
  const nServicos = db.prepare('SELECT COUNT(*) AS n FROM servico_ti').get().n;
  if (nServicos === 0) {
    const ins = db.prepare('INSERT INTO servico_ti (label, preco, prazo) VALUES (?, ?, ?)');
    const servicos = [
      ['Suporte técnico — plano básico', 890.00, 3],
      ['Suporte técnico — plano 24/7', 2450.00, 1],
      ['Migração para cloud (AWS/GCP)', 12500.00, 30],
      ['Auditoria de segurança / pentest', 8900.00, 14],
      ['Projeto de rede corporativa', 6400.00, 21],
      ['Squad de devs (mensal)', 42000.00, 7]
    ];
    const tx = db.transaction(() => servicos.forEach(s => ins.run(...s)));
    tx();
  }

  const nClientes = db.prepare('SELECT COUNT(*) AS n FROM cliente').get().n;
  if (nClientes === 0) {
    // cliente de teste para login (senha válida pelas regras da AV1)
    db.prepare(`
      INSERT INTO cliente (login, senha, nome, cpf, data_nascimento, telefone, escolaridade, estado_civil)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('adaury@fixo.com', 'Senha@1', 'Adaury Neto', '529.982.247-25', '1990-05-12', '(21) 99988-7766', 'superior', 'solteiro');

    // histórico inicial ligado ao cliente de teste
    const servRows = db.prepare('SELECT id, label FROM servico_ti').all();
    const idDe = label => (servRows.find(s => s.label === label) || {}).id;
    const insSol = db.prepare(`
      INSERT INTO solicitacao (cliente_login, servico_id, data, status, preco, prevista)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const historico = [
      ['Suporte técnico — plano básico', '2026-01-12', 'CONCLUÍDO', 890.00, '2026-01-15'],
      ['Migração para cloud (AWS/GCP)', '2026-02-03', 'EM EXECUÇÃO', 12500.00, '2026-03-05'],
      ['Auditoria de segurança / pentest', '2026-02-28', 'AGENDADO', 8900.00, '2026-03-14'],
      ['Projeto de rede corporativa', '2026-03-10', 'EM ELABORAÇÃO', 6400.00, '2026-03-31']
    ];
    const tx = db.transaction(() => {
      historico.forEach(([label, data, status, preco, prevista]) => {
        insSol.run('adaury@fixo.com', idDe(label), data, status, preco, prevista);
      });
    });
    tx();
  }
}

seed();

module.exports = db;
