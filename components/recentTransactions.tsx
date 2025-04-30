"use client";
import { ChartNoAxesCombined } from "lucide-react";
import React from "react";
import Container from "./container";
import Title from "./title";

function RecentTransactions() {
  const [recentTransactions, setRecentTransactions] = React.useState<
    transactionType[]
  >([]);

  React.useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/list-3-transactions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const resData = await response.json();
        if (resData.status) {
          console.log("Recent transactions:", resData.data);
          setRecentTransactions(resData.data);
        } else {
          console.error("Error fetching recent transactions:", resData.message);
        }
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
      }
    };

    fetchRecentTransactions();
  }, []);

  return (
    <Container>
      <Title
        icon={<ChartNoAxesCombined className="w-6 h-6" />}
        title="Recent Transactions"
        subtitle="Latest 3 transactions"
      />
      <div className="flex flex-col gap-2">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between sm:p-4 rounded-lg gap-4">
            <span className="px-3 py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {transaction.category}
            </span>
            <span
              className=" text-sm sm:text-base font-medium border-b-4 border-blue-200 line-clamp-1
                ">
              {transaction.description}
            </span>
            <div className="flex items-center  gap-4">
              <span className={`text-md sm:text-lg font-semibold ${transaction.type === "expense" 
                ? "text-red-500"
                : "text-green-500"
                
              }` }>
                {transaction.type === "expense" ? "-" : "+"}
                ₹{transaction.amount.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm text-blue-100">
                {new Date(transaction.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Container>
    //   </div>
    // </div>
  );
}

export default RecentTransactions;
