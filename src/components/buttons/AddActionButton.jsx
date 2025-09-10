import { cn } from "@/components/lib/utils";
import { Plus } from "lucide-react";

export default function AddActionButton({
  label,
  onClick,
  icon: Icon,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "button",
  className,
  ariaLabel,
  ...rest
}) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    teal: "bg-teal-500 text-white hover:bg-teal-600",
    neutral: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-base",
  };

  const RootIcon = Icon || Plus;

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel || label}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded transition disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? "w-full justify-center" : "",
        className
      )}
      {...rest}
    >
      <RootIcon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

