// Shared alpha-tint scale for mood/loop colors.
// Every loop/event/member color in the app is a plain hex string (e.g. "#A9C7FF") that
// gets alpha-suffixed on the fly to make badges, icon backgrounds, borders, etc. Before
// this file, each component picked its own suffix ("20", "25", "30", "45"...) by hand,
// so nothing stayed consistent across LoopDetail, EventDetail, and LoopChat. Use these
// named levels instead of hardcoding a new suffix.
const TINT_LEVELS = {
  faint: "15", // very light wash — sticky header backgrounds
  subtle: "20", // icon backgrounds, badge backgrounds
  soft: "25", // "joined" / "following" pill backgrounds
  medium: "30", // stronger badge/icon backgrounds, avatar fill
  border: "40", // card borders
  strong: "45", // own-message chat bubble background
  glow: "50", // button box-shadow glow, "joined" border
  borderStrong: "60", // avatar rings, active/own borders
} as const;

export type TintLevel = keyof typeof TINT_LEVELS;

export function tint(color: string, level: TintLevel): string {
  return `${color}${TINT_LEVELS[level]}`;
}
