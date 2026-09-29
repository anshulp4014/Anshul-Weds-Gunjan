# Anshul Weds Gunjan

Digital wedding invitation — Barsar, Himachal Pradesh · 10–12 December 2026.

## Structure

```text
/
├── index.html              # Page markup
├── css/styles.css          # Styles
├── js/app.js               # Gate, scroll scenes, game, audio
└── assets/
    ├── images/couple.webp  # Couple illustration
    └── audio/
        ├── gate-shloka.mp3     # Opening (Ganesh shloka)
        └── wedding-song.mp3    # After the gate opens
```

## Local preview

Serve the folder over HTTP (audio/autoplay policies need a real origin):

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Notes

- Audio uses `preload="none"` so phones do not download both tracks on first paint.
- On coarse pointers / small screens the page enables a `save-gpu` mode (fewer particles, lighter blur).
