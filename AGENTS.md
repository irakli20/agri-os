@RTK.md

# Agri-OS Working Anchor

- Treat `/Users/macbookpro/agri-os/agri-os` on branch `agri-os-latest-mac` as the current most advanced Agri-OS app unless the user explicitly changes the anchor.
- When the user says "Agri-OS app", "latest app", "strategy mode", or "weekly plan", work in this repo/branch first, not older branches, nested backups, or unrelated repos.
- The local dev server for this app is `npm run dev` from `/Users/macbookpro/agri-os/agri-os`; the verified latest app loaded at `http://localhost:3000` with the `Agri-OS Control` shell and `Switch To Strategy` control.
- Do not delete old app copies, branches, backups, or build artifacts unless the user explicitly approves a cleanup plan after seeing what will be removed.
- The Demaso Wood `საექსპერტო დასკვნა` generator/document workflow is a separate project that was accidentally mixed into the Agri-OS workspace. Preserve it separately; do not remove Demaso scripts/assets or overwrite that workflow while cleaning Agri-OS.
- For Demaso work, prefer the dedicated skill at `/Users/macbookpro/.codex/skills/demaso-expert-conclusion/SKILL.md` and the preserved generator/assets rather than recreating formatting by hand.
