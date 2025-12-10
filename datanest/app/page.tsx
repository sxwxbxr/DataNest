"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Code2, FolderOpen, MessageSquare, Plus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  updatedAt: string;
}

interface Stats {
  snippets: number;
  categories: number;
  tags: number;
  aiQueries: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    snippets: 0,
    categories: 0,
    tags: 0,
    aiQueries: 0,
  });
  const [recentSnippets, setRecentSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setRecentSnippets(data.recentSnippets);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Snippets", value: stats.snippets, icon: Code2 },
    { label: "Categories", value: stats.categories, icon: FolderOpen },
    { label: "Tags", value: stats.tags, icon: Tags },
    { label: "AI Queries", value: stats.aiQueries, icon: MessageSquare },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your code snippet vault
          </p>
        </div>
        <Link href="/snippets/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Snippet
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {isLoading ? "-" : stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="border-b p-4">
            <h2 className="font-semibold">Recent Snippets</h2>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : recentSnippets.length > 0 ? (
              <ul className="space-y-3">
                {recentSnippets.map((snippet) => (
                  <li key={snippet.id}>
                    <Link
                      href={`/snippets/${snippet.id}`}
                      className="flex items-start justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{snippet.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {snippet.code.slice(0, 100)}...
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs font-medium">
                          {snippet.language}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(snippet.updatedAt)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">
                No snippets yet. Create your first one!
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="border-b p-4">
            <h2 className="font-semibold">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link href="/snippets/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Create New Snippet
              </Button>
            </Link>
            <Link href="/ai-chat">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                Ask AI for a Snippet
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FolderOpen className="h-4 w-4" />
                Browse Categories
              </Button>
            </Link>
            <Link href="/tags">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Tags className="h-4 w-4" />
                Manage Tags
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
