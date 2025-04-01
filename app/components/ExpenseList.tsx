"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category, Expense } from "@/lib/type";
import {
  Badge,
  Calendar,
  MoreHorizontal,
  PieChart,
  Plus,
  Search,
} from "lucide-react";

interface ExpenseListProps {
  filteredExpenses: Expense[];
  totalExpenseCount: number;
  categories: Category[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (category: string) => void;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  onDeleteExpense: (id: string) => void;
  onAddExpenseClick: () => void; // Pour le bouton "Ajouter" quand la liste est vide
  getCategoryColor: (categoryName: string) => string;
  getCategoryIcon: (categoryName: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

export default function ExpenseList({
  filteredExpenses,
  totalExpenseCount,
  categories,
  searchTerm,
  onSearchTermChange,
  filterCategory,
  onFilterCategoryChange,
  activeTab,
  onActiveTabChange,
  onDeleteExpense,
  onAddExpenseClick,
  getCategoryColor,
  getCategoryIcon,
  formatDate,
}: ExpenseListProps) {
  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Recent Expenses</CardTitle>
          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
              <Input
                type="search"
                placeholder="Search expenses..."
                className="w-[200px] pl-8 h-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
              />
            </div>
            <Select
              value={filterCategory}
              onValueChange={onFilterCategoryChange}
            >
              <SelectTrigger className="w-[130px] h-9 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-xl">
                <SelectItem value="All">Categories</SelectItem>
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
        </div>
        {/* Time Tabs */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          className="mt-2"
          onValueChange={onActiveTabChange}
        >
          <TabsList className="grid grid-cols-4 w-full sm:w-[400px] bg-white/10">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white/20"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-white/20"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="data-[state=active]:bg-white/20"
            >
              This Week
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="data-[state=active]:bg-white/20"
            >
              This Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/10">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                {/* Expense Details */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${getCategoryColor(
                      expense.category
                    )} flex items-center justify-center text-white shadow-lg`}
                  >
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {expense.description}
                    </div>
                    <div className="text-sm text-white/70 flex items-center gap-2">
                      <Badge className="text-xs rounded-full bg-white/10 text-white hover:bg-white/20">
                        {expense.category}
                      </Badge>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(expense.date)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Amount & Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-lg font-medium text-white">
                    ${expense.amount.toFixed(2)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 text-white hover:bg-white/10"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white/90 backdrop-blur-xl"
                    >
                      <DropdownMenuItem>Edit</DropdownMenuItem>{" "}
                      {/* Edit non implémenté */}
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => onDeleteExpense(expense.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="py-12 text-center text-white/70">
              <PieChart className="h-12 w-12 mx-auto mb-3 text-white/30" />
              <p>No expenses found.</p>
              <p className="text-sm">
                Add a new expense or adjust your filters.
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={onAddExpenseClick}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      {/* Footer */}
      {filteredExpenses.length > 0 && (
        <CardFooter className="flex justify-between py-4 border-t border-white/10">
          <div className="text-sm text-white/70">
            Showing {filteredExpenses.length} of {totalExpenseCount} expenses
          </div>
          {/* <Button
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            View All // Fonctionnalité non implémentée
          </Button> */}
        </CardFooter>
      )}
    </Card>
  );
}
