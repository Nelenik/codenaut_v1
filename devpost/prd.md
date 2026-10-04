---
doc: prd
status: approved
---

# Codenaut — Product Requirements

A browser game that teaches CSS to children aged 7–9 by having them write real properties in a code editor and see the result immediately. Two worlds, five tasks each.
Source: `scope.md > Initial Idea`, `scope.md > The Unique Kernel`.

## The Core Journey

1. The child opens the app and is asked for their **name**. It is required — there is no skip and no default. The name is the character's name and is used in every task from then on.
2. The child is taken to a **map of planets in space**. Two worlds exist — Colors and Sizes. The first is open and lit; the second is dimmed and locked with a padlock. A rocket trail connects the planets.
3. The child clicks the first planet. The map re-renders with the five levels of that world listed, each showing a number and its stars. The first level is available; the rest are locked.
4. The child clicks an available level. Three zones appear side by side: the **task** (one short story sentence plus a small hint icon), the **editor**, and the **preview** with the reference target laid over it semi-transparently. **The child character stands on the playfield in every task**, watching from the side of the scene.
5. The child types or drags CSS into the editor. The preview updates live with every keystroke — no confirmation needed to see the effect. The semi-transparent reference stays on top for comparison.
6. The child presses **Check**.
   - **Right property, right effect** → success, stars awarded, celebration, move to the next task.
   - **Right effect, wrong property** → encouragement first ("great, you got the look you wanted"), then the correct property is named. **No attempt is spent** and the task is **not** completed — the child stays in it and tries again.
   - **Wrong effect** → a hint pointing at what needs changing. An attempt is spent.
7. After task five of a world, the next planet lights up and the rocket trail extends.
8. The child returns to the map or re-enters a completed level to improve their stars.

Success in one line: a child who has never written CSS changes an object's appearance by typing a real property, and the game confirms *which* property was right.

## Screens and Layout

**0. Name entry (first screen).**
Opened on the very first visit. Asks for the child's name and nothing else. The name is required — there is no skip and no default name, because the name is the character's name and an empty one would break every task text. Saved with the rest of the progress, so it is asked once.

**1. Map of planets (first screen after the name).**
Space background. Planets in sequence, connected by a dashed rocket trail. Open planets are bright and clickable; locked ones are semi-transparent with a padlock. A **book button** opens a story/about screen.

**2. Story / about.**
Reachable by the book button on the map. Holds the framing story and a short explanation of the game and its worlds. A close control returns to the map.

**3. Level list.**
Opened from a planet. Five rows, each with a level number and its stars (0–3). Locked rows are dimmed with a padlock. Star totals shown per world.

**4. Level screen.** Three zones side by side, left to right:
- **Task** — one short story sentence, plus, the first time a property appears, a short explanation of what it does. A small hint icon is **not** in the MVP.
- **Editor** — the CSS field(s) to fill. The child types or drags a property in from the basket. Near the editor, a **basket** of jumbled CSS property names.
- **Preview** — the live result, with the reference target rendered semi-transparently on top.

A language switch (EN/RU) sits in a corner and is present on every screen. A check button, and a way back to the level list.

## Look and Feel

- **Bright, saturated colors.** Not muted, not pastel.
- **A playful but legible children's font**, with lettering kept as large as practical — the target audience reads at 7.
- Space-map framing: planets, a rocket trail, stars.
- Friendly and upbeat. A mistake hints, it never scolds.
- No walls of text anywhere: one short sentence per task.
- **Avoid:** the generic AI-app look — gray background, blue primary button, system sans-serif, neutral shadows.

## Features and Behavior

### The map

- Worlds light up and lock based on completion. The rocket trail shows the path between them.
- A book button opens the story/about screen.
- The language switch is global and present on every screen.

### Level list

- Five levels per world, each showing a number and 0–3 stars.
- The next available level is highlighted; the rest are locked with a padlock.
- Completed levels can be re-entered to improve stars. A replay **replaces** the previous run's star count rather than keeping the best — but the replacement happens when the child writes something and presses **Check**, not when they merely open the level. Opening a completed level, or pressing Check with nothing written, leaves the previous result untouched, so a score never disappears just for being looked at.

