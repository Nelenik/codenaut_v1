---
doc: spec
status: approved
---

# Codenaut — Technical Spec

## How This Works, In Plain Language

Игра состоит из двух половин, которые живут рядом на одном экране.

**Оболочка** — это карта планет, списки уровней, звёзды, переключатель языка. Она сделана на твоём обычном стеке: Next.js + React + TypeScript. Ребёнок её не читает — он по ней кликает, поэтому скорость разработки здесь важнее, чем «чистота» кода в его глазах.

**Игровое поле** — это отдельный кусочек настоящего HTML с CSS, который ребёнок видит в правой части экрана. Оно не знает ничего про React. В нём лежат мяч, дерево, камень и те стили, которые ребёнку трогать нельзя.

**Мост между ними** — редактор в центре экрана. Ребёнок пишет CSS в поле, и на каждое нажатие клавиши React берёт заготовку игрового поля, дописывает в неё написанное и показывает результат в маленьком окошке. Никакого сервера, никакой базы данных: всё живёт в браузере. Окошко изолировано, поэтому ребёнок физически не может дописать туда скрипт и сломать игру.

**Как проверяется ответ.** У каждого задания есть маленькая инструкция для системы: «здесь ожидается такое-то свойство, и оно должно стать вот таким в пикселях». Когда ребёнок жмёт «Проверить», система спрашивает у браузера, во что это свойство *на самом деле* превратилось, и сравнивает с ожиданием. Поэтому `1.25em` и `20px` засчитываются одинаково — браузер сам переводит всё в пиксели.

**Где лежат задания.** Каждое задание — обычный файл `public/tasks/<level>/<task>.html`, который ты редактируешь как HTML, а не как строку внутри TypeScript. Рядом лежит `task.json` с проверкой и переводами текстов. Чтобы добавить градацию или новое задание, достаточно положить ещё одну пару файлов.

**Прогресс** — `localStorage`, то есть стикерная записка, которую браузер хранит для этого сайта. Закрыл вкладку, вернулся — звёзды на месте.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

```
Карта планет  (React)
   │ клик по планете
   ▼
Список уровней  (React)  ──── читает/пишет ────▶  localStorage
   │ клик по уровню
   ▼
Экран уровня  (React)  ──── читает ───▶  public/tasks/.../task.json
   │                                        public/tasks/.../task.html
   │
   │ ребёнок пишет CSS
   ▼
Строка = task.html + "</style>" + "код ребёнка" + "</style>"
   │
   ▼
<iframe srcDoc={...}>  ── живой предпросмотр
   │
   │ кнопка «Проверить»
   ▼
Проверка:
  1. спросить у iframe, какое свойство реально применилось
  2. сравнить с task.json
     ├─ свойство верное + значение верное → успех, звёзды
     ├─ вид верный, свойство нет → похвала, подсказка, попытка не тратится
     └─ неверно → подсказка, попытка тратится
   │
   ▼
localStorage  ← звёзды, пройденные уровни
```

## Stack

| Choice | Version | Why |
|---|---|---|
| Next.js | 15 (App Router) | Her stack. Wrapper only. |
| React | 19 | Her stack. |
| TypeScript | 5 | Her stack. |
| Tailwind CSS | 4 | Her stack — **wrapper only, never inside a playfield.** |
| shadcn/ui | latest | Her stack. Kept, not questioned: components are copied into the project so only what's used gets loaded, it costs nothing when unused, and the game may get more complex. |
| i18next / react-i18next | latest | EN + RU dictionaries from day one. |
| CodeMirror 6 | latest | The editor. Chosen because the game will extend to HTML tasks, and the library is needed then anyway. |
| SVG assets | — | Characters and objects, one file per object, in `public/assets/`. Hand-drawn in code, not images. |
| Plain HTML + CSS in `public/tasks/` | — | The teaching surface. No framework, no Tailwind, no build step. |

