#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
REPO="${1:-future-ready-namibia}"

for tool in git gh; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Missing $tool. Install it, then rerun this script."
    exit 1
  fi
done
if ! gh auth status >/dev/null 2>&1; then
  echo "Sign into GitHub in the browser:"
  gh auth login
fi
OWNER="$(gh api user --jq .login)"
echo "Using GitHub account: $OWNER"

if [[ ! -d .git ]]; then
  git init -b main
fi
git branch -M main 2>/dev/null || true
git config user.name "$(git config user.name || echo "$OWNER")"
git config user.email "$(git config user.email || echo "$OWNER@users.noreply.github.com")"
git add -A
if ! git diff --cached --quiet; then
  git commit -m "Publish FutureReady Namibia complete website"
fi

if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "Repository $OWNER/$REPO already exists."
  if ! git remote get-url origin >/dev/null 2>&1; then
    git remote add origin "https://github.com/$OWNER/$REPO.git"
  fi
  echo "Pushing to existing repository (make sure this is your dedicated website repo)."
  git push -u origin main
else
  echo "Creating PUBLIC GitHub repository $OWNER/$REPO ..."
  gh repo create "$OWNER/$REPO" --public --source=. --remote=origin --push
fi

echo "Attempting to enable GitHub Pages from main/(root)..."
if gh api --method POST "/repos/$OWNER/$REPO/pages" \
  -f 'source[branch]=main' -f 'source[path]=/' >/dev/null 2>&1; then
  echo "GitHub Pages was enabled."
elif gh api "/repos/$OWNER/$REPO/pages" >/dev/null 2>&1; then
  echo "GitHub Pages already exists; inspect Settings > Pages."
else
  echo "Enable it manually: repository Settings > Pages > Deploy from a branch > main > /(root) > Save"
fi

echo ""
echo "REPOSITORY: https://github.com/$OWNER/$REPO"
echo "EXPECTED SITE: https://$OWNER.github.io/$REPO/"
echo "Verify the published address in repository Settings > Pages."
