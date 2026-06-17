// repository.js — funcionalidades de acesso a dados exigidas pelo enunciado AV2.
const db = require('./db');

// Autenticação: lê cliente por login e compara a senha. Retorna true/false.
function autenticar(login, senha) {
  const row = db.prepare('SELECT senha FROM cliente WHERE login = ?').get(login);
  if (!row) return false;
  return row.senha === senha;
}

// Troca de senha: autentica com login + senha atual; se válido, atualiza a senha.
// Lança erro com mensagem pertinente caso a autenticação falhe.
function trocarSenha(login, senhaAtual, novaSenha) {
  if (!autenticar(login, senhaAtual)) {
    throw new Error('Login ou senha atual inválidos.');
  }
  db.prepare('UPDATE cliente SET senha = ? WHERE login = ?').run(novaSenha, login);
}

// Cadastro de cliente: verifica apenas se o login já existe; se sim, erro.
function cadastrarCliente(dados) {
  const { login, senha, nome, cpf, dataNascimento, telefone, escolaridade, estadoCivil } = dados;
  const existe = db.prepare('SELECT 1 FROM cliente WHERE login = ?').get(login);
  if (existe) {
    throw new Error('Login já cadastrado.');
  }
  db.prepare(`
    INSERT INTO cliente (login, senha, nome, cpf, data_nascimento, telefone, escolaridade, estado_civil)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(login, senha, nome, cpf, dataNascimento, telefone || null, escolaridade || null, estadoCivil || null);
}

// Cadastro de serviço de TI: insere; a PK é inteiro autoincremento.
function cadastrarServico(dados) {
  const { label, preco, prazo } = dados;
  db.prepare('INSERT INTO servico_ti (label, preco, prazo) VALUES (?, ?, ?)')
    .run(label, Number(preco), Number(prazo));
}

// Consulta de serviços de TI: lê e retorna todos.
function listarServicos() {
  return db.prepare('SELECT id, label, preco, prazo FROM servico_ti ORDER BY id').all();
}

// Consulta solicitações de um usuário (por login).
function listarSolicitacoes(login) {
  return db.prepare(`
    SELECT id, cliente_login AS clienteLogin, servico_id AS servicoId,
           data, status, preco, prevista
    FROM solicitacao
    WHERE cliente_login = ?
    ORDER BY data
  `).all(login);
}

// Atualização das solicitações de um usuário: apaga todas as atuais e insere a lista recebida.
function atualizarSolicitacoes(login, lista) {
  const del = db.prepare('DELETE FROM solicitacao WHERE cliente_login = ?');
  const ins = db.prepare(`
    INSERT INTO solicitacao (cliente_login, servico_id, data, status, preco, prevista)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const tx = db.transaction(() => {
    del.run(login);
    (lista || []).forEach(s => {
      ins.run(login, s.servicoId, s.data, s.status, Number(s.preco), s.prevista);
    });
  });
  tx();
}

module.exports = {
  autenticar,
  trocarSenha,
  cadastrarCliente,
  cadastrarServico,
  listarServicos,
  listarSolicitacoes,
  atualizarSolicitacoes
};
