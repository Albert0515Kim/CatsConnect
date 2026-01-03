function Card({ children, className = '' }) {
  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ${className}`}>
      {children}
    </div>
  );
}

function CardMedia({ children, className = '' }) {
  return <div className={`h-40 w-full overflow-hidden ${className}`}>{children}</div>;
}

function CardBody({ children, className = '' }) {
  return <div className={`flex flex-1 flex-col gap-2 px-4 pt-3 ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-auto flex w-full gap-2 px-4 pb-4 pt-4 ${className}`}>{children}</div>
  );
}

export { CardBody, CardFooter, CardMedia };
export default Card;
