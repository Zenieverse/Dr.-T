import {
  CreateStartUpPageContainer,
  DeviceConnectType,
  DeviceStatus,
  EvenAppBridge,
  EvenHubEvent,
  EventSourceType,
  LaunchSource,
  ListContainerProperty,
  ListItemContainerProperty,
  MenuContainerProperty,
  MenuItemProperty,
  OsEventTypeList,
  RebuildPageContainer,
  TextContainerProperty,
  TextContainerUpgrade,
  formatEvenHubPageContainerValidationError,
  isValidTextBrightness,
  validateEvenHubPageContainer,
  waitForEvenAppBridge,
} from '@evenrealities/even_hub_sdk';
import {
  CareCueG2ScreenState,
  CareCueHardwareGesture,
  CareCueMessageItem,
} from './types';

export const EVEN_HUB_SDK_VERSION = '0.0.16';
export const G2_DISPLAY_WIDTH = 576;
export const G2_DISPLAY_HEIGHT = 288;

export interface CareCueHudFrame {
  screenTitle: string;
  headerLeft: string;
  headerRight: string;
  bodyLines: string[];
  footerHint: string;
  listItems?: string[];
  highlightedListIndex?: number;
  containerPayload: CreateStartUpPageContainer;
  validation: { valid: boolean; message?: string };
}

export interface EvenBridgeConnectionProbe {
  mode: 'live_device' | 'simulator';
  available: boolean;
  bridge: EvenAppBridge | null;
  deviceModel: string | null;
  connectType: DeviceConnectType;
  batteryLevel: number | null;
  isWearing: boolean | null;
  launchSource: LaunchSource | null;
  reason: string;
}

export interface CareCueReducerContext {
  telegramConnected: boolean;
  sessionPaused: boolean;
  customStagedText?: string;
  selectedListIndex?: number;
}

export function createInitialCareCueState(): CareCueG2ScreenState {
  return {
    screen: 'HOME',
    selectedMessageIndex: 0,
    selectedDraftIndex: 0,
    settingsRowIndex: 0,
    homeRowIndex: 0,
    displayPrefs: {
      brightnessLevel: 4,
      compactMode: false,
    },
    lastGesture: 'Wearable HUD ready (Home)',
    stagedReplyText: '',
    lastError: null,
  };
}

