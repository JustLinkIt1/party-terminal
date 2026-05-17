// Era-aware workshop-lamp tint. Returns an rgba() the ChassisFrame consumes
// via the --era-light CSS var, so the room behind the dial actually changes
// light source when you scroll between centuries.
//
// Tuned subtly — the chassis already has its own warm-brass palette, so the
// tint only nudges hue, never overwhelms it.

const ERAS: { until: number; light: string }[] = [
  { until: 1700, light: 'rgba(255, 138, 70, 0.22)' },   // candle, deep warm amber
  { until: 1850, light: 'rgba(255, 178, 92, 0.20)' },   // gaslight / oil lamp
  { until: 1920, light: 'rgba(255, 204, 120, 0.20)' },  // edison incandescent
  { until: 1970, light: 'rgba(255, 220, 140, 0.18)' },  // workshop incandescent (default)
  { until: 2000, light: 'rgba(218, 232, 240, 0.16)' },  // cool fluorescent
  { until: 9999, light: 'rgba(196, 220, 240, 0.18)' },  // LED daylight
];

export function eraLight(year: number): string {
  for (const era of ERAS) {
    if (year < era.until) return era.light;
  }
  return ERAS[ERAS.length - 1].light;
}
