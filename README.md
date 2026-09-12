# Expression-Specific Temporal Support Listening Evaluation

Public listening evaluation for controllable singing voice conversion:

https://niiro002.github.io/icassp2027-listening-evaluation/

The study uses already-generated outputs from the frozen recovered-v16 Breathiness/Intensity candidate (`b38113a1cc655dab8732a053ad108ce671fa748213810eca3347ad27a22673e4`) and frozen Vibrato formula checkpoint (`629b41f8221249071ab0454086bd245b5024f5a44208c309e855c35d2a7bc1f8`). No new inference or waveform post-processing is used.

Every participant receives the same 15 trials, with A/B position counterbalanced per participant:

- Block A — 9 direction A/B trials: three each for Breathiness, Intensity, and Vibrato.
- Block B — 6 comparative-MOS trials: signed endpoints for Breathiness and Intensity, one Vibrato endpoint, and one identical-clip null. Naturalness and reference-conditioned singer similarity are both rated from −3 to +3.

Participants must start each A/B clip once; quality trials also require the target-speaker reference to be played. Clips do not need to be played to the end. Play counts and the blinded A/B presentation code are retained in the response CSV for auditing and decoding.

The completed anonymous response is downloaded as a CSV in the participant's browser. The static site does not upload or store responses.

The conference-facing support-only result remains available at:

https://niiro002.github.io/icassp2027-listening-evaluation/smoke-test.html

## Data and license

The evaluation audio is adapted from GTSinger (Zhang et al., NeurIPS 2024) and distributed for non-commercial research under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Raw datasets, model checkpoints, researcher keys, and participant responses are not published here.
