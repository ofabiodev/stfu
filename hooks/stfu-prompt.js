#!/usr/bin/env node
'use strict';

const {
  buildContext,
  isStfuCommand,
  parseModeCommand,
  readMode,
  setMode,
} = require('./stfu-core');

let input = '';
let finished = false;

function finish() {
  if (finished) return;
  finished = true;

  try {
    const payload = JSON.parse(input.replace(/^\uFEFF/, ''));
    const prompt = String(payload.prompt || '').trim();
    const previousMode = readMode();
    const command = parseModeCommand(prompt);
    const invalidCommand = isStfuCommand(prompt) && !command;
    const mode = command ? setMode(command) : previousMode;

    if (!command && !invalidCommand && mode === 'off') return;

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: buildContext({
          mode,
          command,
          previousMode,
          invalidCommand,
        }),
      },
    }));
  } catch (_) {
    // Hooks are advisory. A malformed event must never break the session.
  }
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', finish);
process.stdin.on('error', () => { finish(); process.exit(0); });

// Fail open if a host wrapper keeps stdin open after forwarding the payload.
setTimeout(() => { finish(); process.exit(0); }, 1000).unref();
