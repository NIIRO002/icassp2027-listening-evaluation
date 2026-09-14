window.DEMO_DATA = {
  examples: [
    {
      key: "breathiness",
      title: "Breathiness",
      direction: "Less breathy ↔ More breathy",
      pair: "KO-Soprano-2 → EN-Alto-2",
      language: "Korean source · excerpt 1",
      note: "Native stable-voiced support",
      context: [
        { label: "Source", file: "source.wav" },
        { label: "Target reference", file: "target_reference.wav" }
      ],
      outputs: [
        { label: "Less breathy", control: "u = −1", file: "less_breathy.wav" },
        { label: "Neutral", control: "u = 0", file: "neutral.wav", neutral: true },
        { label: "More breathy", control: "u = +1", file: "more_breathy.wav" }
      ]
    },
    {
      key: "intensity",
      title: "Intensity",
      direction: "Less intense ↔ More intense",
      pair: "EN-Alto-2 → KO-Soprano-2",
      language: "English source · excerpt 2",
      note: "Native active-region support",
      context: [
        { label: "Source", file: "source.wav" },
        { label: "Target reference", file: "target_reference.wav" }
      ],
      outputs: [
        { label: "Less intense", control: "u = −1", file: "less_intense.wav" },
        { label: "Neutral", control: "u = 0", file: "neutral.wav", neutral: true },
        { label: "More intense", control: "u = +1", file: "more_intense.wav" }
      ]
    },
    {
      key: "vibrato",
      title: "Vibrato",
      direction: "Neutral ↔ More vibrato",
      pair: "KO-Soprano-2 → EN-Alto-2",
      language: "Korean source · excerpt 2",
      note: "Note-sustain support",
      context: [
        { label: "Source", file: "source.wav" },
        { label: "Target reference", file: "target_reference.wav" }
      ],
      outputs: [
        { label: "Neutral", control: "u = 0", file: "neutral.wav", neutral: true },
        { label: "More vibrato", control: "u = +1", file: "more_vibrato.wav" }
      ]
    }
  ]
};
