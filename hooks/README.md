# Hook integration

`stfu-hook.js` is the shared, dependency-free entry point for hosts that run a command before a prompt or when a session starts.

It accepts the usual hook JSON on stdin, including `hook_event_name` and `prompt`, and returns:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "..."
  }
}
```

Claude Code and Codex load `hooks/hooks.json` automatically when this package is enabled. For another host, point its before-prompt/session-start hook at:

```text
node /absolute/path/to/stfu/hooks/stfu-hook.js
```

Set `STFU_HOOK_EVENT=UserPromptSubmit` when the host does not include `hook_event_name`. Set `STFU_HOOK_OUTPUT=plain` when the host expects plain text instead of the Claude/Codex JSON shape.

The default is on. Use `STFU_DEFAULT_MODE=off` to start disabled, or `/stfu off` and `/stfu on` to switch the active mode. State is written to the host plugin data directory when one is provided, otherwise to the user config directory.
