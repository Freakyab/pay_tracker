import React, { useEffect, useState } from "react";
import { DollarSign, IndianRupee, PieChart, Sliders } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useCategories from "./context/categories";

function CategoryBudgetDialog({
  isDialogOpen,
  id,
  setIsDialogOpen,
}: {
  id?: string;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data, budgetData, setBudgetData } = useCategories();
  const [budgets, setBudgets] = useState<budgetType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isDialogOpen) {
      setBudgets(
        budgetData.length > 0
          ? budgetData.map((item) => ({
              category: item.category,
              amount: item.amount,
            }))
          : data.map((category) => ({
              category: category.name,
              amount: "1000",
            }))
      );
    }
  }, [isDialogOpen, budgetData, data]);

  const handleBudgetChange = (index: number, value: string) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index].amount = value;
    setBudgets(updatedBudgets);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/add-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgets }),
      });

      const resData = await response.json();
      if (resData.status) {
        setBudgetData(resData.data);
        setBudgets(resData.data);
      } else {
        alert("Failed to add budget. Please try again.");
      }
    } catch (error) {
      console.error("Error adding budget:", error);
    } finally {
      setIsDialogOpen(false);
      setIsLoading(false);
    }
  };

  const getNewBudget = () => {
    const newBudget = data.filter(
      (item) => !budgets.some((b) => b.category === item.name)
    );
    return newBudget.map((item) => ({
      category: item.name,
      amount: "1000",
    }));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 text-slate-100">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <PieChart className="h-5 w-5 text-green-400" />
            Monthly Category Budgets
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Set spending limits for each category per month.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-5 py-5" onSubmit={handleSubmit}>
          {id === "add" && getNewBudget().length > 0 && (
            <button
              type="button"
              onClick={() => {
                const newItems = getNewBudget();
                const updatedBudgets = [...budgets];
                newItems.forEach((newBudget) => {
                  if (
                    !updatedBudgets.some(
                      (b) => b.category === newBudget.category
                    )
                  ) {
                    updatedBudgets.push(newBudget);
                  }
                });
                setBudgets(updatedBudgets);
              }}
              className="flex items-center justify-center gap-2 w-full p-3 bg-green-600/20 text-green-400 rounded-md hover:bg-green-600/30 transition-colors"
            >
              <Sliders className="h-4 w-4" />
              <span>Add {getNewBudget().length} New Categories</span>
            </button>
          )}

          <div className="space-y-4 overflow-y-auto h-36">
            {[...budgets]
              .sort((a, b) => a.category.localeCompare(b.category))
              .map((budget, index) => (
                <div
                  key={budget.category}
                  className="grid grid-cols-4 gap-4 items-center"
                >
                  <label className="text-right text-slate-300 capitalize">
                    {budget.category}
                  </label>
                  <div className="col-span-3 relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={budget.amount}
                      onChange={(e) =>
                        handleBudgetChange(index, e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                      min="0"
                      required
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-700">
            <div className="flex items-center">
              <div className="bg-green-600/20 p-2 rounded-md">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-slate-400 text-sm">Total Budget</p>
                <p className="text-white font-bold text-lg">
                  ₹
                  {budgets.reduce(
                    (sum, b) => sum + Number(b.amount || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-700 border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
            >
              {isLoading ? "Saving..." : "Save Budgets"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryBudgetDialog;
