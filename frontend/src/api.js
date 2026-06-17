// api.js — wrappers fetch para os endpoints REST do backend.
// O Vite faz proxy de /api -> http://localhost:3001.

async function req(url, options) {
  const resp = await fetch(url, options);
  let body = {};
  try { body = await resp.json(); } catch { /* sem corpo */ }
  return body;
}

const jsonPost = (url, data) =>
  req(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

const jsonPut = (url, data) =>
  req(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

export const autenticar = (login, senha) =>
  jsonPost('/api/auth', { login, senha });

export const trocarSenha = (login, senhaAtual, novaSenha) =>
  jsonPost('/api/trocar-senha', { login, senhaAtual, novaSenha });

export const cadastrarCliente = (dados) =>
  jsonPost('/api/clientes', dados);

export const cadastrarServico = (dados) =>
  jsonPost('/api/servicos', dados);

export const listarServicos = () =>
  req('/api/servicos');

export const listarSolicitacoes = (login) =>
  req(`/api/solicitacoes/${encodeURIComponent(login)}`);

export const atualizarSolicitacoes = (login, solicitacoes) =>
  jsonPut(`/api/solicitacoes/${encodeURIComponent(login)}`, { solicitacoes });
