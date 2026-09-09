# Study Validation Report

The public study contains 30 fixed trials: 12 in Block A, 12 in Block B, and 6 in Block C. All participants receive the same questions and order; no assignment slot is requested.

A/B placement is automatically derived from the participant ID. Consecutive trials alternate placement, and the complementary layout is used for participant IDs that hash to the other parity. The response CSV records the layout and per-trial presentation code so the private key can decode all scores.

The site requires every presented audio file to finish at least once before enabling the response button. Block A additionally requires the target-singer reference to finish. All formal stimuli use model and inference seed 2027, and copied WAV files are byte-identical to the frozen experiment outputs.

The public trial data contain only opaque identifiers and audio filenames. Controller type, control axis, level, item identity, source paths, and the neutral/controlled mapping remain in the ignored private researcher key.
