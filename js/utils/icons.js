// ==========================================
// Icon Utility
// Inline SVG icon set used in place of emoji
// throughout the platform. Stroke-based line
// icons matching the .icon-svg convention.
// ==========================================

const ICONS = {
  workspace: `<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 17v3"/>`,
  book: `<path d="M4 5.5c2-1 5-1 8 0 3-1 6-1 8 0v13c-2-1-5-1-8 0-3-1-6-1-8 0z"/><path d="M12 5.5v13"/>`,
  shield: `<path d="M12 3.5 19 6.5v5.2c0 4.4-3 7.6-7 8.8-4-1.2-7-4.4-7-8.8V6.5z"/><path d="M9 12l2 2 4-4.5"/>`,
  save: `<path d="M5 4.5h11L19.5 8v11a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z"/><path d="M8 4.5v4.5h6V4.5M8 14h8v6H8z"/>`,
  rocket: `<path d="M12 3c2.8 1.3 4.5 4 4.5 7.5 0 2-.6 3.7-1.5 5l-3-1.5-3 1.5c-.9-1.3-1.5-3-1.5-5C7.5 7 9.2 4.3 12 3Z"/><path d="M9.5 15.5 7 21l3-1 2 2 2-2 3 1-2.5-5.5"/><circle cx="12" cy="10" r="1.5"/>`,
  play: `<path d="M8 5.5v13l11-6.5z"/>`,
  check: `<path d="M5 12.5l4.5 4.5L19 7"/>`,
  chart: `<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>`,
  badge: `<circle cx="12" cy="9.5" r="5.5"/><path d="M9 14.5 7.5 21l4.5-2.5L16.5 21 15 14.5"/>`,
  folder: `<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z"/>`,
  code: `<path d="M9 8 5 12l4 4M15 8l4 4-4 4"/>`,
  loop: `<path d="M4 4.5V9h4.5"/><path d="M20 19.5V15h-4.5"/><path d="M5 15a7.5 7.5 0 0 0 12.8 3.2M19 9A7.5 7.5 0 0 0 6.2 5.8"/>`,
  note: `<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z"/>`,
  link: `<path d="M9.5 14.5 14.5 9.5"/><path d="M11 7.5l1-1a3 3 0 0 1 4.2 4.2l-1 1M13 16.5l-1 1a3 3 0 0 1-4.2-4.2l1-1"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  cloud: `<path d="M7 18.5a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.7-1.4A4.5 4.5 0 0 1 17 18.5Z"/>`,
  sun: `<circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/>`,
  moon: `<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5Z"/>`,
  arrowRight: `<path d="M5 12h13M13 6l6 6-6 6"/>`,
  history: `<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M3 4v4.5h4.5"/><path d="M12 8v4.5l3 2"/>`,
  refresh: `<path d="M4 4.5V9h4.5"/><path d="M20 19.5V15h-4.5"/><path d="M5 15a7.5 7.5 0 0 0 12.8 3.2M19 9A7.5 7.5 0 0 0 6.2 5.8"/>`,
};

/**
 * Returns an inline SVG icon markup for the given icon name.
 *
 * @param {string} name
 * @param {string} [extraClass]
 * @returns {string}
 */
export function icon(name, extraClass = "") {
  const paths = ICONS[name];

  if (!paths) {
    return "";
  }

  return `<svg class="icon-svg${extraClass ? " " + extraClass : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}
