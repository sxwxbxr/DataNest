"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Save,
  Sparkles,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Bash" },
  { value: "markdown", label: "Markdown" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "other", label: "Other" },
];

export default function NewSnippetPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    // Fetch categories and tags
    async function fetchData() {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data);
        }
        if (tagsRes.ok) {
          const data = await tagsRes.json();
          setAvailableTags(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const addTag = async () => {
    const normalizedTag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!normalizedTag) return;

    // Check if tag already exists
    const existingTag = availableTags.find((t) => t.name === normalizedTag);
    if (existingTag) {
      if (!selectedTagIds.includes(existingTag.id)) {
        setSelectedTagIds([...selectedTagIds, existingTag.id]);
      }
      setTagInput("");
      return;
    }

    // Create new tag
    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: normalizedTag }),
      });
      if (response.ok) {
        const newTag = await response.json();
        setAvailableTags([...availableTags, newTag]);
        setSelectedTagIds([...selectedTagIds, newTag.id]);
        setTagInput("");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    if (!title || !code || !language) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          code,
          language,
          categoryId: categoryId || null,
          tags: selectedTagIds,
        }),
      });
      if (response.ok) {
        router.push("/snippets");
      } else {
        console.error("Failed to create snippet");
      }
    } catch (error) {
      console.error("Error creating snippet:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateWithAI = () => {
    if (!description) return;

    setIsGenerating(true);
    // TODO: Implement AI generation
    setTimeout(() => {
      setCode(`// AI-generated code based on: ${description}
// This is a placeholder. Connect to AI backend for real generation.

function example() {
  console.log("Generated code goes here");
}`);
      setIsGenerating(false);
    }, 2000);
  };

  const selectedTags = availableTags.filter((t) =>
    selectedTagIds.includes(t.id)
  );
  const isValid = title && code && language;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/snippets">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create New Snippet
          </h1>
          <p className="text-muted-foreground">
            Add a new code snippet to your vault
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Snippet Details</CardTitle>
              <CardDescription>
                Enter the basic information for your snippet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., React useState Hook Example"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this snippet does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="language">
                    Language <span className="text-destructive">*</span>
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
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

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Code</CardTitle>
                  <CardDescription>
                    Paste or write your code snippet
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateWithAI}
                  disabled={!description || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Tip: Add a description above and click &quot;Generate with AI&quot; to
                auto-generate code
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add tags to help organize and find your snippet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {selectedTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => removeTag(tag.id)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tags added yet
                </p>
              )}

              {availableTags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Existing tags:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {availableTags
                      .filter((t) => !selectedTagIds.includes(t.id))
                      .slice(0, 10)
                      .map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() =>
                            setSelectedTagIds([...selectedTagIds, tag.id])
                          }
                          className="rounded bg-muted px-2 py-0.5 text-xs hover:bg-muted/80"
                        >
                          {tag.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                How your snippet will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              {code ? (
                <pre className="overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm text-zinc-100">
                  <code>{code.slice(0, 200)}{code.length > 200 ? "..." : ""}</code>
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-8">
                  <Code2 className="h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Code preview will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              {isSaving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Snippet
                </>
              )}
            </Button>
            <Link href="/snippets">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>

          {!isValid && (
            <p className="text-center text-xs text-muted-foreground">
              Please fill in all required fields (title, language, code)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