### The editor

- A CSS field with the property name already written in, in the easiest tasks; in harder tasks the field is empty or must receive a dragged property.
- Typing is always available, even where a drag is suggested.
- The child can drag a property name from the basket and drop it into the field. Only the property is draggable; the value is typed or completed in full.
- CSS property names and values are always in English, in both language modes.

### Live preview and reference

- The preview re-renders on every keystroke with no delay and no confirmation step — this is what makes the game feel responsive.
- The reference target is overlaid semi-transparently on top of the live preview so the child compares rather than guesses.
- The property name may be pre-filled (easy tasks) or must be supplied (harder tasks).

### Check and result

- A **Check** button ends the attempt. This is how the child says "I'm done" and how an attempt is counted.
- **Result judged in two parts:**
  - *Property* — checked against the meaning of the task. "Move the rock away from the tree" means `margin`; "free up space around the tree" means `padding`. The right look achieved by the wrong property does not pass.
  - *Value* — accepted in any unit or form that produces the required result. `1.25em` where `20px` was expected passes and is praised as a bonus.
- **Success** → celebration and stars awarded, then two buttons: on to the next task, or back to the level list.
- **Right look, wrong property** → "you got the look you wanted — well done — but the property to use here is X". Encouraging, but no success and an attempt is spent.
- **Wrong look** → a hint pointing at what to change. An attempt is spent.

### Stars

An attempt is one press of **Check** that doesn't succeed. Three stars are the ceiling, not a requirement:

| When success comes | Stars |
|---|---|
| Attempts 1–2 | 3 |
| Attempts 3–4 | 2 |
| Attempts 5–6 | 1 |
| Attempt 7 or later | 0 |
| The child opened the ready-made solution | 0 |

A level with 0 stars still counts as **completed** and unlocks the next one. The child can return and replay; the new run replaces the previous star count. Asking for the ready-made solution **does not** count as an attempt — it is a separate action, not a failed Check.

### Hints, in stages

Hints are not a separate feature — they are part of how a task is authored. When a property appears for the first time, the task that introduces it explains how it works. Later tasks in the same or another world reuse what the child has already learned as hints.

After a failed Check, the child gets a ladder, as deep as it goes:

1. A **guiding hint in words** — pointing at what to change or recalling what was learned. Example: the child has already learned that `margin` pushes an object away from its neighbour, so the hint says "this is the one that moves the ball away".
2. A **blurred answer** — the shape of the answer is visible, the characters are not. The child can click to reveal it.
3. The **ready-made solution** — fills in the answer. All stars for that level are lost, and it still counts as completed.

A child must never be stuck with no way forward.

### Task progression within a world

The scaffolding builds within the level, and the topic is recombined at the end:

- **Tasks 1–2** — the property name is given; the child types only the value.
- **Tasks 3–4** — the property is chosen from the basket (5–6 jumbled properties), each carrying its value: the only question left is *which* property does this job. A property that is already in the editor is not offered again and comes back when it is taken out.
- **Task 5** — a combination: several properties at once, using what was learned in tasks 1–4. The task names what the scene needs, so the child uses the properties they have already met rather than searching for new ones. All of the required properties must be correct for the task to pass — a combination task is not a free choice, it is the same rule applied twice.

Colors covers background, text color, and border, learned in that order and then combined — background first, because a painted shape is the easiest thing in CSS to point at and to see change. Sizes covers width, height, and `border-radius`.

### Progress

- Stars, completion, and locked/unlocked worlds live in `localStorage` and survive a browser restart.
- Progress is saved at task boundaries (a completed task, a completed level).
- If the tab is closed mid-task, that task starts from the beginning on return. The completed tasks before it are kept.
- There is no backend and no account. Progress is per browser, per device.

## States and Boundaries

