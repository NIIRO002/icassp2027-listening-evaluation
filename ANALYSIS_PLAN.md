# Listening evaluation analysis plan

Use the private decoding key to map each presented side to its hidden role. Keep ties as observed responses; do not discard or split them.

## Block A — expression direction and strength

Convert the five-point A-versus-B rating so that positive values mean the controlled sample has more of the named attribute than neutral. Multiply Breathiness and Intensity scores by the sign of the requested control level to obtain an expected-direction score. Vibrato trials use positive control only.

For each axis, report the full response distribution, mean expected-direction score with a participant-clustered 95% bootstrap confidence interval, and the proportions in the expected direction, tied, and opposite direction. Treat the comparison between absolute control levels 0.5 and 1.0 as exploratory evidence of graded control.

## Block B — matched-target temporal support

The eight items compare the proposed and alternative application supports for the same expression, item, direction, and nominal control level. The private key records the objective target response for both outputs; every selected mismatch is at most 0.01.

Per axis, report:

- perceived-strength responses as proposed stronger / similar / alternative stronger (manipulation check);
- temporal-appropriateness responses as proposed / no difference / alternative (primary support outcome);
- naturalness responses as proposed / no difference / alternative (quality safeguard).

Also encode each preference as proposed = +1, tie = 0, and alternative = −1, then report the participant-clustered mean and 95% bootstrap confidence interval. As a sensitivity analysis, repeat temporal appropriateness and naturalness using only judgments whose perceived-strength response was “similar.” Do not interpret a 50% forced-choice rate as evidence of zero cross-axis leakage; that hypothesis is not part of this listening study.

## Integrity and exclusions

The primary dataset includes only complete 20-row files with one participant ID and the current study ID. Report all exclusions and a headphone-only sensitivity analysis. Preserve raw CSVs unchanged, decode into a separate file, and cluster uncertainty by participant; item-resampling may be added as a robustness analysis.
