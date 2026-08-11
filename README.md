# ICASSP 2027 GTSinger Listening Evaluation Final v5

Public listening evaluation for hierarchical expression control in singing voice conversion.

## Open the evaluation

https://niiro002.github.io/icassp2027-listening-evaluation/

Each participant should receive one assignment slot from `01` to `24`. Every slot contains 20 trials over 20 different excerpts:

- 14 direction trials and 6 quality trials
- Intensity: 6 trials
- Breathiness: 6 trials
- Vibrato: 5 trials
- Local Vocal Emphasis: 3 auxiliary trials

The study covers English, Korean, and Japanese GTSinger sources, six source-to-reference transfer families, and at least 14 exact source-reference pairs per participant. A/B order and stimulus exposure are balanced across the 24 slots.

The first page now explains the research task, distinguishes source audio, target-voice reference, and converted output, and provides exaggerated examples for Intensity, Breathiness, and Vibrato. Tutorial excerpts are disjoint from all 24 formal evaluation items. Local Vocal Emphasis remains an auxiliary axis and is explained without a tutorial answer anchor.

Every participant receives exactly seven direction trials whose intended answer is A and seven whose intended answer is B. Within each participant, Intensity, Breathiness, and Vibrato are each balanced 2/2 across A/B, while Local Vocal Emphasis is balanced 1/1.

Local Vocal Emphasis uses the calibrated V17 controller. Its positive direction is fixed at gain `2.5`, and all three emphasis conditions are integrated-loudness matched to prevent overall volume from revealing the answer.

The completed anonymous response is exported as a CSV file in the participant's browser. This static site does not automatically upload or store responses on a server.

The final set incorporates an expert pilot review: two ambiguous breathiness excerpts and one low-quality intensity excerpt were replaced while preserving the original slot, language, axis, and scheduled-exposure balance.

Responses from previous versions must not be combined with this version. New files identify the study as `icassp2027_gtsinger_focused_human_evaluation_final_v5`.

## Data and license

The audio stimuli in `audio/` are adapted from GTSinger (Zhang et al., NeurIPS 2024) and are distributed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-nc-sa/4.0/) for non-commercial research evaluation.

No Tohoku Kiritan material, raw dataset files, model checkpoints, researcher answer keys, or participant responses are included in this repository.
