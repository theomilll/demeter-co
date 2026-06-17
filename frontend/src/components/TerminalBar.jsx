// Barra superior estilo terminal. left/right são os dois textos exibidos.
export default function TerminalBar({ left, right }) {
  return (
    <div className="terminal-bar">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
