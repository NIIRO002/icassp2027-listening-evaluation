# Temporal-application listening addendum

This directory contains a short, independent listening addendum for comparing two blinded temporal-application methods. It does not replace or share responses with the root v6 study.

- Study version: `icassp2027_temporal_support_addendum_v1`
- Assignment slots: 24
- Trials per participant: 9
- Axes: Intensity, Breathiness, and Vibrato (3 trials each)
- Response: A, B, or No clear difference, plus confidence 1–5
- Response handling: browser-side CSV download only; no automatic upload or server storage

## Deterministic stimulus design

The study uses the frozen evaluation-pair lists and a fixed generation seed/control level selected before listening responses exist. No item was selected by subjective preference or by later interference outcomes. Each training-dependent physical comparison is exposed exactly twice over the 24-slot design, once on each public side. Each remaining physical comparison is exposed six times, three times on each public side. Every participant receives nine distinct source excerpts.

For playback preparation, Intensity retains the pair's relative integrated level and receives only shared peak-safety attenuation when needed. Breathiness and Vibrato are matched within each pair using BS.1770 integrated loudness, followed by shared peak-safety attenuation when needed. All public files are mono, 44.1 kHz PCM WAV with identical pair boundaries. See `STUDY_VALIDATION_REPORT.md` for measured QC.

## Data and license

The audio is adapted from GTSinger (Zhang et al., NeurIPS 2024) under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) for non-commercial research evaluation.

## Open locally

Serve the repository root over HTTP and open `support-study/`. For example, from the repository root:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/support-study/`. Opening `index.html` directly may work, but an HTTP server better matches GitHub Pages.

The private decoding key and unblinded protocol are intentionally excluded from this public branch. Do not begin recruitment until the manual checklist in `STUDY_VALIDATION_REPORT.md` is complete.
