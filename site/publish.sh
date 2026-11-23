#!/usr/bin/env bash
# Publish the built website to the public GitHub Pages repo.
#   bash publish.sh <git-remote-url> [branch]     e.g. SITE_URL=https://seen.creova.one bash publish.sh https://github.com/creova-studios/seen-site.git
# Builds with SITE_URL, replaces static site files with dist/ while preserving repo governance files (history is kept), commits and pushes.
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
git ls-files | grep -Ev '^(\.github/|\.gitignore$|README\.md$|LICENSE$|SECURITY\.md$|AGENTS\.md$)' | xargs -r git rm -q --ignore-unmatch -- || true
cp -R "$here/dist/." .
git add -A
if git diff --cached --quiet; then echo "Nothing to publish: the site is unchanged."; exit 0; fi
git commit --quiet -m "chore(site): publish SEEN static web artifact"
git push origin "$branch"
echo "Published to $remote ($branch)."
