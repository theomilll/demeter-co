// Rodapé simples (usado nas páginas de formulário). `children` = texto do copyright.
export default function SiteFooter({ children }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-bottom">{children}</p>
      </div>
    </footer>
  );
}
