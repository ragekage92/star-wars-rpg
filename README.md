# Mos Eisley 3D (Star Wars RPG prototype)

Your repo root must contain (these are NOT in this zip, you already have them):
`three.min.js`, `GLTFLoader.js`, `player.glb`

Upload from this zip: `index.html`, the `js/` folder and this README.

## What each file does (load order matters: top to bottom)
| File | Job |
|---|---|
| js/state.js | Shared variables (health, credits, quest and shop state, player position). Loads first. |
| js/world.js | Scene, camera, lights, terrain, Mos Eisley, spaceport, desert props, droids, twin suns. |
| js/player.js | The character, GLB loading from ./player.glb, brown-robe fallback color. |
| js/rig.js | Bending/moving the model, holding the saber in his hand. |
| js/combat.js | HUD, damage, 3-hit combos, Force push/lightning, saber throw, dash, enemy AI, per-frame update. |
| js/enemies.js | The four raider camps (raiders, lungers, gunners). |
| js/cantina.js | Cantina interior, bartender, quests, enter/leave/talk. |
| js/shop.js | The Trader and his shop. |
| js/boss.js | Jedi Ruins, Trial Master, boss bolts and slam. |
| js/progress.js | Light/dark side, companions and influence (Juno, KX-9), skills and perks (Lightsaber, Force, Sneak, Speech), items, equipment, loot, and their menus (T, I, J). |
| js/minimap.js | The round minimap. |
| js/audio.js | Sound effects, wind, cantina music, mute (M). Load AFTER gameplay files. |
| js/main.js | Input, game loop, start-up. Loads last. |

## Controls added in this version
T = skills & perks, I = inventory, J = journal & companions, C = sneak (View on controller),
D-pad up/left and Menu also open journal/inventory/skills.

## Rules that keep it from breaking
- Keep the `<script>` order in index.html exactly as it is. A file may use things from files ABOVE it
  while the page loads. Anything inside a function can use any file.
- three.min.js and GLTFLoader.js stay local. Never point them at a CDN.
- Browsers cache scripts. After you upload a changed file, bump the number in index.html
  (`./js/combat.js?v=1` -> `?v=2`) so everyone gets the new version.
- Before changing a file, copy it to a backup name (for example `combat-backup.js`) or rely on GitHub's History.
