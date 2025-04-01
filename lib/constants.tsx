import {
  Car,
  CreditCard,
  Film,
  Home,
  ShoppingBag,
  Utensils,
  Zap,
} from "lucide-react";
import { ReactNode } from "react";
import { Category } from "./type";

export const CATEGORIES: Category[] = [
  {
    name: "Food",
    color: "bg-blue-500/80",
    icon: <Utensils />,
  },
  {
    name: "Transport",
    color: "bg-green-500/80",
    icon: <Car />,
  },
  {
    name: "Shopping",
    color: "bg-pink-500/80",
    icon: <ShoppingBag />,
  },
  {
    name: "Bills",
    color: "bg-yellow-500/80",
    icon: <Zap />,
  },
  {
    name: "Entertainment",
    color: "bg-orange-500/80",
    icon: <Film />,
  },
  {
    name: "Other",
    color: "bg-purple-500/80",
    icon: <Home />,
  },
];

export const getCategoryColor = (categoryName: string): string =>
  CATEGORIES.find((c) => c.name === categoryName)?.color || "bg-gray-500/80";

export const getCategoryIcon = (categoryName: string): ReactNode =>
  CATEGORIES.find((c) => c.name === categoryName)?.icon || (
    <CreditCard className="h-4 w-4" />
  );
