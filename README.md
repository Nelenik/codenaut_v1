# Codenaut

A small browser game that teaches CSS by typing one declaration at a time and
watching it change a real playfield. The whole point is that the browser, not
the code, judges whether the child got it right: each declaration is wrapped in
a selector and applied to an `<iframe>`, and the checker reads the *computed*
value back out of that iframe. Two worlds (Colors, Sizes), five tasks each,
EN/RU throughout. CSS stays English; only the surrounding text translates.

## What it is

- **Editor** (`src/components/CssEditor.tsx`) — a CodeMirror 6 field for the CSS.
- **Live preview** (`src/components/PlayfieldPreview.tsx`) — an `<iframe>` whose
  `srcdoc` is the task's SVG/HTML plus the child's CSS, wrapped in the task
  selector by `src/lib/taskLoader.ts` (`wrapDeclarations`, `assemblePlayfield`).
- **Checker** (`src/lib/checker.ts`) — reads computed style from the iframe and
  compares it to the task (`px` tolerance, `rgb` tolerance, geometry for
  `border-radius: round`), then drives the star table
  (`src/lib/stars.ts`) and the outcome toast.
- **Basket** (`src/components/PropertyBasket.tsx`) — the scaffolding tasks where
  the child drags a ready-made `property: value;` command into the editor.
- **Task text** (`src/components/TaskZone.tsx`) — a two-column block (sentence
  left, "how to do it" right on desktop, one column on a phone).
- **i18n** (`src/i18n/en.json`, `ru.json`) — every child-facing string. CSS
  words are marked with `[[token]]`: colours are painted, property names are
  shown as pills (`src/components/MarkedText.tsx`).

A compact map of the drag-to-check journey lives in [`devpost/app-map.html`](./devpost/app-map.html).

## Run it

This is a Next.js 15 app. From the repo:

```bash
npm install
npm run dev     # http://localhost:3000
```

Game state is kept in `localStorage` under `codenaut.progress.v1`. To start
fresh, delete that key (or open an incognito/private window).

## Play

1. Pick a language → type a name → the onboarding walks through one CSS command.
2. Each level gives a sentence and a reference picture. Write CSS in the editor
   and the preview repaints live.
3. Press **Check**. Right answer → stars and the next level. Wrong property
   with the right look → an encouraging toast that names the property. Anything
   else → a hint toast, one attempt spent. After a few attempts the hint ladder
   offers a blurred answer and then a ready-made solution.
4. Combination tasks (`colors/05`, `sizes/05`) need several declarations, each
   ending with a semicolon. Basket tasks let you drag a whole command in.

## Structure

```text
src/
  app/                 routes: /  (map), /play/[world]/[level] (level screen)
  components/          screens and pieces (LevelScreen, TaskZone, CssEditor,
                       PlayfieldPreview, PropertyBasket, ResultToast, NoticeToast)
  lib/                 checker, taskLoader, progress, stars, useProgress, worlds,
                       cssTerms (the lists MarkedText resolves tokens against)
  i18n/                en.json, ru.json — all child-facing text
public/
  tasks/               colors/01..05, sizes/01..05 — .html playfield + .json config
```

### Task config shape

`public/tasks/<world>/NN-name.json`:

```jsonc
{
  "selector": "#target",          // what the child's CSS is wrapped in
  "expects": [                    // one or more property/value/mode checks
    { "property": "background-color", "mode": "rgb", "value": "darkblue" }
  ],
  "basket": [                      // for drag-in tasks: { property, value }
    { "property": "background-color", "value": "darkblue" }
  ],
  "solution": "background-color: darkblue;" // shown by "use the ready-made answer"
}
```

`mode` is `px`, `rgb` or `round` (geometry, e.g. a circle).

## Tokens in the dictionaries

A word wrapped in `[[square brackets]]` is markup, resolved by `MarkedText`:

- `[[green]]` → painted in that colour, with a colour chip beside it.
- `[[background-color]]` → a bright cyan pill (the one thing the child must type
  exactly).
- anything else → shown plainly, no brackets.

These are only honoured where `MarkedText` runs — task text, the "how to do it"
block, and the hint toast — so an author mistake stays visible in review and
harmless to a child.

## Notes

- Playfields use only plain CSS/HTML — no Tailwind class touches a playfield.
- License: MIT

> This README lives in the project's GitHub repository; replace this header with
> the repository URL once it is published.
