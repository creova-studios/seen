#!/usr/bin/env bash
# Publish the built website to the public GitHub Pages repo.
#   bash publish.sh <git-remote-url> [branch]     e.g. bash publish.sh https://github.com/creova-gif/seen-site.git
# Builds with the default SITE_URL, replaces the repo's contents with dist/ (history is kept), commits and pushes.
# It never force-pushes. Run `npm run check` first.
set -euo pipefail
remote="${1:?usage: bash publish.sh <git-remote-url> [branch]}"
branch="${2:-main}"
here="$(cd "$(dirname "$0")" && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

(cd "$here" && node build.mjs)
git clone --quiet "$remote" "$work/repo" 2>/dev/null || { git init --quiet "$work/repo"; git -C "$work/repo" remote add origin "$remote"; }
cd "$work/repo"
git checkout --quiet "$branch" 2>/dev/null || git checkout --quiet -b "$branch"
git rm -rq --ignore-unmatch . >/dev/null 2>&1 || true
cp -R "$here/dist/." .
git add -A
if git diff --cached --quiet; then echo "Nothing to publish: the site is unchanged."; exit 0; fi
git commit --quiet -m "Publish SEEN website"
git push origin "$branch"
echo "Published to $remote ($branch)."
