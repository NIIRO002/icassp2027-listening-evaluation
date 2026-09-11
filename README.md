# Expression-Specific Temporal Support Listening Evaluation

Public listening evaluation for controllable singing voice conversion:

https://niiro002.github.io/icassp2027-listening-evaluation/

Every participant receives the same fixed 22 trials:

- Block A — 9 direction A/B trials: three each for Breathiness, Intensity, and Vibrato.
- Block B — 7 comparative-MOS trials: two endpoint trials per axis and one identical-clip null. Naturalness and reference-conditioned singer similarity are both rated from −3 to +3.
- Block C — 6 Breathiness-support comparative-MOS trials: stable-voiced support versus active-region support at `u=+1`, rated for naturalness.

The study uses the frozen final checkpoint (seed 2027, step 6000). The public site contains blinded trial metadata and opaque audio names only. Semantic roles, the response key, build audit, and analysis materials are kept under ignored `private_analysis/`.

Audio playback is optional: participants may advance once the required response has been selected, even if a clip was not played to the end. Play counts are retained in the response CSV for auditing.

The completed anonymous response is downloaded as a CSV in the participant's browser. The static site does not upload or store responses.

## Data and license

The evaluation audio is adapted from GTSinger (Zhang et al., NeurIPS 2024) and distributed for non-commercial research under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Raw datasets, model checkpoints, researcher keys, and participant responses are not published here.
