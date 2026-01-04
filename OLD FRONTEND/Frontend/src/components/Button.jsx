const styles = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  outline: 'border border-brand-600 text-brand-700 hover:bg-brand-50',
  green: 'bg-accent-500 text-white hover:bg-accent-600',
  ghost: 'bg-white text-brand-700 border border-slate-200 hover:border-brand-200',
};

function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
