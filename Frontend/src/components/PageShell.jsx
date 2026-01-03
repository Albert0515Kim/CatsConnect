import Navbar from './Navbar';
import Footer from './Footer';

function PageShell({
  title,
  subtitle,
  children,
  headerAction,
  maxWidth = 'max-w-4xl',
  panelClassName = '',
  sideTitle,
  sideCopy,
  sideItems = [],
  sideIcon = '✨',
}) {
  const showSide = Boolean(sideTitle || sideCopy || sideItems.length);
  const containerWidth = showSide ? 'max-w-6xl' : maxWidth;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className={`w-full ${containerWidth}`}>
          <div className={showSide ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]' : ''}>
            <section
              className={`rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10 ${panelClassName}`}
            >
              <header className="flex flex-col gap-2">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
                    {subtitle ? (
                      <p className="mt-2 text-sm text-slate-600 sm:text-base">{subtitle}</p>
                    ) : null}
                  </div>
                  {headerAction ? <div className="flex items-center">{headerAction}</div> : null}
                </div>
              </header>
              <div className="mt-6">{children}</div>
            </section>
            {showSide ? (
              <aside className="flex flex-col justify-between rounded-3xl bg-brand-700 p-8 text-white shadow-xl sm:p-10">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                    {sideIcon}
                  </div>
                  {sideTitle ? (
                    <h2 className="mt-6 text-2xl font-semibold leading-tight">{sideTitle}</h2>
                  ) : null}
                  {sideCopy ? <p className="mt-3 text-sm text-white/80">{sideCopy}</p> : null}
                </div>
                {sideItems.length ? (
                  <ul className="mt-8 grid gap-3 text-sm text-white/80">
                    {sideItems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </aside>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PageShell;
