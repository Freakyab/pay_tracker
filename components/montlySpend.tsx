"use client";
import React, { useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, DollarSign, TrendingUp } from "lucide-react";
import Container from "./container";
import Title from "./title";

function MontlySpend() {
  const [data, setData] = React.useState({
    earned: 0,
    spent: 0,
    net: 0,
    earnedInPercentage : 0,
    spentInPercentage : 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const response = await fetch("http://localhost:8000/todays-budget", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log(result,"result");
        if(result.status) {
          setData({
            earned: result.data.earned,
            spent: result.data.spent,
            net: result.data.net,
            earnedInPercentage: result.data.earnedInPercentage,
            spentInPercentage: result.data.spentInPercentage,
          });
        }
        else {
          console.error("Error fetching data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="flex flex-col gap-4">
      <Title icon={<DollarSign className="w-6 h-6" />} title="My Cashflow Today" subtitle="" />
      
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-2 sm:gap-4">
        <div className="bg-slate-800/70 rounded-lg p-4 hover:bg-slate-800 transition-all duration-200 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <p className="text-md sm:text-lg text-slate-400 font-bold uppercase flex items-center gap-2">
            Earned
            <ArrowUpCircle className="text-green-400" size={16} />
          </p>
          <p className="text-xl text-green-400 font-bold mt-2">₹ {data.earned}</p>
          <div className="mt-2 text-xs text-green-300/70 flex items-center gap-1">
            <TrendingUp size={12} />
            <span>{data.earnedInPercentage}% vs yesterday</span>
          </div>
        </div>
        
        <div className="bg-slate-800/70 lfex rounded-lg p-4 hover:bg-slate-800 transition-all duration-200 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <p className="text-md sm:text-lg text-slate-400 font-bold uppercase flex items-center gap-2">
            Spent
            <ArrowDownCircle className="text-red-400" size={16} />
          </p>
          <p className="text-xl text-red-400 font-bold mt-2">₹ {data.spent}</p>
          <div className="mt-2 text-xs text-red-300/70 flex items-center gap-1">
            <TrendingUp size={12} className="rotate-180" />
            <span>{data.spentInPercentage}% vs yesterday</span>
          </div>
        </div>
        
        <div className="bg-slate-800/70 rounded-lg p-4 hover:bg-slate-800 transition-all duration-200 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <p className="text-md sm:text-lg text-slate-400 font-bold uppercase flex items-center gap-2">
            Net
            {data.net >= 0 ? 
              <ArrowUpCircle className="text-blue-400" size={16} /> : 
              <ArrowDownCircle className="text-blue-400" size={16} />
            }
          </p>
          <p className="text-xl text-blue-400 font-bold mt-2">₹ {data.net}</p>
         
        </div>
      </div>
    </Container>
  );
}

export default MontlySpend;
