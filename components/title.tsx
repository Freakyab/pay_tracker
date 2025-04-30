import React from "react";

function Title({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-6 group transition-all duration-300 ease-out">
      <div
        className={`rounded-full border-4 border-secondary w-12 h-12 bg-slate-800/60 flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
        {icon}
      </div>
      <div className="flex flex-col items-start justify-center gap-1">
        <h3 className="text-lg sm:text-2xl tracking-wider font-bold text-white flex items-center gap-2">
          {title}
        </h3>
        {subtitle && <p className="text-sm tracking-widest text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default Title;
