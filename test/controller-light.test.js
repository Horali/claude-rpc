// controller-light.js — the Activity Controller link (my addition to this fork).
import { test } from 'node:test';
import assert from 'node:assert/strict';

const { lightBlocks, checkinState, startControllerLight } = await import('../src/controller-light.js');

const base = { pausedUntil: null, privacyHidden: false, stale: false, hideWhenStale: true, status: 'working', shown: true };
const activity = { details: 'Editing main.js', state: 'In project', largeImageKey: 'claude' };

test('lightBlocks: only red and wait block the card', () => {
  assert.equal(lightBlocks('red'), true);
  assert.equal(lightBlocks('wait'), true);
  assert.equal(lightBlocks('green'), false);
  assert.equal(lightBlocks('none'), false);
});

test('checkinState: a working session is online and on', () => {
  const s = checkinState({ ...base, activity });
  assert.deepEqual(s, {
    ownSwitch: 'on', online: true, idle: false, showing: true,
    preview: { headline: 'Claude Code', details: 'Editing main.js', state: 'In project', image: '' },
  });
});

test('checkinState: the CLI pause is the own switch', () => {
  assert.equal(checkinState({ ...base, pausedUntil: Date.now() + 1000, activity }).ownSwitch, 'off');
});

test('checkinState: stale or privacy-hidden is offline', () => {
  assert.equal(checkinState({ ...base, stale: true, activity }).online, false);
  assert.equal(checkinState({ ...base, stale: true, hideWhenStale: false, activity }).online, true);
  assert.equal(checkinState({ ...base, privacyHidden: true, activity }).online, false);
  assert.equal(checkinState({ ...base, activity: null }).online, false);
});

test('checkinState: idle and chatting count as idle', () => {
  assert.equal(checkinState({ ...base, status: 'idle', activity }).idle, true);
  assert.equal(checkinState({ ...base, status: 'chatting', activity }).idle, true);
});

test('startControllerLight: no controller gives none', async () => {
  const seen = [];
  const l = startControllerLight({ url: 'http://127.0.0.1:1', getState: () => checkinState({ ...base, activity }), onChange: (x) => seen.push(x) });
  assert.equal(l.light(), 'wait');
  for (let i = 0; i < 150 && l.light() === 'wait'; i++) await new Promise((r) => setTimeout(r, 20));
  l.stop();
  assert.equal(l.light(), 'none');
  assert.deepEqual(seen, ['none']);
});
