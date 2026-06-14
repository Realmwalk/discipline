# Assets

Use this document to track media assets used by the project — images, audio, video, icons, fonts, downloadable files, fonts, etc. Update it whenever code references new assets or asset paths/formats change.

**Skip or delete this file if the project ships no static assets** (a pure-logic library, a service with no media). The framework is fine without it.

## Asset Locations

Distinguish between optimized/built assets (what ships) and source/master assets (what authoring tools produce):

```text
path/to/assets/         -- optimized, served to clients
path/to/assets-source/  -- masters; may live outside the repo if files are large
```

If masters live outside the repo (Git LFS, object storage, designer's drive), say so explicitly so contributors know where to find them.

## Hosting Considerations

- Repo size: large media inflates clones; check repo size before committing big files.
- Alternatives: object storage, CDN, Git LFS, or a separate assets repo.
- Build step: if assets are processed (resized, compressed, sprite-sheeted) by a build step, document the command in `docs/DEPLOYMENT.md` or `docs/ARCHITECTURE.md`.

## Naming Rules

- Use lowercase filenames.
- Use hyphens instead of spaces (`release-name-cover.jpg`, not `Release Name Cover.jpg`).
- Keep filenames URL-safe (no spaces, apostrophes, or special characters that need escaping in HTML / URLs).
- Prefer descriptive names that survive renames elsewhere in the codebase.
- Avoid committing huge raw source files unless required.

## Current Asset Slots

Group entries by asset category when there are many — e.g. `## Images`, `## Audio`, `## Fonts`. A single flat list works for small projects.

### Asset Name

Asset type: image / audio / video / font / icon / downloadable

Canonical path (optimized, what ships):

```text
path/to/asset.ext
```

Source / master copy (delete if N/A):

```text
path/to/source/asset.psd
```

Used by:

- `path/to/file.ext`

Purpose:

- Describe what the asset is used for.

Recommended preparation (depends on asset type):

- **Images**: dimensions, format, target file size, color profile, alt text.
- **Audio**: bitrate, sample rate, channels (mono / stereo), encoding, peak/loudness target.
- **Video**: resolution, codec, container, target bitrate.
- **Fonts**: weights/styles included, formats (`.woff2`, `.ttf`), license, glyph subsetting.
- **Icons**: format (SVG / PNG sprite), size sets, monochrome vs. multicolor.

Fallback behavior:

- Describe what happens if the asset is missing or fails to load.

## Access-Controlled / Server-Mediated Assets (optional)

For projects where some assets are not served as static files but are fetched through an authenticated endpoint (paywalled media, signed URLs, gated downloads):

### Asset Name

Endpoint: `GET /api/...`

Auth model: who is allowed to fetch this and how it's verified.

What the client sees: the response shape, content-type, framing.

What stays server-side: the raw file path, signing keys, access logs.

Skip this section if all assets are public static files.

## Source Files

Describe whether source/master files should be committed or kept outside the repo. Fold into per-asset "Source / master copy" entries above when convenient; keep this section for repo-wide policy if the rule is the same across all assets.