Docs: [Next.js](https://nextjs.org/docs), [React](https://react.dev), [TypeScript](https://www.typescriptlang.org/docs), [Tailwind CSS](https://tailwindcss.com/docs), [shadcn/ui](https://ui.shadcn.com/docs), [i18next](https://www.i18next.com), [CodeMirror 6](https://codemirror.net/docs/).

**Tailwind's boundary, stated plainly:** the wrapper can use utility classes freely. Inside `public/tasks/`, a single Tailwind class is a bug — a child who reads `class="rounded-full"` learns nothing about CSS. If the wrapper's styles ever leak into a playfield, that's a defect, not a preference.

**Tradeoffs accepted:**
- **Next.js App Router** — more setup than a single Vite + React app, and we use one page. Accepted because it is her stack and the build stays in a tool she knows, which serves `learner-profile.md > Desired Learning Outcome` (staying in control of the codebase).
- **CodeMirror 6, syntax highlighting on.** Reason: a plain textarea is too primitive for a product that will extend to HTML tasks, and the library will be needed either way. The partially-typed-property problem is handled at the configuration level — highlighting is set to not throw on invalid CSS, and if it misbehaves on a given task, highlighting is disabled for that editor while the library stays installed. Docs: [CodeMirror 6](https://codemirror.net/docs/), [CSS language support](https://codemirror.net/docs/ref/#language).
- **`fetch` for each task file** — one brief load on first open of a task. Accepted for real `.html` files that are editable with syntax highlighting.
- **No test framework.** A handful of hand-run checks during the build instead. Justified: 2–4 hours, and the verification that matters here is looking at the screen.

**Unverified — check these early in the build:** exact current versions of Next/React/Tailwind/shadcn/CodeMirror (they move fast), and whether the i18next setup needs a config file or a plain dictionary import is enough for two languages.

## Where It Runs and How Someone Tries It

- Runtime: browser, on a desktop-sized screen. No server beyond `next dev`.
- Environment: Node.js LTS. No API keys, no accounts, no `.env` beyond defaults.
- **Start:** `npm install`, then `npm run dev`, then open `http://localhost:3000`.
- **To record the demo:** run `npm run dev`, open the app, and record the browser. A separate `npm run build && npm start` is worth doing once before recording so the recording isn't of dev-mode behavior.
- Submission needs **both** a short demo video and a public GitHub repository. Deployment is optional and is not a substitute for either.
- **Deployment: not planned for the MVP.** If `6-ship` adds it, Vercel is the zero-config option for a Next.js app with no backend — free tier, no env vars, deploys from the GitHub repo. Recorded here as a candidate, not a decision.

## Look and Feel

Carried from `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`, in terms a build can act on.

- **Bright, saturated colors.** A space background that is deep but not black (dark blue/violet), with planets in high-chroma yellow, cyan, magenta, lime. Saturated, not pastel.
- **Typography:** a rounded, friendly, legible children's display face for headings and UI; a clean sans for body and story text; a monospace for the editor. Letterforms large — nothing below ~16px, and the story sentence larger still.
- **Density:** spacious and rounded, large hit targets. Nothing crowded. A 7-year-old aims with a mouse.
- **Tone:** warm and upbeat. Failure messages hint, never scold. Celebration is brief and bright, then straight on to the next task.
- **Avoid:** the generic AI-app look — flat gray, a single blue primary button, system sans, neutral shadows, dense text.

Tailwind can express this in the wrapper. Inside a playfield, the same values are written as plain CSS by hand — which is also a nice side effect: the styling of the game teaches the style the game teaches.

## Components

### NameEntry
The first screen (`prd.md > Screens and Layout` #0). Asks for the player's name once, in the current language, and saves it with the rest of the progress. No skip and no default: the name is the character's name, so an empty one would leave every task text nameless. `src/app/page.tsx` gates on it — with no saved name it renders this instead of `MapScreen`, so the gate needs no extra route and no redirect flash.

### MapScreen
The first screen (`prd.md > Screens and Layout` #1). Renders planets in sequence with a dashed rocket trail, an open/locked state per planet from progress, and a book button. The language switch is mounted here and in the layout so it is present on every screen.

### StoryScreen
Opened by the book button (`prd.md > Screens and Layout` #2). Renders the story text for the current language. Content from the i18n dictionaries.

### LevelList
Opened from a planet (`prd.md > Screens and Layout` #3, `prd.md > Level list`). Five rows, number + stars, lock state. Reads and writes progress.

### LevelScreen
The three-zone screen (`prd.md > Screens and Layout` #4, `prd.md > The editor`, `prd.md > Live preview and reference`, `prd.md > Check and result`). Owns the editor string, the live preview, the check, the hint ladder, and the success path. This is the most complex component in the app and the one `5-build` should slice carefully.

### TaskZone
The left zone (`prd.md > Screens and Layout` #4). Renders the short story sentence, and — the first time a property appears — the short explanation of what it does. Both come from the i18n dictionaries. Carries no state.

### CssEditor
The center zone. A **CodeMirror 6** instance holding CSS (`prd.md > The editor`). The property name may arrive pre-filled, from a drag, or typed; the value is typed. Emits the current CSS on every keystroke, driving the live preview. Configured not to throw on invalid CSS; if highlighting misbehaves on a task, the extension is turned off for that editor and the library stays in place for the future HTML tasks.

### PropertyBasket
Next to the editor (`prd.md > The editor`). Draggable CSS property names. Dragging fills the property field; the value is typed. Visual "text characters" stand in for real icons (`prd.md > Deferred From the POC`).

### PlayfieldPreview
The right zone (`prd.md > Live preview and reference`). An `<iframe srcdoc>` fed the task HTML plus the child's CSS. Needs no state of its own beyond the srcDoc string. A reference target is rendered in a second, semi-transparent layer on top.

### CheckButton
Runs the check. Triggers the three outcomes in `prd.md > Check and result` and the star table in `prd.md > Stars`.

### ResultToast
The staged hints (`prd.md > Hints, in stages`): guiding words → blurred answer → ready-made solution, all in one non-blocking toast. The words are authored per task in the dictionaries, not generated; the two mechanisms (reveal, ready-made answer) come from the task's `solution`. The ready-made solution sets stars to 0 and marks the level completed.

### ProgressStore
Reads and writes `localStorage` (`prd.md > Progress`). The only persistence. Exposed through a small module, not a library.

### TaskLoader
Fetches `task.json` and the task HTML for a level/task, and assembles the playfield string. Keeps `fetch` out of the components.

### i18n setup
Dictionaries for EN and RU (`prd.md > Product Decisions`, "Texts live in dictionaries from day one"). Every child-facing string lives here. CSS property names and values are **not** in the dictionaries — they stay English in both languages.

## Data Model

Three separate kinds of data, deliberately not mixed.

**1. Task content — files on disk, read-only at runtime.**
```
public/tasks/colors/01-ball-color.html     the playfield: markup + untouchable CSS
public/tasks/colors/01-ball-color.json     the check + which part is given
```
`task.json`:
```json
{
  "id": "colors/01-ball-color",
  "selector": "#target",
  "expects": [
    { "property": "background-color", "mode": "rgb", "value": [0, 128, 0] }
  ],
  "givesProperty": "background-color",
  "givesValue": false,
  "basket": [],
  "solution": "background-color: green"
}
```
- `selector` — the element the child's CSS is applied to. **Required.** The child types declarations (`background-color: green`), and a bare declaration outside a rule is invalid CSS that the browser drops silently, so declarations are wrapped in this selector by `wrapDeclarations()`. Anything the child writes that already contains a `{` is passed through untouched, so full-rule answers keep working.
- `expects` — **a list, and every entry must hold.** A single-property task has one entry; a combination task (`prd.md > Task progression within a world`, task 5) lists every property the scene needs, and the task passes only when the child's CSS satisfies all of them. The list exists because one property per task could not hold a combination task; `check()` already iterated over every declaration the child wrote, so only the config shape changed.
- `expects[].property` is compared against the property the child actually applied, and `expects[].value` against what that property computed to.
- `expects[].mode` — **how** the value is compared, because colors and lengths don't compare the same way:
  - `"px"` — a length or number. Compare against `getComputedStyle(el)[prop]` as a number, with a small tolerance. This is what makes `1.25em` and `20px` both pass.
  - `"rgb"` — a color. Browsers return colors as a normalized `rgb(r, g, b)` string, so compare the three numbers, allowing a tolerance (children typing `#0f0` vs `#00ff00` must not differ by more than rounding). This is what makes `#0f0`, `lime`, and `rgb(0,255,0)` all pass.
- `givesProperty` / `givesValue` — which part of the task is given, encoding the three stages of `prd.md > Task progression within a world`. `givesProperty` pre-fills the editor with `property: `; `basket` is the list of jumbled names the child drags from when nothing is given.
- `solution` — the ready-made answer: the shape of every expected declaration in one string, used by the third hint step and by the reference target.
- **Hint text is not in this file.** It lives in the dictionaries under `tasks.<id>.hints`, so the EN and RU wording stay together with every other child-facing string, and CSS stays out of the task files.

**2. Progress — `localStorage`, one key, `codenaut.progress.v1`.**
```json
{
  "lang": "en",
  "playerName": "",
  "tasks": {
    "colors/01-ball-color": { "stars": 3, "completed": true, "attempts": 1 }
  },
  "unlocked": { "worlds": ["colors"], "levels": ["colors/01"] }
}
```
- `playerName` — empty until the name screen is completed; `NameEntry` is shown while it is empty. The name is the character's name, so every task text interpolates it.
- Written on task completion, on level completion, on language change, and when the name is entered.
- Read on app start. No migration path yet — `v1` is the only version.
- `attempts` is what the star table reads.
- Mid-task input is **not** saved (`prd.md > States and Boundaries`): closing the tab restarts that task, keeping the tasks before it.

**3. In-flight state — React state only, never persisted.**
The current task id, the child's CSS string, which hint step is showing, whether a result message is up. Gone on reload, by design.

## File Structure

```
codenaut/
├── public/
│   ├── assets/                   # one SVG file per object
│   │   ├── ball.svg
│   │   ├── tree.svg
│   │   ├── rock.svg
│   │   ├── rocket.svg
│   │   └── planets/
│   └── tasks/                     # every playfield, a real editable HTML file
│       ├── colors/
│       │   ├── 01-ball-color.html     # background-color, property given
│       │   ├── 01-ball-color.json
│       │   ├── 02-color-too-dark.html # color, property given
│       │   ├── 03-pick-background.html # background-color, from the basket
│       │   ├── 04-pick-border.html     # border-color, from the basket
│       │   └── 05-color-combo.html    # all three at once
│       └── sizes/
│           ├── 01-how-wide.html       # width, property given
│           ├── 02-how-tall.html       # height, property given
│           ├── 03-pick-height.html    # height, from the basket
│           ├── 04-make-round.html     # border-radius, from the basket
│           └── 05-size-combo.html     # all three at once
│           # each with its .json beside it; the slugs are the list in src/lib/worlds.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx             # language switch lives here — every screen
│   │   ├── page.tsx               # MapScreen
│   │   ├── story/page.tsx         # StoryScreen
│   │   └── play/
│   │       ├── [world]/page.tsx   # LevelList
│   │       └── [world]/[level]/page.tsx   # LevelScreen
│   ├── components/
│   │   ├── MapScreen.tsx
│   │   ├── StoryScreen.tsx
│   │   ├── LevelList.tsx
│   │   ├── LevelScreen.tsx
│   │   ├── TaskZone.tsx
│   │   ├── CssEditor.tsx
│   │   ├── PropertyBasket.tsx
│   │   ├── PlayfieldPreview.tsx
│   │   ├── CheckButton.tsx
│   │   └── HintLadder.tsx
│   ├── lib/
│   │   ├── taskLoader.ts          # fetch + assemble playfield string
│   │   ├── checker.ts             # the two-part check
│   │   ├── progress.ts            # localStorage read/write
│   │   └── stars.ts               # the star table
│   └── i18n/
│       ├── en.json                # all child-facing text
│       └── ru.json
├── devpost/                       # learner-profile, scope, prd, spec, checklist
├── package.json
├── .gitignore
└── README.md
```

Note: the playfield is `.html`, not a route. Nothing under `public/tasks/` is rendered by Next — it is fetched as a string.

## External Services and Dependencies

**None.** No API, no database, no auth, no keys, no rate limits, no cost. Everything is npm packages at install time and `localStorage` at runtime.

This is a deliberate result of the simplification pass, not an omission.

## Important Failure Modes

- **The child types CSS that breaks the playfield** (a missing brace, a bad selector) → the iframe renders oddly or blank. The playfield's base CSS sits in its own `<style>` before the child's code, so a syntax error in the child's CSS can't remove the scene. If the preview is blank, a small message appears in the editor zone. Blanking the editor resets it in one keystroke.
- **`fetch` fails or the task file is missing** → the level screen shows "This level could not be loaded" with a retry button. This is the one thing worth handling, because a missing file is a plausible authoring mistake during the build.
- **Corrupt or absent `localStorage`** (private mode, cleared storage) → the store falls back to a fresh default and continues. Progress is not worth a crash.
- **A child gets permanently stuck and the hint ladder is exhausted** → cannot happen by design: the third step always produces a completed level with 0 stars.

## What Was Simplified and Why

- **No backend, no accounts, no sync.** `localStorage` instead. The full version would need a database, an auth provider, and a merge strategy for progress on multiple devices. None of that proves the idea.
- **No syntax highlighter in the editor.** A plain textarea. A library like CodeMirror would add a dependency, break on partial input, and shift the focus from writing a property to reading code.
- **No bitmap image assets.** Every object is hand-drawn as **SVG**, one file per object in `public/assets/` — `ball.svg`, `tree.svg`, `rock.svg`, `rocket.svg`, planets. Reason: drawn in code, they stay crisp, need no build step, and can be recolored by the very CSS the game teaches — a child setting `background-color` on an SVG is doing something real. Real character illustration is explicitly a post-MVP improvement, but the MVP interface is expected to be **visually pleasant and interesting to a real child**, because it will be tested on one. Aesthetic placeholders are not acceptable here. Canvas is not used: SVG files are addressable, styleable by CSS, and reusable across tasks.
- **No real icons in the basket.** Text characters stand in. The basket needs a visual language, but it doesn't need artwork to prove the mechanism.
- **No star-best-keeping.** A replay replaces the result rather than keeping the highest score. Simpler state, and the star display stays honest.
- **Uniform hints, not personalized ones.** Every task carries its own authored hint steps, keyed to the level's topic. Nothing at runtime knows which facts this particular child has seen. Reason: personalization depends on the game's future, and for 10 tasks it adds nothing. Revisit only if the game is developed further.
- **No deployment.** Recorded as a candidate, not built.

## Decisions and Open Issues

**Learner decisions:**
- **shadcn/ui stays.** Reason: it isn't in the bundle unless a component is used, so an unused library costs nothing, and the game is expected to get more complex. Removing it was raised and declined.
- **Static HTML+CSS playfield, React/Next/Tailwind wrapper.** Reason: CSS must be visible to the child where they are learning it; the wrapper is where speed of development matters. Tradeoff accepted: two rendering contexts in one app, and a rule that must hold — no Tailwind inside a playfield.
- **Real `.html` files rather than strings in `.tsx`.** Reason: easier to edit, easier to add difficulty gradations later. Tradeoff accepted: a `fetch` on each task open, and no `file://` support.
- **Check by computed style, not by string.** Reason: it directly implements the agreed rule that any unit producing the right result counts. Tradeoff accepted: expected values must be authored in pixels, and a browser quirk becomes a possible false negative.
- **Ready-made solution exists, costs 0 stars, still completes the level.** Reason: a child stuck mid-level is a worse outcome than one who learns by watching an answer once. Tradeoff accepted: stars are no longer a reliable measure, and a child can farm 0-star passes. Chosen deliberately over a hard block.
- **No hint icon in the MVP.** Reason: addable later. The hint ladder after a failed check is what the child actually needs.

**The one uncertainty worth naming, from `learner-profile.md > Desired Learning Outcome`:** how to verify the agent's output quickly enough to keep the codebase under control. The concrete answer adopted here is structural rather than procedural — small, reviewable files; playfields as plain HTML that can be opened and read without understanding the wrapper; and a build sliced one zone at a time so each increment is checkable by looking. If the build turns out to produce large diffs in `LevelScreen.tsx`, that is the signal that the slicing failed.

**Resolved during drafting — the `srcdoc` access question:**
The child's CSS is a string in React state on the **parent** page, so it is always readable from there. The playfield is a separate document inside the iframe, and a check needs the computed style of an element inside it. An `<iframe srcdoc="...">` **without a `sandbox` attribute inherits the parent's origin**, so the parent reads it directly via `iframe.contentDocument.getElementById(...)` and `getComputedStyle`. No `postMessage` and no injected script are needed. The one way to break this is adding `sandbox` without `allow-same-origin`, which makes the document opaque and unreadable from the parent. We are not adding `sandbox`: the child types into an editor and physically cannot inject `<script>`, so the iframe is already isolated from the app in the way that matters — and the isolation from other tasks comes from being a separate document, not from a sandbox attribute.

**Open, to verify early in the build:**
- Current versions of Next 15 / React 19 / Tailwind 4 / shadcn/ui / CodeMirror 6, and whether the i18next setup needs a config file or works with a plain dictionary import for two languages.
