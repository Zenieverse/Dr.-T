import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';
import {
  EventSourceType,
  OsEventTypeList,
  validateEvenHubPageContainer,
} from '@evenrealities/even_hub_sdk';
import {
  G2_DISPLAY_HEIGHT,
  G2_DISPLAY_WIDTH,
  buildG2HudFrame,
  createInitialCareCueState,
  mapEvenHubEventToGesture,
  reduceCareCueGesture,
} from '../g2Protocol';
import { createSyntheticDemoMessages } from '../syntheticData';
import { sanitizeTelegramError, TELEGRAM_PERMISSION_BOUNDARY } from '../telegramClient';
import { summarizeMessageForG2 } from '../aiService';
import { createCareCueRouter } from '../server';
import { CareCueScreenId } from '../types';

async function runTests() {
  console.log('Running Even Realities CareCue G2 test suite...\n');

  // Test 1: Even Hub SDK 576x288 container geometry & validation across all 7 wearable screens
  {
    const msgs = createSyntheticDemoMessages();
    msgs[0].summary = await summarizeMessageForG2(msgs[0], null);
    msgs[0].status = 'SUMMARIZED';
    msgs[0].sentReply = {
      text: 'Confirmed at Building B.',
      sentAt: new Date().toISOString(),
      deliveryMode: 'simulated_local',
    };

    const screens: CareCueScreenId[] = [
      'HOME',
      'INCOMING_MESSAGE',
      'AI_SUMMARY',
      'REPLY_DRAFT',
      'CONFIRM_SEND',
      'SENT',
      'SETTINGS',
    ];

    for (const screen of screens) {
      const state = {
        ...createInitialCareCueState(),
        screen,
        stagedReplyText: 'Got it — checking now.',
      };
      const frame = buildG2HudFrame(state, msgs, true, false);
      assert.equal(
        frame.validation.valid,
        true,
        `Expected valid EvenHub frame for ${screen}: ${frame.validation.message}`
      );
      const officialValidation = validateEvenHubPageContainer(frame.containerPayload);
      assert.equal(officialValidation.valid, true);

      for (const t of frame.containerPayload.textObject || []) {
        assert.ok((t.xPosition ?? 0) + (t.width ?? 0) <= G2_DISPLAY_WIDTH, 'Text width overflow');
        assert.ok((t.yPosition ?? 0) + (t.height ?? 0) <= G2_DISPLAY_HEIGHT, 'Text height overflow');
      }
      for (const l of frame.containerPayload.listObject || []) {
        assert.ok((l.xPosition ?? 0) + (l.width ?? 0) <= G2_DISPLAY_WIDTH, 'List width overflow');
        assert.ok((l.yPosition ?? 0) + (l.height ?? 0) <= G2_DISPLAY_HEIGHT, 'List height overflow');
      }
    }
    console.log('PASS [1/8] Even Hub SDK 576x288 page container validation passed for all 7 screens.');
  }

  // Test 2: Hardware gesture reducer across Home -> Incoming -> Summary -> Draft -> Confirm -> Home & Settings
  {
    const msgs = createSyntheticDemoMessages();
    msgs[0].summary = await summarizeMessageForG2(msgs[0], null);
    let state = createInitialCareCueState();
    assert.equal(state.screen, 'HOME');

    // Home -> Settings (row 1) -> brightness cycle + compact toggle -> Back Home
    state = reduceCareCueGesture(state, 'R1_NEXT', msgs);
    assert.equal(state.homeRowIndex, 1);
    state = reduceCareCueGesture(state, 'R1_SELECT', msgs);
    assert.equal(state.screen, 'SETTINGS');

    state = reduceCareCueGesture(state, 'R1_NEXT', msgs); // brightness row
    state = reduceCareCueGesture(state, 'R1_SELECT', msgs);
    assert.equal(state.displayPrefs.brightnessLevel, 1);

    state = reduceCareCueGesture(state, 'R1_NEXT', msgs); // compact toggle row
    state = reduceCareCueGesture(state, 'R1_SELECT', msgs);
    assert.equal(state.displayPrefs.compactMode, true);

    state = reduceCareCueGesture(state, 'TEMPLE_BACK', msgs);
    assert.equal(state.screen, 'HOME');

    // Home (row 0) -> Inbox -> R1_NEXT -> R1_PREV -> AI Summary -> Reply Draft -> Confirm -> Temple Back -> Hold Home
    state = reduceCareCueGesture(state, 'R1_PREV', msgs); // homeRowIndex -> 0
    state = reduceCareCueGesture(state, 'R1_SELECT', msgs);
    assert.equal(state.screen, 'INCOMING_MESSAGE');

    state = reduceCareCueGesture(state, 'R1_NEXT', msgs);
    assert.equal(state.selectedMessageIndex, 1);
    state = reduceCareCueGesture(state, 'R1_PREV', msgs);
    assert.equal(state.selectedMessageIndex, 0);
    state = reduceCareCueGesture(state, 'R1_SELECT', msgs);
    assert.equal(state.screen, 'AI_SUMMARY');
    state = reduceCareCueGesture(state, 'R1_SELECT', msgs);
    assert.equal(state.screen, 'REPLY_DRAFT');
    state = reduceCareCueGesture(state, 'R1_NEXT', msgs);
    assert.equal(state.selectedDraftIndex, 1);
    state = reduceCareCueGesture(state, 'R1_SELECT', msgs);
    assert.equal(state.screen, 'CONFIRM_SEND');
    state = reduceCareCueGesture(state, 'TEMPLE_BACK', msgs);
    assert.equal(state.screen, 'REPLY_DRAFT');
    state = reduceCareCueGesture(state, 'TEMPLE_HOLD_HOME', msgs);
    assert.equal(state.screen, 'HOME');

    assert.equal(
      mapEvenHubEventToGesture(
        { sysEvent: { eventType: OsEventTypeList.SCROLL_BOTTOM_EVENT } },
        'INCOMING_MESSAGE'
      ),
      'R1_NEXT'
    );
    assert.equal(
      mapEvenHubEventToGesture(
        {
          sysEvent: {
            eventType: OsEventTypeList.CLICK_EVENT,
            eventSource: EventSourceType.TOUCH_EVENT_FROM_GLASSES_L,
          },
        },
        'AI_SUMMARY'
      ),
      'TEMPLE_BACK'
    );
    console.log('PASS [2/8] R1 ring / temple hardware 7-screen state reducer & SDK event mapping passed.');
  }

  // Test 3: Telegram token redaction & explicit permission boundary
  {
    const redacted = sanitizeTelegramError(
      'request to https://api.telegram.org/bot123456:ABCdef_SecretToken99/getUpdates failed'
    );
    assert.equal(redacted.includes('ABCdef_SecretToken99'), false);
    assert.ok(redacted.includes('bot[REDACTED]'));
    assert.ok(TELEGRAM_PERMISSION_BOUNDARY.includes('/start'));
    console.log('PASS [3/8] Telegram token redaction & Bot API permission boundary verified.');
  }

  // Test 4: AI summarizer deterministic fallback bounds
  {
    const msg = createSyntheticDemoMessages()[0];
    const summary = await summarizeMessageForG2(msg, null);
    assert.equal(summary.modelProvider, 'deterministic_fallback');
    assert.ok(summary.glanceHeadline.length <= 44);
    assert.equal(summary.drafts.length, 3);
    assert.ok(summary.drafts.every((d) => d.unverifiedUntilConfirmed === true));
    console.log('PASS [4/8] AI summarizer fallback output & draft verification flags passed.');
  }

  // Test 5-8: HTTP Express integration tests + 403 gate + 409 duplicate-send lock + session pause/reconnect
  {
    const testApp = express();
    testApp.use(express.json());
    testApp.use('/api/carecue', createCareCueRouter(() => null));

    const server: http.Server = await new Promise((resolve) => {
      const s = testApp.listen(0, '127.0.0.1', () => resolve(s));
    });

    try {
      const addr = server.address();
      assert.ok(addr && typeof addr === 'object');
      const base = `http://127.0.0.1:${addr.port}/api/carecue`;

      const statusRes = await fetch(`${base}/status`);
      assert.equal(statusRes.status, 200);
      const statusJson = (await statusRes.json()) as {
        telegramHost: string;
        permissionBoundary: string;
        defaultChatIdConfigured: boolean;
        sessionPaused: boolean;
      };
      assert.equal(statusJson.telegramHost, 'https://api.telegram.org');
      assert.ok(statusJson.permissionBoundary.includes('Bot API'));
      assert.equal(typeof statusJson.defaultChatIdConfigured, 'boolean');
      assert.equal(statusJson.sessionPaused, false);

      const testSendBlockedRes = await fetch(`${base}/telegram/test-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wearerConfirmed: false, text: 'Test' }),
      });
      assert.equal(testSendBlockedRes.status, 403);
      const testSendBlockedJson = (await testSendBlockedRes.json()) as { code: string };
      assert.equal(testSendBlockedJson.code, 'CONFIRMATION_REQUIRED');

      const simRes = await fetch(`${base}/telegram/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: 'Test Ops',
          senderHandle: '@test_ops',
          rawText: 'Confirm if ambulance bay door 2 is unlocked.',
        }),
      });
      assert.equal(simRes.status, 201);
      const simJson = (await simRes.json()) as { message: { id: string } };
      const msgId = simJson.message.id;

      const sumRes = await fetch(`${base}/ai/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msgId }),
      });
      assert.equal(sumRes.status, 200);

      // Must reject send when wearerConfirmed is false
      const blockedSendRes = await fetch(`${base}/telegram/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: msgId,
          replyText: 'Door 2 is open.',
          wearerConfirmed: false,
        }),
      });
      assert.equal(blockedSendRes.status, 403);
      const blockedJson = (await blockedSendRes.json()) as { code: string };
      assert.equal(blockedJson.code, 'CONFIRMATION_REQUIRED');
      console.log('PASS [5/8] HTTP /status, /telegram/simulate, /ai/summarize & 403 confirmation gate passed.');

      // Must succeed when wearerConfirmed is true
      const confirmedSendRes = await fetch(`${base}/telegram/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: msgId,
          replyText: 'Door 2 is open now.',
          wearerConfirmed: true,
        }),
      });
      assert.equal(confirmedSendRes.status, 200);
      const sentJson = (await confirmedSendRes.json()) as {
        ok: boolean;
        deliveryMode: string;
        message: { status: string };
      };
      assert.equal(sentJson.ok, true);
      assert.equal(sentJson.message.status, 'REPLIED');

      // Duplicate send on an already REPLIED thread must return 409 DUPLICATE_SEND_PREVENTED
      const duplicateSendRes = await fetch(`${base}/telegram/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: msgId,
          replyText: 'Sending twice by accident.',
          wearerConfirmed: true,
        }),
      });
      assert.equal(duplicateSendRes.status, 409);
      const duplicateJson = (await duplicateSendRes.json()) as { code: string };
      assert.equal(duplicateJson.code, 'DUPLICATE_SEND_PREVENTED');
      console.log('PASS [6/8] Confirmed dispatch & 409 DUPLICATE_SEND_PREVENTED lock passed.');

      // Session disconnect/reconnect toggle must block poll/send while paused
      const pauseRes = await fetch(`${base}/telegram/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paused: true }),
      });
      assert.equal(pauseRes.status, 200);
      const pauseJson = (await pauseRes.json()) as { sessionPaused: boolean };
      assert.equal(pauseJson.sessionPaused, true);

      const pausedPollRes = await fetch(`${base}/telegram/poll`, { method: 'POST' });
      assert.equal(pausedPollRes.status, 409);
      const pausedPollJson = (await pausedPollRes.json()) as { code: string };
      assert.equal(pausedPollJson.code, 'SESSION_PAUSED');

      const resumeRes = await fetch(`${base}/telegram/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paused: false }),
      });
      assert.equal(resumeRes.status, 200);
      console.log('PASS [7/8] Settings Disconnect/Reconnect Telegram session pause gate passed.');

      const auditRes = await fetch(`${base}/audit`);
      assert.equal(auditRes.status, 200);
      const auditJson = (await auditRes.json()) as { entries: Array<{ eventType: string }> };
      assert.ok(auditJson.entries.some((e) => e.eventType === 'REPLY_BLOCKED_UNCONFIRMED'));
      assert.ok(auditJson.entries.some((e) => e.eventType === 'REPLY_BLOCKED_DUPLICATE'));
      assert.ok(auditJson.entries.some((e) => e.eventType === 'REPLY_CONFIRMED_AND_SENT'));
      assert.ok(auditJson.entries.some((e) => e.eventType === 'TELEGRAM_SESSION_TOGGLED'));

      const resetRes = await fetch(`${base}/demo/reset`, { method: 'POST' });
      assert.equal(resetRes.status, 200);
      console.log('PASS [8/8] Safety audit events and clean demo reset verified.');
    } finally {
      server.closeAllConnections?.();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  }

  console.log('\nALL CARECUE G2 TESTS PASSED (8/8).');
}

runTests().catch((err) => {
  console.error('CareCue G2 test failure:', err);
  process.exit(1);
});
