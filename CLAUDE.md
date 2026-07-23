# CLAUDE.md — KaizoDex

Project-specific context for KaizoDex. Universal rules are inherited from the Pokémon umbrella and
the global instructions; only what is specific to this project is repeated here.

## What KaizoDex is
A single-file, data-driven dex for a Kaizo/romhack playthrough. It renders from two data files:
- `trainers.json` — every trainer, their location, and their team (species, level, moves, item, nature).
- `changes.json` — the romhack's edits to abilities, stats, types, and learnsets versus the base game.

The application is `index.html`. There is no build step and no server. Editing the data files changes
the dex; the HTML is the renderer.

## Where things are
- `index.html` — the application (renderer).
- `trainers.json`, `changes.json` — the data the dex depends on.
- `docs/` — white paper, plain-English deck, technical documentation.
- `tests/test-data.js` — validates both data files and that the HTML still references them.

## Rules that matter most here
- The data files are the source of truth. A malformed data file is the most likely way to ship a
  broken dex, so `tests/test-data.js` must pass before publishing.
- Anything that changes over time (the trainer list, the change list) lives in the data files, not
  the HTML.

---

## Rule: three places must agree
Every change lands in all three places in the same pass: local files, GitHub, and the live site.
A change in one place only is not finished. If a step is impossible, say so and name it; never report
a change as done when it exists only on disk.

## Rule: identical treatment, enforced by a check
Every project gets the same artefacts: white paper, plain-English deck, technical documentation,
README, CHANGELOG, CLAUDE.md, tests, LICENSE, SECURITY.md, CONTRIBUTING.md, .gitignore, and a CI
workflow. Run `python3 portfolio/build/check_projects.py` before publishing; it fails on any gap.

## Rule: one changelog format
`CHANGELOG.md` follows Keep a Changelog + Semantic Versioning, newest first, with
`## [MAJOR.MINOR.PATCH] — YYYY-MM-DD` headings and Added/Changed/Fixed/Removed/Notes sections. The
top version must match the version stamped on the project's primary artifact.
