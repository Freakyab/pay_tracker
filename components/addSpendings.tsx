"use client";
import { Plus } from "lucide-react";
import React from "react";
import Container from "./container";
import AddTransaction from "./addTransaction";

function AddSpendings() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <Container className="flex flex-col items-center justify-center gap-4 ">
      <AddTransaction
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      <div
        className="bg-blue-100 p-4 rounded-full cursor-pointer"
        onClick={() => {
          setIsDialogOpen(true);
        }}>
        <Plus size={32} className="text-secondary" />
      </div>
     
      <p className="text-xl sm:text-2xl font-medium">Add Spending</p>
      <p className="text-xs sm:text-sm">Click to record a new transaction</p>
    </Container>
  );
}

export default AddSpendings;
