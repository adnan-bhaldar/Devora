# Devora

Fast, focused developer utilities that run entirely in your browser. No account, no backend, and nothing you type is sent to a server. After your first visit Devora also works offline and can be installed as an app.

## Tools

| Category            | Tools                                                                                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Encoders & Decoders | Base64 Encoder & Decoder, Base64 Image Converter, Binary ↔ Text Converter, JWT Decoder, Unix Timestamp Converter, Morse Code Translator, CSS Unit Converter                                                               |
| Generators          | CSS Gradient Generator, QR Code Generator, Lorem Ipsum Generator, Password Generator, UUID Generator, Slug Generator, WhatsApp & Telegram Link Generator, .gitignore Generator, Dummy Data Generator, ASCII Art Generator |
| Security & Hashing  | JWT Decoder, Hash Generator (SHA-256/384/512), Bcrypt Hash Generator, Password Generator                                                                                                                                  |
| Images              | Base64 Image Converter, QR Code Decoder, ASCII Art Generator                                                                                                                                                              |
| Text                | Base64 Encoder & Decoder, Binary ↔ Text Converter, Lorem Ipsum Generator, Slug Generator, Case Converter, ASCII Art Generator                                                                               |
| Reference           | HTTP Status Codes, FFmpeg Commands                                                                                                                                                                                        |

Some tools appear in more than one category.

## Tech stack

