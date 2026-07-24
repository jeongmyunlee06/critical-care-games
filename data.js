/**
 * Cascade nodes positioned to mirror the sample flowchart (% of answer sheet).
 */
const CASCADE_TILES = [
  { id: "injury", label: "Injury", kind: "burst", pathway: "start", x: 43.5, y: 0.8, w: 13, h: 6.5 },

  { id: "damaged-tissue", label: "Damaged Tissue", kind: "burst", pathway: "extrinsic", x: 12, y: 7.8, w: 15, h: 5.8 },
  { id: "exposed-collagen", label: "Exposed Collagen", kind: "burst", pathway: "intrinsic", x: 73, y: 7.8, w: 15.5, h: 5.8 },

  // Extrinsic
  { id: "tissue-factor", label: "Tissue factor (III)", kind: "inactive", pathway: "extrinsic", x: 6, y: 16, w: 14, h: 4.5 },
  { id: "iiia", label: "IIIa", kind: "active", pathway: "extrinsic", x: 22, y: 16, w: 7.5, h: 4.5 },
  { id: "vii", label: "VII", kind: "inactive", pathway: "extrinsic", x: 3.5, y: 23.5, w: 7, h: 4.2 },
  { id: "ca-ext", label: "Ca²⁺", kind: "cofactor-dot", group: "ca", pathway: "extrinsic", x: 12, y: 21, w: 5, h: 5 },
  { id: "vii-iii", label: "VII – III complex", kind: "inactive", pathway: "extrinsic", x: 19.5, y: 23.5, w: 13.5, h: 4.2 },

  // Intrinsic upper
  { id: "xii", label: "XII", kind: "inactive", pathway: "intrinsic", x: 83, y: 16, w: 7.5, h: 4.2 },
  { id: "xiia", label: "XIIa", kind: "active", pathway: "intrinsic", x: 73, y: 16, w: 7.5, h: 4.2 },
  { id: "xi", label: "XI", kind: "inactive", pathway: "intrinsic", x: 83, y: 22.5, w: 7.5, h: 4.2 },
  { id: "xia", label: "XIa", kind: "active", pathway: "intrinsic", x: 73, y: 22.5, w: 7.5, h: 4.2 },
  { id: "hmw", label: "HMW kininogen", kind: "cofactor-sm", pathway: "intrinsic", x: 91.5, y: 22.8, w: 7.2, h: 3.6 },
  { id: "ix", label: "IX", kind: "inactive", pathway: "intrinsic", x: 83, y: 29.2, w: 7.5, h: 4.2 },
  { id: "ixa", label: "IXa", kind: "active", pathway: "intrinsic", x: 73, y: 29.2, w: 7.5, h: 4.2 },
  { id: "ca-ix", label: "Ca²⁺", kind: "cofactor-dot", group: "ca", pathway: "intrinsic", x: 92, y: 29.3, w: 5, h: 5 },

  // Intrinsic lower / tenase
  { id: "thrombin-loop", label: "Thrombin", kind: "cofactor-sm", pathway: "intrinsic", x: 57, y: 33.2, w: 6.5, h: 3.5 },
  { id: "viii", label: "VIII", kind: "cofactor", pathway: "intrinsic", x: 65, y: 35.8, w: 7, h: 4.2 },
  { id: "viiia", label: "VIIIa", kind: "active", pathway: "intrinsic", x: 74, y: 35.8, w: 7.5, h: 4.2 },
  { id: "platelet-pl", label: "Platelet phospholipids", kind: "pl", pathway: "intrinsic", x: 83.5, y: 35.8, w: 13.5, h: 4.2 },
  { id: "factor-x-activator", label: "Factor X activator complex", kind: "complex", pathway: "intrinsic", x: 67, y: 43, w: 24, h: 4.8 },

  // Common
  { id: "x", label: "X", kind: "inactive", pathway: "common", x: 45.5, y: 31, w: 9, h: 4.5 },
  { id: "xa", label: "Xa (prothrombinase)", kind: "active", pathway: "common", x: 40.5, y: 39, w: 19, h: 4.8 },
  { id: "prothrombin", label: "Prothrombin", kind: "inactive", pathway: "common", x: 32, y: 48.5, w: 13, h: 4.2 },
  { id: "thrombin", label: "Thrombin", kind: "active", pathway: "common", x: 52.5, y: 48.5, w: 13, h: 4.2 },
  { id: "ca-common", label: "Ca²⁺", kind: "cofactor-dot", group: "ca", pathway: "common", x: 47.2, y: 54.2, w: 5, h: 5 },
  { id: "fibrinogen", label: "Fibrinogen", kind: "inactive", pathway: "common", x: 32, y: 61, w: 13, h: 4.2 },
  { id: "fibrin", label: "Fibrin", kind: "active", pathway: "common", x: 52.5, y: 61, w: 13, h: 4.2 },
  { id: "xiii", label: "XIII", kind: "inactive", pathway: "common", x: 22, y: 68.5, w: 8.5, h: 4.2 },
  { id: "xiiia", label: "XIIIa", kind: "active", pathway: "common", x: 33, y: 68.5, w: 8.5, h: 4.2 },
  { id: "crosslink", label: "Cross-linking of fibrin!", kind: "burst-end", pathway: "common", x: 39, y: 76.5, w: 22, h: 8 },
];

