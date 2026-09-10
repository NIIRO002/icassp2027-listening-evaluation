# Study validation report

The public study contains 20 fixed trials: 12 expression direction/strength items and 8 matched-target temporal-support comparisons. Every participant receives the same trial set and order; no assignment slot is requested. A/B placement alternates and is counterbalanced from the participant ID.

The site requires both presented outputs to finish at least once. The support-comparison block additionally requires the neutral anchor to finish. Block A records one five-point bipolar attribute rating. Block B records effect-size similarity, temporal appropriateness, and naturalness, each with an explicit tie option.

The stimulus build checks all source manifests for completion, copies frozen WAV outputs without post-processing, hashes each published file, and keeps the unblinded mapping outside version control. The eight support pairs use identical items, directions, and nominal levels; their objective target-response mismatch is constrained to at most 0.01.

Validation must pass before collection:

1. exactly 20 unique trial IDs with a 12/8 block split;
2. exactly 48 public WAV files (24 in Block A and 24 in Block B);
3. every public audio path exists and has a nonzero size;
4. all public filenames are opaque and no unblinded roles appear in `study-data.js`;
5. the CSV export contains the study ID, trial ID, presentation code, all relevant responses, and playback audit fields;
6. the public repository contains no private decoding key or experiment filesystem paths.
