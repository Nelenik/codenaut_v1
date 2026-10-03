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

- [x] **4. Check button + two-part validation + stars**
  Becomes usable: Check button runs validation: compares child's applied property against task's expected property (by meaning), compares computed value in pixels/rgb against expected. Three outcomes: success (stars, celebrate, next task), right look/wrong property (encourage, name correct property, no star cost, stay), wrong look (hint, spend attempt). Star table: 3 stars for 1-2 attempts, 2 for 3-4, 1 for 5-6, 0 for 7+.
  Why now: The checking logic is the second half of the kernel — it teaches *which* property, not just the look. Stars give visible reward.
  PRD ref: `prd.md > The Core Journey` (step 5), `prd.md > Check and result`, `prd.md > Stars`
  Spec ref: `spec.md > Components` (CheckButton, checker.ts), `spec.md > Data Model` (expect.mode: px/rgb), `spec.md > Important Failure Modes`
  Build: Create `src/lib/checker.ts` with two-part check: read computed style from iframe.contentDocument, compare property name, compare value per mode (px tolerance, rgb tolerance). Create CheckButton triggering check, showing result modal/message. Create stars.ts with star table. Wire into LevelScreen: on success — award stars, save progress, navigate to next task. On right-look-wrong-property — show encouraging message with correct property name, no attempt spent. On wrong — show hint, increment attempts.
  Verify (mechanical): In level 1 (expects `color`), type `color: lime` → success, 3 stars, advances. Type `background-color: lime` → encouraging message "you got the look... but property is color", no star cost, stays. Type `color: blue` → hint, attempt spent. Check star count matches table.
  Learner check: Play through level 1: succeed on first try → 3 stars. Fail intentionally → see hint. Get right look with wrong property → see encouraging correction. Does the feedback feel warm, not scolding?
  Commit: `Add check validation, star logic, and task advancement`

