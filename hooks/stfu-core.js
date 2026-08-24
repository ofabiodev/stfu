'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_MODE = 'on';
const SKILL_PATH = path.join(__dirname, '..', 'skills', 'stfu', 'SKILL.md');

function normalizeMode(value) {
  const mode = String(value || '').trim().toLowerCase();
  return mode === 'on' || mode === 'off' ? mode : null;
}

function getDefaultMode() {
  return normalizeMode(process.env.STFU_DEFAULT_MODE) || DEFAULT_MODE;
}

function getStatePath(explicitPath) {
  if (explicitPath) return explicitPath;
  if (process.env.STFU_STATE_FILE) return process.env.STFU_STATE_FILE;

  const stateDir = process.env.STFU_STATE_DIR ||
    process.env.PLUGIN_DATA ||
    process.env.CLAUDE_PLUGIN_DATA ||
    (process.platform === 'win32'
      ? path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'stfu')
      : path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'), 'stfu'));

  return path.join(stateDir, '.stfu-mode');
}

function readStoredMode(statePath = getStatePath()) {
  try {
    return normalizeMode(fs.readFileSync(statePath, 'utf8'));
  } catch (_) {
    return null;
  }
}

function readMode(statePath = getStatePath()) {
  return readStoredMode(statePath) || getDefaultMode();
}

function setMode(mode, statePath = getStatePath()) {
  const normalized = normalizeMode(mode);
  if (!normalized) throw new Error(`Unsupported STFU mode: ${mode}`);
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, normalized, 'utf8');
  return normalized;
}

function parseModeCommand(prompt) {
  const match = String(prompt || '').trim().match(/^\/stfu\s+(on|off)$/i);
  return match ? match[1].toLowerCase() : null;
}

function isStfuCommand(prompt) {
  return /^\/stfu(?:\s|$)/i.test(String(prompt || '').trim());
}

function getInstructions() {
  try {
    const skill = fs.readFileSync(SKILL_PATH, 'utf8');
    return skill.replace(/^---[\s\S]*?---\s*/, '').trim();
  } catch (_) {
    return [
      '# STFU',
      '',
      'Keep every response direct, concise, and focused on the requested result.',
      'No greeting, preamble, recap, filler, or generic closing.',
      'Preserve correctness, safety, and necessary detail.'
    ].join('\n');
  }
}

function getCommandResponse(mode, previousMode) {
  const already = mode === previousMode ? 'already ' : '';
  return mode === 'on'
    ? `🔇 STFU ${already}on.`
    : `🔊 STFU ${already}off.`;
}

function buildContext({ mode, command, previousMode, invalidCommand = false }) {
  if (invalidCommand) {
    return 'STFU command received. Reply exactly:\n⚠️ Use `/stfu on` or `/stfu off`.';
  }

  if (command === 'off') {
    return `STFU command received. Reply exactly:\n${getCommandResponse('off', previousMode)}`;
  }

  const rules = `STFU MODE ACTIVE\n\n${getInstructions()}`;
  if (command === 'on') {
    return `STFU command received. Reply exactly:\n${getCommandResponse('on', previousMode)}\n\n${rules}`;
  }
  return mode === 'on' ? rules : '';
}

module.exports = {
  DEFAULT_MODE,
  buildContext,
  getDefaultMode,
  getInstructions,
  getStatePath,
  isStfuCommand,
  normalizeMode,
  parseModeCommand,
  readMode,
  readStoredMode,
  setMode,
};
