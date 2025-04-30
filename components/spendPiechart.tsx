"use client";
import React, { useCallback } from "react";
import { PieChart, Pie, Tooltip } from "recharts";
import Container from "./container";
import { ChartNoAxesCombinedIcon } from "lucide-react";
import Title from "./title";
import useCategories from "./context/categories";

function SpendPiechart() {
  const { data } = useCategories();

  return (
    <Container className="row-span-2 flex flex-col  gap-4 ">
      <Title
        icon={<ChartNoAxesCombinedIcon className="w-6 h-6" />}
        title="Category Spendings"
      />
      <div className="flex items-center justify-center">
        <PieChart width={300} height={300}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            outerRadius={80}
            label
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1d2041",
              border: "none",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#fff" }}
            formatter={useCallback((value: number, name: string) => {
              return [`₹ ${value}`, name];
            }, [])}
          />
        </PieChart>
      </div>
      <div className=" p-4 bg-slate-800 rounded-lg shadow-inner">
        <p className="flex items-center gap-2 justify-center">
          <span className="text-gray-300">Total Spendings:</span>
          <span className="text-xl sm:text-3xl text-blue-400 font-bold tracking-wide">
            ₹  {data.reduce((acc, curr) => acc + curr.value, 0)}
          </span>
        </p>
      </div>
      {/* </div> */}
    </Container>
  );
}

export default SpendPiechart;
