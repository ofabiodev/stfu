<p align="center">
 <img src="https://github.com/ofabiodev/stfu-skill/blob/main/.github/assets/logo.png" align="center" width="200" alt="STFU Logo">
 <h1 align="center">STFU</h1>
 <p align="center">
  Minimal response mode for agents. No preamble, no recap, no filler.
 </p>
</p>
<br/>

<p align="center">
 <a href="https://skills.sh/ofabiodev/stfu-skill" rel="nofollow"><img alt="skills.sh" src="https://skills.sh/b/ofabiodev/stfu-skill"></a>
 <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen"></a>
</p>

## Why STFU?

STFU is a tiny Agent Skill for cleaner, shorter answers.

It makes the agent respond directly, avoid unnecessary context, skip recaps, and keep output minimal by default.

Use it when you want answers that are fast to read, low-noise, and focused only on the requested result.

## Installation

<table>
<tr>
<td width="300">

```bash
# Using Bun
bunx skills add ofabiodev/stfu-skill
````

</td>
<td width="300">

```bash
# Using NPM
npx skills add ofabiodev/stfu-skill
```

</td>
<td width="300">

```bash
# Using Yarn
yarn skills add ofabiodev/stfu-skill
```

</td>
</tr>
</table>

## Usage

Enable STFU mode:

```text
/stfu on
```

The agent replies:

```text
STFU mode on. Minimal answers only. 🔇
```

Disable STFU mode:

```text
/stfu off
```

The agent replies:

```text
STFU mode off. Normal responses restored. 🔊
```

Example:

```text
/stfu on
```

```text
Explain what this error means:
TypeError: Cannot read properties of undefined
```

Expected style:

```text
You are reading a property from a value that is undefined.
Check where the value is created or passed before accessing it.
Say "expand" for more.
```

## License

[MIT](LICENSE) © [ofabiodev](https://github.com/ofabiodev)
