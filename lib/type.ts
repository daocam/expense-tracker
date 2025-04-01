import { ReactNode } from "react";

export type Expense = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
};

export type Category = {
  name: string;
  color: string;
  icon: ReactNode;
};

export type CategoryWithTotal = Category & {
  total: number;
};
