import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const {
  getDefaultMode,
  getInstructions,
  normalizeMode,
  readMode,
  setMode,
} = require('../../hooks/stfu-core.js');

const configRoot = process.env.XDG_CONFIG_HOME ||
  (process.platform === 'win32'
    ? process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
    : path.join(os.homedir(), '.config'));
const statePath = path.join(configRoot, 'stfu', '.stfu-mode');

export default async function stfuPlugin() {
  return {
    'experimental.chat.system.transform': async (_input, output) => {
      const mode = readMode(statePath);
      if (mode === 'off') return;

      const instructions = `STFU MODE ACTIVE\n\n${getInstructions()}`;
      if (!Array.isArray(output.system)) return;
      if (output.system.length > 0) {
        output.system[output.system.length - 1] += `\n\n${instructions}`;
      } else {
        output.system.push(instructions);
      }
    },

    'command.execute.before': async (input) => {
      if (!input || input.command !== 'stfu') return;
      const argument = String(input.arguments || '').trim();
      const mode = normalizeMode(argument) || getDefaultMode();
      setMode(mode, statePath);
    },
  };
}
