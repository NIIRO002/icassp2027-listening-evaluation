window.SMOKE_DATA = {
  pairs: [
    { id: "ko_sop2_to_alto2_e01", label: "Korean · same range", source: "KO-Soprano-2", target: "EN-Alto-2" },
    { id: "en_alto2_to_kosop2_e02", label: "English · same range", source: "EN-Alto-2", target: "KO-Soprano-2" },
    { id: "ja_tenor1_to_alto2_e01", label: "Japanese · same range", source: "JA-Tenor-1", target: "EN-Alto-2" },
    { id: "ja_tenor1_to_zhiy_a_e01", label: "Japanese · cross range", source: "JA-Tenor-1", target: "ZHIY" }
  ],
  axes: [
    { key: "breathiness", label: "Breathiness", endpoints: [{ key: "m100", label: "u = −1" }, { key: "p100", label: "u = +1" }] },
    { key: "intensity", label: "Intensity", endpoints: [{ key: "m100", label: "u = −1" }, { key: "p100", label: "u = +1" }] }
  ],
  supports: [
    { key: "native", label: "Native" },
    { key: "alternative_localized", label: "Alternative localized" },
    { key: "all_valid", label: "All-valid" }
  ]
};
