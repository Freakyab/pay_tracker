import AddSpendings from "@/components/addSpendings";
import BudgetProgress from "@/components/budgetProgress";
import CategoryBudget from "@/components/categoryBudget";
import MontlySpend from "@/components/montlySpend";
import Navbar from "@/components/navbar";
import RecentTransactions from "@/components/recentTransactions";
const SpendPiechart = dynamic(() => import("@/components/spendPiechart"), {
  ssr: false,
});
const BudgetBar = dynamic(() => import("@/components/budgetBar"), {
  ssr: false,
});
import dynamic from "next/dynamic";

export default function Home() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
      <AddSpendings />
      <SpendPiechart />
      <RecentTransactions />
      <MontlySpend />
      <BudgetProgress />
      <BudgetBar />
      <CategoryBudget />
    </div>
  );
}
