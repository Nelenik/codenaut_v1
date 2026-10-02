---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Project scaffold + MapScreen — two worlds with rocket trail**
  Becomes usable: The app starts, shows a space map with two planets (Colors lit, Sizes locked), a dashed rocket trail connecting them, and a book button. Language switch in the corner.
  Why now: First screen the child sees. Bootstrapping lives here per spec — scaffold, deps, config, routing, i18n init, layout with language switch. Proves the wrapper stack works end to end.
  PRD ref: `prd.md > The Core Journey` (steps 1), `prd.md > Screens and Layout` #1
  Spec ref: `spec.md > Components` (MapScreen), `spec.md > File Structure`, `spec.md > Stack`
  Build: Scaffold Next.js 15 App Router project with TypeScript, Tailwind 4, shadcn/ui, i18next/react-i18next, CodeMirror 6. Create `src/app/layout.tsx` with language switch, `src/app/page.tsx` with MapScreen, planet components with open/locked states from progress, rocket trail SVG, book button. Add `src/i18n/en.json` and `ru.json` with map strings. Configure `next.config.js` for static assets.
  Verify (mechanical): `npm install` succeeds, `npm run dev` starts on localhost:3000 with no errors. Open page — map renders, both planets visible with correct locked states, language switch toggles text.
  Learner check: Open the app, confirm the map looks like a space scene with two planets and a trail, click the language switch — does it feel right for a 7-year-old?
  Commit: `Scaffold project and MapScreen with two worlds`

- [x] **2. StoryScreen + LevelList — navigation from map to levels**
  Becomes usable: Clicking the book button opens the story screen with framing text. Clicking the Colors planet opens a level list with 5 rows showing level numbers and stars (first available, rest locked). Clicking a level navigates to the level screen (placeholder for now).
  Why now: Completes the map → level list → level navigation flow. LevelList reads progress for stars/locks.
  PRD ref: `prd.md > The Core Journey` (steps 2-3), `prd.md > Screens and Layout` #2-3
  Spec ref: `spec.md > Components` (StoryScreen, LevelList), `spec.md > Data Model` (progress shape), `spec.md > File Structure`
  Build: Create `src/app/story/page.tsx` with StoryScreen reading from i18n. Create `src/app/play/[world]/page.tsx` with LevelList reading progress from localStorage (ProgressStore). Add ProgressStore module (`src/lib/progress.ts`) with localStorage read/write, default fresh state. Add route for level screen `src/app/play/[world]/[level]/page.tsx` (placeholder). Wire navigation from MapScreen.
  Verify (mechanical): Click book button — story opens with text. Click Colors planet — level list shows 5 levels with stars, first unlocked. Click level 1 — navigates to placeholder level screen. Refresh — stars/locks persist.
  Learner check: Walk the path: map → story → back → map → Colors → level list → level 1. Does the flow feel natural? Are hit targets large enough?
  Commit: `Add StoryScreen, LevelList, and ProgressStore`

