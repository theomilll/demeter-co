// troca-senha.js
(function () {
  const $login  = document.getElementById('login');
  const $senha  = document.getElementById('senha');
  const $senha2 = document.getElementById('senha2');
  const $msg    = document.getElementById('msg');
  const $rules  = document.getElementById('rules');
  const $btnOk  = document.getElementById('btn-trocar');
  const $btnClr = document.getElementById('btn-limpar');

  $rules.textContent = PASSWORD_RULES_TEXT;

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
    if (!$senha2.value) errors.push('confirmação de senha não preenchida.');

    if ($senha.value) {
      const p = validatePassword($senha.value);
      if (!p.ok) p.reasons.forEach(r => errors.push(r));
    }

    if ($senha.value && $senha2.value && $senha.value !== $senha2.value) {
      errors.push('senha e confirmação não conferem.');
    }

    return errors;
  }

  $btnOk.addEventListener('click', function () {
    const errs = validate();
    if (errs.length) {
      setMsg('> ' + errs.join('\n> '), 'error');
      return;
    }
    setMsg('> Validação realizada com sucesso. voltando…', 'ok');
    setTimeout(() => { history.back(); }, 600);
  });

  $btnClr.addEventListener('click', function () {
    $login.value = '';
    $senha.value = '';
    $senha2.value = '';
    setMsg('// aguardando entrada…');
    $login.focus();
  });

  $login.focus();
})();
