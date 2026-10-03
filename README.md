# Kaptajn Kaper i Kattegat (Phaser)

Browser remake of **Kaptajn Kaper i Kattegat**, Peter Ole Frederiksen’s 1985 DOS classic, built with **Phaser 3** and packaged for **Docker**.

## Original source

| Resource | URL |
|----------|-----|
| Official GPL-3.0 BASIC sources (1985) | [kb-dk/KaptajnKaper](https://github.com/kb-dk/KaptajnKaper) |
| Author’s download page (archived) | [kaptajnkaper.dk](https://kaptajnkaper.dk/) |

The Royal Danish Library published the original `KAPER.BAS`, `BUILD.BAS`, `SKUD.BAS`, `TEGN.BAS`, `HLP.BAS`, and `SPECIAL.BAS` under GPL-3.0.

## This implementation

**Phaser 3 (idiomatic):** `BootScene` → `PreloadScene` → `GameScene` with a `KaperGameHost` controller, ES module game systems under `src/game/systems/`, and CGA text drawn via Phaser textures (`PhaserGameView` / `CgaLabelFactory`). No canvas bridge.

Game logic matches the JavaScript port [**Privateer**](https://github.com/nivs1978/Privateer) (GPL-3.0), which traces back to the original QBASIC/DOS design (`KAPER.BAS` release 4).

Fidelity choices aligned with the **1985 DOS original**:

- Danish by default; intro text and **Version 1 Release 4** label from `KAPER.BAS`
- Startup **sound choice** (`0` / `1`) before the title picture, like the BASIC game
- **F2** toggles sound during play (same as the DOS `LYD` flag)
- Same map, economy, combat, harbor, and promotion rules as the Privateer port (verified identical to upstream game modules)

## Controls (intro)

1. **Any key** — continue (Danish)
2. **E** — English
3. **C** — clear record
4. **0** / **1** — silence or sound effects (then title screen)
5. Enter name, then play (**F1** help, **F2** sound, **Esc** quit on the map)

On **phones/tablets**, use the on-screen buttons at the bottom (the original game is keyboard-driven). Tap the game area for “continue” on intro screens.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Production build

```bash
npm run build
npm run preview
```

## Deploy on CapRover

Appen er en statisk Phaser-build bag **nginx** i `Dockerfile` (container lytter på **port 80**).

1. Opret en ny app i CapRover (fx `kaper`).
2. **Deployment method:** deploy via **GitHub** (eller upload af repo) med **Dockerfile** i roden.
3. **`captain-definition`** peger allerede på `./Dockerfile` — CapRover bygger automatisk.
4. Under app-indstillinger: sæt **Container HTTP Port** til **80** (nginx).
5. Aktivér **HTTPS** / domæne som du plejer på CapRover.
6. **Force HTTPS** og **Websocket** er ikke påkrævet (ren statisk SPA).

Lokal test af samme image som CapRover:

```bash
docker build -t kaptajnkaper2026 .
docker run --rm -p 8080:80 kaptajnkaper2026
```

Åbn http://localhost:8080

## License

GPL-3.0-or-later. See [LICENSE](LICENSE) (original game) and game credits in source headers.
