"use client";
import React from "react";
import Container from "./container";
import Title from "./title";
import { ChartBarStacked } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import useCategories from "./context/categories";

function BudgetBar() {
  let { data, budgetData } = useCategories();
  const mappedData = budgetData.map((item) => {
    const categoryData = data.find((dataItem) => dataItem.name === item.category);
    return {
      name: item.category,
      value: categoryData ? categoryData.value : 0,
      fill: categoryData ? categoryData.fill : "#000",
      budget: item.amount,
    };
  });
  return (
    <Container className="flex flex-col sm:col-span-2">
      <Title
        icon={<ChartBarStacked className="w-6 h-6" />}
        title="Category Budget Allocation"
      />
      <div className="flex items-center flex-col sm:flex-row gap-4">
        <LineChart
          width={450}
          height={300}
          data={mappedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <XAxis
            dataKey="name"
            padding={{ left: 20, right: 20 }}
            tick={{ fill: "#8884d8", fontWeight: 800 }}
          />
          <YAxis tick={{ fill: "#8884d8", fontWeight: 300 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="budget" stroke="#8884d8" />
        </LineChart>
        <div className="w-full p-4 flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700/30">
          <h3 className="text-lg font-medium text-slate-200 mb-4">
            Budget Utilization
          </h3>
          <div className="">
            {mappedData.map((item) => (
              <div
                key={item.name}
                className="p-1 hover:bg-slate-800/50 rounded-lg transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium capitalize">
                    {item.name}
                  </span>
                  <div className="text-right">
                    <span
                      style={{ color: item.fill }}
                      className="font-semibold">
                    ₹  {item.value} / ₹{item.budget}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-700/30 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(Number(item.value) / Number(item.budget)) * 100}%`,
                        backgroundColor: item.fill,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default BudgetBar;
