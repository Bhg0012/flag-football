# Coed Flag Playbook

A one-page, phone-friendly playbook for our coed 7v7 flag football team. Tap a play to watch it run, see the QB's options and everyone's job, and swipe to the next play.

Everything is in `index.html`. It has no build step and no dependencies besides a Google Font.

## The plays

Positions: **QB**, **C** (center), **RB** (running back, next to the QB) and four **WR**s (outside left, inside left, inside right, outside right). Everyone keeps the same spot in every play except Criss Cross, where the inside left WR lines up next to the Center. **Yellow** dots are women, **blue** dots are men, and the **white** dot is the QB (anyone can play QB).

Criss Cross is called Right or Left: that's the side with 2 WRs, and the Left version is the mirror image. Pass plays show each of the QB's options with a number. Tap an option to watch the throw go there.

| Play | Type | When | Real football name | Who can get the ball |
| --- | --- | --- | --- | --- |
| Pizza Slice | Pass | Any down | Slant & Flat | 1: inside right WR (slant), 2: RB (flat). Both women |
| Criss Cross Right / Left | Pass | Any down | Twins: slant + drag + go | 1: inside right WR (slant), 2: outside left WR (drag), 3: outside right WR (deep) |
| Fireworks | Pass | 1st down | Four Verticals | 1 and 2: inside WRs deep, 3: Center short. All women |
| Slingshot | Run | 1st or 2nd down | Toss Sweep | RB (woman) |
| Zoom | Run | 1st or 2nd down | Jet Sweep | Inside left WR (woman), running sideways before the hike |
| Houdini | Run | Surprise play | QB Bootleg | Woman QB keeps it |

## Coed rules the plays are built around

- At least 4 women on the field. The lineup has 4 women plus the QB, so it's legal with a man or a woman at QB.
- Men can't run the ball across the line. Every run play goes to a woman.
- No two man-to-man completions in a row. Pizza Slice always goes to a woman.
- A woman throwing or scoring a touchdown is worth 9 points.
- Only one player can be moving before the hike, and only sideways (Zoom).

## Sharing it

To host it on GitHub Pages instead of the Claude artifact link: go to the repo's **Settings → Pages**, set the source to **Deploy from a branch**, and pick the branch and `/ (root)`. The site will then be live at `https://<user>.github.io/flag-football/`.

You can also link straight to one play by adding its name after `#`, for example `#pizza-slice` or `#houdini`.
