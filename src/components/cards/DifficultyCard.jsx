import React from "react";

export default function DifficultyCard({ title, icon, children, className = "", ...rest }) {
  return (
    <div
      className={`bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 text-left ${className}`}
      role="article"
      {...rest}
    >
      {icon ? (
        <div className="text-2xl mb-2" aria-hidden="true">{icon}</div>
      ) : null}
      {title ? (
        <h3 className="font-semibold text-lg mb-2">
          {title}
        </h3>
      ) : null}
      <p className="text-gray-600">
        {children}
      </p>
    </div>
  );
}
