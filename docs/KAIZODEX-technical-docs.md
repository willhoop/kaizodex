# Kaizo Dex — Technical Documentation

**Version 1.0.0 · Last updated 2026-07-22**

*This document uses ASD-STE100 Simplified Technical English and is organised by Diátaxis:
tutorial, how-to, reference, explanation.*

---

# Tutorial — run it in one minute

You need a browser. You do not need Node, Python, or an install.

1. Get the three files: `index.html`, `trainers.json`, `changes.json`. Keep them in the same folder.
2. Start a local web server in that folder:

   ```
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000/`.

**Do not open `index.html` with a double click.** The page fetches the two JSON files. A browser
blocks `fetch` from a `file://` page, so the Trainers, Bosses, and Changes sections stay empty. A
local server is required.

The published copy is at `https://willhoop.github.io/kaizodex/`.

---

# How-to guides

## How to update the trainer data

1. Open `trainers.json`.
2. Find or add the record. Keep the shape exactly:

   ```json
   {
     "loc": "Rustboro Gym",
     "name": "Leader Roxanne",
     "cat": "Boss",
     "dbl": 0,
     "team": [
       { "species": "Nosepass", "g": "f", "lv": 15, "item": "Sitrus Berry",
         "nat": "Naughty", "moves": ["SELFDESTRUCT","Attract","Seismic Toss","Thunder Wave"] }
     ]
   }
   ```

3. Use the species name that Pokémon Showdown uses. The sprite function derives the image filename
   from this string. A wrong name gives a broken image.
4. Validate before you commit:

   ```
   python3 -c "import json;d=json.load(open('trainers.json'));print(len(d),'records')"
   ```

5. Reload the page and check the record in the **Trainers** section.

## How to add a boss to the Bosses section

The Bosses section is built at run time. It is not a separate list.

`buildBosses()` selects every record where `cat === "Boss"`, plus every record where `cat ===
"Evil"` **and** the name contains `Leader`. So:

- To make a trainer a boss, set `"cat": "Boss"`.
- To make an evil-team fight a boss, keep `"cat": "Evil"` and put `Leader` in the name.

The category shown in the interface is derived from the name: `Elite Four` in the name gives Elite
Four, `Champion` gives Champion, `cat === "Evil"` gives Evil Team, anything else gives Gym. The
level cap shown is the highest level on the team.

Optional threat text and a plan come from the `BOSSMETA` table in `index.html`. Without an entry
there, the section falls back to listing the team and telling the reader to open the Trainers tab.

## How to update the romhack change tables

Open `changes.json`. It holds five arrays. Match the shape of the existing rows:

| Key | Row shape |
|---|---|
| `abilities` | `{"m":"Venusaur","old":"Overgrow","new":"Chlorophyll/Overgrow"}` |
| `stats` | `{"m":"Ditto","k":[100,100,100,100,100,100],"note":"..."}` — `k` is HP, Atk, Def, SpA, SpD, Spe |
| `moves` | `{"name":"Drill Run","repl":"Horn Drill","type":"Ground","bp":"80","acc":"100%","eff":"High crit ratio"}` |
| `tms` | `{"tm":"TM01","move":"Focus Punch","note":""}` |
| `evos` | `"Pidgey->Pidgeotto:"` — a plain string, not an object |

`evos` is a string array while the others are object arrays. This is inconsistent and is recorded as
open work in the white paper.

## How to change the level caps

Edit the `CAPS` constant in `index.html`:

```js
const CAPS = [
  ["Roxanne","Rock",15], ["Brawly","Fighting",19], ["Wattson","Electric",29],
  ["Flannery","Fire",42,1], ...
];
```

The fields are: boss name, type, cap level, and an optional flag. The flag marks a large jump from
the previous cap, which the interface highlights — 29→42 at Flannery and 55→70 at Tate & Liza are
the two places runs stall.

## How to update the encounter tables

The `ENC` constant in `index.html` holds 91 locations:

```js
const ENC = [
  ["Littleroot Town", [
    ["Surf", "Squirtle 60, Totodile 30, Croconaw 5, Wartortle 5"],
    ["Old Rod", "Luvdisc 70, Goldeen 30"]
  ]],
  ...
];
```

Each location has a list of `[method, "Species rate, Species rate, ..."]` pairs. The recognised
methods are `Grass`, `Cave`, `Inside`, `Surf`, `Old Rod`, `Good Rod`, `Super Rod`.

**This table drives the run tracker.** `encSpeciesFor(route)` parses these strings to decide which
species the tracker will let a player log for that route. A change here changes the tracker.

## How to deploy

The repository root is the site root, so the published files are the source files.

1. Make the change in the local folder.
2. Run `publish.bat "what changed"` from `Projects\`.
3. Wait about a minute for GitHub Pages to rebuild.
4. Open `https://willhoop.github.io/kaizodex/` and press Ctrl+Shift+R.
5. Confirm the Trainers section is populated. An empty section means the JSON did not load.

---

# Reference

## Files

| File | Size | It holds |
|---|---|---|
| `index.html` | 112 kB | Markup, styles, logic, encounter tables, level caps, boss metadata |
| `trainers.json` | 247 kB | 450 trainer records |
| `changes.json` | 11.7 kB | Five romhack change tables |

## Sections

`overview`, `tracker`, `bosses`, `ai`, `pokedex`, `trainers`, `encounters`, `changes`, `calc`,
`tools`, `routing`, `caps`, `resources`.