- [Vite](https://vite.dev) + [React](https://react.dev) (plain JavaScript) + [React Router](https://reactrouter.com)
- [Tailwind CSS v4](https://tailwindcss.com) plus custom CSS in `src/index.css` (design tokens, light and dark themes)
- [lucide-react](https://lucide.dev) icons
- [uqr](https://github.com/unjs/uqr) (QR generation) and [jsQR](https://github.com/cozmo/jsQR) (QR decoding)
- Everything else uses browser APIs: Web Crypto, Clipboard, File and Canvas

## Run it locally

You need Node.js 20.19 or newer (the CI uses Node 24).

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:5173
```

## Scripts

| Command               | What it does                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`         | Dev server with hot reload. The service worker is not used here.                                                                                        |
| `npm run build`       | Production build into `dist/`. Also writes the offline file list into `dist/sw.js` and, when the site address is known, `sitemap.xml` and `robots.txt`. |
| `npm run preview`     | Serves `dist/` locally. Use this to test offline mode and installing.                                                                                   |
| `npm run lint`        | ESLint.                                                                                                                                                 |
| `npm run check:tools` | Checks the tool registry (duplicate routes, missing folders or colours, and so on).                                                                     |

The GitHub Action in `.github/workflows/lint.yml` runs `lint` and `check:tools` on every pull request.

## Project structure

```text
.
├── index.html                 Page shell, meta tags, inline theme script
├── vite.config.js             Vite + Tailwind + offline file list + sitemap
├── vercel.json                SPA rewrite and security headers (CSP)
├── eslint.config.js
├── CHANGELOG.md               What changed, newest first
├── CONTRIBUTING.md            How to contribute
├── scripts/check-tools.mjs    Registry checks (npm run check:tools)
├── public/                    Copied as-is into the build
│   ├── sw.js                  Service worker (offline support)
│   ├── manifest.webmanifest   Installable app details
│   ├── robots.txt
│   ├── favicon.svg
│   └── icons/                 App icons
└── src/
    ├── main.jsx               Entry point
    ├── App.jsx                Providers (theme, toasts, favorites) and router
    ├── index.css              Design tokens, themes, component styles
    ├── routes/AppRoutes.jsx   All routes, built from the registry
    ├── data/
    │   ├── tools.js           THE tool registry (categories and tools)
    │   ├── site.js            Site name and description
    │   └── shortcuts.js       Keyboard shortcuts shown on About
    ├── pages/                 Home, CategoryPage, ToolPage, About, NotFound
    ├── tools/
    │   ├── index.jsx          Finds every tool folder and loads it on demand
    │   └── <tool-id>/         One folder per tool (index.jsx, docs.js, logic files)
    ├── components/
    │   ├── layout/            Header, Footer, Layout, CommandPalette
    │   ├── tools/             ToolCard, CategoryCard, CategorySection, ToolPanel, ToolDocs
    │   ├── common/            CopyButton, EmptyState, FileDropZone, ...
    │   └── ui/                Button, Select, ChoiceGroup, RangeField, ...
    ├── context/               Theme, toast and favorites/recents providers
    ├── hooks/                 Small reusable hooks
    ├── utils/                 Pure helpers (search, storage, files, share links, ...)
    └── pwa/                   Service worker registration
```

## How it works

**One registry drives everything.** `src/data/tools.js` lists every category and tool. The home page, category pages, search, the command palette, favorites, recently used, page titles and descriptions, routes, and the sitemap are all built from it.

**Tools load on demand.** `src/tools/index.jsx` finds every folder in `src/tools/` and loads its `index.jsx` and `docs.js` only when that tool is opened, so the first page stays small. The folder name must equal the tool's `id`.

**Logic is separate from the screen.** Each tool keeps its calculations in plain functions (for example `hash.js`, `password.js`) and its screen in `index.jsx`. Documentation for every tool lives in its own `docs.js` and is shown under the tool by one shared component.

**Pages**

| Address            | Page                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| `/`                | Home: browse by category, favorites, recently used, search           |
| `/categories/<id>` | All tools in one category                                            |
| `/<tool-route>`    | A tool, for example `/uuid`                                          |
| `/about`           | About, privacy, and keyboard shortcuts (`/whats-new` redirects here) |
| anything else      | 404 page                                                             |

## Privacy and security

- Tools process your input in the browser. Nothing you enter is sent to a server, logged, or stored.
- `localStorage` holds only three things: your theme (`devora-theme`), favorites (`devora-favorites`) and recently used tools (`devora-recent`).
- Some tools can share their settings through **Copy link** (for example the hash algorithm or the password length). Links never contain text you typed or anything generated from it, and everything read from a link is checked before it is used.
- Passwords and UUIDs use the browser's cryptographic random generator. The JWT tool decodes only and says clearly that it does not verify signatures.
- There is no `eval`, no `dangerouslySetInnerHTML`, and no console logging of user data.
- `vercel.json` sets a strict Content Security Policy and other security headers.
- The only third-party request is the site font from Google Fonts.

## Offline and installing

The build lists every file in `dist/sw.js`, so one visit saves the whole app (every tool included) in the browser. After that, any page opens without a connection, and browsers offer to install Devora as an app. The service worker only runs in the production build, never in `npm run dev`. A new version waits until all Devora tabs are closed, then takes over.

## Deploy

Devora is a static site, so any static host works. It needs two things: every address must fall back to `index.html` (the router draws the page), and the headers in `vercel.json` should be applied.

**Vercel (what the repository is set up for)**

1. Import the GitHub repository in Vercel. It detects Vite on its own: build command `npm run build`, output folder `dist`.
2. Deploy. `vercel.json` already contains the rewrite and the security headers. Vercel also provides your site address during the build, so `sitemap.xml` and `robots.txt` are generated with no setup.

**Other hosts (Netlify, Cloudflare Pages, GitHub Pages, ...)**

1. Build with `SITE_URL=https://your-domain.example npm run build` and publish `dist/`.
2. Add a "send all paths to `/index.html`" rule.
3. Apply the headers from `vercel.json` in that host's own format.

**Custom domain or CSP changes.** The Content Security Policy contains a hash of the small theme script in `index.html`. If you ever edit that script, regenerate the hash or the theme will stop applying before the page paints.

## Adding a new tool

1. **Create the tool.** Make `src/tools/<id>/index.jsx` (default-export the component) and `src/tools/<id>/docs.js` (default-export the documentation object; copy the shape from an existing tool). Keep calculations in a separate logic file.
2. **Register it.** Add one entry to `tools` in `src/data/tools.js`:

   ```js
   {
       id: 'my-tool',                 // must equal the folder name
       name: 'My Tool',
       description: 'One sentence on what it does.',
       categories: ['generators'],    // the first one is the main category
       route: '/my-tool',
       icon: Wand2,                   // a lucide-react icon
       keywords: ['search', 'words'],
       status: 'live',
       seo: { title: 'My Tool', description: 'Text for search engines.' },
   },
   ```

3. **Check it.** Run `npm run check:tools`.
4. Add a line under **Unreleased** in `CHANGELOG.md`.

Nothing else needs touching. The tool appears on the home page, its category page, search, the command palette, favorites, recently used, the sitemap and the offline cache.

A **new category** also needs an entry in `categories` in `tools.js` and a color block, `[data-tone='<id>'] { --hue: ... }`, in `src/index.css`. `check:tools` reminds you.

If a tool offers shareable settings, follow `src/tools/hash/share.js`: share only harmless settings, never user text or generated secrets, and validate everything read from the link.

## Maintenance notes

- **Dependencies:** run `npm outdated` now and then. `npm audit` should stay at zero known issues.
- **Offline cache:** nothing to maintain. The version is a hash of the built files, so every deploy updates it.
- **If the old version keeps showing after a deploy:** close all Devora tabs, or unregister the service worker in the browser's developer tools (Application → Service Workers).
- **Fonts:** the font loads from Google Fonts and is cached by the service worker. If you self-host it later, remove the Google Fonts hosts from the CSP and from `public/sw.js`.
- **Docs for tools:** keep each tool's `docs.js` honest. Its privacy line must match what the tool really does.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Notable changes are listed in [CHANGELOG.md](CHANGELOG.md).
