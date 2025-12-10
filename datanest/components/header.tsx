"use client";

import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search snippets or ask AI..."
          className="pl-9 pr-4"
        />
      </div>

      <div className="flex items-center gap-3">
        <Link href="/ai-chat">
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Ask AI
          </Button>
        </Link>
      </div>
    </header>
  );
}
