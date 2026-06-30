# aayushnagar.github.io

Personal website for Aayush Nagar — a single static page (no build step).

## Files

| File | What it is |
|------|------------|
| `index.html` | All the content and structure |
| `styles.css` | Styling + light/dark/matrix themes |
| `script.js` | Theme toggle, interactive terminal, ⌘K palette, matrix easter egg |
| `favicon.svg` / `.png` / `.ico` | Terminal-mark favicons |

## Geeky features

- **Interactive terminal** in the hero — type `help`, `whoami`, `experience`,
  `skills`, `theme matrix`, `clear`… (↑/↓ history, Tab to autocomplete).
- **`⌘K` / `Ctrl-K` command palette** to jump around and switch theme.
- **Easter eggs**: the Konami code (or `theme matrix`) starts Matrix rain; `Esc` exits.
- All of it is progressive enhancement — the site works fully with JavaScript off.

## Preview locally

Just open `index.html` in a browser, or run a tiny server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Editing

- **Text / sections** → `index.html`. Placeholders are marked with `EDIT ME` comments
  (e.g. add your earlier roles in the experience timeline).
- **Colours / fonts / spacing** → CSS variables at the top of `styles.css`.

## Publishing on GitHub Pages

1. Make the repo `AayushNagar.github.io` **public**.
2. Push these files to the `main` branch.
3. In the repo: Settings → Pages → Source = `Deploy from a branch`, branch = `main` / root.
4. Your site goes live at `https://aayushnagar.github.io`.
