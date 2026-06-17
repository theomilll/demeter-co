// login.js — validações e ações da página de login.

(function () {
  const $login  = document.getElementById('login');
  const $senha  = document.getElementById('senha');
  const $msg    = document.getElementById('msg');
  const $btnOk  = document.getElementById('btn-entrar');
  const $btnClr = document.getElementById('btn-limpar');

  function setMsg(text, kind) {
    $msg.textContent = text;
    $msg.classList.remove('error', 'ok');
    if (kind) $msg.classList.add(kind);
  }

  function validate() {
    const errors = [];
    const login = $login.value.trim();
    if (!login) errors.push('login não preenchido.');
    else if (!isValidEmail(login)) errors.push('login precisa ter formato de e-mail válido.');

    if (!$senha.value) errors.push('senha não preenchida.');

    return errors;
  }

  $btnOk.addEventListener('click', function () {
    const errs = validate();
    if (errs.length) {
      setMsg('> ' + errs.join('\n> '), 'error');
      return;
    }
    setMsg('> Validação realizada com sucesso. redirecionando…', 'ok');
    setLogged(true);
    setTimeout(() => { window.location.href = 'index.html'; }, 600);
  });

  $btnClr.addEventListener('click', function () {
    $login.value = '';
    $senha.value = '';
    setMsg('// aguardando entrada…');
    $login.focus();
  });

  // foco inicial
  $login.focus();
})();
