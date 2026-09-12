# Listening evaluation analysis plan

Join response rows to the ignored researcher key by `trial_id`. Preserve raw CSV files unchanged and report exclusions before outcome analysis. Breathiness and Intensity use the recovered final-candidate checkpoint (`b38113a1cc655dab8732a053ad108ce671fa748213810eca3347ad27a22673e4`); Vibrato uses the frozen formula checkpoint (`629b41f8221249071ab0454086bd245b5024f5a44208c309e855c35d2a7bc1f8`).

## Block A — Direction A/B (9 items)

There are three neutral-versus-endpoint judgments per axis. A/B presentation is counterbalanced within each participant and decoded with `presentation_code`. For Breathiness, Intensity, and Vibrato, report correct/total, accuracy, a listener-clustered 10,000-resample bootstrap interval, and the judgment-level Wilson interval.

Do not combine results from the archived pilot or any other checkpoint. Multiple response files from this same study version can be analyzed together.

## Block B — Naturalness and singer-similarity CMOS (6 items)

Five expression trials compare controlled and neutral outputs: signed endpoints for Breathiness and Intensity, and `+1` for Vibrato. One identical-waveform null is retained as a scale-bias check. Raw negative values favor the presented B and positive values favor the presented A. Decode the presentation and report values as controlled-minus-neutral CMOS.

Report naturalness and reference-conditioned singer similarity separately for each axis using a 10,000-resample listener-clustered 95% interval. Report the null separately and never pool it with expression trials.

## Integrity

The primary dataset includes only complete 15-row files with one participant ID and the current study ID. A response file is valid only when A and B were each played at least once in every trial and the target-speaker reference was played in every quality trial. Full playback is not required. The analyzer rejects incompatible versions, missing trials, duplicate participant IDs, invalid responses, and missing required plays.
