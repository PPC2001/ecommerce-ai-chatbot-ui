# 🛍️ E-Commerce AI Chatbot — Frontend

React-based chat and product browsing interface for the AI shopping assistant, built with **Vite**, **TailwindCSS v4**, and **TypeScript**.

---

## 🏗️ Architecture

```
ui/
├── index.html                   # Entry HTML with SEO meta + CSP
├── vite.config.ts               # Vite config (TailwindCSS plugin, dev proxy)
├── tsconfig.app.json            # TypeScript config
├── package.json
└── src/
    ├── main.tsx                 # React app entry point
    ├── App.tsx                  # Root layout (header + chat + sidebar)
    ├── index.css                # Global design system (CSS custom properties)
    ├── types/
    │   └── index.ts             # TypeScript interfaces (mirroring backend schemas)
    ├── services/
    │   └── api.ts               # Typed fetch wrapper (BFF API client)
    ├── hooks/
    │   ├── useChat.ts           # Chat state, message sending, error handling
    │   └── useProducts.ts       # Products fetching, filtering, pagination state
    └── components/
        ├── Header.tsx           # App header with logo, cart badge, sidebar toggle
        ├── ChatInterface.tsx    # Full chat UI with markdown support
        ├── ProductCard.tsx      # Individual product display card
        └── ProductCatalog.tsx   # Filterable product sidebar
```

---

## ⚡ Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |

### 1. Install Dependencies

```bash
cd ui
npm install
```

### 2. Configure Environment (Optional)

Create `ui/.env.local` to override defaults:

```env
# Default: http://localhost:8000 (proxied via Vite dev server)
VITE_API_BASE_URL=http://localhost:8000
```

> In development, the Vite proxy forwards all `/api/*` requests to `http://localhost:8000` automatically, so you don't need to set this.

### 3. Start Development Server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR at `localhost:5173` |
| `npm run build` | TypeScript check + production bundle |
| `npm run preview` | Preview production build locally |

---

## 🎨 Design System

The app uses a custom **dark navy + violet** theme defined entirely in CSS custom properties (`index.css`). No Tailwind config file needed — uses TailwindCSS v4's zero-config approach.

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#0a0b14` | Page background |
| `--color-bg-card` | `#141629` | Cards, panels |
| `--color-accent` | `#7c5cfc` | Primary actions, highlights |
| `--color-teal` | `#00d9c4` | Secondary accent, status dots |
| `--color-text-primary` | `#f0f2ff` | Main text |
| `--color-text-muted` | `#5e6487` | Labels, timestamps |

### Typography

**Inter** (Google Fonts) — weights 300–800

### Animations

| Animation | Used On |
|-----------|---------|
| `message-slide-in` | New chat messages |
| `typing-bounce` | Typing indicator dots |
| `pulse-dot` | Status indicator in header |
| `bounce-in` | Cart badge count update |
| `shimmer` | Skeleton loading cards |

---

## 🧩 Components

### `<ChatInterface />`

The main chat panel. Features:
- Multi-turn conversation with history
- **ReactMarkdown** rendering for bot responses (safe — no `dangerouslySetInnerHTML`)
- Animated typing indicator while waiting for AI
- Suggested prompt chips on empty state
- Character counter near the 2000-char limit
- `Enter` to send, `Shift+Enter` for newline
- Auto-scroll to latest message

**Props:**
```ts
{
  messages: Message[]
  isLoading: boolean
  error: string | null
  onSendMessage: (text: string) => void
  onClearChat: () => void
}
```

---

### `<ProductCatalog />`

Collapsible sidebar with full product filtering. Features:
- Text search (name, description, tags, brand)
- Category dropdown (6 categories)
- Min/max price range inputs
- In-stock only toggle
- Skeleton loading state
- Pagination controls

---

### `<ProductCard />`

Individual product display. Features:
- Lazy-loaded product image with fallback
- Discount badge (% off)
- Star rating display
- Stock availability indicator
- "Add to Cart" button (triggers contextual AI chat message)

---

### `<Header />`

App-wide header. Features:
- Gradient logo with Sparkles icon
- Animated "Powered by Gemini 2.5 Pro" badge with pulsing dot
- Cart counter with bounce-in animation
- Catalog sidebar toggle button

---

## 🪝 Custom Hooks

### `useChat()`

Manages the full chat lifecycle:

```ts
const { messages, isLoading, error, sendMessage, clearChat } = useChat();
```