- **First use** — only the first planet is open; the story screen is reachable from the map.
- **Locked world / locked level** — dimmed with a padlock, not clickable. No explanation screen; the visual is the message.
- **In-progress task** — the editor holds whatever was typed; nothing is saved.
- **Success** — stars and a celebration, then straight on to the next task.
- **Failed check** — a hint; the child's input stays in the editor so they can fix it in place. Attempts so far are already spent.
- **Completed level, 0 stars** — shown as completed with 0 stars, not as locked.
- **Language** — EN is the default; the choice persists.
- **Boundary** — nothing in the UI is a parent-only or teacher-only surface. An adult may sit alongside, but has no separate account or view.
- **Boundary** — the child cannot enter free-form CSS. Every task is bounded by what that task teaches, with a checkable intended result. Only the properties the task is about are editable; other properties stay visible in the playfield but cannot be changed, so the child sees them and learns they're there without being able to break the task. Free play — a sandbox with nothing to achieve — belongs on **bonus levels** that appear only once enough properties have been learned, never in the early levels.

## Product Decisions

- **No Scratch-style blocks, no abstraction layer.** Real CSS is on screen at all times. Reason: the child must memorize the properties and understand what they do, which blocks would hide.
- **Property checked by meaning, value accepted in any unit.** Reason: the goal is *when* to use a property, not recalling a particular number. A child who writes `1.25em` is demonstrating understanding and is praised.
- **An explicit Check button, with a live preview underneath.** Reason: with no button, a half-typed property can look finished, and the child has no way to say "I'm done". A live preview keeps the immediacy; the button makes attempts countable and the result unambiguous.
- **Errors lower stars instead of blocking.** A level with 0 stars still counts as completed. Reason: a 7-year-old who can't get 3 stars should still be able to move forward.
- **Getting the right look with the wrong property is free but doesn't complete the task.** No attempt is spent, and the child stays in the task. Reason: the result is genuinely worth praising, and charging for it would punish an attempt that shows real understanding — but accepting it as success would teach that any visual trick counts, which is exactly what the game is trying to prevent.
- **After a success the child chooses what happens next.** Two buttons: on to the next task, or back to the level list. Reason: the child who finished the last task of a world has no next task to go to, so a single "next" button would be a lie on exactly the moment the game most wants to reward. Two buttons also let a child stop and admire the stars, or go back and look at what they have already unlocked.
- **Replay replaces the previous result rather than keeping the best.** Reason: keeps the star display honest and simple; the child's instinct is to want more, not to bank an old score. Timing matters more than the rule itself — see `prd.md > Level list`.
- **The world is a map of planets with a rocket trail.** Reason: something worth clicking for a 7-year-old, and the trail makes progress legible without words.
- **Bright colors, large playful but legible type.** Reason: the audience reads at 7 and the map has to compete with attention, not instruct it.
- **A story, reachable from the map.** Reason: gives the world a reason to exist without putting text in front of the child at every step.
- **Texts live in dictionaries from day one; EN default plus RU.** Reason: both languages are required, and retrofitting localization is far more work than starting with it.
- **CSS property names and values stay English in both languages.** Reason: they are the subject being learned, not translatable copy.
- **The child writes the tasks; no level generation.** Reason: the quality of the age-appropriate wording *is* the kernel, and it shouldn't be handed to generation.
- **Only 2 worlds.** Reason: three topics × five quality tasks doesn't fit 2–4 hours. Three half-built topics is worse than two complete ones. Spacing (margin/padding) is first to add after the MVP.

## What We're Building

- A map of planets, two of which light up in sequence, with a rocket trail and a book button.
- A name entry screen, asked once at the start, mandatory.
- A story/about screen.
- Level lists of five per world, numbered, with stars and locks.
- A level screen with three zones: task, editor with basket, live preview with a semi-transparent reference.
- Ten tasks across two worlds, with three stages of scaffolding and a recombination task at the end of each world.
- Two-part checking (property by meaning, value by effect), with two distinct kinds of failure message.
- A star table: 3 stars for success in 1–2 attempts, down to 0 after 6, with completion regardless.
- Replay that resets a level's stars.
- EN/RU localization with a global language switch.
- The player as the main character, present on every playfield.
- Progress in `localStorage`, surviving a browser restart.

