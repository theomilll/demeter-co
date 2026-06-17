// format.js — helpers puros de formatação (BRL e datas). Sem DOM.

export function fmtBRL(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
export function fmtDate(d) {
  if (typeof d === 'string') {
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  }
  const dt = (d instanceof Date) ? d : new Date(d);
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${dt.getFullYear()}`;
}

export function toLocalYMD(d) {
  const dt = (d instanceof Date) ? d : new Date(d);
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

export function todayPlusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
