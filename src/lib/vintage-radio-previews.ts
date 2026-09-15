/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/resolve-radio-previews.mjs
 *
 * Local audio tracks and store attribution URLs for the curated crate.
 * Audio is served directly from /audio/tracks/ for zero-latency instant playback,
 * and every track is paired with its `listenUrl` as attribution.
 */
export interface RadioPreview {
  previewUrl: string;
  listenUrl: string;
  matchedTitle: string;
  matchedArtist: string;
}

export const RADIO_PREVIEWS: Record<string, RadioPreview | undefined> = {
  "synchro-system": {
    "previewUrl": "/audio/tracks/synchro-system.m4a",
    "listenUrl": "https://music.apple.com/us/album/synchro-system/1631642977?i=1631642978&uo=4",
    "matchedTitle": "Synchro System",
    "matchedArtist": "King Sunny Ade"
  },
  "water-no-get-enemy": {
    "previewUrl": "/audio/tracks/water-no-get-enemy.m4a",
    "listenUrl": "https://music.apple.com/us/album/water-no-get-enemy/739004054?i=739004068&uo=4",
    "matchedTitle": "Water No Get Enemy",
    "matchedArtist": "Fela Kuti"
  },
  "guitar-boy": {
    "previewUrl": "/audio/tracks/guitar-boy.m4a",
    "listenUrl": "https://music.apple.com/us/album/guitar-boy/176609383?i=176609507&uo=4",
    "matchedTitle": "Guitar Boy",
    "matchedArtist": "Sir Victor Uwaifo"
  },
  "board-members": {
    "previewUrl": "/audio/tracks/board-members.m4a",
    "listenUrl": "https://music.apple.com/us/album/board-members/377162759?i=377164124&uo=4",
    "matchedTitle": "Board Members",
    "matchedArtist": "Ebenezer Obey"
  },
  "fantastic-man": {
    "previewUrl": "/audio/tracks/fantastic-man.m4a",
    "listenUrl": "https://music.apple.com/us/album/fantastic-man/708418132?i=708418258&uo=4",
    "matchedTitle": "Fantastic Man",
    "matchedArtist": "William Onyeabor"
  },
  "one-love": {
    "previewUrl": "/audio/tracks/one-love.m4a",
    "listenUrl": "https://music.apple.com/us/album/one-love/1475198000?i=1475198188&uo=4",
    "matchedTitle": "One Love",
    "matchedArtist": "Onyeka Onwenu"
  },
  "shinamania": {
    "previewUrl": "/audio/tracks/shinamania.m4a",
    "listenUrl": "https://music.apple.com/us/album/shinamania-pt-1/517169493?i=517169997&uo=4",
    "matchedTitle": "Shinamania, Pt. 1",
    "matchedArtist": "Sir Shina Peters"
  }
};

