import { cn } from "@/components/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/components/ui/tooltip";

export default function ActionIconButton({
  label,
  icon: Icon,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  tooltipWhenDisabled,
  className,
  type = "button",
  ariaLabel,
}) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/80",
    danger: "bg-red-600 text-white hover:bg-red-600/80",
    neutral: "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50",
    outline: "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50",
  };
  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2.5",
  };

  const Btn = (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel || label}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
    >
      {Icon ? <Icon className="w-4 h-4" /> : null}
      {label ? <span className="hidden sm:inline">{label}</span> : null}
    </button>
  );

  if (disabled && tooltipWhenDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{Btn}</TooltipTrigger>
          <TooltipContent>{tooltipWhenDisabled}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return Btn;
}
