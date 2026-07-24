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
  { id: "ca-ext", label: "Ca²⁺", kind: "cofactor-dot", group: "ca", pathway: "extrinsic", x: 12.5, y: 23.2, w: 5, h: 5 },
  { id: "vii-iii", label: "VII – III complex", kind: "inactive", pathway: "extrinsic", x: 19.5, y: 23.5, w: 13.5, h: 4.2 },

  // Intrinsic upper
  { id: "xii", label: "XII", kind: "inactive", pathway: "intrinsic", x: 73, y: 16, w: 7.5, h: 4.2 },
  { id: "xiia", label: "XIIa", kind: "active", pathway: "intrinsic", x: 83, y: 16, w: 7.5, h: 4.2 },
  { id: "xi", label: "XI", kind: "inactive", pathway: "intrinsic", x: 73, y: 22.5, w: 7.5, h: 4.2 },
  { id: "xia", label: "XIa", kind: "active", pathway: "intrinsic", x: 83, y: 22.5, w: 7.5, h: 4.2 },
  { id: "hmw", label: "HMW kininogen", kind: "cofactor-sm", pathway: "intrinsic", x: 91.5, y: 22.8, w: 7.2, h: 3.6 },
  { id: "ix", label: "IX", kind: "inactive", pathway: "intrinsic", x: 73, y: 29.2, w: 7.5, h: 4.2 },
  { id: "ixa", label: "IXa", kind: "active", pathway: "intrinsic", x: 83, y: 29.2, w: 7.5, h: 4.2 },
  { id: "ca-ix", label: "Ca²⁺", kind: "cofactor-dot", group: "ca", pathway: "intrinsic", x: 92, y: 29.3, w: 5, h: 5 },

  // Intrinsic lower / tenase
  { id: "thrombin-loop", label: "Thrombin", kind: "cofactor-sm", pathway: "intrinsic", x: 57, y: 36, w: 6.5, h: 3.5 },
  { id: "viii", label: "VIII", kind: "cofactor", pathway: "intrinsic", x: 65, y: 35.8, w: 7, h: 4.2 },
  { id: "viiia", label: "VIIIa", kind: "active", pathway: "intrinsic", x: 74, y: 35.8, w: 7.5, h: 4.2 },
  { id: "platelet-pl", label: "Platelet Phospholipids", kind: "pl", pathway: "intrinsic", x: 83.5, y: 35.8, w: 13.5, h: 4.2 },
  { id: "factor-x-activator", label: "Factor X activator Complex", kind: "complex", pathway: "intrinsic", x: 67, y: 43, w: 24, h: 4.8 },

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

/** Directed edges for flowchart arrows (fromId → toId), matching the sample. */
const CASCADE_EDGES = [
  ["injury", "damaged-tissue"],
  ["injury", "exposed-collagen"],
  ["damaged-tissue", "tissue-factor"],
  ["tissue-factor", "iiia"],
  ["vii", "vii-iii"],
  ["ca-ext", "vii-iii"],
  ["iiia", "vii-iii"],
  ["vii-iii", "x"],
  ["exposed-collagen", "xii"],
  ["xii", "xiia"],
  ["xiia", "xi"],
  ["xi", "xia"],
  ["hmw", "xia"],
  ["xia", "ix"],
  ["ix", "ixa"],
  ["ca-ix", "ixa"],
  ["thrombin-loop", "viii"],
  ["viii", "viiia"],
  ["ixa", "factor-x-activator"],
  ["viiia", "factor-x-activator"],
  ["platelet-pl", "factor-x-activator"],
  ["factor-x-activator", "x"],
  ["x", "xa"],
  ["xa", "prothrombin"],
  ["xa", "thrombin"],
  ["ca-common", "thrombin"],
  ["prothrombin", "thrombin"],
  ["thrombin", "fibrinogen"],
  ["fibrinogen", "fibrin"],
  ["thrombin", "xiii"],
  ["xiii", "xiiia"],
  ["fibrin", "crosslink"],
  ["xiiia", "crosslink"],
];

const STORAGE_KEY = "critical-care-coag-best-ms";
const MAX_OVERLAP = 0.2;
