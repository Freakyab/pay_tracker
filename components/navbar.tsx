"use client";
import {
  BadgeDollarSign,
  BotMessageSquare,
  LayoutDashboard,
} from "lucide-react";
import React from "react";
import { useIsMobile } from "../hooks/use-mobile";

function Navbar() {
  const isMobile = useIsMobile();
  return (
    <nav className="flex justify-between bg-indigo-900/50 backdrop-blur-sm  w-full p-4 rounded-t-xl shadow-xl shadow-black/30">
      <div className="flex items-center gap-4">
        <BotMessageSquare className="rounded-full border-4 border-secondary w-10 h-10 bg-primary/20 p-1" />
        <h2 className="sm:text-xl text-md">Welcome back, User</h2>
      </div>
      <div className="flex items-center gap-4">
        <p className="border-b-2 p-2 border-secondary ">
          {isMobile ? (
            <LayoutDashboard className="w-4 h-4" />
          ) : (
            <span className="flex items-center gap-2">
              <LayoutDashboard /> Dashboard
            </span>
          )}
        </p>

        <p className="">
          {isMobile ? (
            <BadgeDollarSign className="w-4 h-4" />
          ) : (
            <span className="flex items-center gap-2">
              <BadgeDollarSign />
              Transactions
            </span>
          )}
        </p>
      </div>
    </nav>
  );
}

export default Navbar;
