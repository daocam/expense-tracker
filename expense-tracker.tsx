"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  Calendar,
  Car,
  CreditCard,
  DollarSign,
  Film,
  Home,
  MoreHorizontal,
  PieChart,
  Plus,
  Search,
  ShoppingBag,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

// Define expense type
type Expense = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
};

// Define category type with color
type Category = {
  name: string;
  color: string;
  icon: React.ReactNode;
};

export default function ExpenseTracker() {
  const categories: Category[] = [
    {
      name: "Food",
      color: "bg-blue-500/80",
      icon: <Utensils className="h-4 w-4" />,
    },
    {
      name: "Transport",
      color: "bg-green-500/80",
      icon: <Car className="h-4 w-4" />,
    },
    {
      name: "Shopping",
      color: "bg-pink-500/80",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      name: "Bills",
      color: "bg-yellow-500/80",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      name: "Entertainment",
      color: "bg-orange-500/80",
      icon: <Film className="h-4 w-4" />,
    },
    {
      name: "Other",
      color: "bg-purple-500/80",
      icon: <Home className="h-4 w-4" />,
    },
  ];

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok)
          throw new Error(`Failed to fetch expenses: ${response.statusText}`);
        setExpenses(await response.json());
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || expense.category === filterCategory;

    const expenseDate = new Date(expense.date);
    const today = new Date();
    const isToday = expenseDate.toDateString() === today.toDateString();
    const isThisWeek =
      expenseDate >= new Date(today.setDate(today.getDate() - today.getDay()));
    const isThisMonth =
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getFullYear() === today.getFullYear();

    let matchesTab = true;
    if (activeTab === "today") matchesTab = isToday;
    else if (activeTab === "week") matchesTab = isThisWeek;
    else if (activeTab === "month") matchesTab = isThisMonth;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const expensesByCategory = categories
    .map((category) => ({
      ...category,
      total: expenses
        .filter((expense) => expense.category === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
    .sort((a, b) => b.total - a.total);

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.description) return;

    const expense: Expense = {
      id: Date.now().toString(),
      amount: Number.parseFloat(newExpense.amount),
      description: newExpense.description,
      category: newExpense.category,
      date: newExpense.date,
    };

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      if (!response.ok)
        throw new Error(`Failed to add expense: ${response.statusText}`);
      setExpenses(await fetch("/api/expenses").then((res) => res.json()));
      setNewExpense({
        amount: "",
        description: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
      });
      setIsAddExpenseOpen(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok)
        throw new Error(`Failed to delete expense: ${response.statusText}`);
      setExpenses(await fetch("/api/expenses").then((res) => res.json()));
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const getCategoryColor = (categoryName: string) =>
    categories.find((c) => c.name === categoryName)?.color || "bg-gray-500/80";
  const getCategoryIcon = (categoryName: string) =>
    categories.find((c) => c.name === categoryName)?.icon || (
      <CreditCard className="h-4 w-4" />
    );
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-blue-400 to-blue-600 flex flex-col">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      {/* Header */}

      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-white" />
            <h1 className="text-xl font-semibold text-white">ExpenseTracker</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/20"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-full gap-1 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Expense</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-xl border border-white/30">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-9 bg-white/50 border-white/30"
                        value={newExpense.amount}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            amount: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="What did you spend on?"
                      className="bg-white/50 border-white/30"
                      value={newExpense.description}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) =>
                        setNewExpense({ ...newExpense, category: value })
                      }
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
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-9 bg-white/50 border-white/30"
                        value={newExpense.date}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddExpense}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
                  >
                    Add Expense
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Avatar className="h-9 w-9 border-2 border-white/30 bg-white/20 backdrop-blur-sm">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className="text-white">U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      {/* Main Content */}

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
              <CardHeader className="pb-2">
                <CardDescription className="text-white/70">
                  Total Expenses
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-white">
                  ${totalExpenses.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-white/70 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-300" />
                  <span className="text-green-300 font-medium">12%</span> from
                  last month
                </div>
              </CardContent>
              <div className="h-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80"></div>
            </Card>
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
              <CardHeader className="pb-2">
                <CardDescription className="text-white/70">
                  Top Category
                </CardDescription>
                <CardTitle className="flex items-center gap-2 text-white">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      expensesByCategory[0]?.color || "bg-gray-500/80"
                    }`}
                  ></div>
                  {expensesByCategory[0]?.name || "None"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold text-white">
                  ${expensesByCategory[0]?.total.toFixed(2) || "0.00"}
                </div>
                <div className="text-xs text-white/70 mt-1">
                  {Math.round(
                    (expensesByCategory[0]?.total / totalExpenses) * 100
                  ) || 0}
                  % of total expenses
                </div>
              </CardContent>
              <div className="h-2 bg-gradient-to-r from-green-500/80 to-emerald-500/80"></div>
            </Card>

            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
              <CardHeader className="pb-2">
                <CardDescription className="text-white/70">
                  This Month
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-white">
                  $
                  {expenses
                    .filter(
                      (e) =>
                        new Date(e.date).getMonth() === new Date().getMonth()
                    )
                    .reduce((sum, e) => sum + e.amount, 0)
                    .toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-white/70">
                  {
                    expenses.filter(
                      (e) =>
                        new Date(e.date).getMonth() === new Date().getMonth()
                    ).length
                  }{" "}
                  transactions
                </div>
              </CardContent>
              <div className="h-2 bg-gradient-to-r from-orange-500/80 to-pink-500/80"></div>
            </Card>
          </div>

          {/* Category Distribution */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Expense Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {expensesByCategory
                  .filter((category) => category.total > 0)
                  .map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {category.name}
                        </div>
                        <div className="text-sm text-white/70">
                          ${category.total.toFixed(2)}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-sm font-medium text-white">
                          {Math.round((category.total / totalExpenses) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense List */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">
                  Recent Expenses
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                    <Input
                      type="search"
                      placeholder="Search expenses..."
                      className="w-[200px] pl-8 h-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-[130px] h-9 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl">
                      <SelectItem value="All">All Categories</SelectItem>
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
              <Tabs
                defaultValue="all"
                className="mt-2"
                onValueChange={setActiveTab}
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
                            <Badge
                              variant="secondary"
                              className="text-xs rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-white/70">
                    <PieChart className="h-12 w-12 mx-auto mb-3 text-white/30" />
                    <p>No expenses found.</p>
                    <p className="text-sm">
                      Add a new expense or adjust your filters.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
                      onClick={() => setIsAddExpenseOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            {filteredExpenses.length > 0 && (
              <CardFooter className="flex justify-between py-4 border-t border-white/10">
                <div className="text-sm text-white/70">
                  Showing {filteredExpenses.length} of {expenses.length}{" "}
                  expenses
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  View All
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
