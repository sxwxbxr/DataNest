"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tags,
  Plus,
  Search,
  Pencil,
  Trash2,
  Code2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Tag {
  id: string;
  name: string;
  color: string;
  snippetCount: number;
}

const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-cyan-500", label: "Cyan" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-violet-500", label: "Violet" },
  { value: "bg-emerald-500", label: "Emerald" },
  { value: "bg-rose-500", label: "Rose" },
];

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("bg-blue-500");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsages = tags.reduce((sum, tag) => sum + tag.snippetCount, 0);

  const sortedTags = [...filteredTags].sort(
    (a, b) => b.snippetCount - a.snippetCount
  );

  const handleCreateTag = async () => {
    if (!newTagName) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName,
          color: newTagColor,
        }),
      });

      if (response.ok) {
        const newTag = await response.json();
        setTags([...tags, newTag]);
        setIsCreateDialogOpen(false);
        setNewTagName("");
        setNewTagColor("bg-blue-500");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTags(tags.filter((t) => t.id !== id));
        setSelectedTags(selectedTags.filter((tid) => tid !== id));
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${selectedTags.length} tags?`)
    )
      return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/tags", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedTags }),
      });

      if (response.ok) {
        setTags(tags.filter((t) => !selectedTags.includes(t.id)));
        setSelectedTags([]);
      }
    } catch (error) {
      console.error("Error deleting tags:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleTagSelection = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearSelection = () => {
    setSelectedTags([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Manage and organize your snippet tags
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
              <DialogDescription>
                Add a new tag to label your code snippets
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Tag name (e.g., react, api, utility)"
                  value={newTagName}
                  onChange={(e) =>
                    setNewTagName(
                      e.target.value.toLowerCase().replace(/\s+/g, "-")
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewTagColor(color.value)}
                      className={`h-8 w-8 rounded-md ${color.value} ${
                        newTagColor === color.value
                          ? "ring-2 ring-offset-2 ring-primary"
                          : ""
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTag}
                disabled={!newTagName || isCreating}
              >
                {isCreating ? "Creating..." : "Create Tag"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Tags className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {isLoading ? "-" : tags.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Tags</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {isLoading ? "-" : totalUsages}
                </p>
                <p className="text-sm text-muted-foreground">Tag Usages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Tags className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {isLoading || sortedTags.length === 0
                    ? "-"
                    : sortedTags[0]?.name}
                </p>
                <p className="text-sm text-muted-foreground">Most Used Tag</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedTags.length} selected
            </span>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Selected"}
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredTags.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTags.length} tag
            {filteredTags.length !== 1 ? "s" : ""}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Tags</CardTitle>
              <CardDescription>
                Click on a tag to view associated snippets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {sortedTags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`group relative inline-flex items-center rounded-md border px-3 py-2 transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => toggleTagSelection(tag.id)}
                      className="mr-2 h-4 w-4 cursor-pointer"
                    />
                    <Link
                      href={`/snippets?tag=${encodeURIComponent(tag.name)}`}
                      className="flex items-center gap-2"
                    >
                      <span className={`h-2 w-2 rounded-full ${tag.color}`} />
                      <span className="font-medium">{tag.name}</span>
                      <Badge variant="secondary" className="ml-1">
                        {tag.snippetCount}
                      </Badge>
                    </Link>
                    <div className="ml-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Implement edit
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteTag(tag.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {sortedTags.length > 0 && sortedTags[0].snippetCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
                <CardDescription>
                  Most frequently used tags in your snippets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedTags
                    .filter((t) => t.snippetCount > 0)
                    .slice(0, 5)
                    .map((tag, index) => (
                      <Link
                        key={tag.id}
                        href={`/snippets?tag=${encodeURIComponent(tag.name)}`}
                        className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-center text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span
                            className={`h-2 w-2 rounded-full ${tag.color}`}
                          />
                          <span className="font-medium">{tag.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full ${tag.color}`}
                              style={{
                                width: `${(tag.snippetCount / sortedTags[0].snippetCount) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="w-8 text-right text-sm text-muted-foreground">
                            {tag.snippetCount}
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tags className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No tags found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first tag to label your snippets"}
            </p>
            <Button
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Tag
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
