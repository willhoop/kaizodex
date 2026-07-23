# Changelog

**Version 1.0.0 · Last updated 2026-07-22**

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Rule.** Every change to the application is logged here in the same pass as the matching updates to
the white paper, the deck, and the technical documentation. A prior conclusion is never silently
rewritten; what changed and why is stated.

---

## [1.1.0] — 2026-07-22

### Added
- **Governance and delivery files** to meet the portfolio's public-company documentation bar:
  `LICENSE` (MIT), `SECURITY.md`, `CONTRIBUTING.md`, `.gitignore`, a GitHub Actions CI workflow, and
  `tests/test-data.js` (12 tests) validating `trainers.json` and `changes.json` and that the shipped
  HTML still references both.

---

## [1.0.0] — 2026-07-22

### Added
- **Documentation set**, versioned and dated, written from the shipped source rather than from
  memory of it.
  - `docs/KAIZODEX-whitepaper.md` — the data, the design decisions, the limitations, and the
    verification script that produces every count.
  - `docs/KAIZODEX-deck-plain-english.md` — 13 slides for a reader who has never played the game.
  - `docs/KAIZODEX-technical-docs.md` — ASD-STE100 Simplified Technical English, organised by
    Diátaxis: 1 tutorial, 6 how-to guides, a reference section, 5 explanations.
  - `README.md`, and this changelog.
- **The project joined the portfolio.** Its three documentation links previously rendered dimmed
  because the documents did not exist.
- **The project joined `publish.bat`.** It was published by hand before this; it now publishes with
  every other project.

### Documented, not changed
The application code is unchanged in this release. The following were found while reading the source
and are recorded rather than silently fixed:

- **The Start Here counts disagree with the shipped data.** The page states "345 rebalanced Pokémon
  · 67 locations · 37 boss battles". The files hold 91 encounter locations, 65 trainer locations,
  and 18 records tagged `Boss`. The boss gap has a partial explanation — the list is assembled at run
  time from `Boss` records plus every `Evil` record whose name contains "Leader" — but the numbers
  are hand-written and not derived. Recorded in white paper §3.4 and listed as open work.
- **No patch version is recorded anywhere in the data.** A reader cannot tell which release of the
  romhack the rosters came from. This is the largest gap in the project.
- **`changes.json` `evos` is an array of strings** while the other four tables are arrays of
  objects. Inconsistent; noted in the technical docs.

### Verified
Counted directly from the shipped files, not read off the interface:

| Measure | Value |
|---|---|
| Trainer records | 450 |
| Enemy Pokémon | 1,633 |
| Distinct species | 376 |
| Trainer locations | 65 |
| Encounter locations | 91 |
| Double battles | 68 |
| Documented romhack changes | 216 |

---

## Earlier

Versions before 1.0.0 predate this changelog. The application was built as a single HTML file with
two JSON data files and published to GitHub Pages without a documentation set.

[1.0.0]: https://github.com/willhoop/kaizodex
