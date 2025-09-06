import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

// Simple, accessible native Select styled in the shadcn spirit.
// - Uses native <select> for reliability (no Radix dep)
// - API: value, onValueChange (or onChange), placeholder, className, children
// - Compose with Tailwind via className

export default function Select({
  value,
  onValueChange,
  onChange,
  placeholder,
  disabled,
  className,
  children,
  ...props
}) {
  const handleChange = (e) => {
    if (onValueChange) onValueChange(e.target.value);
    else if (onChange) onChange(e);
  };

  return (
    <div className={cn("relative inline-block", disabled && "opacity-50 cursor-not-allowed")}> 
      <select
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-64 appearance-none pr-9 pl-3 py-2 text-sm rounded-md",
          "bg-background text-foreground border border-input shadow-sm",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "ring-offset-background",
          className
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}

