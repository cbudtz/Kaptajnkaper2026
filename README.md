# Kaptajn Kaper i Kattegat (Phaser)

Browser remake of **Kaptajn Kaper i Kattegat**, Peter Ole Frederiksen’s 1985 DOS classic, built with **Phaser 3** and packaged for **Docker**.

## Original source

| Resource | URL |
|----------|-----|
| Official GPL-3.0 BASIC sources (1985) | [kb-dk/KaptajnKaper](https://github.com/kb-dk/KaptajnKaper) |
| Author’s download page (archived) | [kaptajnkaper.dk](https://kaptajnkaper.dk/) |

The Royal Danish Library published the original `KAPER.BAS`, `BUILD.BAS`, `SKUD.BAS`, `TEGN.BAS`, `HLP.BAS`, and `SPECIAL.BAS` under GPL-3.0.

## This implementation

Game logic and CGA-style assets follow the JavaScript port [**Privateer**](https://github.com/nivs1978/Privateer) (GPL-3.0), which traces back to Rune P. Olsen’s Java applet and the original QBASIC/DOS design (`KAPER.BAS` release 4). Phaser hosts the legacy renderer on a canvas texture, handles scaling, and ships a production static build.

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

## Docker

```bash
docker build -t kaptajnkaper2026 .
docker run --rm -p 8080:80 kaptajnkaper2026
```

Open http://localhost:8080

## License

GPL-3.0-or-later. See [LICENSE](LICENSE) (original game) and game credits in source headers.
