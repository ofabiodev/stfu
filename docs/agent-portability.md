# Provider support

STFU has one source of truth: `skills/stfu/SKILL.md`. Each supported host uses its native packaging and lifecycle format.

| Provider | Files | Automatic behavior | Toggle support | Status |
| --- | --- | --- | --- | --- |
| Codex | `.codex-plugin/plugin.json` + `hooks/claude-codex-hooks.json` | `SessionStart`, `UserPromptSubmit`, `SubagentStart` | `/stfu on/off` | Full |
| Claude Code | `.claude-plugin/plugin.json` + `hooks/claude-codex-hooks.json` | `SessionStart`, `UserPromptSubmit`, `SubagentStart` | `/stfu on/off` | Full |
| OpenCode | `opencode.json` + `.opencode/plugins/stfu.mjs` | Native system prompt transform every turn | `/stfu on/off` | Full while using the checkout or published package |
| Cursor | `.cursor-plugin/plugin.json` + `rules/stfu.mdc` | Native `alwaysApply` rule | Plugin enable/disable only | Supported with host limitation |

Cursor’s standard `beforeSubmitPrompt` hook can validate or block a prompt, but it cannot return additional context. STFU therefore uses Cursor’s native always-applied rule instead of pretending the Codex/Claude hook output is portable.

The repository intentionally does not ship adapters for other providers. Those are out of scope until they have a native integration and a tested lifecycle contract.
