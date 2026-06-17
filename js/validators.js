// ============================================================
// validators.js — reutilizado por login, troca-senha e cadastro.
// ============================================================

// conjuntos exatos do PDF
const SPECIAL_ALLOWED = '@#$%&*!?/\\|-_+.=';
const SPECIAL_FORBIDDEN = '¨{}[]´`~^:;<>,"\'';

// --- email ---
function isValidEmail(str) {
  if (!str) return false;
  // formato básico, suficiente para a disciplina
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str);
}

// --- senha ---
// regras:
//   - >= 6 chars
//   - pelo menos 1 dígito
//   - pelo menos 1 maiúscula
//   - pelo menos 1 especial da lista permitida
//   - nenhum especial da lista proibida
// Retorna { ok: bool, reasons: [str] }
function validatePassword(pwd) {
  const reasons = [];
  if (!pwd) { return { ok: false, reasons: ['senha não preenchida.'] }; }
  if (pwd.length < 6) reasons.push('senha precisa ter pelo menos 6 caracteres.');
  if (!/[0-9]/.test(pwd)) reasons.push('senha precisa de pelo menos 1 dígito (0-9).');
  if (!/[A-Z]/.test(pwd)) reasons.push('senha precisa de pelo menos 1 letra maiúscula.');

  let hasAllowedSpecial = false;
  for (const ch of pwd) {
    if (SPECIAL_ALLOWED.indexOf(ch) !== -1) { hasAllowedSpecial = true; break; }
  }
  if (!hasAllowedSpecial) reasons.push('senha precisa de pelo menos 1 caractere especial permitido.');

  for (const ch of pwd) {
    if (SPECIAL_FORBIDDEN.indexOf(ch) !== -1) {
      reasons.push('senha contém caractere proibido: ' + ch);
      break;
    }
  }
  return { ok: reasons.length === 0, reasons };
}

// texto que aparece nos campos de saída (cadastro e troca-senha)
const PASSWORD_RULES_TEXT =
  'A senha deve ter pelo menos 6 caracteres, incluindo pelo menos 1 dígito, 1 letra MAIÚSCULA e 1 caractere especial. ' +
  'Especiais PERMITIDOS: ' + SPECIAL_ALLOWED.split('').join(' ') + '. ' +
  'Especiais PROIBIDOS: ' + SPECIAL_FORBIDDEN.split('').join(' ') + '.';

// --- nome ---
function isValidName(name) {
  if (!name || !name.trim()) return { ok: false, reason: 'nome não preenchido.' };
  // caractere especial = união das duas listas
  const forbidden = SPECIAL_ALLOWED + SPECIAL_FORBIDDEN;
  for (const ch of name) {
    if (forbidden.indexOf(ch) !== -1) {
      return { ok: false, reason: 'nome contém caractere especial proibido: ' + ch };
    }
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return { ok: false, reason: 'nome precisa ter pelo menos 2 palavras.' };
  if (parts[0].length < 2) return { ok: false, reason: 'primeira palavra do nome precisa ter pelo menos 2 caracteres.' };
  return { ok: true };
}

// --- CPF ---
// aplica máscara NNN.NNN.NNN-NN removendo não-dígitos
function applyCpfMask(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  input.value = v;
}

function isValidCPF(cpfRaw) {
  const cpf = (cpfRaw || '').replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // todos iguais
  const digits = cpf.split('').map(Number);
  // 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== digits[9]) return false;
  // 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === digits[10];
}

// --- telefone nacional ---
// aceita (DD) NNNNN-NNNN ou (DD) NNNN-NNNN ou +55..., basicamente
// vamos normalizar e exigir um formato brasileiro plausível, não só 10/11 dígitos
const BRAZILIAN_DDDS = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24',
  '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46',
  '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99'
]);

function isSequentialDigits(digits) {
  if (digits.length < 2) return false;
  let asc = true;
  let desc = true;
  for (let i = 1; i < digits.length; i++) {
    const prev = Number(digits[i - 1]);
    const curr = Number(digits[i]);
    if (curr !== prev + 1) asc = false;
    if (curr !== prev - 1) desc = false;
  }
  return asc || desc;
}

function hasLongSequentialRun(digits, minRun = 6) {
  if (digits.length < minRun) return false;

  let ascRun = 1;
  let descRun = 1;

  for (let i = 1; i < digits.length; i++) {
    const prev = Number(digits[i - 1]);
    const curr = Number(digits[i]);

    ascRun = (curr === prev + 1) ? ascRun + 1 : 1;
    descRun = (curr === prev - 1) ? descRun + 1 : 1;

    if (ascRun >= minRun || descRun >= minRun) return true;
  }

  return false;
}

function isValidPhone(raw) {
  if (!raw) return true; // opcional
  let digits = raw.replace(/\D/g, '');

  if (digits.length === 13 && digits.startsWith('55')) {
    digits = digits.slice(2);
  }

  if (!(digits.length === 10 || digits.length === 11)) return false;
  if (!BRAZILIAN_DDDS.has(digits.slice(0, 2))) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const subscriber = digits.slice(2);
  if (isSequentialDigits(subscriber)) return false;
  if (hasLongSequentialRun(subscriber)) return false;

  if (digits.length === 10) {
    return /^[2-5]\d{7}$/.test(subscriber);
  }

  return /^9\d{8}$/.test(subscriber);
}

// --- idade >=18 ---
function isAdult(dateStr) {
  if (!dateStr) return false;
  const birth = new Date(dateStr);
  if (isNaN(birth.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 18;
}
