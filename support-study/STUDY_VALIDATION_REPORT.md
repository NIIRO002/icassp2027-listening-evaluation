# Study validation report — temporal-application addendum v1

Validation date: 2026-09-09 (Asia/Seoul)

Study version: `icassp2027_temporal_support_addendum_v1`

## Generated public files

- `index.html`
- `app.js`
- `study-data.js`
- `styles.css`
- `README.md`
- `ANALYSIS_PLAN.md`
- `STUDY_VALIDATION_REPORT.md`
- `audio/`: 168 opaque-name WAV files

The private decoding key, source manifest, detailed per-file QC, build summary, and unblinded protocol are stored only in the ignored local `private_analysis/` directory.

## Assignment design

| Check | Result |
| --- | ---: |
| Assignment slots | 24 |
| Trials per slot | 9 |
| Intensity trials per slot | 3 |
| Breathiness trials per slot | 3 |
| Vibrato trials per slot | 3 |
| Total exposures per axis | 72 |
| Public side A/B per axis | 36 / 36 |
| Participant-level method-side balance | 4/5 or 5/4; 12 slots each |
| Repeated source excerpts within a slot | 0 |
| Slots containing three consecutive trials of one axis | 0 |

Training-dependent physical comparisons occur exactly twice over the full design, once per public side. The remaining physical comparisons occur exactly six times, three times per public side. Assignment order is deterministic, seeded, and interleaved. The selection rule did not use subjective preference or later interference outcomes.

No tutorial audio module is included, so tutorial/formal overlap is not applicable.

## Audio integrity and processing

| Check | Result |
| --- | ---: |
| Required internal source WAV references | 168 |
| Missing source WAVs | 0 |
| Generated public WAV files | 168 |
| Sample rate | 44,100 Hz |
| Channels | 1 |
| Encoding | PCM 16-bit WAV |
| Duration range | 3.993832–7.999274 s |
| Maximum pair duration difference | 0.000000 s |
| Maximum output peak | −0.999854 dBFS |
| Clipped output samples | 0 |
| Duplicate public audio hashes | 0 |
| Maximum within-pair loudness difference reported for matched axes | 0.1 dB (meter reporting resolution) |

Intensity retained each pair's relative integrated level and used only common peak-safety attenuation where required. Breathiness and Vibrato were matched within each pair using BS.1770 integrated loudness, then received common peak-safety attenuation where required. No limiter, compressor, denoiser, time crop, or resampling was applied. Every non-unity gain is logged in the private per-file QC table.

## File, path, and blinding audit

- Every public audio path referenced by `study-data.js` exists.
- Every generated WAV is referenced by at least one formal trial.
- Public filenames are opaque 24-character hexadecimal identifiers with no collisions.
- The public data schema contains no condition fields, answer field, or decoded side.
- A case-insensitive scan of public text, paths, filenames, and metadata found zero prohibited condition-label or answer-key hits.
- The private decoding key is matched by `.gitignore` and is not staged for commit.

## Existing root v6 preservation

A SHA-256 baseline was recorded before changes for all 302 pre-existing files, including all 295 root `audio/` WAV files. The post-build comparison matched 302/302 files; no file was changed or removed.

Explicitly verified unchanged:

- `README.md`
- `README.txt`
- `index.html`
- `app.js`
- `study-data.js`
- `styles.css`
- `.nojekyll`
- all 295 existing root audio files

The original root query-string versions were not changed.

## Static and browser smoke-test checklist

- [x] JavaScript syntax check passes for `app.js` and `study-data.js`.
- [x] 24 slots load with exactly 9 trials and 3 trials per axis.
- [x] Both playback-completion flags, one three-way response, and confidence are required before Next is enabled.
- [x] Radio selections and playback counters reset between trials.
- [x] Starting one player pauses the other player.
- [x] Repeated Next activation is guarded against double submission.
- [x] The CSV schema contains all preregistered public fields and no decoded condition field.
- [x] Desktop browser: completed all nine trials with full playback; downloaded and inspected the 10-line CSV (header + 9 responses).
- [x] Mobile-width browser (390 × 844): verified stacked audio controls, three response choices, confidence controls, and Next state.

All pre-recruitment checks listed here are complete. Recruitment was not started by this build.
