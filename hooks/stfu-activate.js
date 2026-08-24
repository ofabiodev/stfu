#!/usr/bin/env node
'use strict';

const { buildContext, readMode } = require('./stfu-core');

const mode = readMode();
if (mode === 'off') process.exit(0);

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: buildContext({ mode, previousMode: mode }),
  },
}));
