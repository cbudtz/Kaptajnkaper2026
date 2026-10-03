# Kaptajn Kaper i Kattegat (Phaser)

Browser remake of **Kaptajn Kaper i Kattegat**, Peter Ole Frederiksen’s 1985 DOS classic, built with **Phaser 3** and packaged for **Docker**.

## Original source

| Resource | URL |
|----------|-----|
| Official GPL-3.0 BASIC sources (1985) | [kb-dk/KaptajnKaper](https://github.com/kb-dk/KaptajnKaper) |
| Author’s download page (archived) | [kaptajnkaper.dk](https://kaptajnkaper.dk/) |

The Royal Danish Library published the original `KAPER.BAS`, `BUILD.BAS`, `SKUD.BAS`, `TEGN.BAS`, `HLP.BAS`, and `SPECIAL.BAS` under GPL-3.0.

## This implementation

Game logic and CGA-style assets follow the JavaScript port [**Privateer**](https://github.com/nivs1978/Privateer) (GPL-3.0), which traces back to Rune P. Olsen’s Java applet and the original QBASIC/DOS design. Phaser hosts the legacy renderer on a canvas texture, handles scaling, and ships a production static build.

## Controls (intro)

- **D** — Danish
- **E** — English
- **C** — clear high score record

Then follow on-screen prompts (same as the original web/DOS flow).

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
