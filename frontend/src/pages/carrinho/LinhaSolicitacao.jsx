import { fmtBRL, fmtDate } from '../../format.js';

// Uma linha da tabela de solicitações. `servLabel` resolvido pelo pai.
export default function LinhaSolicitacao({ solic, servLabel, onExcluir }) {
  return (
    <tr>
      <td>{fmtDate(solic.data)}</td>
      <td>#{solic.id ?? '—'}</td>
      <td>{servLabel}</td>
      <td>{solic.status}</td>
      <td>{fmtBRL(solic.preco)}</td>
      <td>{fmtDate(solic.prevista)}</td>
      <td>
        <button type="button" className="btn-del" onClick={onExcluir}>excluir</button>
      </td>
    </tr>
  );
}
