import { Code2, FolderOpen, MessageSquare, Plus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Snippets", value: "0", icon: Code2 },
  { label: "Categories", value: "0", icon: FolderOpen },
  { label: "Tags", value: "0", icon: Tags },
  { label: "AI Queries", value: "0", icon: MessageSquare },
];

const recentSnippets = [
  {
    id: 1,
    title: "Getting Started",
    language: "markdown",
    preview: "Welcome to DataNest! Create your first snippet to get started.",
    updatedAt: "Just now",
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your code snippet vault
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Snippet
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
                  <p className="text-2xl font-semibold">{stat.value}</p>
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
            {recentSnippets.length > 0 ? (
              <ul className="space-y-3">
                {recentSnippets.map((snippet) => (
                  <li
                    key={snippet.id}
                    className="flex items-start justify-between rounded-md border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{snippet.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {snippet.preview}
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs font-medium">
                      {snippet.language}
                    </span>
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
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              Create New Snippet
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask AI for a Snippet
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <FolderOpen className="h-4 w-4" />
              Browse Categories
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Tags className="h-4 w-4" />
              Manage Tags
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
