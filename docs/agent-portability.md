# Agent portability

STFU has one source of truth: `skills/stfu/SKILL.md`. Host integrations only decide how that text reaches the model.

| Host | Integration | Automatic injection |
| --- | --- | --- |
| Codex | `.codex-plugin/plugin.json` + `hooks/hooks.json` | Session, every prompt, and subagent start |
| Claude Code | `.claude-plugin/plugin.json` + `hooks/hooks.json` | Session, every prompt, and subagent start |
| OpenCode | `opencode.json` + `.opencode/plugins/stfu.mjs` | System prompt on every turn |
| Gemini CLI | `gemini-extension.json` + `AGENTS.md` | Context file on every session |
| Other hook-capable agents | `hooks/stfu-hook.js` | Wire it to the host's before-prompt/session-start event |
| Instruction-only agents | `AGENTS.md` or the skill file | Whenever the host loads that file |

There is no universal hook schema across all agents. The shared runner uses the Claude/Codex event names and output shape, while `STFU_HOOK_OUTPUT=plain` covers hosts that inject stdout directly. A new adapter should stay thin and call the runner rather than copy the rules.
