const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

test('ships the native manifests and adapters for every supported provider', () => {
  const rootManifest = readJson('plugin.json');
  assert.equal(rootManifest.name, 'stfu');
  assert.equal(rootManifest.version, '0.1.0');

  const codexManifest = readJson('.codex-plugin/plugin.json');
  assert.equal(codexManifest.hooks, './hooks/claude-codex-hooks.json');

  const claudeManifest = readJson('.claude-plugin/plugin.json');
  assert.equal(claudeManifest.hooks, './hooks/claude-codex-hooks.json');

  const marketplace = readJson('.claude-plugin/marketplace.json');
  assert.equal(marketplace.plugins[0].source, './');
  assert.equal(marketplace.plugins[0].name, 'stfu');

  const cursorManifest = readJson('.cursor-plugin/plugin.json');
  assert.equal(cursorManifest.rules, './rules/');
  assert.match(fs.readFileSync(path.join(root, 'rules', 'stfu.mdc'), 'utf8'), /alwaysApply: true/);

  const hooks = readJson('hooks/claude-codex-hooks.json').hooks;
  assert.deepEqual(Object.keys(hooks), ['SessionStart', 'UserPromptSubmit', 'SubagentStart']);
  for (const event of Object.values(hooks)) {
    const command = event[0].hooks[0].command;
    assert.match(command, /stfu-(activate|prompt|subagent)\.js/);
  }

  for (const relativePath of [
    'hooks/stfu-activate.js',
    'hooks/stfu-prompt.js',
    'hooks/stfu-subagent.js',
  ]) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
  }
});
