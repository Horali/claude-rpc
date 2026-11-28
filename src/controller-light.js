// Activity Controller link ("traffic light"), my addition to this fork.
// The controller (DiscordActivityController, 127.0.0.1:47400) picks ONE card
// when several programs have one. Before each push the daemon asks:
//   green → show the card · red / wait → clear it · none → no controller, work alone.
// Kept in this one file (plus a few lines in daemon.js) so upstream merges stay easy.

import { createControllerClient } from './controller-client.mjs';

// true = the light does not allow a card now.
export function lightBlocks(light) {
  return light === 'red' || light === 'wait';
}

// What the daemon tells the controller. Pure, so it is easy to test.
export function checkinState({ pausedUntil, privacyHidden, stale, hideWhenStale, status, activity, shown }) {
  return {
    ownSwitch: pausedUntil ? 'off' : 'on',
    online: !privacyHidden && !(stale && hideWhenStale !== false) && !!activity,
    idle: status === 'idle' || status === 'chatting',
    showing: !!shown,
    preview: activity
      ? {
          headline: 'Claude Code',
          details: String(activity.details || ''),
          state: String(activity.state || ''),
          image: /^https:\/\//.test(activity.largeImageKey || '') ? activity.largeImageKey : '',
        }
      : null,
  };
}

// Starts the check-in loop. light() is 'wait' until the first answer (max 1.5 s).
export function startControllerLight({ getState, onChange, url }) {
  let light = 'wait';
  const client = createControllerClient({
    id: 'claude-code',
    name: 'Claude Code',
    ...(url ? { url } : {}),
    getState,
    onLight: (next) => {
      const changed = next !== light;
      light = next;
      if (changed) onChange(next);
    },
  });
  client.start();
  return { light: () => light, poke: () => client.poke(), stop: () => client.stop() };
}
