# Kaizo Dex

**Version 1.0.0 · Last updated 2026-07-22**

A planning companion for a hardcore nuzlocke run of **Pokémon Emerald Kaizo**.

**Live:** [willhoop.github.io/kaizodex](https://willhoop.github.io/kaizodex/)

---

## What it does

Emerald Kaizo gives every opponent a full team, a held item, and near-optimal battle AI. A nuzlocke
makes every loss permanent. The information needed to survive a fight exists, but it is spread
across a spreadsheet, four websites, and a shared drive.

Kaizo Dex puts it on one screen, before the fight.

- **450 trainers** — every one with exact levels, held items, natures, and all four moves
- **1,633 enemy Pokémon** across **376 species**
- **91 locations** with their wild encounter tables, split by method
- **216 documented changes** from vanilla Emerald: abilities, base stats, moves, TMs, evolutions
- **A run tracker** whose species list is filtered by what the route can actually give
- **An enemy AI section** documenting the turn loop and the switch logic, with the random branches
  labelled as random
- **Embedded community calculators**, because a generic Gen-3 calculator gives wrong answers here

---

## Run it locally

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

Do not open `index.html` by double-clicking it. The page fetches two JSON files, and a browser
blocks that from a `file://` page — the Trainers, Bosses, and Changes sections will be empty.

---

## Files

| File | It holds |
|---|---|
| `index.html` | Markup, styles, logic, encounter tables, level caps |
| `trainers.json` | 450 trainer records |
| `changes.json` | Five romhack change tables |

No build step. No server. No install. No account.

---

## Documentation

- **[White paper](docs/KAIZODEX-whitepaper.md)** — the data, the design decisions, the limitations,
  and how every number was verified
- **[Plain English deck](docs/KAIZODEX-deck-plain-english.md)** — thirteen slides, no jargon
- **[Technical docs](docs/KAIZODEX-technical-docs.md)** — how to run it, update it, and deploy it
- **[Changelog](CHANGELOG.md)**

---

## Known limitations

Stated up front, because a planning tool that overstates its reliability is worse than none.

1. The data is a snapshot of **one patch**. The romhack is updated; verify movesets in the
   calculator before a boss.
2. The run log lives in `localStorage`. Clearing browser data destroys it. **Export.**
3. The damage calculator is embedded from a community site. If that site is down or refuses framing,
   the panel is blank — use the open-in-new-tab link beside it.
4. The AI description is a model built from community documentation and play, not a disassembly.
   Several branches are random and are labelled as such.
5. The counts printed on the Start Here page were written by hand and do not match the shipped data.
   The verified counts are in the white paper, §3.

---

## Credits

Built on community work:

- **EK Dex** and **EK Damage Calculator** — anastarawneh
- **EKalc** — may8th1995
- **EK Move AI** — bpark16ek
- **Nuzlocke Lua script** — UnopenedClosure
- Sprites via **Pokémon Showdown**; Pokédex detail via **PokéAPI**

---

*A fan project. Not affiliated with Nintendo, Creatures Inc., or Game Freak. Ships no game files.*