- [x] **3. LevelScreen core — editor, live preview, reference overlay**
  Becomes usable: Level screen shows three zones side by side: TaskZone (story sentence), CssEditor (CodeMirror with CSS syntax highlighting), PlayfieldPreview (iframe srcdoc with task HTML + child's CSS + semi-transparent reference layer). Preview updates on every keystroke.
  Why now: This is the unique kernel — real CSS editing with live preview. The spec's core journey centers here. TaskLoader fetches task.html and task.json.
  PRD ref: `prd.md > The Core Journey` (steps 3-4), `prd.md > The editor`, `prd.md > Live preview and reference`
  Spec ref: `spec.md > Components` (LevelScreen, TaskZone, CssEditor, PlayfieldPreview, TaskLoader), `spec.md > Data Model` (task content), `spec.md > File Structure` (public/tasks/)
  Build: Create `src/lib/taskLoader.ts` fetching task.json and task.html, assembling playfield string (task.html + child CSS). Create CssEditor with CodeMirror 6 (CSS language, no throw on invalid). Create PlayfieldPreview with iframe srcdoc, reference overlay via second semi-transparent layer. Create TaskZone rendering story sentence from task.json/i18n. Create LevelScreen composing three zones. Add placeholder tasks in `public/tasks/colors/01-what-color.html` and `.json` (minimal: ball, tree, rock SVG placeholders, expect color property).
  Verify (mechanical): Open level 1 — three zones render. Type `color: red` in editor — preview updates live, ball turns red. Reference overlay visible semi-transparently.
  Learner check: Type a color value, watch the ball change immediately. Try a bad value — does the preview handle it gracefully? Is the reference overlay helpful for comparison?
  Commit: `Add LevelScreen with live editor and preview`

- [ ] **4. Check button + two-part validation + stars**
  Becomes usable: Check button runs validation: compares child's applied property against task's expected property (by meaning), compares computed value in pixels/rgb against expected. Three outcomes: success (stars, celebrate, next task), right look/wrong property (encourage, name correct property, no star cost, stay), wrong look (hint, spend attempt). Star table: 3 stars for 1-2 attempts, 2 for 3-4, 1 for 5-6, 0 for 7+.
  Why now: The checking logic is the second half of the kernel — it teaches *which* property, not just the look. Stars give visible reward.
  PRD ref: `prd.md > The Core Journey` (step 5), `prd.md > Check and result`, `prd.md > Stars`
  Spec ref: `spec.md > Components` (CheckButton, checker.ts), `spec.md > Data Model` (expect.mode: px/rgb), `spec.md > Important Failure Modes`
  Build: Create `src/lib/checker.ts` with two-part check: read computed style from iframe.contentDocument, compare property name, compare value per mode (px tolerance, rgb tolerance). Create CheckButton triggering check, showing result modal/message. Create stars.ts with star table. Wire into LevelScreen: on success — award stars, save progress, navigate to next task. On right-look-wrong-property — show encouraging message with correct property name, no attempt spent. On wrong — show hint, increment attempts.
  Verify (mechanical): In level 1 (expects `color`), type `color: lime` → success, 3 stars, advances. Type `background-color: lime` → encouraging message "you got the look... but property is color", no star cost, stays. Type `color: blue` → hint, attempt spent. Check star count matches table.
  Learner check: Play through level 1: succeed on first try → 3 stars. Fail intentionally → see hint. Get right look with wrong property → see encouraging correction. Does the feedback feel warm, not scolding?
  Commit: `Add check validation, star logic, and task advancement`

- [ ] **5. Hint ladder + progress persistence across sessions**
  Becomes usable: After failed check, hint ladder appears: 1) guiding words, 2) blurred answer (click to reveal), 3) ready-made solution (fills answer, 0 stars, level completes). Progress saves to localStorage at task/level boundaries — survives browser restart. Replay replaces previous stars.
  Why now: Completes the child's safety net (never stuck) and makes progress real. localStorage is the only persistence.
  PRD ref: `prd.md > Hints, in stages`, `prd.md > Progress`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components` (HintLadder, ProgressStore), `spec.md > Data Model` (progress JSON, hints in task.json), `spec.md > Important Failure Modes`
  Build: Add hint keys to task.json, hint texts to i18n dictionaries. Create HintLadder component with three steps, wired to CheckButton. Extend ProgressStore to write on task completion, level completion, language change. Ensure mid-task input not saved (tab close restarts task). Replay logic: re-entering completed level resets its star count.
  Verify (mechanical): Fail check → see hint 1. Click blurred → see hint 2. Click ready-made → answer fills, 0 stars awarded, level marked complete, next level unlocks. Close browser, reopen — progress intact. Replay level → previous stars replaced.
  Learner check: Get stuck on a level, climb the hint ladder to the ready-made solution. Restart browser — are your stars and unlocked levels still there? Replay a level — does it reset honestly?
  Commit: `Add hint ladder and localStorage progress persistence`

- [ ] **6. All 10 tasks — Colors (5) + Sizes (5) with scaffolding progression**
  Becomes usable: All 10 tasks playable with correct scaffolding: tasks 1-2 property given, tasks 3-4 basket pick, task 5 combination. Each has task.html (playfield with SVG objects), task.json (expect, basket, hints, solution). Colors: color, background-color, border-color, then combination. Sizes: width, height, border-radius, then combination.
  Why now: The content is the game. Scaffolding progression is the teaching method.
  PRD ref: `prd.md > Task progression within a world`, `prd.md > What We're Building` (10 tasks)
  Spec ref: `spec.md > File Structure` (public/tasks/colors/, sizes/), `spec.md > Data Model` (task.json fields), `spec.md > What Was Simplified` (SVG assets)
  Build: Create 5 task.html + task.json pairs in `public/tasks/colors/` and 5 in `public/tasks/sizes/`. Create SVG assets in `public/assets/` (ball.svg, tree.svg, rock.svg, rocket.svg, planet SVGs). Each task.html includes base CSS (untouchable scene styles) and markup. Each task.json has expect (property, mode, value), givesProperty/givesValue for scaffolding stage, basket (5-6 jumbled properties), solution, hint keys. Wire givesProperty/givesValue into CssEditor (pre-fill or empty), basket into PropertyBasket.
  Verify (mechanical): Play through all 10 tasks in order. Confirm scaffolding: tasks 1-2 pre-fill property, 3-4 require basket drag, 5 combines. Each check validates correctly. Stars award per table. World 2 unlocks after world 1 task 5.
  Learner check: Play through Colors world completely, then Sizes. Does the scaffolding feel like it builds naturally? Are the task sentences clear for a 7-year-old? Are the SVG objects recognizable?
  Commit: `Add all 10 tasks with scaffolding progression and SVG assets`

