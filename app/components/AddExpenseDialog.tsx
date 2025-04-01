"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Corrected import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/type";
import { Calendar, DollarSign } from "lucide-react";
import { useState } from "react";

type NewExpenseData = {
  amount: string;
  description: string;
  category: string;
  date: string;
};

interface AddExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categories: Category[];
  onAddExpense: (expenseData: NewExpenseData) => Promise<void>; // Fonction pour soumettre
}

export default function AddExpenseDialog({
  isOpen,
  onOpenChange,
  categories,
  onAddExpense,
}: AddExpenseDialogProps) {
  const [newExpense, setNewExpense] = useState<NewExpenseData>({
    amount: "",
    description: "",
    category: categories[0]?.name || "Food", // Default to first category or 'Food'
    date: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (field: keyof NewExpenseData, value: string) => {
    setNewExpense((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewExpense((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async () => {
    if (!newExpense.amount || !newExpense.description) return;
    await onAddExpense(newExpense); // Appelle la fonction du parent
    // Reset form state after successful submission (optional, parent might handle closing)
    setNewExpense({
      amount: "",
      description: "",
      category: categories[0]?.name || "Food",
      date: new Date().toISOString().split("T")[0],
    });
    // onOpenChange(false); // Le parent peut aussi gérer la fermeture
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-xl border border-white/30">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Amount Input */}
          <div className="grid gap-2">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-9 bg-white/50 border-white/30"
                value={newExpense.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
              />
            </div>
          </div>
          {/* Description Input */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>{" "}
            {/* Corrected usage */}
            <Input
              id="description"
              placeholder="What did you spend on?"
              className="bg-white/50 border-white/30"
              value={newExpense.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          {/* Category Select */}
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label> {/* Corrected usage */}
            <Select
              value={newExpense.category}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger
                id="category"
                className="bg-white/50 border-white/30"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-xl">
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${category.color} mr-2`}
                      ></div>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Date Input */}
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label> {/* Corrected usage */}
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                className="pl-9 bg-white/50 border-white/30"
                value={newExpense.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
          >
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
