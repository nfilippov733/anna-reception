# Demo audio files

Per-segment sample-call clips for the Phone tab of the ChannelDemos section.

## Files

```
public/assets/audio/dental.mp3
public/assets/audio/beauty.mp3
public/assets/audio/pubs.mp3
public/assets/audio/construction.mp3
public/assets/audio/fitness.mp3
public/assets/audio/vet.mp3
```

Each is a two-voice dialogue (~9–10 s) that mirrors the phone transcript shown
for that segment in `src/content/channelDemos.ts`.

## How they're wired

`PhoneDemoPanel` (`src/components/channels/PhoneDemoPanel.tsx`) selects the file
by segment: `src={`/assets/audio/${segment}.mp3`}`. No env var needed — the Play
button is live as long as these files exist. Next.js serves anything in `public/`
at the site root, so `public/assets/audio/dental.mp3` → `/assets/audio/dental.mp3`.

## How they were generated (to regenerate / re-voice)

Generated via the ElevenLabs MCP (`text_to_speech`) + ffmpeg stitching:

- **ANNA voice:** Lily — Velvety Actress (`pFZP5JQG7iQjIQuC4Bku`), UK female.
  Settings: stability 0.55, similarity 0.8.
- **Caller voice:** George — Warm Storyteller (`JBFqnCBsd6RMkjVDRZzb`), UK male.
  Settings: stability 0.45.
- **Model:** `eleven_multilingual_v2`, output `mp3_44100_128`.

Process per segment:
1. Each transcript turn (`from: caller` → George, `from: anna` → Lily) is
   synthesized to its own temp file.
2. Turns are concatenated in order with a 0.45 s silence gap between them
   (`ffmpeg -f concat`), matching mp3 params (44.1 kHz / 128 kbps mono silence).
3. Output written here as `<segment>.mp3`.

To re-voice, change the voice IDs above and re-run the same flow. The transcripts
are the source of truth in `src/content/channelDemos.ts` — keep audio and text
in sync if you edit either.

## Format

- MP3 44.1 kHz / 128 kbps. ~150 KB per clip.
- ~9–10 s each (4-turn dialogue). The `audio_demo_completed_30s` analytics event
  fires on `ended` regardless of actual length (legacy event name).
