"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryWithTotal } from "@/lib/type";

interface CategoryDistributionProps {
  expensesByCategory: CategoryWithTotal[];
  totalExpenses: number;
}

export default function CategoryDistribution({
  expensesByCategory,
  totalExpenses,
}: CategoryDistributionProps) {
  const categoriesWithExpenses = expensesByCategory.filter(
    (category) => category.total > 0
  );

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {categoriesWithExpenses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoriesWithExpenses.map((category) => (
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
                  <div className="font-medium text-white">{category.name}</div>
                  <div className="text-sm text-white/70">
                    ${category.total.toFixed(2)}
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="text-sm font-medium text-white">
                    {totalExpenses > 0
                      ? Math.round((category.total / totalExpenses) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white/70 py-4">
            No expenses to distribute yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