- [ ] **7. Language switcher (EN/RU) — global, persists**
  Becomes usable: Language switch in layout corner toggles all child-facing text (map, story, level list, task sentences, hints, buttons) between English and Russian. CSS property names and values stay English. Choice persists in localStorage.
  Why now: Bilingual from day one per PRD. Global switch on every screen.
  PRD ref: `prd.md > Product Decisions` (EN/RU dictionaries, CSS stays English), `prd.md > Screens and Layout` (switch on every screen)
  Spec ref: `spec.md > Components` (i18n setup), `spec.md > Data Model` (lang in progress), `spec.md > Look and Feel`
  Build: Ensure all child-facing strings in en.json/ru.json (map, story, level list, task sentences, hints, check button, hint ladder, stars celebration). Wire language switch in layout to i18next, persist to ProgressStore. Verify no CSS property names/values in dictionaries.
  Verify (mechanical): Toggle language on map → all text switches. Navigate to story, level list, level — all text in selected language. Type CSS in editor — property names/values remain English. Restart — language persists.
  Learner check: Switch to Russian — does the game feel natural in both languages? Is the CSS editor still English (as intended)?
  Commit: `Add global EN/RU language switch with persistence`

- [ ] **8. Polish, edge cases, final review prep**
  Becomes usable: Celebration animation on success, rocket trail extends on world unlock, 0-star completion shown correctly, locked states visually clear, error handling for missing task files, corrupt localStorage fallback, blank preview message. All screens match Look and Feel (bright colors, large type, rounded friendly density).
  Why now: Polish makes it a shippable PoC. Edge cases prevent crashes during demo.
  PRD ref: `prd.md > Look and Feel`, `prd.md > States and Boundaries`, `prd.md > Important Failure Modes`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Important Failure Modes`, `spec.md > Components` (all)
  Build: Add celebration feedback (brief, bright). Extend rocket trail on world unlock. Style locked planets/levels with padlock + dim. Add fetch error UI for missing task files. Add localStorage corrupt fallback. Add blank preview detection. Apply Tailwind styles for bright saturated space theme, large rounded typography, generous spacing. Verify no Tailwind leaks into playfields.
  Verify (mechanical): Complete both worlds — rocket trail extends. Lock states correct. Corrupt localStorage → fresh start. Missing task file → retry button. Playfields use only plain CSS.
  Learner check: Play the full game start to finish. Does it feel complete and polished? Any rough edges a 7-year-old would hit?
  Commit: `Polish UI, handle edge cases, final visual pass`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 3 (core kernel working: editor + preview + check)
- [ ] Final kick-the-tires exploration and feedback completed — after slice 8

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions

- **The game is now called Codenaut.** The learner renamed it during the build. This made the old premise obsolete rather than just cosmetically renamed: the hero was a ball travelling to become round, which is why the game was called Round Ball, and the hero is now the player. Rewrote the story in both languages around the new premise — a navigator of code whose ship can only land on a planet whose code is in order, so the map, the stars and the level unlock are all one idea instead of a wrapper. The story is now second person with a personalized greeting line, rather than a third-person narrative about a named character.
- **Storage key renamed `roundball.progress.v1` → `codenaut.progress.v1`, which clears existing local progress.** Deliberate: the tasks, story and name screen all changed, so a stale progress file with an old task list would be wrong. No real players yet.
- **Language switch and story link moved into `layout.tsx`.** Raised by the learner. The PRD required the switch on every screen, but only the map had it — each screen would have had to remember. `AppHeader` is mounted once in the layout, so a new screen cannot forget it, and the map's own copy is gone. Screens that have something in the top-right corner (map title, star total, story text) got right padding so the fixed header does not sit on top of them.
- **Level layout changed to 40/60 with the task moved to a bottom bar.** Raised by the learner at the slice-3 hands-on check. Editor and preview are now two columns (`lg:grid-cols-5`, 2 and 3), and the task text runs along the bottom as a speech block with the hero drawn as the narrator. The original three equal columns gave the preview only a third of the screen, which is the thing the child actually needs to judge.
- **Tasks now explain the method, not just the goal.** `intro` (one vague sentence) is replaced by `teachTitle` / `teachBody` / `example` per task, so the child is told what the property does and what the syntax looks like before being asked to use it. `example` deliberately shows a *wrong* value (`background-color: blue`) — it teaches the shape of the answer without giving it away.
- **`useProgress()` hook replaces per-screen progress effects.** The name screen flashed for players who already had a name. `useProgress` exposes `ready`, and screens show a loader until `localStorage` has actually been read; `refresh` re-reads after a write. Applied to the home gate, map, level list and story screen.
- **Editor font raised to 1.35rem with increased line height** via a CodeMirror `EditorView` theme, and the editor grows to fill its column. The audience reads at 7; a developer-sized editor is not readable for them.
- **The reference is now a cursor-following wipe, not a permanent overlay.** Raised by the learner at the slice-3 hands-on check, the CSS Battle pattern: the reference iframe is full size and clipped with `clip-path: inset(0 X% 0 0)` where X follows the pointer, so the child sees their result on the left and the target on the right, split exactly under the cursor, with a yellow divider. The earlier always-on 40%-opacity overlay was hard to read against a bright playfield and hid the child's own result. Position is written directly to the node via a ref — routing it through state would re-render the whole level screen on every mouse move.

- **Task 1 is now `background-color` on the ball, not `color` on the text.** Raised by the learner. Two reasons it is better than the original: a child changes an object rather than a word, and a grey ball can be seen and named, which the grey `#3a3226` text was not. The playfield also dropped the card — the ball now sits directly on the ground with the hero beside it, so the scene reads as a scene and not as a UI mock. `background-color` still teaches the base concept (paint the inside of a shape) and stays the first property in the Colors order, so the world's progression is unaffected. Files renamed `01-what-color` → `01-ball-color` so the slug matches what it teaches.
- **The player became the hero, and their name is entered at the start.** Raised by the learner at the slice-3 hands-on check. Previously the ball was the hero and tasks were addressed to a named third party ("Vasya"). Now there is no separate cast: the name entered on the first screen is the character's name, it is required with no skip and no default, and every task text interpolates it. The hero stands on the playfield beside the scene — deliberately outside the task's `selector`, so a `color` task never repaints him instead of the target. `prd.md > Open Questions` and `spec.md > Components > NameEntry` updated in the same pass. Deferring "the player as the positioned element" to the spacing world is now recorded in `prd.md > Deferred From the POC`.
- The name screen is a gate inside `src/app/page.tsx` rather than its own route: no saved name renders `NameEntry`, otherwise the map. This avoids a redirect flash and keeps `/` as the one entry point.

