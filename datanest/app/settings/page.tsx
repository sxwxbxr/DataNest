"use client";

import { useState } from "react";
import {
  Settings,
  Database,
  Sparkles,
  Palette,
  Shield,
  Download,
  Upload,
  Save,
  Moon,
  Sun,
  Monitor,
  Key,
  Server,
  HardDrive,
  RefreshCw,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [aiProvider, setAiProvider] = useState("claude");
  const [theme, setTheme] = useState("system");
  const [editorTheme, setEditorTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("14");
  const [apiKey, setApiKey] = useState("");
  const [localModelEndpoint, setLocalModelEndpoint] = useState("http://localhost:11434");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // TODO: Implement settings save with database
    setTimeout(() => {
      setIsSaving(false);
      console.log("Settings saved");
    }, 1000);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting snippets...");
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log("Importing snippets...");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your DataNest preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Integration</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database
              </CardTitle>
              <CardDescription>
                Configure your local database settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="dbPath">Database Path</Label>
                <div className="flex gap-2">
                  <Input
                    id="dbPath"
                    value="./dev.db"
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" disabled>
                    <HardDrive className="mr-2 h-4 w-4" />
                    Change
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  SQLite database file location
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Database Status</p>
                  <p className="text-sm text-muted-foreground">
                    Connection to local SQLite database
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy
              </CardTitle>
              <CardDescription>
                DataNest keeps your data private and secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm">
                  <strong>On-Premise Storage:</strong> All your snippets are stored
                  locally on your machine. No data is sent to external servers unless
                  you explicitly configure AI integration with external providers.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Local-First Mode</p>
                  <p className="text-sm text-muted-foreground">
                    All operations work offline
                  </p>
                </div>
                <span className="rounded bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                  Enabled
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Provider
              </CardTitle>
              <CardDescription>
                Configure the AI model for snippet search and generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="aiProvider">Provider</Label>
                <Select value={aiProvider} onValueChange={setAiProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="local">Local Model (Ollama)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {aiProvider !== "local" && (
                <div className="grid gap-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your API key is stored locally and never sent to our servers
                  </p>
                </div>
              )}

              {aiProvider === "local" && (
                <div className="grid gap-2">
                  <Label htmlFor="localEndpoint">Local Model Endpoint</Label>
                  <Input
                    id="localEndpoint"
                    placeholder="http://localhost:11434"
                    value={localModelEndpoint}
                    onChange={(e) => setLocalModelEndpoint(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Endpoint for your local Ollama or similar service
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI Status</p>
                  <p className="text-sm text-muted-foreground">
                    Connection to AI provider
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-sm">Not configured</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                AI Features
              </CardTitle>
              <CardDescription>
                Configure AI-powered functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Semantic Search</p>
                  <p className="text-sm text-muted-foreground">
                    Search snippets using natural language
                  </p>
                </div>
                <span className="rounded bg-muted px-2 py-1 text-xs font-medium">
                  Requires API Key
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Generation</p>
                  <p className="text-sm text-muted-foreground">
                    Generate snippets when no match is found
                  </p>
                </div>
                <span className="rounded bg-muted px-2 py-1 text-xs font-medium">
                  Requires API Key
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Categorization</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically suggest tags and categories
                  </p>
                </div>
                <span className="rounded bg-muted px-2 py-1 text-xs font-medium">
                  Requires API Key
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme
              </CardTitle>
              <CardDescription>
                Customize the appearance of DataNest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Application Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label>Code Editor Theme</Label>
                <Select value={editorTheme} onValueChange={setEditorTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select editor theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark (Default)</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="monokai">Monokai</SelectItem>
                    <SelectItem value="dracula">Dracula</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="14">14px (Default)</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="18">18px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Data
              </CardTitle>
              <CardDescription>
                Export your snippets for backup or migration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Export Format</Label>
                <Select defaultValue="json">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export All Snippets
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Data
              </CardTitle>
              <CardDescription>
                Import snippets from a file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-dashed p-8 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop a file here, or click to browse
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supports JSON, CSV, and Markdown files
                </p>
                <Button variant="outline" className="mt-4" onClick={handleImport}>
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that affect your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reset Database</p>
                  <p className="text-sm text-muted-foreground">
                    Delete all snippets, categories, and tags
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
