# Coed Flag Playbook

## [▶ Open the playbook](https://claude.ai/artifact/PCzQrtL9SHw2UAFQ9rsC2y)

https://claude.ai/artifact/PCzQrtL9SHw2UAFQ9rsC2y

**Printable sheets:** [playbook.pdf](playbook.pdf) has two landscape letter-size pages (pass plays and run plays, 4 per page) for the sideline. Pass plays are on a blue page, run plays on an orange page. To rebuild it after changing a play, run `node tools/make-playbook-pdf.js`.

A one-page, phone-friendly playbook for our coed 8v8 flag football team. Tap a play to watch it run, see the QB's options and everyone's job, and swipe to the next play.

Everything is in `index.html`. It has no build step and no dependencies besides a Google Font.

## The plays

Positions (8 players): **QB**, **C** (center), a right lineman (**L**, next to the Center), **RB** (running back, next to the QB) and four **WR**s (outside left, inside left, inside right, outside right). Everyone keeps the same spot in every play except six. In Lightning, the inside left WR lines up next to the Center as a second lineman, and the RB lines up as a third WR on the right. In Bubble Wrap, Fireworks and Houdini, the outside left WR lines up next to the Center as a lineman. In Emily Sandwich, the RB lines up next to the Center (on the left) as a lineman. In Emily², the inside left WR lines up right behind the RB, next to the QB. Dots are colored by position: **yellow** for WRs and RBs, **gray** for the Center and linemen, **white** for the QB, and **purple** when the play needs a woman at QB.

Lightning is called Right or Left: that's the side with 3 WRs, and the Left version is the mirror image. Pass plays show each of the QB's options with a number. Tap an option to watch the throw go there.

| Play | Type | Real football name | Who can get the ball |
| --- | --- | --- | --- |
| Bubble Wrap | Pass | RB Screen | 1: RB (short pass behind 2 blockers), 2: inside left WR (hitch). Both women. Center + 2 linemen block |
| Lightning Right / Left | Pass | Trips: slant, hitch, drag, long slant. Center + 2 linemen block | 1: outside left WR (quick slant), 2: RB lined up as a WR (5 steps then turns around, woman), 3: inside right WR (drag, woman), 4: outside right WR (long slant) |
| Fireworks | Pass | Verticals (3 WRs deep) | 1 and 2: inside WRs deep, 3: RB blocks first, then pops out short. All women. Center + 2 linemen block |
| Emily Sandwich | Pass | High-low slants | 1: inside left WR (short slant), 2: inside right WR (deep slant). Both women. Outside WRs run deep to clear the middle. RB lines up next to the Center as a lineman. Center + 2 linemen block |
| Slingshot | Run | Toss Sweep | RB (woman) |
| Zoom | Run | Jet Sweep | Inside left WR (woman), running sideways before the hike |
| Houdini | Run | QB Bootleg | Woman QB keeps it. Center + 2 linemen block; inside left WR runs deep, then blocks |
| Emily² | Run | I formation (handoff, with a lead blocker) | Back RB (inside left WR, woman) takes the handoff. Front RB (woman) runs ahead and blocks. Right side WRs block |

## Coed rules the plays are built around

- 8 players: at least 4 women, at most 4 men. The lineup has 4 women and 3 men plus the QB, so it's legal with a man or a woman at QB.
- Men can't run the ball across the line. Every run play goes to a woman.
- No two man-to-man completions in a row. Emily Sandwich is the play for that: it always goes to a woman (it's marked "Pass to a woman").
- A woman throwing or scoring a touchdown is worth 9 points.
- Only one player can be moving before the hike, and only sideways (Zoom).
- The defense can rush the QB right at the hike, and usually does. Every pass play keeps at least 2 blockers in, and the run plays get the ball out of the QB's hands right away.

## Sharing it

To host it on GitHub Pages instead of the Claude artifact link: go to the repo's **Settings → Pages**, set the source to **Deploy from a branch**, and pick the branch and `/ (root)`. The site will then be live at `https://<user>.github.io/flag-football/`.

You can also link straight to one play by adding its name after `#`, for example `#bubble-wrap` or `#houdini`.
