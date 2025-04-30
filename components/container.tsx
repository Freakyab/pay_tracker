import React from "react";

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-indigo-900/50 backdrop-blur-sm relative overflow-hidden w-full h-full rounded-xl shadow-md cursor-pointer px-6 py-4 border-b border-indigo-800/30 ${className} `}>
      {/* <div className="absolute w-32 h-32 bg-indigo-600/20 rounded-full -top-12 -left-12 blur-xl"></div>
      <div className="absolute w-24 h-24 bg-indigo-400/10 rounded-full -bottom-10 -right-10 blur-xl"></div> */}
      {children}
    </div>
  );
}

export default Container;
