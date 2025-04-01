"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryWithTotal, Expense } from "@/lib/type";
import { ArrowUpRight } from "lucide-react";

interface SummaryCardsProps {
  totalExpenses: number;
  expensesByCategory: CategoryWithTotal[];
  expenses: Expense[];
}

export default function SummaryCards({
  totalExpenses,
  expensesByCategory,
  expenses,
}: SummaryCardsProps) {
  const topCategory = expensesByCategory[0];
  const thisMonthExpenses = expenses
    .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);
  const thisMonthTransactions = expenses.filter(
    (e) => new Date(e.date).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Expenses Card */}
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
            <span className="text-green-300 font-medium">12%</span> from last
            month {/* Note: This percentage is hardcoded in the original */}
          </div>
        </CardContent>
        <div className="h-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80"></div>
      </Card>

      {/* Top Category Card */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
        <CardHeader className="pb-2">
          <CardDescription className="text-white/70">
            Top Category
          </CardDescription>
          <CardTitle className="flex items-center gap-2 text-white">
            <div
              className={`w-3 h-3 rounded-full ${
                topCategory?.color || "bg-gray-500/80"
              }`}
            ></div>
            {topCategory?.name || "None"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-2xl font-bold text-white">
            ${topCategory?.total.toFixed(2) || "0.00"}
          </div>
          <div className="text-xs text-white/70 mt-1">
            {totalExpenses > 0
              ? Math.round((topCategory?.total / totalExpenses) * 100)
              : 0}
            % of total expenses
          </div>
        </CardContent>
        <div className="h-2 bg-gradient-to-r from-green-500/80 to-emerald-500/80"></div>
      </Card>

      {/* This Month Card */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
        <CardHeader className="pb-2">
          <CardDescription className="text-white/70">
            This Month
          </CardDescription>
          <CardTitle className="text-3xl font-bold text-white">
            ${thisMonthExpenses.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-xs text-white/70">
            {thisMonthTransactions} transactions
          </div>
        </CardContent>
        <div className="h-2 bg-gradient-to-r from-orange-500/80 to-pink-500/80"></div>
      </Card>
    </div>
  );
}
