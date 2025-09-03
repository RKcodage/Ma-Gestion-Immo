import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center mt-6 px-8 py-4 rounded-full text-lg font-semibold tracking-wide text-white border border-white bg-primary/80 hover:bg-primary transition-all duration-300 shadow-lg hover:scale-105";

export default function LinkButton({ className = "", children, ...rest }) {
  return (
    <Link to="/signup" className={`${base} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