- The book button links to a real `/story` route added in slice 1 rather than a modal in slice 2 — a dead link on the first working screen is a broken project, and the spec already puts StoryScreen at its own route. The slice-2 StoryScreen work is now just text/asset refinement of what exists.
- Stack pinned to Next 15.5 / React 19.3 / react-i18next 15 / Tailwind 4 rather than the exact versions the spec named — the spec flagged these as unverified, and react-i18next 14 is React-19-only while 13 breaks on React 19. Tailwind 4 also needs `@tailwindcss/postcss` as the PostCSS plugin, not `tailwindcss` + `autoprefixer` directly.
- Level/task identity in `progress.ts` is keyed `world/NN` plus task id rather than the spec's `colors/01-what-color` for the `unlocked.levels` list, because level unlock is a list position and not a file name. Task ids in `tasks` stay full slugs.
- The original `awardStars()` parsed the level number out of the task slug with a chain of `.replace()` calls — it broke on any new level name. Replaced with `recordTaskSuccess()` plus separate `unlockLevel()` / `unlockWorld()`, driven by the level list in `src/lib/worlds.ts`, which is now the single source of truth for world and level ids.
- `MapScreen` and `LevelList` render progress from a default state during SSR instead of a "Loading…" placeholder — `localStorage` is unavailable on the server, and a blank screen on the core navigation path is worse than a brief default state. A returning player's real progress is applied in an effect immediately after hydration.
- The first fix for the blank SSR screen caused a hydration mismatch: the initializer read `localStorage` on the client but the default on the server, so the two rendered differently. Both components now use `defaultProgress` as the initial value on server *and* client, and the stored progress is applied in `useEffect`. A returning player sees a brief default state rather than a mismatch.
- Never run `npm run build` while `npm run dev` is running — both write to `.next`, and the dev bundler fails with `Could not find the module ... in the React Client Manifest`. If it happens, delete `.next` and restart the dev server. Production build was verified separately.
- The spec's playfield assembly (`task.html + child's CSS`) produces invalid CSS, because the child types declarations (`color: lime`), and a bare declaration outside a rule is dropped by the browser — the preview would silently never change. Added a `selector` field to `task.json`; `wrapDeclarations()` wraps bare declarations in that selector and passes anything already containing a block through untouched. Verified against 6 cases including `$&` sequences, which `String.replace` would otherwise treat as substitution patterns.
- The reference target is a second iframe stacked on top of the live one at 40% opacity rather than an element inside the playfield — it reuses the same task html with the solution CSS applied, so it needs no per-task authoring and can never drift from the live preview.