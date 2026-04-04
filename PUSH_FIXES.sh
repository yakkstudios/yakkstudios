#!/bin/bash
# ============================================
# YAKK STUDIOS — ONE-CLICK FIX PUSHER
# Just double-click this or run: bash PUSH_FIXES.sh
# ============================================

echo ""
echo "🩷 YAKK STUDIOS — Pushing API + Wren fixes..."
echo ""

# Find the repo — try common locations
REPO=""
for dir in \
  "$HOME/yakkstudios" \
  "$HOME/Desktop/yakkstudios" \
  "$HOME/Documents/yakkstudios" \
  "$HOME/Projects/yakkstudios" \
  "$HOME/dev/yakkstudios" \
  "$HOME/code/yakkstudios" \
  "$HOME/repos/yakkstudios" \
  "$HOME/GitHub/yakkstudios" \
  ; do
  if [ -d "$dir/.git" ]; then
    REPO="$dir"
    break
  fi
done

# If not found, ask
if [ -z "$REPO" ]; then
  echo "❌ Could not auto-find your yakkstudios repo."
  echo "   Drag your yakkstudios folder here and press Enter:"
  read -r REPO
  REPO=$(echo "$REPO" | sed "s/^ *//;s/ *$//;s/^'//;s/'$//")
fi

if [ ! -d "$REPO/.git" ]; then
  echo "❌ Not a git repo: $REPO"
  echo "   Make sure you point to the folder that has .git inside it."
  exit 1
fi

echo "✅ Found repo at: $REPO"
cd "$REPO" || exit 1

# Find the patch file
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PATCH="$SCRIPT_DIR/0001-fix-kill-API-500s-Wren-rewrite.patch"

if [ ! -f "$PATCH" ]; then
  echo "❌ Patch file not found at: $PATCH"
  echo "   Make sure 0001-fix-kill-API-500s-Wren-rewrite.patch is in the same folder as this script."
  exit 1
fi

echo "📋 Applying patch..."
git am "$PATCH"

if [ $? -ne 0 ]; then
  echo ""
  echo "⚠️  Patch didn't apply cleanly. Trying fallback method..."
  git am --abort 2>/dev/null
  git apply "$PATCH"
  if [ $? -ne 0 ]; then
    echo "❌ Could not apply patch. Your repo might have changes that conflict."
    echo "   Message Claude and paste this error output."
    exit 1
  fi
  git add -A
  git commit -m "fix: kill API 500s + Wren mission rewrite + icon update

- price/route.ts: remove next:{revalidate} from fetch, add multi-endpoint fallback
- stats/route.ts: same fix + in-memory 30s TTL cache + n8n fallback chain
- screener/route.ts: remove next:{revalidate}, graceful fallback
- Wren.tsx: rewrite — now UK grooming gang exposure + giving women a voice
- constants.ts: Wren icon updated

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
fi

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ DONE! Fixes pushed. Vercel will auto-deploy in ~60 seconds."
  echo "   Check https://yakkstudios.xyz in 2 minutes."
  echo ""
else
  echo ""
  echo "❌ Push failed. You might need to run: git pull --rebase origin main"
  echo "   Then run this script again."
fi
