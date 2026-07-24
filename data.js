/**
 * Cascade nodes positioned to mirror the sample flowchart (% of answer sheet).
 * Object sizes are ~1.5× the original tiles, scaled from each center.
 */
const CASCADE_TILES = [
  { id: "injury", label: "Injury", kind: "burst", pathway: "start", x: 40.25, y: 0.2, w: 19.5, h: 9.75 },

  { id: "damaged-tissue", label: "Damaged Tissue", kind: "burst", pathway: "extrinsic", x: 7.5, y: 5.8, w: 22.5, h: 8.7 },
  { id: "exposed-collagen", label: "Exposed Collagen", kind: "burst", pathway: "intrinsic", x: 68.5, y: 5.8, w: 23.25, h: 8.7 },

  // Extrinsic
  { id: "tissue-factor", label: "Tissue factor (III)", kind: "inactive", pathway: "extrinsic", x: 1.5, y: 14.5, w: 21, h: 6.75 },
  { id: "iiia", label: "IIIa", kind: "active", pathway: "extrinsic", x: 23.5, y: 14.5, w: 11.25, h: 6.75 },
  { id: "vii", label: "VII", kind: "inactive", pathway: "extrinsic", x: 0.8, y: 22.8, w: 10.5, h: 6.3 },
  { id: "ca-ext", label: "Ca²⁺", kind: "cofactor-dot", group: "ca", pathway: "extrinsic", x: 12.5, y: 22.2, w: 7.5, h: 7.5 },
  { id: "vii-iii", label: "VII – III complex", kind: "inactive", pathway: "extrinsic", x: 21.5, y: 22.8, w: 20.25, h: 6.3 },

  // Intrinsic upper: activated left, inactive right (XII→XIIa, XI→XIa, IX→IXa)
  { id: "xiia", label: "XIIa", kind: "active", pathway: "intrinsic", x: 73.5, y: 14.9, w: 11.25, h: 6.3 },
  { id: "xii", label: "XII", kind: "inactive", pathway: "intrinsic", x: 86.5, y: 14.9, w: 11.25, h: 6.3 },
  { id: "xia", label: "XIa", kind: "active", pathway: "intrinsic", x: 73.5, y: 22.2, w: 11.25, h: 6.3 },
  { id: "xi", label: "XI", kind: "inactive", pathway: "intrinsic", x: 86.5, y: 22.2, w: 11.25, h: 6.3 },
  { id: "hmw", label: "HMW kininogen", kind: "cofactor-sm", pathway: "intrinsic", x: 60.5, y: 22.5, w: 10.8, h: 5.4 },
  { id: "ixa", label: "IXa", kind: "active", pathway: "intrinsic", x: 73.5, y: 30.2, w: 11.25, h: 6.3 },
  { id: "ix", label: "IX", kind: "inactive", pathway: "intrinsic", x: 86.5, y: 30.2, w: 11.25, h: 6.3 },
  { id: "ca-ix", label: "Ca²⁺", kind: "cofactor-dot", group: "ca", pathway: "intrinsic", x: 55, y: 30.5, w: 7.5, h: 7.5 },

  // Intrinsic lower / tenase (activated left, inactive right)
  { id: "thrombin-loop", label: "Thrombin", kind: "cofactor-sm", pathway: "intrinsic", x: 60.5, y: 38.5, w: 9.75, h: 5.25 },
  { id: "viiia", label: "VIIIa", kind: "active", pathway: "intrinsic", x: 73.5, y: 38.5, w: 11.25, h: 6.3 },
  { id: "viii", label: "VIII", kind: "cofactor", pathway: "intrinsic", x: 86.5, y: 38.5, w: 10.5, h: 6.3 },
  { id: "platelet-pl", label: "Platelet phospholipids", kind: "pl", pathway: "intrinsic", x: 79, y: 44.8, w: 20.25, h: 6.3 },
  { id: "factor-x-activator", label: "Factor X activator complex", kind: "complex", pathway: "intrinsic", x: 62, y: 52.2, w: 36, h: 7.2 },

  // Common
  { id: "x", label: "X", kind: "inactive", pathway: "common", x: 43.25, y: 31.8, w: 13.5, h: 6.75 },
  { id: "xa", label: "Xa (prothrombinase)", kind: "active", pathway: "common", x: 35.75, y: 40.5, w: 28.5, h: 7.2 },
  { id: "prothrombin", label: "Prothrombin", kind: "inactive", pathway: "common", x: 28, y: 49.5, w: 19.5, h: 6.3 },
  { id: "thrombin", label: "Thrombin", kind: "active", pathway: "common", x: 52.5, y: 49.5, w: 19.5, h: 6.3 },
  { id: "ca-common", label: "Ca²⁺", kind: "cofactor-dot", group: "ca", pathway: "common", x: 46.25, y: 56.5, w: 7.5, h: 7.5 },
  { id: "fibrinogen", label: "Fibrinogen", kind: "inactive", pathway: "common", x: 28, y: 64.5, w: 19.5, h: 6.3 },
  { id: "fibrin", label: "Fibrin", kind: "active", pathway: "common", x: 52.5, y: 64.5, w: 19.5, h: 6.3 },
  { id: "xiii", label: "XIII", kind: "inactive", pathway: "common", x: 16, y: 72.5, w: 12.75, h: 6.3 },
  { id: "xiiia", label: "XIIIa", kind: "active", pathway: "common", x: 31, y: 72.5, w: 12.75, h: 6.3 },
  { id: "crosslink", label: "Cross-linking of fibrin!", kind: "burst-end", pathway: "common", x: 33.5, y: 85, w: 33, h: 12 },
];

