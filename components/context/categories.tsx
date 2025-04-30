"use client";
import React, { createContext } from "react";


interface CategoriesContextType {
  data: categoryType[];
  budgetData: budgetType[];
  setBudgetData: React.Dispatch<React.SetStateAction<budgetType[]>>;
}

const categoriesContext = createContext<CategoriesContextType>({
    data: [],
    budgetData: [],
    setBudgetData: () => {},
});

export const CategoriesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = React.useState<categoryType[]>([]);
  const [budgetData, setBudgetData] = React.useState<budgetType[]>([]);
  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8000/categories-budgets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();
      console.log("Categories response:", responseJson);
      if (responseJson.status && responseJson.data) {
        setData(responseJson.data);
        setBudgetData(responseJson.budgets);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <categoriesContext.Provider value={{ data , budgetData ,setBudgetData}}>
      {children}
    </categoriesContext.Provider>
  );
};

const useCategories = () => React.useContext(categoriesContext);

export default useCategories;
