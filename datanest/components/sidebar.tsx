"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  FolderOpen,
  Home,
  MessageSquare,
  Plus,
  Settings,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/snippets", label: "All Snippets", icon: Code2 },
  { href: "/categories", label: "Categories", icon: FolderOpen },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/ai-chat", label: "AI Assistant", icon: MessageSquare },
];

const languages = [
  { name: "JavaScript", color: "bg-yellow-500" },
  { name: "TypeScript", color: "bg-blue-500" },
  { name: "Python", color: "bg-green-500" },
  { name: "Go", color: "bg-cyan-500" },
  { name: "Rust", color: "bg-orange-500" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Code2 className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">DataNest</span>
      </div>

      <div className="p-3">
        <Link href="/snippets/new">
          <Button className="w-full justify-start gap-2" size="sm">
            <Plus className="h-4 w-4" />
            New Snippet
          </Button>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <div className="mb-2">
          <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground">
            Languages
          </h3>
        </div>
        <nav className="flex flex-col gap-1">
          {languages.map((lang) => (
            <Link
              key={lang.name}
              href={`/snippets?language=${lang.name.toLowerCase()}`}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
            >
              <span className={cn("h-2 w-2 rounded-full", lang.color)} />
              {lang.name}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <Separator />
      <div className="p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
