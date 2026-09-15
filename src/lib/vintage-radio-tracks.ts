export interface VintageTrack {
  id: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  label?: string;
  culturalNote: string;
  /** Audio source file path or URL. Defaults to local sample loop if file is not customized. */
  src: string;
}

export const VINTAGE_TRACKS: VintageTrack[] = [
  {
    id: "synchro-system",
    title: "Synchro System",
    artist: "King Sunny Ade & His African Beats",
    year: "1983",
    genre: "Jùjú",
    label: "Island Records",
    culturalNote:
      "A landmark global release featuring talking drums, pedal steel guitars, and hypnotic polyrhythms.",
    src: "/audio/vintage-highlife-loop.mp3",
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
    src: "/audio/vintage-highlife-loop.mp3",
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
    src: "/audio/vintage-highlife-loop.mp3",
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
    src: "/audio/vintage-highlife-loop.mp3",
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
    src: "/audio/vintage-highlife-loop.mp3",
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
    src: "/audio/vintage-highlife-loop.mp3",
  },
  {
    id: "ijo-shina",
    title: "Ijo Shina (Ace)",
    artist: "Sir Shina Peters & His International Stars",
    year: "1989",
    genre: "Afro-Jùjú",
    label: "CBS Nigeria",
    culturalNote:
      "The high-energy revolution blending Jùjú with fast electronic tempo that took the nation by storm.",
    src: "/audio/vintage-highlife-loop.mp3",
  },
];
