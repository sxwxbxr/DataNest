"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  Pencil,
  Trash2,
  Clock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const languageColors: Record<string, string> = {
  javascript: "bg-yellow-500",
  typescript: "bg-blue-500",
  python: "bg-green-500",
  go: "bg-cyan-500",
  rust: "bg-orange-500",
};

export default function SnippetViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchSnippet() {
      try {
        const response = await fetch(`/api/snippets/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSnippet(data);
        }
      } catch (error) {
        console.error("Error fetching snippet:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSnippet();
  }, [id]);

  const copyToClipboard = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this snippet?")) return;

    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/snippets");
      }
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/snippets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Snippet Not Found
          </h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              The snippet you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/snippets" className="mt-4">
              <Button>Back to Snippets</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/snippets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  languageColors[snippet.language] || "bg-gray-500"
                }`}
              />
              <h1 className="text-2xl font-semibold tracking-tight">
                {snippet.title}
              </h1>
            </div>
            {snippet.description && (
              <p className="text-muted-foreground">{snippet.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={copyToClipboard}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </>
            )}
          </Button>
          <Link href={`/snippets/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Code</CardTitle>
              <CardDescription>
                {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm text-zinc-100">
                <code>{snippet.code}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {snippet.category && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Category
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {snippet.category.name}
                  </Badge>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Language
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      languageColors[snippet.language] || "bg-gray-500"
                    }`}
                  />
                  <span className="capitalize">{snippet.language}</span>
                </div>
              </div>

              {snippet.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tags</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(snippet.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
