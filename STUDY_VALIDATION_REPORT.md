# Study validation report

The public study contains 22 fixed trials: 9 direction A/B items, 7 naturalness/singer-similarity CMOS items, and 6 Breathiness support naturalness CMOS items. Every participant receives the same order and no assignment slot is requested.

The stimulus builder uses the frozen seed-2027, step-6000 checkpoint outputs. Block A contains three endpoint comparisons per axis. Block B contains two endpoint comparisons per axis and one bit-identical null pair. Block C contains six Breathiness `u=+1` stable-voiced versus active-region support comparisons.

Playback completion is not required. The next button activates after the required response is supplied, while play counts remain in the exported CSV for auditing.

Validated build properties:

1. exactly 22 unique trial IDs with a 9/7/6 block split;
2. exactly 51 opaque public WAV files and no missing audio references;
3. all Block-A intended answers decode to the requested presentation side;
4. all Block-C A samples decode to stable-voiced support;
5. the Block-B null pair is bit-identical;
6. public metadata contains no semantic roles, answer key, or experiment filesystem paths;
7. a headless browser completed all 22 trials without playing audio and exported a valid 22-row CSV;
8. the response analyzer accepted that CSV and produced all planned summaries.
