---
doc: scope
status: approved
---

# Codenaut — a CSS practice game for 7–9 year olds

A web game where a 7–9 year old learns CSS by editing real properties in a code editor and seeing the result immediately.

## The Unique Kernel

In front of the child is **real CSS** — not blocks, not a visual constructor. Understanding comes not from explanation but from three levels of scaffolding inside each task: first the property name is given and only the value must be typed (`20px`); then from a "basket" of jumbled CSS properties the right one must be selected and its value completed; then both the property and the value must be chosen independently. The scaffolding accumulates across the topic, and within a level the learned things get combined into combinations (text color + background + border).

The second distinction: **the property is checked against the meaning of the task, the value is accepted in any form that produces the same result.** The task "move the rock away from the tree" is `margin`; "free up space around the tree" is `padding`. Writing `1.25em` instead of `20px` is scored and praised. This way the game teaches *application*, not answer-matching.

Unlike Scratch, where the logic is packaged into blocks and the child never sees what's underneath.

## Who It's For

A 7–9 year old who can read and has already tried to make something on the internet — but knows no CSS properties and has most likely never opened devtools. Today their option for "learn CSS" is someone else's half-page of text and an attempt to retype an example from scratch. They need someone nearby: shown things visually, given things to try, told why it worked.

An adult nearby — a parent or teacher — is expected but not given a separate role.

## The Core Loop

Opens a world → sees the level list with stars, locked and available levels → enters the available level → reads a short story-task, types or drags CSS into the editor → sees a live preview next to a semi-transparent reference → presses "check" → sees the object move or change color, and earns stars.

They come back because the world opens up in pieces and they want to reach the next one, and because stars are a visible reward for care rather than speed.

## Inspiration & Identity

The approach references interactive task sandboxes with a preview (in the spirit of HTML Academy's exercises), but with very little text: one short task sentence, one icon, minimal instructions. A 7–9 year old reads slowly and a wall of text breaks everything.

The world and characters suit the age: friendly, bright, without clever text-based jokes. The tone is warm and upbeat — a mistake isn't punished, it hints.

## Why This Matters to the Learner

Get an MVP of the idea done with an agent's help, **while keeping control over the code and the project.** After 1–2 iterations the agent starts driving rather than helping, and that needs to be overcome rather than accelerated. Every build step must stay small and legible so control isn't lost.

## What "Working" Looks Like

You open the app, see two worlds — "Colors" and "Sizes" — five tasks each, with star progress and some levels locked.

You enter a task: "Mom and dad gave Vasya a ball, but the seller mixed it up and sold a square ball. Make it round." The child sees what the task looks like, types CSS, and **immediately** sees the ball turn round in the preview, with the reference as a semi-transparent layer on top for comparison.

They press "check" — stars are awarded, progress is saved, and on return they see them in place. On the second visit, the first task of level two has jumbled properties in the basket again, and they have to pick the right one.

**The moment that shows "oh, it works":** in an advanced task the child has to color the background *and* the border *and* the text, and they do it themselves, with no hint about which property — because by task three they've already taken colors apart down to the last brushstroke.

## The POC Boundary

**In:**
- 2 worlds: "Colors" (5 tasks) and "Sizes" (5 tasks).
- Topic level, three levels of scaffolding: property given → pick the property from the basket → choose independently. Plus combinations of learned things at the end of the level.
- Three screen zones: the task, an editor with marked input fields and drag-and-drop from the basket, and a preview with a semi-transparent reference.
- Checking: the property against the meaning of the task, the value in any form that produces the same result. On a wrong property — a message with a hint about which is better.
- A reference target for each task.
- Progress: stars and level unlocking in `localStorage`.
- Original characters and world (no ready-made assets).
- **Bilingual: English (default) + Russian.** Texts go into dictionaries from the start rather than being translated afterwards. A language switcher. CSS property names and values stay English — that is part of the teaching, not translatable text.

**A starting task structure (a guideline, not a commitment):**
- Tasks 1–2: property given, type the value.
- Tasks 3–4: pick the property from the basket (5–6 jumbled properties), complete the value.
- Task 5: a combination — 2–3 properties of the child's choosing, using skills from tasks 1–4.

## Later

- Worlds for spacing (margin/padding — everything about space is built on them) and for borders (`border`, `border-radius`).
- A text world: font, size, text color, alignment.
- Difficulty differentiation by age (10–12) — deliberately deferred, but accounted for: a level shouldn't hit a ceiling, it's extended in layers.
- A T9-style input hint (for keyboards where switching layouts is awkward).
- Accounts and progress sync (for now only `localStorage`).
- Own icons instead of text-characters in the basket.

## Explicitly Cut

- **Backend, accounts, progress sync.** Need is to validate the idea in 2–4 hours; `localStorage` is enough. Reason: doesn't affect the kernel — what the child sees and what they learn.
- **Mobile adaptation.** The game is for a large screen with a keyboard, three zones side by side. Reason: doesn't affect idea validation in the MVP; can be added if the concept sticks.
- **Public deployment as a goal.** Deployment is optional per the hackathon, not part of the MVP.
- **A spacing world (margin/padding) as its own world.** The most tempting cut, since she named spacing as the first topic and everything about space rests on it. Reason: three topics with five quality tasks each don't fit in 2–4 hours, and three half-built topics is worse than two complete ones. Spacing is the first thing to add after the MVP.
- **Generating levels from a topic description.** Decided: she writes the tasks herself or together with an agent. Reason: the quality and age-appropriate wording of the texts *is* the kernel, and that shouldn't be handed to generation.
- **A "show me the answer" button with no stars.** Kept as a last-resort step of the hint ladder: the child can always get unstuck, at the cost of all stars for that level (0 stars, level still counts as completed). This is the one thing the star mechanic is allowed to give up — a 7-year-old stuck on task 3 of 5 with no way forward is a worse outcome than a child who learns by watching the answer once. What stays cut is *autocomplete* — a button that fills in the answer without the child choosing to ask for it.
- **Sticky audio, voice-overs.** Reason: doesn't affect the kernel.
- **Languages other than EN/RU.** Reason: EN and RU are the requirement; a third language isn't in scope for the MVP.
