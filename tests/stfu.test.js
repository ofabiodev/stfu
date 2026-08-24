const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.join(__dirname, '..');
const hook = path.join(root, 'hooks', 'stfu-hook.js');

function run(env, input) {
  return spawnSync(process.execPath, [hook], {
    env: { ...process.env, ...env },
    input,
    encoding: 'utf8',
    timeout: 3000,
  });
}

test('injects the skill on session start', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'stfu-test-'));
  try {
    const result = run(
      { STFU_STATE_FILE: path.join(temp, '.stfu-mode'), STFU_DEFAULT_MODE: 'on' },
      JSON.stringify({ hook_event_name: 'SessionStart', source: 'startup' }),
    );
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.hookSpecificOutput.hookEventName, 'SessionStart');
    assert.match(output.hookSpecificOutput.additionalContext, /STFU MODE ACTIVE/);
    assert.match(output.hookSpecificOutput.additionalContext, /# STFU/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('toggles mode without leaking context while off', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'stfu-test-'));
  const state = path.join(temp, '.stfu-mode');
  const env = { STFU_STATE_FILE: state, STFU_DEFAULT_MODE: 'on' };
  try {
    const off = run(env, JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: '/stfu off' }));
    assert.match(JSON.parse(off.stdout).hookSpecificOutput.additionalContext, /🔊 STFU off\./);
    assert.equal(fs.readFileSync(state, 'utf8'), 'off');

    const quiet = run(env, JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: 'hello' }));
    assert.equal(quiet.stdout, '');

    const on = run(env, JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: '/stfu on' }));
    const context = JSON.parse(on.stdout).hookSpecificOutput.additionalContext;
    assert.match(context, /🔇 STFU on\./);
    assert.match(context, /STFU MODE ACTIVE/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('supports plain-text hosts and subagent events', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'stfu-test-'));
  try {
    const result = run(
      {
        STFU_STATE_FILE: path.join(temp, '.stfu-mode'),
        STFU_DEFAULT_MODE: 'on',
        STFU_HOOK_OUTPUT: 'plain',
      },
      JSON.stringify({ hook_event_name: 'SubagentStart' }),
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /STFU MODE ACTIVE/);
    assert.doesNotMatch(result.stdout, /^\s*\{/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
