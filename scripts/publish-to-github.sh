#!/usr/bin/env bash
set -euo pipefail

REPO="vgargatgit/learning-rep"
SITE_URL="https://vgargatgit.github.io/learning-rep/"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required. On macOS: brew install gh" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Authenticate first with: gh auth login" >&2
  exit 1
fi

if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "Repository $REPO already exists."
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
  git remote set-url origin "https://github.com/$REPO.git"
  git push -u origin main
else
  gh repo create "$REPO" \
    --public \
    --description "Illustrated guide to Learning representations by back-propagating errors (1986)" \
    --source . \
    --remote origin \
    --push
fi

# Configure GitHub Pages to deploy through the committed Actions workflow.
if gh api "repos/$REPO/pages" >/dev/null 2>&1; then
  gh api --method PUT "repos/$REPO/pages" -f build_type=workflow >/dev/null
else
  gh api --method POST "repos/$REPO/pages" -f build_type=workflow >/dev/null
fi

gh workflow run pages.yml --repo "$REPO" --ref main || true

echo "Repository: https://github.com/$REPO"
echo "Website:    $SITE_URL"
