<p align="center">
 <img src="https://github.com/ofabiodev/stfu/blob/main/.github/assets/logo.png" align="center" width="200" alt="STFU Logo">
 <h1 align="center">STFU</h1>
 <p align="center">
  Minimal response mode for agents — skill, plugin, and portable hook.
 </p>
</p>
<br/>

<p align="center">
 <a href="https://skills.sh/ofabiodev/stfu" rel="nofollow"><img alt="skills.sh" src="https://skills.sh/b/ofabiodev/stfu"></a>
 <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen"></a>
</p>

## What it is

STFU is a small, agent-portable response mode:

- `skills/stfu/SKILL.md` is the standalone skill.
- `.codex-plugin/` and `.claude-plugin/` package it for Codex and Claude Code.
- `hooks/hooks.json` injects the rules at session start, on every prompt, and for subagents.
- `hooks/stfu-hook.js` is the shared runner for other agents with a lifecycle hook.
- `AGENTS.md` and `gemini-extension.json` provide an instruction-only fallback.
- `.opencode/` provides a native OpenCode system-prompt adapter.

There is no single hook API shared by every agent. STFU keeps the behavior in one skill and makes each host integration thin.

## Installation

### Skill only

```bash
# Bun
bunx skills add ofabiodev/stfu

# NPM
npx skills add ofabiodev/stfu

# Yarn
yarn skills add ofabiodev/stfu
```

### Plugin checkout

```bash
git clone https://github.com/ofabiodev/stfu.git
```

Enable the checkout with the plugin manager of your agent. Codex and Claude Code discover the bundled `hooks/hooks.json`; review/trust the hook when the host asks. OpenCode can load the included `opencode.json` when started from the checkout.

### Any hook-capable agent

Point the host’s session-start or before-prompt hook at:

```bash
node /absolute/path/to/stfu/hooks/stfu-hook.js
```

The runner reads the usual hook JSON from stdin and returns the standard `hookSpecificOutput.additionalContext` shape used by Claude Code and Codex. For a host that injects stdout directly, set `STFU_HOOK_OUTPUT=plain` and, when needed, `STFU_HOOK_EVENT=UserPromptSubmit`.

## Usage

The plugin is on by default. Disable or re-enable it with:

```text
/stfu off
/stfu on
```

Start disabled with `STFU_DEFAULT_MODE=off`. The standalone skill keeps the same commands but only becomes active when explicitly enabled.

## Portability

See [docs/agent-portability.md](docs/agent-portability.md) for the host matrix and [hooks/README.md](hooks/README.md) for the generic hook contract.

## License

[MIT](LICENSE) © [ofabiodev](https://github.com/ofabiodev)
