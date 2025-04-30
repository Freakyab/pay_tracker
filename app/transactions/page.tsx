"use client";
import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, Trash2, Edit, Loader2, MoreHorizontal, Search, Tag, IndianRupee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TransactionType = {
  _id: number;
  amount: number;
  description: string;
  date: Date | string;
  category: string;
  type: string;
};

function Transactions() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<TransactionType | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    amount: "",
    date: "",
    description: ""
  });
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/list-transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      
      if (resData.status) {
        setTransactions(resData.data);
      } else {
        console.error("Failed to fetch transactions:", resData.message);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (transaction: TransactionType) => {
    setCurrentTransaction(transaction);
    
    // Format date for date input (YYYY-MM-DD)
    let formattedDate = "";
    if (transaction.date) {
      const date = new Date(transaction.date);
      formattedDate = date.toISOString().split('T')[0];
    }
    
    setEditFormData({
      amount: transaction.amount.toString(),
      date: formattedDate,
      description: transaction.description
    });
    
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (transaction: TransactionType) => {
    setCurrentTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTransaction) return;
    
    try {
      const res = await fetch(`http://localhost:8000/update-transaction/${currentTransaction._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(editFormData.amount),
          date: editFormData.date,
          description: editFormData.description,
        }),
      });
      
      const resData = await res.json();
      
      if (resData.status) {
        // Update the transaction in local state
        setTransactions(prev => 
          prev.map(t => 
            t._id === currentTransaction._id
              ? { 
                  ...t, 
                  amount: Number(editFormData.amount),
                  date: editFormData.date,
                  description: editFormData.description
                }
              : t
          )
        );
        setIsEditDialogOpen(false);
      } else {
        console.error("Failed to update transaction:", resData.message);
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!currentTransaction) return;
    
    try {
      const res = await fetch(`http://localhost:8000/delete-transaction/${currentTransaction._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const resData = await res.json();
      
      if (resData.status) {
        // Remove the transaction from local state
        setTransactions(prev => prev.filter(t => t._id !== currentTransaction._id));
        setIsDeleteDialogOpen(false);
      } else {
        console.error("Failed to delete transaction:", resData.message);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format amount for display
  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return type.toLowerCase() === 'expense' 
      ? `-${formattedAmount}` 
      : formattedAmount;
  };

  // Get CSS class for transaction type
  const getAmountColorClass = (type: string) => {
    return type.toLowerCase() === 'expense' 
      ? 'text-red-500' 
      : 'text-green-500';
  };

  // Get category badge style
  const getCategoryBadgeClass = (category: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch(category.toLowerCase()) {
      case 'food':
        return `${baseClass} bg-orange-100 text-orange-800`;
      case 'transport':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'entertainment':
        return `${baseClass} bg-purple-100 text-purple-800`;
      case 'auto':
        return `${baseClass} bg-teal-100 text-teal-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  // Table columns definition
  const columns: ColumnDef<TransactionType>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("date");
        return (
          <div className="flex items-center ">
            <Calendar className="h-4 w-4  mr-2" />
            {formatDate(date as string)}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="max-w-[200px]   truncate">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const type = row.original.type;
        return (
          <div className={`flex items-center font-medium ${getAmountColorClass(type)}`}>
            <IndianRupee className="h-4 w-4 mr-1" />
            {formatAmount(amount, type)}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <span className={getCategoryBadgeClass(category)}>
            <Tag className="h-3 w-3 inline mr-1" />
            {category}
          </span>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;
        
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEditClick(transaction)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeleteClick(transaction)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Create data table instance
  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6 bg-slate-50 text-black min-h-screen capitalize">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Transaction History</h1>
        <p className="text-slate-500">View, edit and manage your transactions</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-slate-600">Loading transactions...</span>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search transactions..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
              />
              
              <Select
                value={(table.getColumn("category")?.getFilterValue() as string[])?.join(",") || ""}
                onValueChange={(value) => {
                  table.getColumn("category")?.setFilterValue(
                    value ? value.split(",") : []
                  );
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {table.getFilteredRowModel().rows.length} of {transactions.length} transactions
              </p>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[475px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              Edit Transaction
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Update the transaction details below.
            </DialogDescription>
          </DialogHeader>
          
          <form className="grid gap-5 py-4" onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right text-slate-600 font-medium">
                Amount
              </label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 ">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={editFormData.amount}
                  onChange={handleEditFormChange}
                  className="pl-8"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right text-slate-600 font-medium">
                Date
              </label>
              <div className="col-span-3 relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 " />
                <Input
                  id="date"
                  type="date"
                  value={editFormData.date}
                  onChange={handleEditFormChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-slate-600 font-medium">
                Description
              </label>
              <Input
                id="description"
                type="text"
                value={editFormData.description}
                onChange={handleEditFormChange}
                className="col-span-3"
                placeholder="Enter description"
                required
              />
            </div>
            
            <DialogFooter className="flex justify-end gap-3 pt-2 border-t border-slate-200 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Transaction
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentTransaction && (
            <div className="py-4">
              <div className="p-4 bg-slate-50 rounded-md mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Description:</span>
                  <span className="font-medium">{currentTransaction.description}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Amount:</span>
                  <span className={`font-medium ${getAmountColorClass(currentTransaction.type)}`}>
                    {formatAmount(currentTransaction.amount, currentTransaction.type)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium">{formatDate(currentTransaction.date)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-end gap-3 pt-2 border-t border-slate-200 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              variant="destructive"
            >
              Delete Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Transactions;