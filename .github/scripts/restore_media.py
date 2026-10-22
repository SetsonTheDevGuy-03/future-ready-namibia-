#!/usr/bin/env python3
"""Reconstruct original website media from manageable, encoded transfer pieces."""
from pathlib import Path
from base64 import b64decode
from hashlib import sha1
import shutil

MEDIA = {
    "episode-01": ("assets/audio/episode-01-youth-unemployment.mp3", "c20a4bb0c54d11168a6411ccc1f8862b13b168b5"),
    "episode-02": ("assets/audio/episode-02-online-work.mp3", "bdef08527fbf29edc0efbc3ba433b7a56ef6383f"),
    "episode-03": ("assets/audio/episode-03-one-skill.mp3", "1856c821c6aefdd52a0acac95a27c5ea66bff6e7"),
    "scripts": ("assets/docs/FutureReady_Podcast_Recording_Scripts.pdf", "83497cc8468da666f053a08998ccc166b8db188f"),
    "video": ("assets/video/futureready-skills-journey.mp4", "815d04cb73381083b9731d72e307a934fbc771c0"),
}

for folder, (destination, expected_sha) in MEDIA.items():
    parts = sorted((Path("media-parts") / folder).glob("*.b64"))
    if not parts:
        raise RuntimeError(f"Missing media pieces for {folder}")
    content = "".join("".join(p.read_text(encoding="ascii").split()) for p in parts)
    raw = b64decode(content, validate=True)
    git_blob_sha = sha1(f"blob {len(raw)}\0".encode() + raw).hexdigest()
    if git_blob_sha != expected_sha:
        raise RuntimeError(f"Media integrity check failed for {folder}: {git_blob_sha}")
    target = Path(destination)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(raw)
    print(f"Restored {target} ({len(raw)} bytes)")

shutil.rmtree("media-parts")
print("All media restored and checksum-verified successfully.")
