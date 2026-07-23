# Kaizo Dex — the plain English version

**Version 1.0.0 · Last updated 2026-07-22**

Thirteen slides. No jargon. If you have never played a Pokémon game, you can still follow this.

---

## Slide 1 — The one sentence

**Kaizo Dex is a cheat sheet for a Pokémon game that is designed to be unfair, where losing is
permanent.**

---

## Slide 2 — The game

Pokémon Emerald Kaizo is a fan-made hard version of an official Pokémon game. Fans rebuilt it to be
brutal: every opponent has a full team instead of a partial one, almost every opponent carries an
item, hundreds of creatures have had their strengths rewritten, and the computer opponent plays
close to optimally.

---

## Slide 3 — The extra rules

On top of that, players impose a challenge format called a **nuzlocke**:

- If one of your creatures faints, **it is dead**. You cannot use it again.
- You get **one catch per area**. Miss it and that area gives you nothing, ever.
- You cannot exceed a level ceiling before each major fight.
- You cannot use healing items during a fight.

So the game is at its hardest and every mistake is permanent.

---

## Slide 4 — Why that is a planning problem

If you walk into a fight without knowing what is on the other side, you will lose creatures you
cannot replace. Sixty hours of a run can end in one turn.

The information you need exists. It is just scattered across a spreadsheet, four different websites,
and a shared folder.

---

## Slide 5 — What Kaizo Dex does

It puts the information for the fight you are about to have **on one screen, before you fight it**.

Open it and you can see the exact team the next boss has — every creature, its level, the item it is
holding, and all four of its attacks.

---

## Slide 6 — The numbers

- **450** opponents catalogued
- **1,633** individual enemy creatures, each with items, natures, and full movesets
- **376** different species used against you
- **91** areas with their catch tables
- **216** documented changes from the original game

---

## Slide 7 — The tracker

There is a page where you log what you caught in each area and whether it is alive, boxed, dead, or
missed.

One detail matters more than it sounds: **the app only lets you pick creatures that area can
actually give you.** It knows the catch table, so it filters the list. You cannot log something
impossible.

Your log is saved in your browser. Nobody else sees it. There is no account and no sign-up.

---

## Slide 8 — The part that actually wins fights

There is a whole section on **how the computer opponent thinks**.

The opponent is not random. It follows a scoring routine every turn, and the routine is known:

1. Can I kill you this turn? If yes, do that.
2. If not, what is my biggest hit against what you have out?
3. If you are not a threat, set up an advantage instead.
4. It also **predicts what you will swap to** and attacks that.

---

## Slide 9 — Why knowing that helps

If the opponent always takes a kill when it has one, then **never leave a creature in front of
something that can kill it**. That single rule saves runs.

And because the opponent predicts your swap, you can use that: send out something that invites a
predictable attack, then swap to the creature that shrugs that attack off. You are steering it, not
guessing.

---

## Slide 10 — The honest parts

- The data is from **one version** of the romhack. Fans update it. Some details drift.
- Your log lives in your browser. **Clear your browser data and it is gone.** Export it.
- The damage calculator is borrowed from the community, embedded in the page. If their site is down,
  that one panel does not work.
- The description of the opponent's thinking is a **model**, not a guarantee. Parts of it are random
  and the app says which parts.

---

## Slide 11 — Why the calculator is borrowed

Writing our own damage calculator would mean copying hundreds of rebalanced numbers and then keeping
that copy correct forever as the romhack updates.

The community already maintains one that is right. Using theirs is the honest choice, and the cost —
a dependency on someone else's site — is written down rather than hidden.

---

## Slide 12 — How it is built

One HTML file and two data files. No install, no server, no sign-up, no framework.

You open it and it runs. It works offline apart from the borrowed calculator and the pictures.

---

## Slide 13 — Where to go deeper

- **[White paper](KAIZODEX-whitepaper.md)** — the data, the design decisions, the limitations, and
  where every number came from.
- **[Technical docs](KAIZODEX-technical-docs.md)** — how to run it, the data shapes, and how to
  update it.

---

*Kaizo Dex is a fan project. It is not affiliated with Nintendo or Game Freak, and it contains no
game files.*