- Maintains conversation history (max 20 turns)
- Generates and tracks session IDs
- Client-side message length validation (max 2000 chars)
- Categorised error messages (rate limit vs. server error vs. network error)
- No auth tokens stored in `localStorage` — stateless API calls only

---

### `useProducts()`

Manages product fetching and filter state:

```ts
const {
  products, total, page, isLoading, error,
  filters, updateFilters, resetFilters, setPage
} = useProducts();
```

- Fetches on filter or page change
- Debounce-friendly (updates trigger new fetch)
- Reset function clears all filters and returns to page 1

---

## 🔐 Security

| Threat | Mitigation |
|--------|-----------|
| XSS | React JSX auto-escaping on all user-provided content |
| XSS (markdown) | ReactMarkdown with `script` and `iframe` components disabled |
| Credential theft | No API keys, tokens, or secrets ever sent to the client |
| Auth token storage | Not stored in `localStorage`/`sessionStorage` (stateless API) |
| CSP | Meta tag enforces strict `script-src 'self'`, `frame-ancestors 'none'` |
| Clickjacking | `X-Frame-Options: DENY` meta tag |
| API abuse | All calls go through backend BFF — LLM is never called directly |
| Input length | 2000-char limit enforced client-side and server-side |

### Content Security Policy (dev)

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https://images.unsplash.com;
connect-src 'self' http://localhost:8000 http://127.0.0.1:8000;
frame-ancestors 'none';
object-src 'none';
```

> **TODO(security):** Move CSP from `<meta>` tag to HTTP response header in production (via nginx or CDN). The meta tag approach has limitations and is weaker than a proper header.

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18 | UI framework |
| `vite` | 8 | Build tool + dev server |
| `tailwindcss` | 4 | Utility CSS (via `@tailwindcss/vite` plugin) |
| `lucide-react` | latest | Icon library |
| `react-markdown` | latest | Safe Markdown rendering for bot messages |
| `uuid` | latest | Session ID generation |
| `typescript` | 5 | Type safety |

---

## 🗂️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend base URL |

> All `VITE_` prefixed variables are embedded at **build time** — never use this for secrets.

---

## 🏭 Production Build

```bash
npm run build
```

Output in `dist/` — a fully static bundle you can serve from any CDN (Cloud Storage, Firebase Hosting, Vercel, etc.).

**Bundle sizes (approximate):**

| File | Size | Gzipped |
|------|------|---------|
| `index.js` | ~329 KB | ~102 KB |
| `index.css` | ~25 KB | ~5.7 KB |

---

## 🚀 Production Deployment (Vercel)

Deploy your React/Vite application to **Vercel** with the following steps:

1. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New...** → **Project**.
   - Import your **`ecommerce-ai-chatbot-ui`** GitHub repository.

2. **Build Settings**:
   - **Framework Preset**: `Vite` (Auto-detected).
   - **Root Directory**: `./` (Auto-selected).
   - **Build Command**: `npm run build` (Runs type-check and Vite compilation).
   - **Output Directory**: `dist`.

3. **Configure Environment Variables (CRITICAL)**:
   - In the **Environment Variables** settings, add the variable pointing to your deployed backend (e.g. Hugging Face Space):
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://<your-username>-<your-space-name>.hf.space` *(no trailing slash `/`)*
     - **Scope**: Ensure the **`Production`** checkbox is selected.

4. **Security & Content Security Policy (CSP)**:
   - Our `index.html` implements a Content Security Policy. If you deploy your backend to Hugging Face, make sure your [index.html](file:///home/pratik/genai-projects/ecommerce-ai-chatbot/ecommerce-ai-chatbot-ui/index.html) has `https://*.hf.space` in its `connect-src` CSP whitelist:
     ```html
     <meta http-equiv="Content-Security-Policy" content="... connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https://*.hf.space; ...">
     ```
     *(This is already pre-configured in the repository)*.

5. **Deploy & Re-deploys**:
   - Click **Deploy**. Vercel will build and deploy the app.
   - **Note:** Vite compiles environment variables at **build time**. If you change `VITE_API_BASE_URL` in Vercel settings, you must trigger a **Redeploy** on the Deployments tab to inject the new URL.

---

## 🚀 Deployment (Alternative: Firebase Hosting)

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

Or serve with nginx:

```nginx
server {
    listen 80;
    root /var/www/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers (stronger than meta tags)
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header Content-Security-Policy "default-src 'self'; ...";
}
```


---

## 🔗 Related

- [Backend README](../ecommerce-ai-chatbot/README.md) — FastAPI server setup and API reference
- [Root README](../README.md) — Full project overview and architecture
