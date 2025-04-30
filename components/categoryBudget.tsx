"use client";
import React, { useState, useEffect } from "react";
import Container from "./container";
import Title from "./title";
import { ChartBarStacked } from "lucide-react";
import useCategories from "@/components/context/categories";

function CategoryBudget() {
  const { data, budgetData } = useCategories();

  const newData = budgetData.map((budget) => {
    const categoryData = data.find((item) => item.name === budget.category);
    return {
      name: budget.category,
      value: categoryData ? categoryData.value : 0,
      fill: categoryData ? categoryData.fill : "#000",
    };
  }
  );

  return (
    <Container>
      <Title
        icon={<ChartBarStacked className="w-6 h-6" />}
        title="Category Budget Allocation"
      />
      <div className="space-y-4 mt-4">
        {newData.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between text-sm capitalize">
              <span >{item.name}</span>
              <span style={{ color: item.fill }} className="font-semibold ">
                ₹{item.value.toLocaleString()} /{" "}
                <span className="font-semibold text-pink-400">
                  ₹
                  {
                    budgetData.find((budget) => budget.category === item.name)
                      ?.amount
                  }
                </span>
              </span>
            </div>
            <div className="h-2 bg-blue-100/20 rounded-full">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${
                    (item.value /
                      (Number(
                        budgetData.find(
                          (budget) => budget.category === item.name
                        )?.amount
                      ) || 1)) *
                    100
                  }%`,
                  backgroundColor: item.fill,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default CategoryBudget;
