import { fmtBRL, fmtDate, todayPlusDays } from '../../format.js';

// Formulário de nova solicitação: combo de serviços + labels derivados + botão incluir.
export default function NovaSolicitacaoForm({ servicos, servicoId, onSelect, onIncluir }) {
  const sel = servicos.find(s => String(s.id) === String(servicoId));

  return (
    <section id="nova" className="yg-panel">
      <div className="yg-title">Nova Solicitação</div>
      <div className="yg-body">
        <div className="field" style={{ maxWidth: '400px', marginBottom: '10px' }}>
          <label htmlFor="servico">Serviço de TI</label>
          <select id="servico" value={servicoId} onChange={e => onSelect(e.target.value)}>
            {servicos.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <table className="new-request-table" role="presentation">
          <tbody>
            <tr>
              <td>
                <span className="lbl">Preço</span>
                <span className="val">{sel ? fmtBRL(sel.preco) : '—'}</span>
              </td>
              <td>
                <span className="lbl">Prazo de Atendimento</span>
                <span className="val">{sel ? `${sel.prazo} dias úteis` : '—'}</span>
              </td>
              <td>
                <span className="lbl">Data Prevista</span>
                <span className="val">{sel ? fmtDate(todayPlusDays(sel.prazo)) : '—'}</span>
              </td>
              <td>
                <span className="lbl">Status</span>
                <span className="val">EM ELABORAÇÃO</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="new-request-actions">
          <button type="button" onClick={onIncluir} disabled={!sel}>Incluir Solicitação</button>
        </div>
      </div>
    </section>
  );
}
