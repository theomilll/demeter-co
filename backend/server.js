// server.js — API REST (Express) usando as funcionalidades de repository.js.
const express = require('express');
const cors = require('cors');
const repo = require('./repository');

const app = express();
app.use(cors());
app.use(express.json());

// Autenticação — entrada: login, senha | retorno: status do login.
app.post('/api/auth', (req, res) => {
  const { login, senha } = req.body || {};
  const autenticado = repo.autenticar(login, senha);
  res.json({ status: 'ok', autenticado });
});

// Troca de senha — entrada: login, senhaAtual, novaSenha | retorno: status + mensagem.
app.post('/api/trocar-senha', (req, res) => {
  const { login, senhaAtual, novaSenha } = req.body || {};
  try {
    repo.trocarSenha(login, senhaAtual, novaSenha);
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(400).json({ status: 'erro', mensagem: e.message });
  }
});

// Cadastro de cliente — entrada: dados do cliente | retorno: status + mensagem.
app.post('/api/clientes', (req, res) => {
  try {
    repo.cadastrarCliente(req.body || {});
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(400).json({ status: 'erro', mensagem: e.message });
  }
});

// Cadastro de serviço de TI — entrada: dados do serviço | retorno: status + mensagem.
app.post('/api/servicos', (req, res) => {
  try {
    repo.cadastrarServico(req.body || {});
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(400).json({ status: 'erro', mensagem: e.message });
  }
});

// Consulta de serviços de TI — retorno: lista + status.
app.get('/api/servicos', (req, res) => {
  try {
    res.json({ status: 'ok', servicos: repo.listarServicos() });
  } catch (e) {
    res.status(500).json({ status: 'erro', mensagem: e.message });
  }
});

// Leitura das solicitações de um usuário — entrada: login | retorno: lista + status.
app.get('/api/solicitacoes/:login', (req, res) => {
  try {
    res.json({ status: 'ok', solicitacoes: repo.listarSolicitacoes(req.params.login) });
  } catch (e) {
    res.status(500).json({ status: 'erro', mensagem: e.message });
  }
});

// Atualização das solicitações de um usuário — entrada: lista + login | retorno: status + mensagem.
app.put('/api/solicitacoes/:login', (req, res) => {
  const { solicitacoes } = req.body || {};
  try {
    repo.atualizarSolicitacoes(req.params.login, solicitacoes);
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(400).json({ status: 'erro', mensagem: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API demetrius&co rodando em http://localhost:${PORT}`));
