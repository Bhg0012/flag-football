# Coed Flag Playbook

A one-page, phone-friendly playbook for our coed 7v7 flag football team. Tap a play to watch it run, see everyone's job, and swipe to the next play.

Everything is in `index.html`. It has no build step and no dependencies besides a Google Font.

## The plays

Everyone keeps the same spot in every play. The **yellow** spots are women, the **blue** spots are men, and the **white** spot is the QB (anyone can play QB).

| Play | Type | Real football name | Ball goes to |
| --- | --- | --- | --- |
| Pizza Slice | Pass | Slant & Flat | RS (slant), then B (flat). Both are women, so it's always legal on a closed play |
| Layer Cake | Pass | Flood | RW deep, RS middle, B short |
| Fireworks | Pass | Four Verticals | Whoever is open deep |
| Pitch Perfect | Run | Toss Sweep | B (woman) |
| Zoom | Run | Jet Sweep | LS (woman) on motion |
| Uno Reverse | Run | Reverse | RS (woman), after a fake pitch |
| Houdini | Run | QB Bootleg | Woman QB keeps it |

## Coed rules the plays are built around

- At least 4 women on the field. The lineup has 4 women plus the QB, so it's legal with a man or a woman at QB.
- Men can't run the ball across the line. Every run play goes to a woman.
- No two man-to-man completions in a row. Pizza Slice always targets women.
- A woman throwing or scoring a touchdown is worth 9 points.
- The QB lines up 2+ yards back. Only one player can be in motion, moving sideways (Zoom).
- Blocking is screen-only (no contact).

## Sharing it

To host it on GitHub Pages instead of the Claude artifact link: go to the repo's **Settings → Pages**, set the source to **Deploy from a branch**, and pick the branch and `/ (root)`. The site will then be live at `https://<user>.github.io/flag-football/`.

You can also link straight to one play by adding its name after `#`, for example `#pizza-slice` or `#houdini`.
