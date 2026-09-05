# Guide Video Assets

Place your Google Flow-generated video clips here.

## Required files per state

| State       | Files needed                          | Behavior              |
|-------------|---------------------------------------|-----------------------|
| `idle`      | `idle.mp4`, `idle.webm`, `idle.jpg`   | 3-5s loop             |
| `greeting`  | `greeting.mp4`, `greeting.webm`       | Plays once on load    |
| `listening` | `listening.mp4`, `listening.webm`     | 2-3s loop while typing|
| `explaining`| `explaining.mp4`, `explaining.webm`   | 3-5s loop on answer   |

## Compression

```bash
# MP4 (H.264 — fallback)
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow -an output.mp4

# WebM (VP9 — better compression)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -an output.webm

# Poster image (first frame)
ffmpeg -i input.mp4 -vframes 1 poster.jpg
```

## Placeholder

Until real clips exist, the GuideWidget uses a solid-color
animated div as a stand-in. No broken video references.
