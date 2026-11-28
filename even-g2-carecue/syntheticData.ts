import { CareCueMessageItem } from './types';

export function createSyntheticDemoMessages(): CareCueMessageItem[] {
  const now = Date.now();
  return [
    {
      id: 'demo-tg-1',
      telegramChatId: 'synthetic-chat-101',
      senderName: 'Maya Lin (Ops)',
      senderHandle: '@maya_ops',
      chatType: 'group_supergroup',
      receivedAt: new Date(now - 4 * 60_000).toISOString(),
      rawText:
        'Quick check before the 3:30 PM clinic standup: did the shipment of portable pulse oximeters arrive at Building B reception, or should I reroute courier pickup for tomorrow morning?',
      source: 'synthetic_demo',
      status: 'UNREAD',
    },
    {
      id: 'demo-tg-2',
      telegramChatId: 'synthetic-chat-102',
      senderName: 'David Park',
      senderHandle: '@dpark_eng',
      chatType: 'private_bot_chat',
      receivedAt: new Date(now - 14 * 60_000).toISOString(),
      rawText:
        'Battery telemetry on demo headset #4 stayed above 82% after two hours of BLE testing. Can we lock firmware build 0.16 for tonight?',
      source: 'synthetic_demo',
      status: 'UNREAD',
    },
    {
      id: 'demo-tg-3',
      telegramChatId: 'synthetic-chat-103',
      senderName: 'Elena Alvarez',
      senderHandle: '@elena_care',
      chatType: 'private_bot_chat',
      receivedAt: new Date(now - 37 * 60_000).toISOString(),
      rawText:
        'Running 10 minutes late from physical therapy. Please keep my 4:00 PM check-in slot open if possible.',
      source: 'synthetic_demo',
      status: 'UNREAD',
    },
  ];
}
