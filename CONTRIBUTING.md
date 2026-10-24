# Contributing to Devora

Thanks for helping! Devora is a small, client-side app, so contributing is straightforward. Bug fixes, new tools, accessibility improvements and documentation fixes are all welcome.

## Before you start

- **Found a bug or have an idea?** [Open an issue](https://github.com/adnan-bhaldar/Devora/issues/new/choose) first for anything bigger than a small fix, so we can agree on the approach.
- **Security problem?** Please don't post it publicly. Contact the maintainer through their [GitHub profile](https://github.com/adnan-bhaldar).

## Set up

You need Node.js 20.19 or newer.

```bash
git clone https://github.com/adnan-bhaldar/Devora.git
cd Devora
npm install
npm run dev        # http://localhost:5173
```

Create a branch for your change, for example `fix/hash-copy-button` or `feat/url-encoder`.

## Before you open a pull request

Run all of these. GitHub runs `npm run lint` and `npm run check:tools` automatically on every pull request, but not the build, so please run `npm run build` yourself.

```bash
npm run lint
npm run check:tools
npm run build
```

Then try your change in the browser in both the light and dark theme, with the keyboard only, and on a narrow (phone-sized) window.

## Adding a tool

1. Create `src/tools/<id>/index.jsx` and `src/tools/<id>/docs.js`. Copy the shape from an existing tool such as `uuid`. Keep calculations in a separate plain-JavaScript file.
2. Add one entry to `tools` in `src/data/tools.js`. The `id` must equal the folder name.
3. Run `npm run check:tools`. It catches duplicate routes, missing folders and similar mistakes.
4. If the tool needs its own styles, put them in `src/tools/<id>/styles.css` (wrapped in `@layer components { ... }`) and add `@import './tools/<id>/styles.css';` at the bottom of `src/index.css`. Styles shared by several tools stay in `src/index.css`.
5. Add a line under **Unreleased** in [CHANGELOG.md](CHANGELOG.md).

The tool then appears on the home page, its category page, search, the command palette and the offline cache automatically. A **new category** also needs a color block, `[data-tone='<id>'] { --hue: ... }`, in `src/index.css`.

## Ground rules

- **Privacy first.** Tools must work entirely in the browser. Never send user input anywhere, never log it, and never put typed text or generated secrets in a URL.
- **Be honest in the docs.** A tool's `docs.js` privacy line must match what the tool really does.
- **Accessible by default.** Real buttons and labels, visible focus, sufficient color contrast, and no information carried by color alone.
- **Keep it small.** Avoid adding dependencies unless they clearly earn their size. Say why in the pull request.
- **Match the style.** Use the existing components, color tokens and spacing instead of one-off styles.

## Pull requests

- Keep each pull request focused on one change.
- Explain what changed and why, and include a screenshot for visual changes.
- Be patient and kind in reviews. Everyone here is learning.