Navigation is driven by the `tabs` array in `index.html`. Each entry is `[id, label]`.

## Persistent state

| Key | Store | Contents |
|---|---|---|
| `kaizodex_team` | `localStorage` | One entry per route: species and status |

Statuses: On Team, Boxed, Dead, Missed, Not logged.

There is no server and no account. Clearing browser data destroys the run log. Export first.

## External dependencies

| Service | Used for | Failure behaviour |
|---|---|---|
| `play.pokemonshowdown.com` | Sprite images | Broken image icons; text still readable |
| `pokeapi.co` (species 1–386) | Pokédex detail | Pokédex section stays empty |
| `calc.anastarawneh.com` | Damage calculator (iframe) | Blank panel; open-in-new-tab link works |
| `ekdex.anastarawneh.com` | EK Pokédex (iframe) | Blank panel; open-in-new-tab link works |

Every embedded panel has a labelled external link beside it, because a site can refuse to be framed
at any time.

## Key functions in `index.html`

| Function | It does |
|---|---|
| `sprite(name)` | Turns a species name into a Showdown sprite URL. Lowercases, maps `♀`/`♂` to `f`/`m`, strips punctuation, special-cases the Deoxys forms. |
| `buildBosses()` | Assembles the boss list from the trainer records at run time. |
| `encSpeciesFor(route)` | Returns the species a route can give. Drives the tracker's species filter. |
| `routeMons()` / `pickSpecies()` | Render the tracker's per-route controls. |
| `saveRun()` / `exportRun()` / `resetRun()` | Write, export, and clear `kaizodex_team`. |
| `renderTrainers()` / `renderBosses()` / `renderChanges()` / `renderEnc()` | Render their sections from the loaded data. |
| `initCalc()` / `calc()` / `statAt()` / `stageMult()` | Set up the calculator panel and its helpers. |
| `initDexMaps()` / `loadDexList()` / `renderDex()` / `renderDexDetail()` | The PokéAPI-backed Pokédex. |
| `toggleTeam()` / `saveTeam()` / `renderMyTeamBar()` | The team bar that carries a selection between sections. |

## Data counts, verified 2026-07-22

| Measure | Value |
|---|---|
| Trainer records | 450 |
| Enemy Pokémon | 1,633 |
| Distinct species used | 376 |
| Trainer locations | 65 |
| Encounter locations | 91 |
| Double battles | 68 |
| Boss-tagged records | 18 |
| Ability changes | 74 |
| Stat changes | 30 |
| New or replaced moves | 12 |
| TM changes | 50 |
| Evolution changes | 50 |

---

# Explanation

## Why there is no build step

The application is three static files. Adding a bundler would add a toolchain, a lockfile, and a
class of failure where the built output differs from the source. The cost of not having one is that
the encounter table and the level caps live inside a 112 kB HTML file instead of separate modules.

That trade is acceptable at this size and would stop being acceptable if the encounter data grew.
The natural next step, if it does, is to move `ENC` and `CAPS` into their own JSON files alongside
the two that already exist — not to add a framework.

## Why the calculator is embedded and not implemented

A generic Gen-3 damage calculator gives **wrong answers** for this romhack. 30 species have
rewritten base stats and 74 have different abilities. Damage depends on both.

Implementing a correct calculator means importing the romhack's full stat and ability tables and
then keeping that import correct across every future patch. The community calculators already carry
that data and are maintained by people who track the patches.

Embedding them keeps one source of truth. The cost is a live dependency on a third-party site, which
is why every panel has a visible fallback link and why the interface states that a blank panel means
the remote site refused to be framed.

## Why the tracker filters the species list by route

A free-text field accepts a typo and accepts a species the route cannot give. Both produce a run log
that is quietly wrong, and the log is the thing the player trusts to remember what happened forty
hours ago.

Because the encounter table is already in the file, the tracker can offer only the legal options.
The constraint is free. This is the same principle as a form that offers a date picker instead of a
text box.

## Why the AI section is written as prose and not as a table

The battle AI is a scoring loop with several branches that are roughly 50% random rolls. A table
implies determinism that does not exist.

The section therefore states the order of the checks, marks which ones are random, and ends with the
practical conclusion — bait a move, then bring in the answer. It tells the reader what is likely and
labels what is not, rather than presenting a decision table that would be wrong at the margin.

## Why `localStorage` and not an account

The run log is one player's private data about a single-player game. An account would require a
server, a password, and a privacy policy, for a benefit — sync across devices — that most players do
not need.

The cost is real: clearing browser data destroys the log, and the log does not follow the player to
another device. The Export button is the mitigation, and Import is listed as open work.

---

## Open work

| Item | Status |
|---|---|
| Record the romhack patch version in the data files | Open. The most important gap. |
| Derive the Start Here counts from the data rather than hand-writing them | Open. The stated counts disagree with the shipped files. |
| Import for the run log | Open. Export exists. |
| Normalise `changes.json` `evos` to objects like the other four tables | Open. |
| Move `ENC` and `CAPS` out of `index.html` into JSON | Open. Only worth doing if the data grows. |

---

*Kaizo Dex is a fan-made planning companion for Pokémon Emerald Kaizo. It is not affiliated with
Nintendo, Creatures Inc., or Game Freak, and it ships no game files.*
