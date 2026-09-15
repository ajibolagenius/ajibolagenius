import { RADIO_PREVIEWS } from "./vintage-radio-previews";

/** Ambience bed used when a track has no resolved Apple preview. */
export const FALLBACK_LOOP = "/audio/vintage-highlife-loop.mp3";

export interface VintageTrack {
  id: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  label?: string;
  culturalNote: string;
  /** Source backing the cultural note, surfaced as a citation in the player. */
  wikiUrl: string;
  /** Search term for the Apple lookup. Explicit so a match is never ambiguous. */
  appleQuery: string;
  /** Apple 30s preview when resolved, local ambience loop otherwise. */
  src: string;
  /** Apple Music page. Shown alongside a preview as required attribution. */
  listenUrl?: string;
}

type Curated = Omit<VintageTrack, "src" | "listenUrl">;

/**
 * Editorial curation — hand-maintained. Audio URLs are resolved separately by
 * scripts/resolve-radio-previews.mjs so that the crate's writing and its
 * playback links never have to be edited in the same place.
 */
const CURATION: Curated[] = [
  {
    id: "synchro-system",
    title: "Synchro System",
    artist: "King Sunny Ade & His African Beats",
    year: "1983",
    genre: "Jùjú",
    label: "Island Records",
    culturalNote:
      "A landmark global release featuring talking drums, pedal steel guitars, and hypnotic polyrhythms.",
    wikiUrl: "https://en.wikipedia.org/wiki/Synchro_System",
    appleQuery: "King Sunny Ade Synchro System",
  },
  {
    id: "water-no-get-enemy",
    title: "Water No Get Enemy",
    artist: "Fela Anikulapo Kuti & Africa 70",
    year: "1975",
    genre: "Afrobeat",
    label: "Kalakuta Records",
    culturalNote:
      "A philosophical Afrobeat masterpiece weaving electric piano meditation with poignant horn arrangements.",
    wikiUrl: "https://en.wikipedia.org/wiki/Expensive_Shit",
    appleQuery: "Fela Kuti Water No Get Enemy",
  },
  {
    id: "guitar-boy",
    title: "Guitar Boy",
    artist: "Sir Victor Uwaifo & His Melody Maestros",
    year: "1966",
    genre: "Ekassa / Highlife",
    label: "Philips West Africa",
    culturalNote:
      "Inspired by Uwaifo's midnight encounter at Lagos Bar Beach, pioneering Nigeria's first gold disc record.",
    wikiUrl: "https://en.wikipedia.org/wiki/Victor_Uwaifo",
    appleQuery: "Victor Uwaifo Guitar Boy",
  },
  {
    id: "board-members",
    title: "Board Members",
    artist: "Chief Commander Ebenezer Obey & His Inter-Reformers",
    year: "1972",
    genre: "Miliki Jùjú",
    label: "Decca Records",
    culturalNote:
      "The quintessential Miliki anthem celebrating Lagos high society, philosophy, and good fortune.",
    wikiUrl: "https://en.wikipedia.org/wiki/Ebenezer_Obey",
    appleQuery: "Ebenezer Obey Board Members",
  },
  {
    id: "fantastic-man",
    title: "Fantastic Man",
    artist: "William Onyeabor",
    year: "1979",
    genre: "Synth Funk",
    label: "Wilfilms Records",
    culturalNote:
      "Recorded in Enugu using early Moog synthesizers, decades ahead of its time in electronic groove.",
    wikiUrl: "https://en.wikipedia.org/wiki/William_Onyeabor",
    appleQuery: "William Onyeabor Fantastic Man",
  },
  {
    id: "one-love",
    title: "One Love",
    artist: "Onyeka Onwenu",
    year: "1986",
    genre: "Highlife Pop",
    label: "PolyGram Nigeria",
    culturalNote:
      "The enduring anthem of unity, resilience, and compassion that soundtracked a generation.",
    wikiUrl: "https://en.wikipedia.org/wiki/Onyeka_Onwenu",
    appleQuery: "Onyeka Onwenu One Love",
  },
  {
    id: "shinamania",
    title: "Shinamania",
    artist: "Sir Shina Peters & His International Stars",
    year: "1990",
    genre: "Afro-Jùjú",
    culturalNote:
      "The follow-up to Ace that cemented Afro-Jùjú's reign, fusing Jùjú with a fast electronic tempo that took the nation by storm.",
    wikiUrl: "https://en.wikipedia.org/wiki/Shina_Peters",
    appleQuery: "Shina Peters Shinamania",
  },
];

export const VINTAGE_TRACKS: VintageTrack[] = CURATION.map((track) => {
  const preview = RADIO_PREVIEWS[track.id];
  return {
    ...track,
    src: preview?.previewUrl ?? FALLBACK_LOOP,
    listenUrl: preview?.listenUrl,
  };
});
