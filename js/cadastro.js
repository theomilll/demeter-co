// cadastro.js
(function () {
  const $email  = document.getElementById('email');
  const $senha  = document.getElementById('senha');
  const $senha2 = document.getElementById('senha2');
  const $nome   = document.getElementById('nome');
  const $cpf    = document.getElementById('cpf');
  const $nasc   = document.getElementById('nasc');
  const $tel    = document.getElementById('tel');
  const $esc    = document.getElementById('escolaridade');
  const $rules  = document.getElementById('rules');
  const $msg    = document.getElementById('msg');

  $rules.textContent = PASSWORD_RULES_TEXT;

  // máscara de CPF
  $cpf.addEventListener('input', () => applyCpfMask($cpf));

  function setMsg(text, kind) {
    $msg.textContent = text;
    $msg.classList.remove('error', 'ok');
    if (kind) $msg.classList.add(kind);
  }

  function validate() {
    const errors = [];

    // e-mail
    const email = $email.value.trim();
    if (!email) errors.push('e-mail não preenchido.');
    else if (!isValidEmail(email)) errors.push('e-mail precisa ter formato válido.');

    // senha
    if (!$senha.value)  errors.push('senha não preenchida.');
    if (!$senha2.value) errors.push('confirmação de senha não preenchida.');
    if ($senha.value) {
      const p = validatePassword($senha.value);
      if (!p.ok) p.reasons.forEach(r => errors.push(r));
    }
    if ($senha.value && $senha2.value && $senha.value !== $senha2.value) {
      errors.push('senha e confirmação não conferem.');
    }

    // nome
    const n = isValidName($nome.value);
    if (!n.ok) errors.push(n.reason);

    // CPF
    if (!$cpf.value) errors.push('CPF não preenchido.');
    else if (!isValidCPF($cpf.value)) errors.push('CPF inválido (dígito verificador).');

    // nascimento
    if (!$nasc.value) errors.push('data de nascimento não preenchida.');
    else if (!isAdult($nasc.value)) errors.push('é preciso ter pelo menos 18 anos.');

    // telefone (opcional, mas se preenchido precisa ser válido)
    if ($tel.value && !isValidPhone($tel.value)) {
      errors.push('telefone precisa ter formato nacional válido (10 ou 11 dígitos).');
    }

    return errors;
  }

  document.getElementById('btn-incluir').addEventListener('click', function () {
    const errs = validate();
    if (errs.length) {
      setMsg('> ' + errs.join('\n> '), 'error');
      return;
    }
    setMsg('> Validação realizada com sucesso.', 'ok');
  });

  document.getElementById('btn-limpar').addEventListener('click', function () {
    $email.value = '';
    $senha.value = '';
    $senha2.value = '';
    $nome.value = '';
    $cpf.value = '';
    $nasc.value = '';
    $tel.value = '';
    // radios → default solteiro
    const r = document.querySelector('input[name="civil"][value="solteiro"]');
    if (r) r.checked = true;
    // combo → default 2º grau completo
    $esc.value = '2comp';
    setMsg('// aguardando entrada…');
    $email.focus();
  });

  document.getElementById('btn-voltar').addEventListener('click', function () {
    history.back();
  });

  $email.focus();
})();
