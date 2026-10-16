#!/bin/sh
# Mirrors public/pictures/ (originals + optimized/) to the R2 bucket served at img.playasmurcia.com.
# Run after any script that adds, prunes, re-encodes or optimizes pictures. Extra args go to rclone,
# e.g. `pnpm sync:pictures --dry-run`.
#
# Requires rclone (`brew install rclone`) and, in .env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.
set -eu

cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

: "${R2_ACCOUNT_ID:?Set R2_ACCOUNT_ID in .env}"
: "${R2_ACCESS_KEY_ID:?Set R2_ACCESS_KEY_ID in .env}"
: "${R2_SECRET_ACCESS_KEY:?Set R2_SECRET_ACCESS_KEY in .env}"
BUCKET="${R2_PICTURES_BUCKET:-playasmurcia-pictures}"

# Configure the remote through env vars so no rclone.conf is needed
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true

# One week rather than immutable: pictures are sometimes replaced in place under the same name
rclone sync public/pictures "r2:${BUCKET}" \
  --exclude ".DS_Store" \
  --header-upload "Cache-Control: public, max-age=604800" \
  --transfers 16 \
  --checkers 32 \
  --progress \
  "$@"