function clampLine(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, Math.max(1, maxLen - 3))}...`;
}

function clampMenuLabel(text: string): string {
  const encoder = new TextEncoder();
  let out = '';
  for (const ch of text) {
    if (encoder.encode(out + ch).length > 32) break;
    out += ch;
  }
  return out || 'Action';
}

function formatClock(iso: string): string {
  try {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch {
    return '--:--';
  }
}

export function reduceCareCueGesture(
  state: CareCueG2ScreenState,
  gesture: CareCueHardwareGesture,
  messages: CareCueMessageItem[],
  contextOrStaged?: string | CareCueReducerContext
): CareCueG2ScreenState {
  const ctx: CareCueReducerContext =
    typeof contextOrStaged === 'string'
      ? { telegramConnected: false, sessionPaused: false, customStagedText: contextOrStaged }
      : contextOrStaged || { telegramConnected: false, sessionPaused: false };

  const safeCount = messages.length;
  const clampedMsgIdx =
    safeCount > 0 ? Math.min(Math.max(0, state.selectedMessageIndex), safeCount - 1) : 0;
  const activeMsg = messages[clampedMsgIdx];
  const drafts = activeMsg?.summary?.drafts ?? [];
  const draftCount = drafts.length;

  if (gesture === 'TEMPLE_HOLD_HOME') {
    return {
      ...state,
      screen: 'HOME',
      selectedDraftIndex: 0,
      stagedReplyText: '',
      lastGesture: 'Temple long-press: returned to Home',
    };
  }

  if (gesture === 'OPEN_SETTINGS') {
    return {
      ...state,
      screen: 'SETTINGS',
      settingsRowIndex: 0,
      lastGesture: 'Glasses menu: opened Settings',
    };
  }

  switch (state.screen) {
    case 'HOME': {
      if (gesture === 'R1_NEXT') {
        const nextRow = (state.homeRowIndex + 1) % 2;
        return {
          ...state,
          homeRowIndex: nextRow,
          lastGesture: nextRow === 0 ? 'R1 scroll: highlight Inbox' : 'R1 scroll: highlight Settings',
        };
      }
      if (gesture === 'R1_PREV') {
        const prevRow = (state.homeRowIndex + 1) % 2;
        return {
          ...state,
          homeRowIndex: prevRow,
          lastGesture: prevRow === 0 ? 'R1 scroll: highlight Inbox' : 'R1 scroll: highlight Settings',
        };
      }
      if (gesture === 'R1_SELECT') {
        const effectiveHomeRow =
          typeof ctx.selectedListIndex === 'number' && ctx.selectedListIndex >= 0 && ctx.selectedListIndex < 2
            ? ctx.selectedListIndex
            : state.homeRowIndex;
        if (effectiveHomeRow === 1) {
          return {
            ...state,
            screen: 'SETTINGS',
            homeRowIndex: 1,
            settingsRowIndex: 0,
            lastGesture: 'R1 tap: opened Settings',
          };
        }
        return {
          ...state,
          screen: 'INCOMING_MESSAGE',
          homeRowIndex: 0,
          selectedMessageIndex: clampedMsgIdx,
          selectedDraftIndex: 0,
          lastGesture: safeCount > 0 ? `R1 tap: opened Inbox (${safeCount} threads)` : 'R1 tap: opened Inbox (empty)',
        };
      }
      if (gesture === 'TEMPLE_BACK') {
        return {
          ...state,
          screen: 'SETTINGS',
          lastGesture: 'Temple tap: opened Settings',
        };
      }
      return state;
    }

    case 'INCOMING_MESSAGE': {
      if (gesture === 'TEMPLE_BACK') {
        return {
          ...state,
          screen: 'HOME',
          lastGesture: 'Temple tap: back to Home',
        };
      }
      if (safeCount === 0) {
        return {
          ...state,
          lastGesture: 'No incoming Telegram messages yet',
        };
      }
      if (gesture === 'R1_NEXT') {
        const nextIdx = (clampedMsgIdx + 1) % safeCount;
        return {
          ...state,
          selectedMessageIndex: nextIdx,
          selectedDraftIndex: 0,
          stagedReplyText: '',
          lastGesture: `R1 swipe down: message ${nextIdx + 1}/${safeCount}`,
        };
      }
      if (gesture === 'R1_PREV') {
        const prevIdx = (clampedMsgIdx - 1 + safeCount) % safeCount;
        return {
          ...state,
          selectedMessageIndex: prevIdx,
          selectedDraftIndex: 0,
          stagedReplyText: '',
          lastGesture: `R1 swipe up: message ${prevIdx + 1}/${safeCount}`,
        };
      }
      if (gesture === 'R1_SELECT') {
        return {
          ...state,
          screen: 'AI_SUMMARY',
          selectedMessageIndex: clampedMsgIdx,
          selectedDraftIndex: 0,
          lastGesture: `R1 tap: AI Summary for ${activeMsg?.senderName || 'thread'}`,
        };
      }
      return state;
    }

    case 'AI_SUMMARY': {
      if (gesture === 'TEMPLE_BACK') {
        return {
          ...state,
          screen: 'INCOMING_MESSAGE',
          lastGesture: 'Temple tap: back to Incoming Message',
        };
      }
      if (gesture === 'R1_NEXT' && safeCount > 1) {
        const nextIdx = (clampedMsgIdx + 1) % safeCount;
        return {
          ...state,
          selectedMessageIndex: nextIdx,
          selectedDraftIndex: 0,
          lastGesture: `R1 swipe: message ${nextIdx + 1}/${safeCount}`,
        };
      }
      if (gesture === 'R1_PREV' && safeCount > 1) {
        const prevIdx = (clampedMsgIdx - 1 + safeCount) % safeCount;
        return {
          ...state,
          selectedMessageIndex: prevIdx,
          selectedDraftIndex: 0,
          lastGesture: `R1 swipe: message ${prevIdx + 1}/${safeCount}`,
        };
      }
      if (gesture === 'R1_SELECT') {
        if (draftCount > 0) {
          return {
            ...state,
            screen: 'REPLY_DRAFT',
            selectedDraftIndex: 0,
            stagedReplyText: drafts[0].text,
            lastGesture: 'R1 tap: opened AI Reply Draft',
          };
        }
        return {
          ...state,
          lastGesture: 'Request AI Summary first to inspect drafts',
        };
      }
      return state;
    }

    case 'REPLY_DRAFT': {
      if (gesture === 'TEMPLE_BACK') {
        return {
          ...state,
          screen: 'AI_SUMMARY',
          lastGesture: 'Temple tap: back to AI Summary',
        };
      }
      if (draftCount === 0) {
        return {
          ...state,
          screen: 'AI_SUMMARY',
          lastGesture: 'No drafts generated yet',
        };
      }
      if (gesture === 'R1_NEXT') {
        const nextIdx = (state.selectedDraftIndex + 1) % draftCount;
        return {
          ...state,
          selectedDraftIndex: nextIdx,
          stagedReplyText: drafts[nextIdx].text,
          lastGesture: `R1 swipe down: draft ${nextIdx + 1}/${draftCount}`,
        };
      }
      if (gesture === 'R1_PREV') {
        const prevIdx = (state.selectedDraftIndex - 1 + draftCount) % draftCount;
        return {
          ...state,
          selectedDraftIndex: prevIdx,
          stagedReplyText: drafts[prevIdx].text,
          lastGesture: `R1 swipe up: draft ${prevIdx + 1}/${draftCount}`,
        };
      }
      if (gesture === 'R1_SELECT') {
        const effectiveDraftIdx =
          typeof ctx.selectedListIndex === 'number' &&
          ctx.selectedListIndex >= 0 &&
          ctx.selectedListIndex < draftCount
            ? ctx.selectedListIndex
            : state.selectedDraftIndex;
        const chosen =
          (typeof ctx.selectedListIndex === 'number' && drafts[effectiveDraftIdx]?.text) ||
          (ctx.customStagedText && ctx.customStagedText.trim()) ||
          state.stagedReplyText ||
          drafts[effectiveDraftIdx]?.text ||
          '';
        return {
          ...state,
          screen: 'CONFIRM_SEND',
          selectedDraftIndex: effectiveDraftIdx,
          stagedReplyText: chosen,
          lastGesture: 'R1 tap: review Confirm Send screen',
        };
      }
      return state;
    }

    case 'CONFIRM_SEND': {
      if (gesture === 'TEMPLE_BACK') {
        return {
          ...state,
          screen: 'REPLY_DRAFT',
          lastGesture: 'Temple tap: cancelled send',
        };
      }
      return {
        ...state,
        lastGesture:
          activeMsg?.status === 'REPLIED'
            ? 'Already replied — duplicate sends prevented'
            : 'Deliberate wearer confirmation required before Telegram send',
      };
    }

    case 'SENT': {
      if (gesture === 'R1_SELECT' || gesture === 'TEMPLE_BACK') {
        return {
          ...state,
          screen: 'HOME',
          selectedDraftIndex: 0,
          stagedReplyText: '',
          lastGesture: 'Returned to CareCue Home',
        };
      }
      return state;
    }

    case 'SETTINGS': {
      if (gesture === 'TEMPLE_BACK') {
        return {
          ...state,
          screen: 'HOME',
          lastGesture: 'Temple tap: back to Home',
        };
      }
      if (gesture === 'R1_NEXT') {
        const nextRow = (state.settingsRowIndex + 1) % 3;
        return {
          ...state,
          settingsRowIndex: nextRow,
          lastGesture: `Settings option ${nextRow + 1}/3`,
        };
      }
      if (gesture === 'R1_PREV') {
        const prevRow = (state.settingsRowIndex + 2) % 3;
        return {
          ...state,
          settingsRowIndex: prevRow,
          lastGesture: `Settings option ${prevRow + 1}/3`,
        };
      }
      if (gesture === 'R1_SELECT') {
        const effectiveSettingsRow =
          typeof ctx.selectedListIndex === 'number' &&
          ctx.selectedListIndex >= 0 &&
          ctx.selectedListIndex < 3
            ? ctx.selectedListIndex
            : state.settingsRowIndex;
        if (effectiveSettingsRow === 1) {
          const nextBrightness = ((state.displayPrefs.brightnessLevel % 4) + 1) as 1 | 2 | 3 | 4;
          return {
            ...state,
            settingsRowIndex: 1,
            displayPrefs: { ...state.displayPrefs, brightnessLevel: nextBrightness },
            lastGesture: `G2 Brightness set to ${nextBrightness}/4`,
          };
        }
        if (effectiveSettingsRow === 2) {
          const nextCompact = !state.displayPrefs.compactMode;
          return {
            ...state,
            settingsRowIndex: 2,
            displayPrefs: { ...state.displayPrefs, compactMode: nextCompact },
            lastGesture: nextCompact ? 'Compact typography enabled' : 'Standard typography enabled',
          };
        }
        return {
          ...state,
          settingsRowIndex: 0,
          lastGesture: ctx.sessionPaused
            ? 'Use Reconnect Bot Session control below'
            : 'Use Disconnect Bot Session control below',
        };
      }
      return state;
    }

    default:
      return state;
  }
}

export function buildG2HudFrame(
  state: CareCueG2ScreenState,
  messages: CareCueMessageItem[],
  botConnected: boolean,
  sessionPaused = false
): CareCueHudFrame {
  const activeMsg =
    messages.length > 0
      ? messages[Math.min(Math.max(0, state.selectedMessageIndex), messages.length - 1)]
      : undefined;

  const unreadCount = messages.filter((m) => m.status !== 'REPLIED').length;
  const connLabel = sessionPaused
    ? 'TG PAUSED'
    : botConnected
      ? 'TG LIVE'
      : 'TG DEMO';

  let screenTitle = 'HOME';
  const headerLeft = `CARECUE · ${connLabel}`;
  let headerRight = `${unreadCount} OPEN`;
  let bodyLines: string[] = [];
  let footerHint = 'R1: SCROLL  |  TAP: OPEN  |  TEMPLE: BACK';
  let listItems: string[] | undefined;
  let highlightedListIndex: number | undefined;

  if (state.screen === 'HOME') {
    screenTitle = 'HOME';
    const latestLine = activeMsg
      ? clampLine(`LATEST: ${activeMsg.senderName} — ${activeMsg.rawText}`, 46)
      : 'LATEST: Inbox clear';
    listItems = [
      clampLine(`${state.homeRowIndex === 0 ? '>' : ' '} INBOX (${unreadCount} OPEN) · ${latestLine}`, 48),
      clampLine(`${state.homeRowIndex === 1 ? '>' : ' '} SETTINGS & CONNECTION (${connLabel})`, 48),
    ];
    highlightedListIndex = state.homeRowIndex;
    bodyLines = listItems;
    footerHint = 'R1 TAP: OPEN  |  TEMPLE: SETTINGS';
  } else if (state.screen === 'INCOMING_MESSAGE') {
    screenTitle = 'INCOMING';
    headerRight =
      messages.length > 0
        ? `${Math.min(state.selectedMessageIndex + 1, messages.length)}/${messages.length}`
        : '0/0';
    if (!activeMsg) {
      bodyLines = ['NO TELEGRAM MESSAGES IN QUEUE', 'Poll Bot API or inject a demo thread.'];
      footerHint = 'TEMPLE: HOME';
    } else {
      const timeStr = formatClock(activeMsg.receivedAt);
      const wrapLen = state.displayPrefs.compactMode ? 48 : 44;
      const textClean = activeMsg.rawText.replace(/\s+/g, ' ').trim();
      bodyLines = [
        clampLine(`${activeMsg.senderName} (${activeMsg.senderHandle}) · ${timeStr}`, 48),
        clampLine(textClean.slice(0, wrapLen), 48),
        textClean.length > wrapLen
          ? clampLine(textClean.slice(wrapLen, wrapLen * 2), 48)
          : `STATUS: ${activeMsg.status} (${activeMsg.source})`,
      ].filter(Boolean);
      footerHint = 'R1 UP/DOWN: MSG  |  TAP: AI SUMMARY  |  TEMPLE: HOME';
    }
  } else if (state.screen === 'AI_SUMMARY') {
    screenTitle = 'AI SUMMARY';
    headerRight = activeMsg?.summary ? activeMsg.summary.urgency : 'UNSUMMARIZED';
    if (!activeMsg) {
      bodyLines = ['Select an incoming message first.'];
      footerHint = 'TEMPLE: INCOMING';
    } else if (activeMsg.summary) {
      bodyLines = [
        clampLine(activeMsg.summary.glanceHeadline, 48),
        ...activeMsg.summary.bulletPoints.slice(0, 2).map((b) => clampLine(`- ${b}`, 48)),
        clampLine(`ASK: ${activeMsg.summary.recommendedAction}`, 48),
      ];
      footerHint = 'R1 TAP: REPLY DRAFT  |  TEMPLE: MESSAGE';
    } else {
      bodyLines = [
        clampLine(`FROM: ${activeMsg.senderName}`, 48),
        'No AI summary generated yet for this message.',
        'Trigger Summarize from the control console.',
      ];
      footerHint = 'TEMPLE: MESSAGE';
    }
  } else if (state.screen === 'REPLY_DRAFT') {
    screenTitle = 'DRAFT · UNCONFIRMED';
    const drafts = activeMsg?.summary?.drafts ?? [];
    headerRight = drafts.length > 0 ? `${state.selectedDraftIndex + 1}/${drafts.length}` : '0/0';
    if (drafts.length > 0) {
      listItems = drafts.map((d, idx) => {
        const marker = idx === state.selectedDraftIndex ? '>' : ' ';
        return clampLine(`${marker} [${d.tone.toUpperCase()}] ${d.text}`, 46);
      });
      highlightedListIndex = state.selectedDraftIndex;
      bodyLines = listItems;
    } else {
      bodyLines = ['Generate AI summary first to draft replies.'];
    }
    footerHint = 'UNCONFIRMED AI DRAFT · TAP: CONFIRM SCREEN';
  } else if (state.screen === 'CONFIRM_SEND') {
    screenTitle = 'CONFIRM SEND';
    headerRight = activeMsg?.status === 'REPLIED' ? 'SENT LOCKED' : 'GATE ACTIVE';
    const preview = clampLine(state.stagedReplyText || '(Empty reply)', 88);
    if (!activeMsg) {
      bodyLines = ['No target message selected.'];
    } else if (activeMsg.status === 'REPLIED') {
      bodyLines = [
        `TO: ${clampLine(activeMsg.senderName, 36)}`,
        'ALREADY REPLIED — DUPLICATE SEND PREVENTED.',
        `SENT: ${clampLine(activeMsg.sentReply?.text || '', 42)}`,
      ];
    } else {
      bodyLines = [
        `TO: ${clampLine(activeMsg.senderName, 36)} (${activeMsg.senderHandle})`,
        clampLine(`OUT: ${preview.slice(0, 44)}`, 48),
        preview.length > 44 ? clampLine(`     ${preview.slice(44, 88)}`, 48) : '',
        '[DELIBERATE CONFIRM]  OR  [TEMPLE: CANCEL]',
      ].filter(Boolean);
    }
    footerHint = 'EXPLICIT WEARER CONFIRMATION REQUIRED';
  } else if (state.screen === 'SENT') {
    screenTitle = 'SENT';
    headerRight = 'DELIVERED';
    const tgMsgId = activeMsg?.sentReply?.telegramResultMessageId;
    bodyLines = [
      clampLine(`TO: ${activeMsg?.senderName || 'Recipient'}`, 48),
      tgMsgId ? `TELEGRAM MSG ID: #${tgMsgId} (CONFIRMED)` : 'DELIVERED (LOCAL DEMO RECEIPT)',
      clampLine(`TEXT: ${activeMsg?.sentReply?.text || state.stagedReplyText}`, 48),
    ];
    footerHint = 'R1 TAP / TEMPLE: RETURN TO HOME';
  } else {
    screenTitle = 'SETTINGS';
    headerRight = `B:${state.displayPrefs.brightnessLevel}/4`;
    listItems = [
      clampLine(`${state.settingsRowIndex === 0 ? '>' : ' '} STATUS: ${connLabel} (SERVER BOT API)`, 46),
      clampLine(`${state.settingsRowIndex === 1 ? '>' : ' '} BRIGHTNESS: ${state.displayPrefs.brightnessLevel}/4 (TAP CYCLE)`, 46),
      clampLine(`${state.settingsRowIndex === 2 ? '>' : ' '} TYPOGRAPHY: ${state.displayPrefs.compactMode ? 'COMPACT' : 'STANDARD'}`, 46),
    ];
    highlightedListIndex = state.settingsRowIndex;
    bodyLines = listItems;
    footerHint = 'PRIVACY: SERVER TOKENS ONLY · TEMPLE: HOME';
  }

  const validBrightness = isValidTextBrightness(state.displayPrefs.brightnessLevel)
    ? state.displayPrefs.brightnessLevel
    : 4;

  const headerContainer = new TextContainerProperty({
    containerID: 1,
    containerName: 'carecue_header',
    xPosition: 12,
    yPosition: 8,
    width: 552,
    height: 36,
    borderWidth: 0,
    paddingLength: 2,
    zOrderIndex: 0,
    isEventCapture: 0,
    textColor: Math.max(1, validBrightness - 1),
    content: `${headerLeft} · ${screenTitle} [${headerRight}]`,
  });

  const textObjects: TextContainerProperty[] = [headerContainer];
  const listObjects: ListContainerProperty[] = [];

  if (
    listItems &&
    listItems.length > 0 &&
    (state.screen === 'HOME' || state.screen === 'REPLY_DRAFT' || state.screen === 'SETTINGS')
  ) {
    listObjects.push(
      new ListContainerProperty({
        containerID: 2,
        containerName: 'carecue_list',
        xPosition: 12,
        yPosition: 50,
        width: 552,
        height: 192,
        borderWidth: 1,
        borderColor: 2,
        borderRadius: 4,
        paddingLength: 6,
        zOrderIndex: 1,
        isEventCapture: 1,
        itemContainer: new ListItemContainerProperty({
          itemCount: listItems.length,
          itemWidth: 536,
          isItemSelectBorderEn: 1,
          itemName: listItems,
        }),
      })
    );
  } else {
    textObjects.push(
      new TextContainerProperty({
        containerID: 2,
        containerName: 'carecue_body',
        xPosition: 12,
        yPosition: 50,
        width: 552,
        height: 192,
        borderWidth: 1,
        borderColor: 2,
        borderRadius: 4,
        paddingLength: 8,
        zOrderIndex: 1,
        isEventCapture: 1,
        textColor: validBrightness,
        content: bodyLines.join('\n'),
      })
    );
  }

  textObjects.push(
    new TextContainerProperty({
      containerID: 3,
      containerName: 'carecue_footer',
      xPosition: 12,
      yPosition: 248,
      width: 552,
      height: 32,
      borderWidth: 0,
      paddingLength: 2,
      zOrderIndex: 2,
      isEventCapture: 0,
      textColor: Math.max(1, Math.min(2, validBrightness)),
      content: footerHint,
    })
  );

  const menuItems = [
    new MenuItemProperty({ itemID: 1, itemName: clampMenuLabel('Select / Open') }),
    new MenuItemProperty({ itemID: 2, itemName: clampMenuLabel('Back') }),
    new MenuItemProperty({ itemID: 3, itemName: clampMenuLabel('CareCue Home') }),
    new MenuItemProperty({ itemID: 4, itemName: clampMenuLabel('Settings') }),
  ];

  const containerPayload = new CreateStartUpPageContainer({
    containerTotalNum: textObjects.length + listObjects.length,
    textObject: textObjects,
    listObject: listObjects.length > 0 ? listObjects : undefined,
    menuObject: new MenuContainerProperty({ menuItems }),
  });

  const validation = validateEvenHubPageContainer(containerPayload);

  return {
    screenTitle,
    headerLeft,
    headerRight,
    bodyLines,
    footerHint,
    listItems,
    highlightedListIndex,
    containerPayload,
    validation: validation.valid
      ? { valid: true }
      : { valid: false, message: formatEvenHubPageContainerValidationError(validation) },
  };
}

