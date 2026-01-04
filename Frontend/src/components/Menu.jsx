import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function Menu({
  items = [],
  align = 'right',
  buttonClassName = '',
  menuClassName = '',
  ariaLabel = 'Open menu',
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const alignmentClass = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className={`inline-flex items-center justify-center leading-none text-center ${buttonClassName}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {children}
      </button>
      {isOpen ? (
        <div
          className={`absolute z-40 mt-2 min-w-[10rem] rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-lg ${alignmentClass} ${menuClassName}`}
          role="menu"
        >
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  className="rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-100"
                  role="menuitem"
                  onClick={() => handleSelect(item)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Menu;
