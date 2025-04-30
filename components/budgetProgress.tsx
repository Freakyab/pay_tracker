"use client";
import { useState } from "react";
import { Wallet, Bitcoin, ArrowUpRight, Plus } from "lucide-react";
import Container from "./container";
import Title from "./title";
import CategoryBudgetDialog from "./addBudget";
import useCategories from "./context/categories";

export default function BudgetProgress() {
  const { budgetData, data } = useCategories();
  const spent = data.reduce((acc: number, item: categoryType) => {
    if (budgetData.some(budget => budget.category === item.name)) {
      return acc + Number(item.value);
    }
    return acc;
  }, 0);

  const budget =
    budgetData.map((item) => Number(item.amount)).reduce((a, b) => a + b, 0) ===
    0
      ? 1
      : budgetData
          .map((item) => Number(item.amount))
          .reduce((a, b) => a + b, 0);

  const percentage = Math.round((spent / budget) * 100);
  const [isBudgetAdd, setIsBudgetAdd] = useState(false);

  // Color logic based on percentage
  const getProgressColor = () => {
    if (percentage <= 25) return "text-emerald-500 bg-emerald-100";
    if (percentage <= 50) return "text-blue-500 bg-blue-100";
    if (percentage <= 75) return "text-amber-500 bg-amber-100";
    return "text-rose-500 bg-rose-100";
  };

  const getCircleColor = () => {
    if (percentage <= 25) return "stroke-emerald-400";
    if (percentage <= 50) return "stroke-blue-400";
    if (percentage <= 75) return "stroke-amber-400";
    return "stroke-rose-400";
  };

  const getBorderColor = () => {
    if (percentage <= 25) return "border-emerald-400";
    if (percentage <= 50) return "border-blue-400";
    if (percentage <= 75) return "border-amber-400";
    return "border-rose-400";
  };

  return (
    <Container>
      <Title
        icon={<Wallet className="w-6 h-6" />}
        title="Budget Progress"
        subtitle={`Your budget for this month is ₹${budget.toLocaleString()}`}
      />

      <div className="flex items-center justify-evenly mt-3 gap-4">
        <div className="w-36 h-36 relative">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="stroke-slate-700"
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="8"
            />
            <circle
              className={`${getCircleColor()} transition-all duration-500 ease-out`}
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`flex items-center justify-center text-xl font-bold rounded-full border-4 ${getBorderColor()} w-14 h-14 bg-slate-800/80 transition-all duration-300`}>
              <Bitcoin className="w-8 h-8" />
            </span>
          </div>
        </div>

        {budgetData.length !== 0 ? (
          <div className="flex flex-col space-y-4 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">
                Budget Utilization
              </span>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${getProgressColor()}`}>
                {percentage}%
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span
                className={`text-4xl font-bold ${
                  percentage <= 25
                    ? "text-emerald-400"
                    : percentage <= 50
                    ? "text-blue-400"
                    : percentage <= 75
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}>
                ₹{spent.toLocaleString()}
              </span>
              <span className="text-slate-500 font-medium">/</span>
              <span className="text-xl text-slate-400">
                ₹{budget.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-4 rounded-lg transition-all duration-200"
                onClick={() => setIsBudgetAdd(true)}>
                <span className="text-sm font-medium">Restructure</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div
              className="bg-blue-100 p-4 rounded-full w-fit cursor-pointer"
              onClick={() => {
                setIsBudgetAdd(true);
              }}>
              <Plus size={32} className="text-secondary" />
            </div>

            <p className="text-xl sm:text-2xl font-medium">Add Budgets</p>
          </div>
        )}
        <CategoryBudgetDialog
          isDialogOpen={isBudgetAdd}
          id = {budgetData.length !== 0 ? "add" : ""}
          setIsDialogOpen={setIsBudgetAdd}
        />
      </div>
    </Container>
  );
}
