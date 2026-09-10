# Expression-Specific Temporal Support listening evaluation

This GitHub Pages site runs one fixed, 20-trial listening evaluation. Every participant receives the same questions in the same order. There is no assignment slot. A/B placement is counterbalanced deterministically from the participant ID and recorded in the response CSV.

## Study design

- Block A — 12 attribute-rating trials: four each for Breathiness, Intensity, and Vibrato. Listeners rate whether B has less or more of the named expression than A on a five-point scale.
- Block B — 8 matched-target temporal-support trials: four Breathiness and four Intensity comparisons. A neutral anchor is followed by two blinded support variants, rated for perceived effect size, temporal appropriateness, and naturalness.
- All audio must finish once before a response can be submitted.
- Responses are downloaded locally as CSV; the page does not upload data.

Block B uses the same item, control direction, and nominal control level for both systems. The selected pairs have an absolute objective target-response mismatch of at most 0.01. This makes perceived strength a manipulation check and temporal appropriateness the primary support-comparison outcome.

The earlier forced-choice cross-expression interference task was removed. A 50% choice rate is not interpreted as evidence of zero leakage.

## Research files

Public files contain only blinded trial metadata and opaque audio names. The decoding key, frozen protocol, build audit, and response-analysis script live under ignored `private_analysis/` and are not published by GitHub Pages.

To rebuild the exact public stimulus set on the experiment machine:

```bash
python3 /mnt/c/Users/NIIRO/Documents/ChatGPT/icassp2027/tools/build_final_listening_study.py
```
