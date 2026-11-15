#!/bin/bash
# Block skill usage when gstack is not installed globally.
#
# Resolve the install root the way gstack skill preambles do: the GSTACK_ROOT
# env var first, then every host's global install location, then the migrated
# repo location. Block only when NONE exist (#2500 — hardcoding
# ~/.claude/skills/gstack false-blocked Codex-host and migrated-repo installs).
_GSTACK_ROOT=""
for _D in "${GSTACK_ROOT:-}" "$HOME/.claude/skills/gstack" "$HOME/.codex/skills/gstack" "$HOME/.factory/skills/gstack" "$HOME/.kiro/skills/gstack" "$HOME/.config/opencode/skills/gstack" "$HOME/.slate/skills/gstack" "$HOME/.cursor/skills/gstack" "$HOME/.openclaw/skills/gstack" "$HOME/.hermes/skills/gstack" "$HOME/.gbrain/skills/gstack" "$HOME/.copilot/skills/gstack" "$HOME/.gstack/repos/gstack"; do
  [ -z "$_GSTACK_ROOT" ] && [ -n "$_D" ] && [ -d "$_D/bin" ] && _GSTACK_ROOT="$_D"
done

# Hooks pass a JSON payload on stdin. Drain it either way so a closed pipe
# cannot stall the caller.
HOOK_INPUT=$(cat || true)

if [ -z "$_GSTACK_ROOT" ]; then
  cat >&2 <<'MSG'
BLOCKED: gstack is not installed globally.

gstack is required for AI-assisted work in this repo.

Install it:
  git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
  cd ~/.claude/skills/gstack && ./setup --team

Then restart your AI coding tool.
MSG
  # Exit 2 denies the action. PreToolUse (model-called Skill) uses
  # permissionDecision. UserPromptExpansion (a typed /skillname, which never
  # calls the Skill tool) uses a top-level decision.
  # https://code.claude.com/docs/en/hooks
  if ! HOOK_INPUT="$HOOK_INPUT" python3 - <<'PY'
import json, os
raw = os.environ.get("HOOK_INPUT", "")
event = "PreToolUse"
try:
    event = json.loads(raw).get("hook_event_name") or event
except Exception:
    pass
reason = "gstack is required but not installed. See stderr for install instructions."
if event == "UserPromptExpansion":
    print(json.dumps({
        "decision": "block",
        "reason": reason,
        "hookSpecificOutput": {"hookEventName": "UserPromptExpansion"},
    }))
else:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
PY
  then
    echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"gstack is required but not installed. See stderr for install instructions."}}'
  fi
  exit 2
fi

echo '{}'
