---
id: LRN-052
title: Picture tasks need R2 originals and credentials, not a fresh clone
status: active
tags: [data, photos, r2]
task: TSK-194
created: 2026-11-20
---

Picture work cannot be done from a fresh clone. public/pictures/ is not committed: originals and optimized variants live only in the R2 bucket behind img.playasmurcia.com. So `pnpm score:picture-quality` has nothing on disk to score. `pnpm sync:pictures` (rclone) needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in .env. Do not add filenames to `pictures` in data/beaches.json without the file in R2: the site renders broken images. Picture tasks need a machine that has the originals and R2 credentials.