/**
 * Hand-routed arrow paths in the 1000 × 720 answer-sheet viewBox.
 * They deliberately run through dedicated gutters so no two lines cross.
 */
const CASCADE_ARROWS = [
  { d: "M500 50 L195 85", type: "main" },
  { d: "M500 50 L808 85", type: "main" },
  { d: "M195 117 L130 120", type: "main" },
  { d: "M200 131 L220 131", type: "main" },
  { d: "M257 148 L257 164 L262 164 L262 169", type: "main" },
  { d: "M105 184 L195 184", type: "main" },
  { d: "M145 169 L257 169", type: "cofactor" },
  { d: "M330 184 L360 184 L360 270 L500 270", type: "main" },

  { d: "M808 117 L868 117 L868 130", type: "main" },
  { d: "M830 130 L805 130", type: "main" },
  { d: "M767 148 L767 162 L868 162 L868 169", type: "main" },
  { d: "M830 178 L805 178", type: "main" },
  { d: "M767 196 L767 210 L868 210 L868 216", type: "main" },
  { d: "M830 225 L805 225", type: "main" },
  { d: "M915 178 L830 178", type: "cofactor" },
  { d: "M945 238 L830 238 L830 225", type: "cofactor" },

  { d: "M718 273 L740 273", type: "main" },
  { d: "M635 252 L723 252 L723 273", type: "cofactor" },
  { d: "M768 240 L768 303 L790 303", type: "main" },
  { d: "M778 295 L778 303 L790 303", type: "main" },
  { d: "M902 295 L902 303 L850 303", type: "main" },
  { d: "M902 252 L980 252 L980 130 L830 130", type: "cofactor" },

  { d: "M500 258 L500 281", type: "main" },
  { d: "M790 344 L650 344 L650 270 L500 270", type: "main" },
  { d: "M262 200 L360 200 L360 270 L500 270", type: "main" },
  { d: "M500 315 L500 337 L385 337 L385 349", type: "main" },
  { d: "M500 315 L500 337 L590 337 L590 349", type: "main" },
  { d: "M450 364 L525 364", type: "main" },
  { d: "M497 405 L497 364 L525 364", type: "cofactor" },
  { d: "M590 379 L590 422 L385 422 L385 439", type: "main" },
  { d: "M450 454 L525 454", type: "main" },
  { d: "M590 379 L590 490 L262 490 L262 493", type: "main" },
  { d: "M305 508 L325 508", type: "main" },
  { d: "M590 469 L590 551 L500 551", type: "main" },
  { d: "M410 508 L410 551 L500 551", type: "main" },
];

const STORAGE_KEY = "critical-care-coag-best-ms";
