function TextInput({ label, id, className = '', ...props }) {
  return (
    <label htmlFor={id} className={`flex flex-col gap-2 text-sm font-medium text-slate-700 ${className}`}>
      {label}
      <input
        id={id}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        {...props}
      />
    </label>
  );
}

export default TextInput;
