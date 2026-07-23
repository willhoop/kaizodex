# Kaizo Dex — White Paper

**Version 1.0.0 · Last updated 2026-07-22**

*This document uses ASD-STE100 Simplified Technical English.*

---

## 1. What this is

Kaizo Dex is a planning companion for a hardcore nuzlocke run of **Pokémon Emerald Kaizo**, a
difficulty romhack of Pokémon Emerald. It is one HTML file with two JSON data files. It runs in a
browser with no server, no build step, and no install.

The application does not play the game and does not read the game's memory. It is a reference and a
planner. The player still fights every battle.

---

## 2. The problem

A nuzlocke adds two rules to a Pokémon game:

1. **Permadeath.** A Pokémon that faints is dead. The player boxes it or releases it.
2. **First encounter only.** The player catches one Pokémon on each route. A miss gives nothing.

A *hardcore* nuzlocke adds three more: a level cap tied to the next boss, SET battle mode (no free
preview of the opponent's switch), and no healing items during a battle.

Emerald Kaizo then changes the game underneath those rules:

| Vanilla Emerald | Emerald Kaizo |
|---|---|
| Gym leaders carry 2–4 Pokémon | Every boss carries a full 6 |
| Most trainers hold no items | Nearly every trainer holds an item |
| Base stats and abilities are the official ones | 345 species are rebalanced; abilities and movesets are changed |
| Basic battle AI | Every trainer runs the full "smart" AI flag set |

The combination is the problem. **A player who improvises loses Pokémon permanently.** The
information needed to avoid that — the exact enemy roster, the exact held items, the exact ability
after the romhack changed it — exists, but it is scattered across a community spreadsheet, four
separate web tools, and a shared drive folder.

Kaizo Dex is the answer to a narrow question: *can the planning information for one fight fit on one
screen, before the fight, with no tab switching?*

---

## 3. What the data actually contains

Every figure below was counted from the shipped files on 2026-07-22, not copied from the interface.

### 3.1 `trainers.json` — 247 kB

| Measure | Count |
|---|---|
| Trainer records | 450 |
| Locations covered | 65 |
| Individual enemy Pokémon | 1,633 |
| Distinct species used by trainers | 376 |
| Double battles | 68 |
| Records marked `Boss` | 18 |
| Records marked `Evil` (Magma / Aqua) | 84 |
| Records marked `Trainer` | 348 |

One record has this shape:

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

Every enemy Pokémon carries its **species, gender, level, held item, nature, and all four moves**.
This is the level of detail that makes a fight plannable. Roxanne is the first gym in the game; in
vanilla Emerald she has two Pokémon. Here she has six, and the lead holds a Sitrus Berry and knows
Selfdestruct.

### 3.2 `changes.json` — 11.7 kB

Five tables of what the romhack changed against vanilla Emerald:

| Table | Rows | It records |
|---|---|---|
| `abilities` | 74 | Old ability → new ability |
| `stats` | 30 | The six base stats, plus a note |
| `moves` | 12 | New moves, what they replaced, type, power, accuracy, effect |
| `tms` | 50 | The TM list, which is completely rewritten |
| `evos` | 50 | Changed evolution methods |

This table is not decoration. Vanilla knowledge is actively wrong in this romhack. Ditto is a
100/100/100/100/100/100 statline with Shadow Tag, which traps the player's Pokémon. A player who
treats Ditto as a joke loses a team member.

### 3.3 Encounter tables — held inside `index.html`

91 locations, each with its wild encounter table split by method: Grass, Cave, Inside, Surf, Old
Rod, Good Rod, Super Rod. Each entry carries the species and its encounter rate.

### 3.4 A known inconsistency

The **Start Here** page states "345 rebalanced Pokémon · 67 locations · 37 boss battles". The
shipped data holds 91 encounter locations, 65 trainer locations, and 18 records tagged `Boss`.

Two of those three gaps have an explanation. The boss list is assembled at run time from the `Boss`
records **plus** every `Evil` record whose name contains "Leader", so the count the interface shows
is higher than 18. The location counts differ because encounter locations and trainer locations are
different sets — a route can have wild Pokémon and no trainers.

The numbers in the prose are still not derived from the data. They are written by hand and they do
not agree with it. This is recorded here rather than quietly corrected, and it is listed as open
work in §7.

---

## 4. How the application is built

### 4.1 One file, three fetches

`index.html` is 112 kB. It holds the markup, the styles, the logic, and the 91-location encounter
table. At load it fetches `trainers.json` and `changes.json` from the same folder.

There is no framework. There is no bundler. The 13 sections are `<section>` elements; the navigation
sets a class. This is a deliberate trade: the whole application is one file a person can read, and
it cannot break because a dependency changed.

### 4.2 The thirteen sections

| Section | It answers |
|---|---|
| Start Here | What are the rules, and what am I in for |
| My Run | What did I catch on each route, and what is still alive |
| Bosses | What is the next boss carrying, and what is the plan |
| Enemy AI | What will the enemy click, and when will it switch |
| Pokédex | What are this Pokémon's stats and types |
| Trainers | What is the exact roster of any of the 450 trainers |
| Encounters | What can I catch here, and where does this species appear |
| Changes | What did the romhack change against vanilla |
| Dmg Calc | Does my attack kill, and does theirs kill me |
| EK Tools | The community tools, embedded |
| Routing | Which catches should I prioritise |
| Level Caps | What is my ceiling for the next fight |
| Resources | What do I set up before I start |

### 4.3 The run tracker

The tracker is the only part that holds the player's own data. It stores one row per route: the
species caught and its status — On Team, Boxed, Dead, Missed, or Not logged.

Its useful property is that **the species field is filtered by the route**. `encSpeciesFor(route)`
reads the encounter table and offers only the species that route can actually give. A player cannot
log a Pokémon they could not have caught there. The typo case and the misremembering case both
disappear.

State is saved to `localStorage` under the key `kaizodex_team`. There is no account and no server.
The data does not leave the browser. The consequence is stated plainly in §6.

### 4.4 The damage calculator and the enemy AI tool

Kaizo Dex does **not** implement Gen-3 damage. It embeds the community calculators — Ana's and
May's — and the Enemy Move AI tool in `<iframe>` elements, with a labelled "open in a new tab" link
beside each one for the case where the remote site refuses to be framed.

This is the correct decision and it is worth stating why. A generic Gen-3 calculator gives wrong
answers in this romhack, because the base stats and abilities differ. The community calculators
carry the romhack's real data and are maintained by people who track it patch by patch. Reproducing
that inside this application would create a second copy that goes stale.

The cost is real and it is accepted: the calculator is a remote dependency. If the site is down or
blocks framing, the panel is blank. The application says so in the interface rather than showing an
empty box.

### 4.5 Sprites and the Pokédex

Sprites are loaded from Pokémon Showdown by a name-to-filename function that lowercases the name,
maps `♀`/`♂` to `f`/`m`, strips punctuation, and special-cases the four Deoxys forms. Pokédex detail
is fetched from PokéAPI, limited to the first 386 species — the Gen-3 range, which is the correct
bound for this game.

Both are external services and both are read-only.

---

## 5. What the Enemy AI section is for

This is the part of the application with the most writing in it, and it is the part that changes
outcomes.

Emerald Kaizo runs the vanilla Emerald battle AI with **every "smart" flag enabled on every
trainer**. The AI is therefore predictable in a way that a random AI is not. The section documents
the loop it runs each turn:

- **Step 0 — Switch check.** This happens before move selection. If it switches, the player's move
  hits the incoming Pokémon.
- **Step 1 — Score every legal move from 100.**
- **Step 2 — Penalise bad moves.** Immunities, moves that fail, redundant stat drops, healing at
  full health.
- **Step 3 — Take a kill.** A lethal move gets a large bonus, and among lethal moves it prefers the
  faster one. *Never stay in front of a Pokémon that has a clean kill.*
- **Step 4 — Otherwise maximise damage,** reading the player's typing, including into the expected
  switch-in.
- **Step 5 — Set up when safe.** Spikes, weather, screens, Thunder Wave, Hypnosis.
- **Step 6 — Play the highest score.** Ties break randomly. This is the only real coin flip.

The switch logic is documented separately, in the order the checks run: trapped or last Pokémon,
walled with no damaging move, an ability on the bench that absorbs the expected move, and bad
matchup with a better answer available. Several of these are roughly 50% random rolls, so the
section says so instead of promising determinism.

The practical conclusion the section draws: because the AI predicts the switch-in, the player should
**bait a move with one Pokémon and bring the answer in on the move they forced**. That is steering
the AI rather than gambling against it.

---

## 6. Limitations

Stated plainly, because a planning tool that overstates its reliability is worse than no tool.

1. **The data is a snapshot of one patch.** Emerald Kaizo is updated. Movesets, abilities, and
   stats change between patches. The interface says "verify movesets in the calc — they change
   between patches", and that instruction is correct. This document does not claim the data matches
   any specific patch version, because the shipped files do not record one. See §7.
2. **`localStorage` is not a backup.** Clearing browser data destroys the run log. A different
   browser or a different device shows nothing. The Export button exists for this reason and should
   be used.
3. **The calculators are remote.** If the embedded site is down or refuses framing, that panel does
   not work. The open-in-new-tab links are the fallback.
4. **The AI description is a model, not the disassembly.** It is written from community
   documentation and play experience. Several branches are explicitly random. It tells the player
   what is likely, not what is certain.
5. **The counts in the Start Here prose do not match the shipped data.** See §3.4.
6. **This is a fan tool.** It is not affiliated with Nintendo or Game Freak. It ships no game data,
   no ROM, and no copyrighted asset — sprites are hot-linked to Showdown and dex text is fetched
   from PokéAPI.

---

## 7. Open work

| Item | Why it matters |
|---|---|
| Record the romhack patch version in the data files | A reader cannot currently tell which patch the rosters came from. This is the most important gap. |
| Derive the Start Here counts from the data | Removes the §3.4 inconsistency permanently instead of correcting it by hand. |
| Import for the run log | Export exists; a run cannot be moved back in, or to another device. |
| Verify the encounter tables against the current mastersheet | They are labelled "v2.0 data" in the interface with no date. |

---

## 8. Sources

The application is built on community work and says so in its own Resources section. The sources it
names and links:

1. **EK Dex** — anastarawneh. Kaizo-accurate Pokédex: stats, abilities, learnsets, locations.
   `https://ekdex.anastarawneh.com/`
2. **EK Damage Calculator** — anastarawneh. `https://calc.anastarawneh.com/hacks?game=2&gen=3`
3. **EKalc** — may8th1995. An alternate damage calculator.
4. **EK Move AI** — bpark16ek. Shows the move the enemy AI will select.
5. **Nuzlocke Lua script** — UnopenedClosure. mGBA and BizHawk conveniences.
6. **EK Resources drive folder** — the mastersheet, FAQ, moves, learnsets, and rival teams. The
   interface describes this as "the source docs this site is built from".
7. **Pokémon Showdown** — sprite images.
8. **PokéAPI** — Pokédex detail for species 1–386.

---

## 9. Verification

The figures in §3 were produced by counting the shipped files directly:

```python
import json, collections
t = json.load(open('trainers.json'))
len(t)                                          # 450 records
collections.Counter(x['cat'] for x in t)        # Boss 18, Evil 84, Trainer 348
len({x['loc'] for x in t})                      # 65 locations
sum(len(x['team']) for x in t)                  # 1633 Pokémon
len({m['species'] for x in t for m in x['team']})  # 376 species
sum(1 for x in t if x['dbl'])                   # 68 doubles
```

Anyone can re-run this against the repository and get the same numbers.

---

*Kaizo Dex is a fan-made planning companion for Pokémon Emerald Kaizo. It is not affiliated with
Nintendo, Creatures Inc., or Game Freak.*