export function mapEvenHubEventToGesture(
  event: EvenHubEvent,
  currentScreen: CareCueG2ScreenState['screen']
): CareCueHardwareGesture | null {
  if (event.menuItemClickEvent?.itemID === 1) return 'R1_SELECT';
  if (event.menuItemClickEvent?.itemID === 2) return 'TEMPLE_BACK';
  if (event.menuItemClickEvent?.itemID === 3) return 'TEMPLE_HOLD_HOME';
  if (event.menuItemClickEvent?.itemID === 4) return 'OPEN_SETTINGS';

  const eventType =
    event.listEvent?.eventType ?? event.textEvent?.eventType ?? event.sysEvent?.eventType;
  const source = event.sysEvent?.eventSource;

  if (eventType === undefined) return null;

  if (eventType === OsEventTypeList.SCROLL_TOP_EVENT) return 'R1_PREV';
  if (eventType === OsEventTypeList.SCROLL_BOTTOM_EVENT) return 'R1_NEXT';
  if (eventType === OsEventTypeList.LONG_PRESS_EVENT) return 'TEMPLE_HOLD_HOME';
  if (eventType === OsEventTypeList.DOUBLE_CLICK_EVENT) return 'TEMPLE_BACK';

  if (eventType === OsEventTypeList.CLICK_EVENT) {
    if (
      source === EventSourceType.TOUCH_EVENT_FROM_GLASSES_L ||
      (currentScreen === 'CONFIRM_SEND' && source === EventSourceType.TOUCH_EVENT_FROM_GLASSES_R)
    ) {
      return 'TEMPLE_BACK';
    }
    return 'R1_SELECT';
  }

  return null;
}

