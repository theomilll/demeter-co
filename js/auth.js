// Estado de login — flag booleana em localStorage.
const AUTH_KEY = 'demetrius_logged';

function isLogged() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

function setLogged(val) {
  if (val) localStorage.setItem(AUTH_KEY, 'true');
  else localStorage.removeItem(AUTH_KEY);
}

// aplica classe `logged` no body quando logado (o CSS usa isso
// para mostrar/esconder o link "solicitar serviço")
function applyAuthState() {
  if (isLogged()) document.body.classList.add('logged');
  else document.body.classList.remove('logged');
}

function logout() {
  setLogged(false);
  applyAuthState();
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', applyAuthState);

document.addEventListener('click', function (e) {
  const t = e.target.closest('[data-action="logout"]');
  if (!t) return;
  e.preventDefault();
  logout();
});
