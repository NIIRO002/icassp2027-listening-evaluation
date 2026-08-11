# ICASSP 2027 GTSinger Listening Evaluation Final v6

Public listening evaluation for hierarchical expression control in singing voice conversion.

## Open the evaluation

https://niiro002.github.io/icassp2027-listening-evaluation/

Each participant receives one assignment slot from `01` to `24`.

The required core evaluation contains 20 English and Korean trials over 20 different excerpts:

- 14 direction trials and 6 quality trials
- Intensity: 6 trials
- Breathiness: 6 trials
- Vibrato: 5 trials
- Local Vocal Emphasis: 3 auxiliary trials
- English: 8 items; Korean: 12 items

Participants who report that they can understand Japanese at a capable or fluent level receive a separate optional Japanese module with 6 additional trials: 4 direction trials and 2 quality trials. Responses from the required core and optional Japanese module are labeled separately in the exported CSV and should be analyzed as separate result sets.

The first page explains source audio, target-voice reference, and converted output. Its guided examples use only English and Korean GTSinger excerpts. The tutorial excerpts are disjoint from every formal evaluation item.

Every core participant receives exactly seven direction trials whose intended answer is A and seven whose intended answer is B. Intensity, Breathiness, and Vibrato are each balanced 2/2 across A/B; Local Vocal Emphasis is balanced 1/1. The optional Japanese module is also balanced 2/2 across its four direction trials.

The study uses quality-screened stimuli, balanced A/B order, integrated-loudness matching, and controlled stimulus exposure across the 24 assignment slots. Local Vocal Emphasis is retained as an auxiliary axis and uses the calibrated controller gain of `2.5`.

The completed anonymous response is exported as a CSV file in the participant's browser. This static site does not automatically upload or store responses on a server.

Responses from previous versions must not be combined with this version. New files identify the study as `icassp2027_gtsinger_focused_human_evaluation_final_v6` and record each participant's Japanese proficiency.

## Data and license

The audio stimuli in `audio/` are adapted from GTSinger (Zhang et al., NeurIPS 2024) and are distributed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-nc-sa/4.0/) for non-commercial research evaluation.

No Tohoku Kiritan material, raw dataset files, model checkpoints, researcher answer keys, or participant responses are included in this repository.
