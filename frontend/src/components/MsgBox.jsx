// Caixa de mensagens (// aguardando entrada…) com estados ok/erro.
// msg: { text, kind } onde kind ∈ 'ok' | 'error' | undefined.
export default function MsgBox({ msg }) {
  const kind = msg?.kind ? ` ${msg.kind}` : '';
  return (
    <div className={`msg-box${kind}`} role="status" aria-live="polite">
      {msg?.text ?? '// aguardando entrada…'}
    </div>
  );
}
