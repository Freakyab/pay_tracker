import React, { useState } from "react";
import { Calendar, CreditCard, FileText, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function AddTransaction({
  isDialogOpen,
  setIsDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
    type: "expense",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      console.log("Transaction data:", formData);
      setIsDialogOpen(false);

      const response = await fetch("http://localhost:8000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resBody = await response.json();

      if (resBody.status) {
        console.log("Transaction added successfully:", resBody.data);
        alert("Transaction added successfully!");
        setFormData({
          amount: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
          category: "",
          type: "expense",
        });
      } else {
        console.error("Error adding transaction:", resBody.message);
        alert("Error adding transaction: " + resBody.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } 
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[475px] bg-slate-900 text-slate-100 border border-slate-700 rounded-lg shadow-lg">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-400" />
            Add Transaction
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter the details of your transaction below.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-5 py-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="amount"
              className="text-right text-slate-300 font-medium">
              Amount
            </label>

            <div className="col-span-3 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                ₹
              </span>
              <input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="type"
              className="text-right text-slate-300 font-medium">
              Type
            </label>
            <div className="col-span-3 flex items-center gap-4">
              <label className="flex items-center space-x-2">
              <input
                type="radio"
                id="type"
                name="type"
                value="expense"
                checked={formData.type === "expense"}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700"
              />
              <span className="text-slate-300">Expense</span>
              </label>
              <label className="flex items-center space-x-2">
              <input
                type="radio"
                id="type"
                name="type"
                value="income"
                checked={formData.type === "income"}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700"
              />
              <span className="text-slate-300">Income</span>
              </label>
            </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="date"
              className="text-right text-slate-300 font-medium">
              Date
            </label>
            <div className="col-span-3 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              required
              />
            </div>
            </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="description"
              className="text-right text-slate-300 font-medium">
              Description
            </label>
            <div className="col-span-3 relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter description"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="category"
              className="text-right text-slate-300 font-medium">
              Category
            </label>
            <div className="col-span-3 relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none"
                required>
                <option value="" disabled>
                  Select category
                </option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="entertainment">Entertainment</option>
                <option value="auto">Auto (Auto-detect)</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 1L6 5L11 1"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-2 border-t border-slate-700 mt-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-200 rounded-md hover:bg-slate-700 transition-colors border border-slate-700">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition-colors">
              Save Transaction
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTransaction;