## Deferred From the POC

- **The player as the positioned element.** In the MVP the child stands at the side of the scene watching, because the two MVP topics are colors and sizes — neither one moves anything on the playfield. The moment `margin`/`padding` arrive, the child *becomes* the thing being positioned, which is the natural payoff of the rock-and-tree example and the strongest possible framing for a spacing world. The level structure supports this: a task only needs to swap which element carries the `selector`.
- **A spacing world (margin/padding).** It's the most natural next world and everything about space rests on it, but it doesn't fit alongside two other topics in 2–4 hours.
- **A text world** — font, size, text color, alignment.
- **Age differentiation for 10–12.** Deferred by choice, but the level structure shouldn't hit a ceiling: it extends in layers rather than being rebuilt.
- **T9-style input assistance**, for keyboards where switching layouts is awkward.
- **Accounts and progress sync.** `localStorage` is enough to prove the idea; accounts would add a backend and a login screen that a 7-year-old must pass through before playing.
- **Own icons** for the basket instead of text characters.
- **Public deployment.** Optional per the hackathon; the demo runs locally.
- **Languages beyond EN/RU.**

## Possible Later Enhancements

- A spacing world covering `margin` and `padding` — the natural next step, and the pair that makes the rock-and-tree example work.
- A border world: `border`, `border-radius`, borders as decoration.
- A text world: `font-family`, `font-size`, `color`, `text-align`.
- Per-age task variants within an existing world, added as layers rather than as separate levels.
- Slightly harder combination tasks for older children in the existing worlds.
- Bonus levels: a free-play sandbox with no goal, unlocked only after enough properties have been learned, where every property is editable.
- Sound effects, with a mute.

## Non-Goals

- **A block-based or visual constructor.** The whole point is that CSS stays visible. Reason: it would remove the kernel.
- **Free-form CSS in the main levels.** Only the properties a task teaches are editable, and other properties are visible but locked. A sandbox with nothing to achieve is a different kind of task and is deferred to **bonus levels** that unlock only after enough properties have been learned. Reason: a child with three properties in hand has nothing to explore with, and an open editor with no goal has no way to know what's right.
- **Mobile support.** Three zones side by side need a large screen and a keyboard. Reason: doesn't affect validating the idea; addable later.
- **A parent or teacher dashboard.** Reason: no role was identified that needs it, and it doubles the surface area.
- **Autocomplete — a solution that fills itself in without the child asking.** Reason: devalues the stars and removes the reason to think. The child *can* ask for the ready-made solution, but only as the third step of the hint ladder, and it costs every star for the level.
- **Scolding or time pressure.** Reason: wrong turns hint and cost stars, which is enough.
- **Rewriting the child's CSS for them, or auto-fixing it.** Reason: the error is the lesson.

## Open Questions

- ~~**The character cast**~~ — **decided.** The main character is the player: a child, and the name entered at the start of the game is used everywhere — in every task text, in the story, and as the character shown on the playfield. There is no separate cast with its own names. Reason: the tasks are addressed to the player, and a personalised name is what makes the game feel like it is about this child rather than about a generic subject.
- **The story text** — what the book screen actually says. *Can wait; the wording is a writing task, not a design blocker.* The framing is now fixed in outline: the player is a child travelling between planets and fixing what went wrong, and the objects on each planet are the things they fix.
- The exact hint wording for each failure type — the wording matters for age-appropriateness, but it can be written during the build alongside the tasks themselves.

## Open Issues Raised in `4-spec`

- **How the correct value is verified.** Agreed: the system asks the browser what the property actually computed to, and compares that in pixels. It does not compare typed strings, so `1.25em` and `20px` are both accepted. Consequence: expected values are always authored in pixels, since that's the only unit both notations converge on.
- **Where task knowledge lives.** Two separate things, and they must not be mixed: the child-facing story text goes in the EN/RU dictionaries, and the machine-facing check (which property, how many pixels) sits in a short config per task and is never shown to the child.
