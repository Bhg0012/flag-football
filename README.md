# Coed Flag Playbook

## [▶ Open the playbook](https://claude.ai/artifact/PCzQrtL9SHw2UAFQ9rsC2y)

https://claude.ai/artifact/PCzQrtL9SHw2UAFQ9rsC2y

A one-page, phone-friendly playbook for our coed 8v8 flag football team. Tap a play to watch it run, see the QB's options and everyone's job, and swipe to the next play.

Everything is in `index.html`. It has no build step and no dependencies besides a Google Font.

## The plays

Positions (8 players): **QB**, **C** (center), a right lineman (**L**, next to the Center), **RB** (running back, next to the QB) and four **WR**s (outside left, inside left, inside right, outside right). Everyone keeps the same spot in every play except four. In Lightning, the inside left WR lines up next to the Center as a second lineman. In Bubble Wrap, Fireworks and Houdini, the outside left WR lines up next to the Center as a lineman. **Yellow** dots are women, **blue** dots are men, and the **white** dot is the QB (anyone can play QB).

Lightning is called Right or Left: that's the side with 2 WRs, and the Left version is the mirror image. Pass plays show each of the QB's options with a number. Tap an option to watch the throw go there.

| Play | Type | Real football name | Who can get the ball |
| --- | --- | --- | --- |
| Bubble Wrap | Pass | RB Screen | 1: RB (short pass behind 2 blockers), 2: inside left WR (hitch). Both women. Center + 2 linemen block |
| Lightning Right / Left | Pass | Twins: slant, drag, long slant. Center + 2 linemen + RB block | 1: outside left WR (quick slant), 2: inside right WR (drag, woman), 3: outside right WR (long slant) |
| Fireworks | Pass | Verticals (3 WRs deep) | 1 and 2: inside WRs deep. Both women. Center + 2 linemen + RB block |
| Slingshot | Run | Toss Sweep | RB (woman) |
| Zoom | Run | Jet Sweep | Inside left WR (woman), running sideways before the hike |
| Houdini | Run | QB Bootleg | Woman QB keeps it. Center + 2 linemen block; inside left WR runs deep, then blocks |

## Coed rules the plays are built around

- 8 players: at least 4 women, at most 4 men. The lineup has 4 women and 3 men plus the QB, so it's legal with a man or a woman at QB.
- Men can't run the ball across the line. Every run play goes to a woman.
- No two man-to-man completions in a row. Bubble Wrap and Fireworks always go to a woman.
- A woman throwing or scoring a touchdown is worth 9 points.
- Only one player can be moving before the hike, and only sideways (Zoom).
- The defense can rush the QB right at the hike, and usually does. Every pass play keeps at least 2 blockers in, and the run plays get the ball out of the QB's hands right away.

## Sharing it

To host it on GitHub Pages instead of the Claude artifact link: go to the repo's **Settings → Pages**, set the source to **Deploy from a branch**, and pick the branch and `/ (root)`. The site will then be live at `https://<user>.github.io/flag-football/`.

You can also link straight to one play by adding its name after `#`, for example `#bubble-wrap` or `#houdini`.