/**
 * Hand-routed arrow paths in the 1000 × 720 answer-sheet viewBox.
 * They deliberately run through dedicated gutters so no two lines cross.
 */
const CASCADE_ARROWS = [
  { d: "M500 40 L185 70", type: "main" },
  { d: "M500 40 L800 70", type: "main" },
  { d: "M185 105 L120 128", type: "main" },
  { d: "M220 128 L290 128", type: "main" },
  { d: "M290 148 L290 168 L315 168 L315 185", type: "main" },
  { d: "M60 185 L160 185", type: "main" },
  { d: "M160 185 L265 185", type: "cofactor" },
  { d: "M315 200 L360 200 L360 250 L500 250", type: "main" },

  { d: "M800 105 L920 128", type: "main" },
  { d: "M920 148 L790 148", type: "main" },
  { d: "M790 170 L790 182 L920 182 L920 195", type: "main" },
  { d: "M920 215 L790 215", type: "main" },
  { d: "M790 235 L790 248 L920 248 L920 260", type: "main" },
  { d: "M920 280 L790 280", type: "main" },
  { d: "M660 182 L735 182", type: "cofactor" },
  { d: "M680 247 L735 247", type: "cofactor" },

  { d: "M920 300 L790 300", type: "main" },
  { d: "M655 295 L790 295 L790 300", type: "cofactor" },
  { d: "M790 320 L790 360 L825 360", type: "main" },
  { d: "M825 320 L825 360", type: "main" },
  { d: "M890 370 L890 385 L825 385", type: "main" },
  { d: "M890 370 L980 370 L980 148 L920 148", type: "cofactor" },

  { d: "M500 265 L500 295", type: "main" },
  { d: "M800 400 L650 400 L650 250 L500 250", type: "main" },
  { d: "M315 205 L360 205 L360 250 L500 250", type: "main" },
  { d: "M500 320 L500 345 L375 345 L375 370", type: "main" },
  { d: "M500 320 L500 345 L620 345 L620 370", type: "main" },
  { d: "M375 390 L525 390", type: "main" },
  { d: "M500 430 L500 390 L525 390", type: "cofactor" },
  { d: "M620 410 L620 470 L375 470 L375 485", type: "main" },
  { d: "M375 505 L525 505", type: "main" },
  { d: "M620 410 L620 540 L220 540 L220 545", type: "main" },
  { d: "M280 555 L330 555", type: "main" },
  { d: "M620 520 L620 620 L500 620", type: "main" },
  { d: "M375 555 L375 620 L500 620", type: "main" },
];

const STORAGE_KEY = "critical-care-coag-best-ms";
