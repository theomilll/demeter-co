// Painel "yg" (barra de título azul + corpo branco), componente base do layout AV1.
// title: texto do título; meta: texto secundário no título; bodyClass: classes do corpo.
export default function YgPanel({ title, meta, bodyClass = '', className = '', children }) {
  return (
    <section className={`yg-panel ${className}`.trim()}>
      <div className="yg-title">
        {title}{meta ? <span className="meta"> {meta}</span> : null}
      </div>
      <div className={`yg-body ${bodyClass}`.trim()}>{children}</div>
    </section>
  );
}
