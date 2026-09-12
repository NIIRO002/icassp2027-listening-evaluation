# Study validation report

The public study contains 15 fixed trials: 9 direction A/B items and 6 naturalness/singer-similarity CMOS items. The stimuli are byte-for-byte copies of already-generated recovered-v16 Breathiness/Intensity outputs (`b38113a1cc655dab8732a053ad108ce671fa748213810eca3347ad27a22673e4`) and frozen Vibrato outputs (`629b41f8221249071ab0454086bd245b5024f5a44208c309e855c35d2a7bc1f8`).

Block A contains three neutral-versus-endpoint comparisons per axis. Block B contains signed endpoints for Breathiness and Intensity, one Vibrato `+1` comparison, and one bit-identical null pair. Within each block, A/B positions are deterministically counterbalanced from the participant ID; trial identities and order stay fixed.

Advancing requires A and B to have been played at least once. Quality items also require the target-speaker reference. Playback to the end is not required.

Validated build properties:

1. exactly 15 unique trial IDs with a 9/6 block split;
2. all public WAV references exist and use opaque names;
3. the Block-B null pair is bit-identical;
4. public metadata contains no semantic roles, answer key, or experiment filesystem paths;
5. the checkpoint hash and source generation manifest are recorded in the private build audit;
6. the UI counterbalances A/B positions and exports the presentation code;
7. a response cannot advance until all required audio has been started;
8. the response analyzer rejects incompatible study versions and zero-play trials.
