// R-WEF brand tokens (from the R-WEF Brand Guidelines).
// Flat design only: no gradients, no drop shadows anywhere in this app.
export const C = {
  forest: "#0B6B3A",
  forestDark: "#084D29",
  forestTint: "#E7F1EA",
  yellow: "#F3C623",
  yellowTint: "#FDF3D3",
  teal: "#0F4C5C",
  tealTint: "#E7EEF0",
  brown: "#6A4F35",
  rust: "#B0451F",
  rustTint: "#F7E7E0",
  bg: "#F7F8F6",
  panel: "#FFFFFF",
  ink: "#152018",
  inkSoft: "#4B564E",
  line: "#E3E7E1",
};

export const ICON_PATH =
  "M1566.152,818.46c-1.529,208.838 -101.758,363.588 -134.504,412.446c-41.229,61.517 -196.667,274.6 -477.413,329.867c-156.712,30.85 -362.596,14.933 -463.567,-84.175c-60.579,-59.462 -90.708,-133.979 -90.708,-133.979c-5.842,-14.45 -21.163,-54.9 -26.529,-110.033c-1.817,-18.683 -6.362,-79.979 14.604,-155.196c28.092,-100.771 84.45,-163.238 100.071,-179.788c100.062,-106.017 224.796,-125.508 263.162,-130.462c39.046,-5.042 79.283,-5.375 119.763,-0.808c-41.142,-43.425 -85.042,-89.367 -128.467,-135.792c-33.104,-35.433 -32.342,-77.808 1.046,-109.771c31.012,-29.583 70.963,-27.537 104.496,5.375c82.758,81.188 165.517,162.425 248.321,243.567c45.992,45.042 47.038,87.8 1.904,133.171c-83.187,83.617 -166.708,166.946 -250.371,250.133c-33.387,33.196 -77.571,34.004 -110.342,2.996c-31.533,-29.871 -31.296,-72.675 2.092,-107.017c35.15,-36.146 71.438,-71.154 107.017,-106.825c4.325,-4.329 7.562,-9.654 11.271,-14.504c0.975,-0.613 1.504,-1.704 1.338,-2.742c-0.213,-1.321 -1.521,-2.358 -3.05,-2.254c-8.087,-1 -16.125,-1.712 -24.112,-2.142c-0.004,0 -33.896,-1.8 -65.683,2.808c-22.142,3.208 -149.446,29.925 -209.467,148.396c-9.325,18.404 -35.658,71.892 -27.538,143.779c2.208,19.55 11.388,79.642 59.258,134.2c48.7,55.5 108.129,71.879 135.858,79.117c30.379,7.925 94.592,19.604 203.188,-12.996c67.179,-20.167 246.254,-73.525 369.979,-256c19.892,-29.333 144.642,-219.888 98.538,-466.554c-52.958,-283.367 -304.288,-505.738 -564.183,-523.85c-255.883,-17.837 -453.554,87.8 -584.446,306.492c-107.154,179.021 -111.958,369.175 -31.15,567.604c12.033,30.063 31.008,70.396 60.592,113.913c14.892,34.996 5.542,74.896 -21.521,97.183c-31.9,26.275 -82.567,23.25 -113.938,-10c-90.412,-130.417 -142.921,-289.417 -141.637,-461.258c3.329,-442.663 351.533,-788.392 791.579,-783.304c411.096,4.754 777.458,420.717 774.55,818.404";

export const ROLES = [
  { id: "admin", label: "Admin" },
  { id: "lead", label: "Lead" },
  { id: "associate", label: "Associate" },
];

export const STATUSES = [
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "review", label: "In review" },
  { id: "done", label: "Done" },
];

export function deadlineInfo(deadline, status) {
  if (!deadline) return null;
  if (status === "done") return { label: "Done", bg: C.forestTint, fg: C.forestDark };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline + "T00:00:00");
  const diffDays = Math.round((d - today) / 86400000);
  if (diffDays < 0)
    return { label: `Overdue ${Math.abs(diffDays)}d`, bg: C.rustTint, fg: C.rust, alert: "overdue" };
  if (diffDays <= 3)
    return {
      label: diffDays === 0 ? "Due today" : `Due in ${diffDays}d`,
      bg: C.yellowTint,
      fg: "#8a6a10",
      alert: "soon",
    };
  return {
    label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    bg: C.bg,
    fg: C.inkSoft,
  };
}

export const inputStyle = {
  width: "100%",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  padding: "9px 11px",
  borderRadius: 7,
  border: `1px solid ${C.line}`,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  color: C.ink,
};
