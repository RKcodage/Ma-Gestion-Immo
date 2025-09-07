import { Link } from "react-router-dom";
import { cn } from "@/components/lib/utils";

// Reusable dashboard tile component
// - Renders a consistent card style with optional Link wrapper
// - Use `to` for navigation, or `onClick` for actions
// - Use `children` for custom body; otherwise provide `description`
export default function DashboardTile({
  title,
  description,
  icon,
  to,
  onClick,
  dataTour,
  className,
  children,
}) {
  const body = (
    <div className={cn("bg-white p-6 rounded-lg shadow hover:shadow-md transition", className)}>
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        {icon ? icon : null}
        {title}
      </h3>
      {children ? (
        children
      ) : description ? (
        <p className="text-sm text-gray-600">{description}</p>
      ) : null}
    </div>
  );

  if (to) {
    return (
      <Link to={to} data-tour={dataTour} className="block">
        {body}
      </Link>
    );
  }

  return (
    <div data-tour={dataTour} onClick={onClick} className="block">
      {body}
    </div>
  );
}

