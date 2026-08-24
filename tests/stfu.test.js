const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.join(__dirname, '..');
const hooks = {
  activate: path.join(root, 'hooks', 'stfu-activate.js'),
  prompt: path.join(root, 'hooks', 'stfu-prompt.js'),
  subagent: path.join(root, 'hooks', 'stfu-subagent.js'),
};

function run(script, env, input = '') {
  return spawnSync(process.execPath, [script], {
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
      hooks.activate,
      { STFU_STATE_FILE: path.join(temp, '.stfu-mode'), STFU_DEFAULT_MODE: 'on' },
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
    const off = run(hooks.prompt, env, JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: '/stfu off' }));
    assert.match(JSON.parse(off.stdout).hookSpecificOutput.additionalContext, /🔊 STFU off\./);
    assert.equal(fs.readFileSync(state, 'utf8'), 'off');

    const quiet = run(hooks.prompt, env, JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: 'hello' }));
    assert.equal(quiet.stdout, '');

    const on = run(hooks.prompt, env, JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: '/stfu on' }));
    const context = JSON.parse(on.stdout).hookSpecificOutput.additionalContext;
    assert.match(context, /🔇 STFU on\./);
    assert.match(context, /STFU MODE ACTIVE/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('injects the same rules into subagents', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'stfu-test-'));
  try {
    const result = run(
      hooks.subagent,
      {
        STFU_STATE_FILE: path.join(temp, '.stfu-mode'),
        STFU_DEFAULT_MODE: 'on',
      },
    );
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.hookSpecificOutput.hookEventName, 'SubagentStart');
    assert.match(output.hookSpecificOutput.additionalContext, /STFU MODE ACTIVE/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('returns the documented response for invalid commands', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'stfu-test-'));
  try {
    const result = run(
      hooks.prompt,
      { STFU_STATE_FILE: path.join(temp, '.stfu-mode'), STFU_DEFAULT_MODE: 'on' },
      JSON.stringify({ hook_event_name: 'UserPromptSubmit', prompt: '/stfu maybe' }),
    );
    const output = JSON.parse(result.stdout);
    assert.match(output.hookSpecificOutput.additionalContext, /⚠️ Use `\/stfu on` or `\/stfu off`\./);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