- [x] **5. Hint ladder + progress persistence across sessions**
  Becomes usable: After failed check, hint ladder appears: 1) guiding words, 2) blurred answer (click to reveal), 3) ready-made solution (fills answer, 0 stars, level completes). Progress saves to localStorage at task/level boundaries — survives browser restart. Replay replaces previous stars.
  Why now: Completes the child's safety net (never stuck) and makes progress real. localStorage is the only persistence.
  PRD ref: `prd.md > Hints, in stages`, `prd.md > Progress`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components` (HintLadder, ProgressStore), `spec.md > Data Model` (progress JSON, hints in task.json), `spec.md > Important Failure Modes`
  Build: Add hint keys to task.json, hint texts to i18n dictionaries. Create HintLadder component with three steps, wired to CheckButton. Extend ProgressStore to write on task completion, level completion, language change. Ensure mid-task input not saved (tab close restarts task). Replay logic: re-entering completed level resets its star count.
  Verify (mechanical): Fail check → see hint 1. Click blurred → see hint 2. Click ready-made → answer fills, 0 stars awarded, level marked complete, next level unlocks. Close browser, reopen — progress intact. Replay level → previous stars replaced.
  Learner check: Get stuck on a level, climb the hint ladder to the ready-made solution. Restart browser — are your stars and unlocked levels still there? Replay a level — does it reset honestly?
  Commit: `Add hint ladder and localStorage progress persistence`

- [x] **6. All 10 tasks — Colors (5) + Sizes (5) with scaffolding progression**
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

- **Task 5 is several named properties, all required — not a free choice.** Corrected by the learner: the PRD said "2–3 properties of the child's choosing", which would have made the last task of each world uncheckable. The task now names what the scene needs, and `check()` requires every entry in `expects`. `prd.md > Task progression within a world` and the two matching lines in `scope.md` were corrected in the same pass, and the Colors order in the PRD now says background first — it still said "text color, background, border" from before task 1 became `background-color`.
- **`expect` became `expects: []`, as predicted at slice 4.** `check()` now asks the question per expectation: "did the child write *this* property, and did it compute to the wanted value?" A combination task is the same rule applied three times, so all three must hold. An answer with the right value under a neighbouring property name is still the friendly `rightLookWrongProperty` outcome, naming the property the task wanted.
- **The `CHILD_CSS` marker was a promise no playfield kept.** `CHILD_CSS_MARKER` was `<!--CHILD_CSS-->`, an HTML comment, but every task file contains the CSS comment `/* CHILD_CSS */` inside its `<style>` block — so all ten tasks were silently using the `</style>` fallback in `assemblePlayfield()`. Found by the slice-6 verification script, which checks the marker the way the docstring describes. The constant is now the marker the files actually carry; the fallback stays as a safety net.
- **Hint text and the success sentence live in the dictionaries only.** `task.json` had a `hints` array of i18n keys that nothing read (the app reads `tasks.<id>.hints.0`), and `level.success` held "Great job! The ball is green." — one task's sentence in a shared key. Both fields are gone; hint text is `tasks.<id>.hints[0]` and each task owns `tasks.<id>.success`, in both languages.
- **`givesValue` is gone from `task.json`.** Nothing read it, the stage is already fully described by `givesProperty` (pre-filled editor) plus `basket` (pick it yourself), and its value on task 1 was the opposite of what happens there — the property is given, the value is typed.
- **Drag-and-drop needed the app to allow the drop.** CodeMirror 6 registers no `dragover` handler, so the browser refuses the drop before any handler runs. `CssEditor` cancels `dragover` on its wrapper, and handles `drop` in the capture phase so the editor's own drop handler cannot insert a second copy — one drop, one `property: `, inserted where the child dropped it, with a line break when it follows something else. Known limitation, chosen knowingly: HTML5 drag-and-drop does not fire on a touch screen, so the basket needs a mouse or trackpad.
- **Task 5 texts are written but the scenarios are placeholders.** Raised by the learner at the slice-6 review: the ten scenarios (ball, moon-base sign, night sky, school sign, badge, door, rocket, window, square planet, portal) exist so the world is playable end to end, and will be reworked later. The expected colours are all named CSS colours, so every answer stays reachable by a 7-year-old typing one word.

- **The onboarding's first screen is the story text itself, and the book no longer repeats it.** The story was being shown twice with slightly different surroundings, so `story.text` became onboarding screen 1 (`story.greeting` is its title) and the book is now just the replay button plus a one-line pointer. Shortened the story — it was the longest screen in the onboarding by a wide margin, which is wrong for a 7-year-old reading it once.
- **HTML and CSS are now characters: a builder and an artist.** `builder.svg` lays blocks, `artist.svg` holds a brush and palette. The metaphor replaces "makes the parts / changes how they look" because a role is something a 7-year-old already understands, and a role is what they will be doing — they are being handed the painter's job for the rest of the game.
- **Added a 4-step onboarding after the name, skippable and replayable from the book.** Raised by the learner, with the scenario worked out in detail: one idea per screen (welcome → HTML and CSS work together → a CSS command and its parts → the planets ahead), each with a visual example, and no real syntax beyond `color: blue;`. "Property" is deliberately not used as the primary word — the screen says `color` is "the name of the ability" and `blue` is "the value", which is the idea the child needs first; the real terminology arrives through the tasks. Lives at `/welcome`, gated on `onboardingDone`, so it runs once and never interrupts a returning child; the book screen has a button to replay it.
- **The whole hint ladder lives in one toast.** Raised by the learner: the guiding words were in the toast while the reveal and solution buttons sat in a separate block below, so a child had to work out that they belonged together. `HintLadder` is gone — `ResultToast` now carries the words, the blurred answer, "Show me" and "Use the ready-made answer", and the `showingHints` state went with it since the toast is already driven by the check result.
- **Hints live in the task's `hints` array only, and surface in a floating toast.** Raised by the learner: `level.hint1/hint2/hint3` were rendered from nowhere, did nothing, and duplicated the per-task hint text in two places. Removed those plus `starsAwarded`, `levelComplete`, `nextLevel`, `levelList.title/stars/locked` and `map.language`; a script confirmed EN and RU now have identical key sets and no duplicate keys. The hint ladder now holds only the two mechanisms (blurred answer, ready-made solution) — the first rung is the toast, so the same words never appear twice in two boxes. Result messages became `ResultToast`: warm amber, non-blocking, dismissible, and it stays until acted on rather than timing out.
- **Replay drops the previous stars when the child writes something and presses Check — not when they open the level.** Decided by the learner after I flagged that the PRD's original wording wiped a score just for entering a completed level. `prd.md > Level list` corrected in the same pass. "Wrote something" is measured with `parseDeclarations`, so the pre-filled `background-color: ` with no value counts as nothing typed; verified across prefilled, empty, whitespace and typed cases.
- **Success now offers two buttons instead of moving on automatically.** Raised by the learner. This overrides `prd.md > Check and result` ("no separate next click"), and the PRD was corrected in the same pass. The reason is solid: a child who finishes the *last* task of a world has no next task, so a single "next" button would be a lie at the exact moment the game most wants to reward. Two buttons — on to the next task, or back to the level list — also let the child stop and look at what they just unlocked.
- **Success unlocks the next level and moves on by itself.** `recordTaskSuccess` was being called without `unlockLevel`, so passing a task changed nothing. `nextLevel()` / `worldAfter()` in `worlds.ts` derive the next target from the level list, and completing `colors/05` lights up `sizes/01`.
- **Task targets must be authorable as a value a child can type.** The first version of task 1 expected `#00c85a`, and the verification showed a child writing `lime` would be refused — both are green. Expected colours are now named CSS colours (`green` = rgb(0,128,0)) and the teaching block names the colour, so the answer is reachable by a 7-year-old. Verified `lime` correctly fails against `green`: matching the *target* is the lesson, and the reference overlay is how the child sees which target.
- **`expect` covers one property, so combination tasks will need `expects: []`.** Recorded now, at slice 4, so slice 6 does not silently build five tasks against a shape that cannot hold them. `check()` already iterates over every declaration the child wrote and asks the browser what each one computed to, so only the config shape changes.
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