export async function connectEvenHubIfPresent(
  timeoutMs = 600
): Promise<EvenBridgeConnectionProbe> {
  if (typeof window === 'undefined') {
    return {
      mode: 'simulator',
      available: false,
      bridge: null,
      deviceModel: null,
      connectType: DeviceConnectType.None,
      batteryLevel: null,
      isWearing: null,
      launchSource: null,
      reason: 'Server context — interactive 576×288 G2 Simulator mode active.',
    };
  }

  const win = window as unknown as Record<string, unknown>;
  const hasNativeBridge = Boolean(win.EvenAppBridge || win.flutter_inappwebview);
  if (!hasNativeBridge) {
    return {
      mode: 'simulator',
      available: false,
      bridge: null,
      deviceModel: null,
      connectType: DeviceConnectType.None,
      batteryLevel: null,
      isWearing: null,
      launchSource: null,
      reason:
        'SIMULATOR MODE: Even App WebView not present in desktop browser. Rendering faithful 576×288 monochrome G2 simulator.',
    };
  }

  try {
    const bridge = await Promise.race<EvenAppBridge | null>([
      waitForEvenAppBridge(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
    ]);

    if (!bridge) {
      return {
        mode: 'simulator',
        available: false,
        bridge: null,
        deviceModel: null,
        connectType: DeviceConnectType.None,
        batteryLevel: null,
        isWearing: null,
        launchSource: null,
        reason: 'EvenAppBridge timed out — running in Simulator Mode.',
      };
    }

    const deviceInfo = await bridge.getDeviceInfo().catch(() => null);
    return {
      mode: 'live_device',
      available: true,
      bridge,
      deviceModel: deviceInfo?.model ?? null,
      connectType: deviceInfo?.status?.connectType ?? DeviceConnectType.Connected,
      batteryLevel: deviceInfo?.status?.batteryLevel ?? null,
      isWearing: deviceInfo?.status?.isWearing ?? null,
      launchSource: null,
      reason: 'LIVE EVEN HUB BRIDGE: Connected to Even App WebView.',
    };
  } catch (err) {
    return {
      mode: 'simulator',
      available: false,
      bridge: null,
      deviceModel: null,
      connectType: DeviceConnectType.ConnectionFailed,
      batteryLevel: null,
      isWearing: null,
      launchSource: null,
      reason: err instanceof Error ? err.message : 'EvenAppBridge connection failed.',
    };
  }
}

export function subscribeEvenHubLifecycle(
  bridge: EvenAppBridge,
  handlers: {
    onDeviceStatus: (status: DeviceStatus) => void;
    onLaunchSource: (source: LaunchSource) => void;
    onEvenHubEvent: (event: EvenHubEvent) => void;
  }
): () => void {
  const unsubStatus =
    typeof bridge?.onDeviceStatusChanged === 'function'
      ? bridge.onDeviceStatusChanged(handlers.onDeviceStatus)
      : undefined;
  const unsubLaunch =
    typeof bridge?.onLaunchSource === 'function'
      ? bridge.onLaunchSource(handlers.onLaunchSource)
      : undefined;
  const unsubEvents =
    typeof bridge?.onEvenHubEvent === 'function'
      ? bridge.onEvenHubEvent(handlers.onEvenHubEvent)
      : undefined;
  return () => {
    try {
      unsubStatus?.();
    } catch {
      // Ignore cleanup errors during host teardown
    }
    try {
      unsubLaunch?.();
    } catch {
      // Ignore cleanup errors during host teardown
    }
    try {
      unsubEvents?.();
    } catch {
      // Ignore cleanup errors during host teardown
    }
  };
}

export async function pushFrameToEvenBridge(
  bridge: EvenAppBridge,
  frame: CareCueHudFrame,
  hasCreatedStartupPage: boolean
): Promise<{ ok: boolean; detail: string }> {
  if (!frame.validation.valid) {
    return {
      ok: false,
      detail: frame.validation.message || 'EvenHub container validation failed.',
    };
  }

  try {
    if (!hasCreatedStartupPage) {
      if (typeof bridge?.createStartUpPageContainer !== 'function') {
        return { ok: false, detail: 'createStartUpPageContainer unavailable on host bridge.' };
      }
      const code = await bridge.createStartUpPageContainer(frame.containerPayload);
      return {
        ok: code === 0,
        detail: `createStartUpPageContainer returned ${String(code)}`,
      };
    }

    if (typeof bridge?.rebuildPageContainer !== 'function') {
      return { ok: false, detail: 'rebuildPageContainer unavailable on host bridge.' };
    }

    const rebuild = new RebuildPageContainer({
      containerTotalNum: frame.containerPayload.containerTotalNum,
      textObject: frame.containerPayload.textObject,
      listObject: frame.containerPayload.listObject,
      menuObject: frame.containerPayload.menuObject,
    });

    const ok = await bridge.rebuildPageContainer(rebuild);
    return {
      ok,
      detail: ok ? 'rebuildPageContainer ok' : 'rebuildPageContainer rejected by host',
    };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : 'EvenAppBridge page push failed.',
    };
  }
}

export async function upgradeTextBrightnessOnBridge(
  bridge: EvenAppBridge,
  containerID: number,
  content: string,
  brightness: number
): Promise<boolean> {
  if (!isValidTextBrightness(brightness)) return false;
  if (typeof bridge?.textContainerUpgrade !== 'function') return false;
  try {
    return await bridge.textContainerUpgrade(
      new TextContainerUpgrade({
        containerID,
        content,
        textColor: brightness,
      })
    );
  } catch {
    return false;
  }
}
