// Era-flavored conversation starters. Three are surfaced beneath the prompt
// after the persona arrives — period-specific, so a 1640 visitor doesn't see
// "what's on TV?". They fade once the user types their own first message.
//
// Keep these short, lower-case, plain-spoken — they're meant to read as
// thoughts the visitor might already be having, not as menu items.

type Bucket = { until: number; prompts: string[] };

const BUCKETS: Bucket[] = [
  {
    until: 1700,
    prompts: [
      "what news from the court?",
      "is there plague nearby?",
      "what year is it in your reckoning?",
      "is there a king on the throne?",
      "what trade are you in?",
      "do you fear the devil?",
      "what's the price of bread?",
    ],
  },
  {
    until: 1850,
    prompts: [
      "what news from the capital?",
      "any war on at the moment?",
      "what's in the paper today?",
      "who's the magistrate hereabouts?",
      "do you keep a horse?",
      "what trade do you follow?",
      "is the harvest in?",
    ],
  },
  {
    until: 1920,
    prompts: [
      "what's in the morning paper?",
      "are you for the union or against?",
      "any news from the front?",
      "who's running for president?",
      "ever ridden in a motorcar?",
      "what year did they bring the telegraph here?",
      "what's the price of a loaf?",
    ],
  },
  {
    until: 1960,
    prompts: [
      "what's on the wireless tonight?",
      "did you see the picture this week?",
      "who's playing the dance hall?",
      "is the war really over?",
      "what's the rent on a place like yours?",
      "you been listening to the ball game?",
      "any tornados out your way?",
    ],
  },
  {
    until: 2000,
    prompts: [
      "what's on the radio?",
      "what's everybody watching?",
      "who's the president?",
      "you heard about the Beatles?",
      "what year is it for you?",
      "what's the weather like?",
      "is it true about the moon?",
    ],
  },
  {
    until: 9999,
    prompts: [
      "what's the news today?",
      "anything trending right now?",
      "what year is it where you are?",
      "what's the weather doing?",
      "you on social media?",
      "what's everyone arguing about?",
      "is the world ending?",
    ],
  },
];

function bucketFor(year: number): Bucket {
  for (const b of BUCKETS) if (year < b.until) return b;
  return BUCKETS[BUCKETS.length - 1];
}

// Deterministic-but-mixed pick of 3 prompts per date so the same date always
// shows the same 3 prompts (less jitter on persona reroll).
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function quickPromptsFor(date: string): string[] {
  const year = parseInt(date.slice(0, 4), 10);
  const bucket = bucketFor(year);
  const seed = hashStr(date);
  // Shuffle the prompts deterministically and take 3.
  const arr = [...bucket.prompts];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor((((seed * (i + 1)) >>> 0) % (i + 1)));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}
