// Brand + launch config. Everything here is swappable in a single PR pre-launch
// so the founder can rename the token, drop in the real CA, or change socials
// without code review.

export const config = {
  NAME: '$DIAL',
  TICKER: 'DIAL',
  TAGLINE: "TURN THE DIAL. MEET SOMEONE WHO DOESN'T KNOW WHAT'S COMING.",

  // 'TBA' renders the buy button as disabled "AWAITING DEPLOY" until launch.
  CA: 'TBA' as const,
  PUMP_URL_TEMPLATE: 'https://pump.fun/{CA}',

  // Set to true once the token is live and a Dexscreener pair exists.
  liveOnDex: false,
  DEXSCREENER_PAIR: '', // fill in post-launch

  X_URL: 'https://x.com/dialterminal',
  TG_URL: 'https://t.me/dialterminal',

  // First-load dial position. Morning after Apollo 11 lands — broadly positive,
  // memorable, low risk of dropping a first-time visitor into something heavy.
  DEFAULT_DATE: '1969-07-21',

  // Shown as quick-pick chips in the TimeDial component.
  PRESET_DATES: [
    { date: '1969-07-21', label: 'MOON +1' },
    { date: '2001-09-12', label: '9/11 +1' },
    { date: '1963-11-23', label: 'JFK +1' },
    { date: '1989-11-10', label: 'WALL +1' },
    { date: '1912-04-16', label: 'TITANIC +1' },
    { date: '1929-10-25', label: 'CRASH +1' },
  ],

  // Date floor — earlier than this and Sonnet's accuracy collapses.
  MIN_DATE: '1500-01-01',
} as const;

export const pumpFunUrl = (ca: string) =>
  config.PUMP_URL_TEMPLATE.replace('{CA}', ca);

export const isCaPlaceholder = (ca: string) => ca === 'TBA' || ca.length < 32;
