import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Search, Wallet } from "lucide-react";

interface HeaderProps {
  onAddExpenseClick: () => void;
}

export default function Header({ onAddExpenseClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <h1 className="text-xl font-semibold">ExpenseTracker</h1>
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
          <Button
            size="sm"
            className="rounded-full gap-1 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md"
            onClick={onAddExpenseClick}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Expense</span>
          </Button>
          <Avatar className="h-9 w-9 border-2 border-white/30 bg-white/20 backdrop-blur-sm">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback className="font-semibold">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
