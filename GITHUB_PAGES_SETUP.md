# FutureReady Namibia — GitHub Pages Deployment

This is the complete static website for the ITL60US / IDT60US youth employability project.

## Site contents
- `index.html`: homepage
- `blog.html` and `posts/`: 10 blog posts
- `podcasts.html` and `assets/audio/`: three recorded episodes
- `video.html` and `assets/video/`: original educational video
- `resources.html`, `cv-builder.html`, `about.html`: resources, interactive features, team information
- `assets/style.css` and `assets/site.js`: layout and interactions
- `.nojekyll`: tells GitHub Pages to publish the whole static site as-is

No Node.js dependencies or build commands are needed.

## Option A — Through the GitHub website (no terminal required)

1. Sign in to https://github.com/SetsonTheDevGuy-03
2. Click **New repository** and name it `future-ready-namibia`.
3. Set it to **Public** (required for sharing the website openly).
4. Click **Create repository**. Adding a README initially is optional.
5. Choose **Add file > Upload files**.
6. Extract this ZIP and drag the **contents inside** the `FutureReady_Namibia_GitHub_Pages_Ready` folder into the upload area — NOT the enclosing folder or the ZIP itself.
7. Verify `index.html` appears at the repository root, alongside `blog.html`, `about.html`, and `assets/`.
8. Commit the uploaded files to the `main` branch.
9. In **Settings > Pages**, choose **Deploy from a branch**.
10. Select branch `main`, folder `/(root)`, then click **Save**.

Expected website address after publication:
https://SetsonTheDevGuy-03.github.io/future-ready-namibia/

The address above is an EXPECTED address, not a verified live website.

## Option B — One-command publishing (GitHub CLI)

The package includes:
- `PUBLISH_TO_GITHUB_PAGES.sh` for macOS/Linux/Git Bash
- `PUBLISH_TO_GITHUB_PAGES.ps1` for Windows PowerShell

Install `git` and GitHub CLI (`gh`), sign in with `gh auth login`,
then run one of those scripts in this folder. It creates a public repository,
uploads the content, and attempts to enable GitHub Pages automatically.
If Pages cannot be enabled by the CLI, finish Step 9–10 in Option A manually.

## Final pre-submission checklist
- [ ] Homepage opens from the published GitHub Pages URL.
- [ ] Ten article pages load.
- [ ] Three MP3 podcast players work from the published site.
- [ ] Educational video plays.
- [ ] Menu, dark mode, blog search, 30-day tracker, CV builder work.
- [ ] Four names and student numbers are correct (and acceptable to publish publicly).
- [ ] Lecturer has approved a four-member group, since assignment says five.
- [ ] Sources/statistics have been proofread and credited accurately.
- [ ] Copy the final live website link and send it to the lecturer before 23 October 2026.

Note: GitHub Pages is publicly accessible. The About page currently shows
student numbers. If you prefer not to publish those numbers, edit about.html
before upload.
