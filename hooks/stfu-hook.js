#!/usr/bin/env node
'use strict';

const {
  buildContext,
  getStatePath,
  parseModeCommand,
  readMode,
  setMode,
} = require('./stfu-core');

let input = '';
let finished = false;

function parseInput(raw) {
  const value = String(raw || '').replace(/^\uFEFF/, '').trim();
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch (_) {
    return { prompt: value };
  }
}

function writeContext(eventName, context) {
  if (!context) return;
  if (String(process.env.STFU_HOOK_OUTPUT || '').toLowerCase() === 'plain') {
    process.stdout.write(context);
    return;
  }

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext: context,
    },
  }));
}

function finish() {
  if (finished) return;
  finished = true;

  try {
    const payload = parseInput(input);
    const eventName = String(
      payload.hook_event_name ||
      payload.event ||
      process.env.STFU_HOOK_EVENT ||
      'SessionStart'
    );
    const previousMode = readMode();
    const command = eventName === 'UserPromptSubmit'
      ? parseModeCommand(payload.prompt)
      : null;

    let mode = previousMode;
    if (command) {
      try { mode = setMode(command, getStatePath()); } catch (_) { mode = command; }
    }

    if (!command && mode === 'off') return;
    writeContext(eventName, buildContext({ mode, command, previousMode }));
  } catch (_) {
    // Hooks are advisory. A malformed event must never break the agent session.
  }
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', finish);
process.stdin.on('error', () => { finish(); process.exit(0); });

// Some Windows hook wrappers keep stdin open after forwarding the payload.
// Fail open after a short bound so the hook can never freeze a conversation.
setTimeout(() => { finish(); process.exit(0); }, 1000).unref();
