# Expression-Specific Temporal Support Listening Evaluation

Public listening evaluation for controllable singing voice conversion:

https://niiro002.github.io/icassp2027-listening-evaluation/

Every participant receives the same 30 questions in the same order. There is no assignment-slot field. A/B placement is derived automatically from the participant ID and is recorded in the response CSV.

The evaluation has three blocks:

- Block A: 12 paired-comparison CMOS trials for naturalness and target-singer similarity.
- Block B: 12 forced-choice selectivity trials, balanced across axis-specific and shared-branch controllers.
- Block C: 6 forced-choice direction trials, with two trials each for Breathiness, Intensity, and Vibrato. One Breathiness trial uses the half-strength condition.

All model and inference stimuli use the single fixed seed `2027`. Participants listen to both A and B in full before answering. The completed anonymous response is downloaded as a CSV in the participant's browser; the static page does not upload or store responses.

The public repository contains only blinded stimuli and study code. The researcher key and analysis materials are kept outside Git tracking.

Audio stimuli are adapted from GTSinger (Zhang et al., NeurIPS 2024) and NUS-48E where applicable and are provided only for non-commercial research evaluation under their source terms.
