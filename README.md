<p align="center">
 <img src="https://github.com/ofabiodev/stfu/blob/main/.github/assets/logo.png" align="center" width="200" alt="STFU Logo">
 <h1 align="center">STFU</h1>
 <p align="center">
  Minimal response mode for agents — skill plus native provider plugins.
 </p>
</p>
<br/>

<p align="center">
 <a href="https://skills.sh/ofabiodev/stfu" rel="nofollow"><img alt="skills.sh" src="https://skills.sh/b/ofabiodev/stfu"></a>
 <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen"></a>
</p>

## What it is

STFU is one skill with four native adapters:

- `skills/stfu/SKILL.md` is the portable skill.
- Codex and Claude Code use the shared standard plugin hook definition.
- Cursor uses a native always-applied rule through its plugin manifest.
- OpenCode uses its native system-prompt transform and command hook.

The adapters all read the same skill text. No generic hook installer or unsupported provider adapter is included.

## Installation

### Codex

```bash
codex plugin marketplace add ofabiodev/stfu
codex plugin add stfu@stfu
```

Run `codex`, open `/hooks`, review and trust the STFU hooks, then start a new thread.

### Claude Code

```text
/plugin marketplace add ofabiodev/stfu
/plugin install stfu@stfu
```

Run the two commands as separate prompts. Review the plugin hooks when Claude asks.

### Cursor

Submit `https://github.com/ofabiodev/stfu` at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). After approval, install **STFU** from Cursor → **Customize** → **Plugins**.

For local development, place the repository at `~/.cursor/plugins/local/stfu` and reload the Cursor window.

### OpenCode

From a checkout, the included `opencode.json` loads the native adapter automatically:

```bash
git clone https://github.com/ofabiodev/stfu.git
cd stfu
opencode
```

After the package is published to npm, add `@ofabiodev/stfu` to the `plugin` array in your project’s `opencode.json`.

### Standalone skill

```bash
npx skills add ofabiodev/stfu
```

## Usage

The plugin is on by default in Codex, Claude Code, and OpenCode. Disable or re-enable it with:

```text
/stfu off
/stfu on
```

Start disabled with `STFU_DEFAULT_MODE=off`. Cursor uses an always-applied rule; disable the STFU plugin in Cursor to turn it off.

## Provider support

| Provider | Native package | Automatic behavior | `/stfu on/off` | Remaining limitation |
| --- | --- | --- | --- | --- |
| Codex | `.codex-plugin/` | Session, prompt, and subagent injection | Yes | Hooks require review/trust in Codex |
| Claude Code | `.claude-plugin/` | Session, prompt, and subagent injection | Yes | Hooks require normal Claude trust approval |
| OpenCode | `.opencode/` | System prompt every turn | Yes | npm installation waits for package publication |
| Cursor | `.cursor-plugin/` + `rules/` | Always-applied native rule | No runtime toggle | Cursor rules cannot be dynamically disabled by `/stfu off`; disable the plugin |

Not bundled: Gemini, Copilot, Cline, Windsurf, Aider, Qoder, Devin, Pi, and generic hook-only adapters.

See [docs/agent-portability.md](docs/agent-portability.md) for the exact files and host limitations.

## License

[MIT](LICENSE) © [ofabiodev](https://github.com/ofabiodev)
