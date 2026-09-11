# Listening evaluation analysis plan

Join response rows to the ignored researcher key by `trial_id`. Preserve raw CSV files unchanged and report exclusions before any outcome analysis.

## Block A — Direction A/B

For each axis, report correct/total judgments, accuracy, and a 95% Wilson binomial interval. Older direction judgments may be added only when they use the same two-alternative question, have an independently recoverable answer key, and come from the same frozen checkpoint. Report new and prior counts separately before the combined total.

All intended answers in this study are on one presentation side. This requested fixed layout is not counterbalanced, so direction accuracy is confounded with a possible side-response tendency. State that limitation explicitly; do not present the result as bias-free perceptual evidence.

## Block B — Naturalness and singer-similarity CMOS

Negative values favor B, positive values favor A, and zero means no difference. A is controlled and B is neutral for the six expression trials. Report mean CMOS and a 10,000-resample participant-clustered 95% interval for Naturalness and reference-conditioned singer similarity, separately for Breathiness, Intensity, and Vibrato.

The seventh item is an identical-waveform null. Report it separately as an attention and scale-bias diagnostic; do not pool it with the expression trials.

## Block C — Breathiness support CMOS

A uses stable-voiced support and B uses active-region support, both at `u=+1`. Report naturalness CMOS with a 10,000-resample participant-clustered 95% interval. A positive interval excluding zero supports a Stable naturalness preference; an interval containing zero supports no detectable preference, not equivalence.

## Integrity

The primary dataset includes only complete 22-row files with one participant ID and the current study ID. Playback is optional, but report the fraction of trials with zero plays and repeat the main summaries on trials where both A and B were played as a sensitivity analysis. The provided analyzer uses listener-level bootstrap resampling with seed 2027.
