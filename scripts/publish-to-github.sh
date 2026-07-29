#!/usr/bin/env bash
set -euo pipefail

REPO="vgargatgit/learning-representations-backprop-errors"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required. On macOS: brew install gh" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Authenticate first with: gh auth login" >&2
  exit 1
fi

if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "Repository $REPO already exists; adding it as origin."
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
  git push -u origin main
else
  gh repo create "$REPO" \
    --private \
    --description "Illustrated, calculation-first guide to Learning representations by back-propagating errors (1986)" \
    --source . \
    --remote origin \
    --push
fi

echo "Published: https://github.com/$REPO"
