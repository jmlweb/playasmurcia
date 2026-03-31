#!/bin/bash
# PostToolUse hook: auto-validate data JSON files after Write/Edit
# Runs validate-beaches.js when any file under data/*.json is modified.
# Always exits 0 to never block writes.

set -euo pipefail

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.file // empty' 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only run for data/*.json files
case "$FILE_PATH" in
  */data/*.json)
    # Find project root
    DIR=$(dirname "$FILE_PATH")
    while [ "$DIR" != "/" ]; do
      if [ -f "$DIR/package.json" ]; then
        cd "$DIR"
        node scripts/validate-beaches.js 2>&1 | tail -5
        exit 0
      fi
      DIR=$(dirname "$DIR")
    done
    ;;
esac

exit 0
