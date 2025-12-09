Here’s a full **README.md** draft for your **DataNest** app built with **Next.js 16.0.2** and **shadcn/ui**. It’s written in a professional, developer-oriented style, suitable for GitHub.  

***

```markdown
# 🪶 DataNest — Your Personal Code Snippet Vault

DataNest is an **on-premise AI-powered code snippet manager** built with **Next.js 16.0.2** and **shadcn/ui** components.  
Think of it as a “password safe,” but for your code: store, tag, and search snippets by language, category, or use case — and let integrated AI help you discover or even generate new ones.

---

## 🚀 Features

- **Secure snippet storage**: Save your code snippets locally (no cloud dependency).  
- **Categorization & tagging**: Organize snippets by language, framework, or purpose.  
- **AI-powered search**: Ask natural language questions like  
  _“Do we have a snippet for connecting to PostgreSQL?”_ — the AI searches your vault and suggests matches.  
- **AI-powered generation**: If no suitable snippet exists, DataNest auto-generates one using an integrated model, saves, and categorizes it.  
- **Manual filtering & browsing**: Search through snippets manually with optional tag, language, and keyword filters.  
- **Clean UI**: Built with shadcn components for consistent and elegant design.  
- **Privacy first**: Runs locally; designed for teams or developers who prefer on-premise control.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Next.js 16.0.2 (App Router) |
| UI | shadcn/ui, TailwindCSS |
| Database | SQLite |
| AI Layer | Claude / Local LLM integration |
| ORM | Prisma |
| Authentication | NextAuth / JWT |
| Deployment | Node.js |

---

## 📂 Project Structure

```
data-nest/
│
├─ app/                   # Next.js App Router pages
│  ├─ snippets/           # CRUD views for snippets
│  ├─ api/                # API routes (AI logic, DB access)
│  ├─ settings/           # Configuration and preferences
│  └─ layout.tsx          # Root layout
│
├─ components/            # shadcn UI components
├─ lib/                   # Utilities, AI client logic
├─ prisma/                # Schema and DB migrations
├─ public/                # Static assets
├─ styles/                # Global styles (Tailwind)
└─ README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository
```
git clone https://github.com/sxwxbxr/DataNest.git
cd DataNest
```

### 2. Install dependencies
```
pnpm install
```

### 3. Setup environment variables

Create a `.env` file:
```
DATABASE_URL="file:./dev.db"          # Default: SQLite
OPENAI_API_KEY="your-openai-key"     # or local model endpoint
NEXTAUTH_SECRET="some-random-string"
```

### 4. Initialize the database
```
pnpm prisma migrate dev
```

### 5. Run the development server
```
pnpm dev
```
Then visit **http://localhost:3000**

---

## 💡 AI Integration

DataNest uses an integrated AI backend to:
- Search and rank snippets based on semantic similarity.
- Generate new snippets when none match.
- Automatically categorize by **language**, **tags**, and **context**.

Example flow:
1. User asks: “How to debounce a function in JavaScript?”
2. The AI looks for existing snippets.
3. If none are found, it generates one, saves it, and tags it under _JavaScript ➜ Utilities ➜ Debounce._

---

## 🧠 Future Roadmap

- [ ] Share snippets securely between multiple users  
- [ ] Sync with Git repositories  
- [ ] Add syntax highlighting previews  
- [ ] Model fine-tuning for developer-specific context  
- [ ] CLI tool for quick terminal querying  

---

## 🛡️ License

MIT License © 2025 – Seya Weber

---

## 🤝 Contributing

Contributions, feature ideas, or bug reports are welcome!  
Open a PR or issue on [GitHub](https://github.com/sxwxbxr/DataNest).

---

## 🌐 About DataNest

Developed as an on-premise alternative to online snippet managers.  
Perfect for developers who want **AI-assisted productivity** without **cloud dependency**.
```
***

Would you like the README tailored for a **public open-source release** (with badges, contribution guide, etc.) or a **private internal team project** format (e.g., with setup for Docker, local models, and environment templates)?
