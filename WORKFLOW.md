---
tracker:
  kind: github
  project_slug: "Irakli20/agri-os"
  active_states: ["open"]
  terminal_states: ["closed", "completed"]

polling:
  interval_ms: 300000

workspace:
  root: "~/projects"

hooks:
  after_create: |
    cd ~/projects/agri-os
    git checkout main && git pull origin main
    git checkout -b "symphony/{{ issue.identifier }}" 2>/dev/null || git checkout "symphony/{{ issue.identifier }}"
  before_run: |
    cd ~/projects/agri-os
    git fetch origin main && git merge origin/main --no-edit 2>/dev/null || true
  after_run: |
    cd ~/projects/agri-os
    git add -A
    git diff --cached --quiet || git commit -m "symphony: {{ issue.title }} (closes #{{ issue.number }})"
    git push origin "symphony/{{ issue.identifier }}" --force 2>/dev/null || true
    gh pr create --base main --head "symphony/{{ issue.identifier }}" --title "{{ issue.title }}" --body "Closes #{{ issue.number }}" 2>/dev/null || true

agent:
  max_concurrent_agents: 1
  max_turns: 30
  max_retry_backoff_ms: 600000

hermes:
  command: "hermes chat --yolo --source symphony -Q"
  turn_timeout_ms: 1800000
  stall_timeout_ms: 600000
---

You are an expert software engineer working on Agri-OS, a Next.js farm management application.

## Task: {{ issue.title }}

{{ issue.description }}

## Instructions
1. Read and understand the issue fully before writing code
2. Find the relevant files and understand existing patterns
3. Implement the solution (TypeScript, Tailwind, Next.js App Router)
4. Run `npm test` to verify
5. Ensure `npm run build` passes

{% if attempt and attempt > 1 %}
⚠️ RETRY #{{ attempt }}: Previous attempts did not complete. Check `git log --oneline -5` to see what was tried.
{% endif %}

IMPORTANT: Your changes will be auto-committed and a PR created. Make them count.
