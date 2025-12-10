"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Code2,
  Plus,
  Search,
  Filter,
  Copy,
  Pencil,
  Trash2,
  Eye,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  language: string;
  code: string;
  category: Category | null;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

const languages = [
  { value: "all", label: "All Languages" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

const languageColors: Record<string, string> = {
  javascript: "bg-yellow-500",
  typescript: "bg-blue-500",
  python: "bg-green-500",
  go: "bg-cyan-500",
  rust: "bg-orange-500",
};

function SnippetsContent() {
  const searchParams = useSearchParams();
  const languageFilter = searchParams.get("language") || "all";
  const tagFilter = searchParams.get("tag") || "";
  const categoryFilter = searchParams.get("category") || "";

  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(languageFilter);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSnippets();
  }, [selectedLanguage, tagFilter, categoryFilter]);

  async function fetchSnippets() {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedLanguage && selectedLanguage !== "all") {
        params.set("language", selectedLanguage);
      }
      if (tagFilter) {
        params.set("tag", tagFilter);
      }
      if (categoryFilter) {
        params.set("category", categoryFilter);
      }

      const response = await fetch(`/api/snippets?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSnippets(data);
      }
    } catch (error) {
      console.error("Error fetching snippets:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredSnippets = snippets.filter((snippet) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      snippet.title.toLowerCase().includes(query) ||
      snippet.description?.toLowerCase().includes(query) ||
      snippet.tags.some((tag) => tag.name.toLowerCase().includes(query))
    );
  });

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this snippet?")) return;

    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSnippets(snippets.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Snippets</h1>
          <p className="text-muted-foreground">
            Browse and manage your code snippets
            {tagFilter && ` • Filtered by tag: ${tagFilter}`}
            {categoryFilter && ` • Filtered by category: ${categoryFilter}`}
          </p>
        </div>
        <Link href="/snippets/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Snippet
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        {isLoading
          ? "Loading..."
          : `Showing ${filteredSnippets.length} snippet${filteredSnippets.length !== 1 ? "s" : ""}`}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredSnippets.length > 0 ? (
        <div className="grid gap-4">
          {filteredSnippets.map((snippet) => (
            <Card key={snippet.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          languageColors[snippet.language] || "bg-gray-500"
                        }`}
                      />
                      {snippet.title}
                    </CardTitle>
                    {snippet.description && (
                      <CardDescription>{snippet.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => copyToClipboard(snippet.code, snippet.id)}
                      title="Copy code"
                    >
                      {copiedId === snippet.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Link href={`/snippets/${snippet.id}`}>
                      <Button variant="ghost" size="icon-sm" title="View snippet">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/snippets/${snippet.id}/edit`}>
                      <Button variant="ghost" size="icon-sm" title="Edit snippet">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Delete snippet"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(snippet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                  <code>{snippet.code}</code>
                </pre>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {snippet.category && (
                    <Badge variant="secondary">{snippet.category.name}</Badge>
                  )}
                  {snippet.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                  <span className="ml-auto text-xs text-muted-foreground">
                    Updated {new Date(snippet.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code2 className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No snippets found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {searchQuery || selectedLanguage !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first snippet to get started"}
            </p>
            <Link href="/snippets/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Snippet
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Snippets</h1>
          <p className="text-muted-foreground">Browse and manage your code snippets</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    </div>
  );
}

export default function SnippetsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SnippetsContent />
    </Suspense>
  );
}
