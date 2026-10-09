# Coed Flag Playbook

A one-page, phone-friendly playbook for our coed 7v7 flag football team. Tap a play to watch it run, see everyone's job, and swipe to the next play.

Everything is in `index.html`. It has no build step and no dependencies besides a Google Font.

## The plays

Receivers are numbered 1 to 4 from left to right, #5 stands next to the QB, and C is the Center. Everyone keeps the same spot in every play except Criss Cross, where #2 lines up next to the Center. The **yellow** spots are women, the **blue** spots are men, and the **white** spot is the QB (anyone can play QB). On each diagram, the bold line shows who gets the ball.

| Play | Type | Real football name | Ball goes to |
| --- | --- | --- | --- |
| Pizza Slice | Pass | Slant & Flat | #3 (woman), or #5 if she's covered |
| Criss Cross | Pass | Twins: slant + drag | #3 (woman) on the slant, or #1 running across |
| Fireworks | Pass | Four Verticals | Whoever is open deep |
| Pitch Perfect | Run | Toss Sweep | #5 (woman) |
| Zoom | Run | Jet Sweep | #2 (woman), running sideways before the hike |
| Houdini | Run | QB Bootleg | Woman QB keeps it |

## Coed rules the plays are built around

- At least 4 women on the field. The lineup has 4 women plus the QB, so it's legal with a man or a woman at QB.
- Men can't run the ball across the line. Every run play goes to a woman.
- No two man-to-man completions in a row. Pizza Slice always goes to a woman.
- A woman throwing or scoring a touchdown is worth 9 points.
- Only one player can be moving before the hike, and only sideways (Zoom).

## Sharing it

To host it on GitHub Pages instead of the Claude artifact link: go to the repo's **Settings → Pages**, set the source to **Deploy from a branch**, and pick the branch and `/ (root)`. The site will then be live at `https://<user>.github.io/flag-football/`.

You can also link straight to one play by adding its name after `#`, for example `#pizza-slice` or `#houdini`.
