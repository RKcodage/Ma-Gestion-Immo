import React from "react";

export default function ServiceCard({
  icon,        
  title,
  children,    
  className = "",
  ...rest
}) {
  return (
    <div
      className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition text-center ${className}`}
      {...rest}
    >
      {icon ? <div className="mb-4 flex justify-center">{icon}</div> : null}
      {title ? <h3 className="text-xl font-semibold mb-2">{title}</h3> : null}
      <p className="text-gray-600">{children}</p>
    </div>
  );
}
