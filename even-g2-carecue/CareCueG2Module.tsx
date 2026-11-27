import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceConnectType } from '@evenrealities/even_hub_sdk';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CornerDownLeft,
  Glasses,
  Lock,
  Power,
  RefreshCw,
  RotateCcw,
  Send,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Undo2,
} from 'lucide-react';
import {
  CareCueAuditEntry,
  CareCueBotStatus,
  CareCueG2ScreenState,
  CareCueHardwareGesture,
  CareCueMessageItem,
  CareCueScreenId,
} from './types';
import {
  EvenBridgeConnectionProbe,
  G2_DISPLAY_HEIGHT,
  G2_DISPLAY_WIDTH,
  buildG2HudFrame,
  connectEvenHubIfPresent,
  createInitialCareCueState,
  mapEvenHubEventToGesture,
  pushFrameToEvenBridge,
  reduceCareCueGesture,
  subscribeEvenHubLifecycle,
  upgradeTextBrightnessOnBridge,
} from './g2Protocol';

const SCREEN_STEP_LABELS: Array<{ id: CareCueScreenId; label: string }> = [
  { id: 'HOME', label: '01. Home' },
  { id: 'INCOMING_MESSAGE', label: '02. Incoming' },
  { id: 'AI_SUMMARY', label: '03. AI Summary' },
  { id: 'REPLY_DRAFT', label: '04. Reply Draft' },
  { id: 'CONFIRM_SEND', label: '05. Confirm Gate' },
  { id: 'SENT', label: '06. Sent' },
  { id: 'SETTINGS', label: '07. Settings' },
];

const BRIGHTNESS_OPACITY: Record<1 | 2 | 3 | 4, string> = {
  1: 'opacity-45',
  2: 'opacity-65',
  3: 'opacity-85',
  4: 'opacity-100',
};

function formatShortTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function formatConnectType(connectType: DeviceConnectType): string {
  switch (connectType) {
    case DeviceConnectType.Connected:
      return 'Connected';
    case DeviceConnectType.Connecting:
      return 'Connecting';
    case DeviceConnectType.Disconnected:
      return 'Disconnected';
    case DeviceConnectType.ConnectionFailed:
      return 'Connection Failed';
    default:
      return 'Simulator';
  }
}

export interface CareCueG2ModuleProps {
  wearableOnly?: boolean;
}

export const CareCueG2Module: React.FC<CareCueG2ModuleProps> = ({ wearableOnly = false }) => {
  const [status, setStatus] = useState<CareCueBotStatus | null>(null);
  const [messages, setMessages] = useState<CareCueMessageItem[]>([]);
  const [auditEntries, setAuditEntries] = useState<CareCueAuditEntry[]>([]);
  const [hudState, setHudState] = useState<CareCueG2ScreenState>(createInitialCareCueState);

  const [bridgeProbe, setBridgeProbe] = useState<EvenBridgeConnectionProbe | null>(null);
  const [hasCreatedStartupPage, setHasCreatedStartupPage] = useState(false);
  const [lastBridgeSync, setLastBridgeSync] = useState<string>('Simulator ready');

  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [noticeBanner, setNoticeBanner] = useState<string | null>(null);

  const [showSimulatorForm, setShowSimulatorForm] = useState(false);
  const [simSender, setSimSender] = useState('Samir Patel');
  const [simHandle, setSimHandle] = useState('@samir_ops');
  const [simText, setSimText] = useState(
    'Gate 4 courier is waiting with temperature-monitored supplies. Confirm if Reception can sign now.'
  );

  const [customReplyDraft, setCustomReplyDraft] = useState('');
  const [showSdkJson, setShowSdkJson] = useState(false);
  const [confirmTestSend, setConfirmTestSend] = useState(false);

  const messagesRef = useRef<CareCueMessageItem[]>(messages);
  const statusRef = useRef<CareCueBotStatus | null>(status);
  const customDraftRef = useRef<string>(customReplyDraft);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    customDraftRef.current = customReplyDraft;
  }, [customReplyDraft]);

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setErrorBanner(null);
    try {
      const [statusRes, msgRes, auditRes] = await Promise.all([
        fetch('/api/carecue/status'),
        fetch('/api/carecue/messages'),
        fetch('/api/carecue/audit'),
      ]);
      if (!statusRes.ok || !msgRes.ok || !auditRes.ok) {
        throw new Error('Failed to load CareCue G2 workspace state from server.');
      }
      const statusData = (await statusRes.json()) as CareCueBotStatus;
      const msgData = (await msgRes.json()) as { messages: CareCueMessageItem[] };
      const auditData = (await auditRes.json()) as { entries: CareCueAuditEntry[] };

      setStatus(statusData);
      setMessages(msgData.messages || []);
      setAuditEntries(auditData.entries || []);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Could not load CareCue workspace.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const activeMessage = useMemo(() => {
    if (messages.length === 0) return null;
    const idx = Math.min(Math.max(0, hudState.selectedMessageIndex), messages.length - 1);
    return messages[idx] || null;
  }, [messages, hudState.selectedMessageIndex]);

  useEffect(() => {
    if (hudState.stagedReplyText) {
      setCustomReplyDraft(hudState.stagedReplyText);
    } else if (activeMessage?.summary?.drafts?.[hudState.selectedDraftIndex]) {
      setCustomReplyDraft(activeMessage.summary.drafts[hudState.selectedDraftIndex].text);
    }
  }, [activeMessage, hudState.selectedDraftIndex, hudState.stagedReplyText]);

  const botConnected = Boolean(status?.telegramConfigured && !status?.sessionPaused);
  const sessionPaused = Boolean(status?.sessionPaused);

  const g2Frame = useMemo(
    () => buildG2HudFrame(hudState, messages, botConnected, sessionPaused),
    [hudState, messages, botConnected, sessionPaused]
  );

  const handleGesture = useCallback(
    (gesture: CareCueHardwareGesture) => {
      setErrorBanner(null);
      setHudState((prev) =>
        reduceCareCueGesture(prev, gesture, messages, {
          telegramConnected: Boolean(status?.telegramConfigured),
          sessionPaused: Boolean(status?.sessionPaused),
          customStagedText: customReplyDraft,
        })
      );
    },
    [messages, customReplyDraft, status?.telegramConfigured, status?.sessionPaused]
  );

  const jumpToScreen = useCallback(
    (target: CareCueScreenId) => {
      setErrorBanner(null);
      setHudState((prev) => {
        const firstDraft = activeMessage?.summary?.drafts?.[prev.selectedDraftIndex]?.text || '';
        return {
          ...prev,
          screen: target,
          stagedReplyText:
            target === 'REPLY_DRAFT' || target === 'CONFIRM_SEND'
              ? prev.stagedReplyText || customReplyDraft || firstDraft
              : prev.stagedReplyText,
          lastGesture: `Navigated directly to ${target}`,
        };
      });
    },
    [activeMessage, customReplyDraft]
  );

  // Detect Even App Bridge once on mount & subscribe to SDK lifecycle events
  useEffect(() => {
    let active = true;
    let unsubscribeLifecycle: (() => void) | undefined;

    void connectEvenHubIfPresent(600).then((probe) => {
      if (!active) return;
      setBridgeProbe(probe);
      if (probe.available && probe.bridge) {
        unsubscribeLifecycle = subscribeEvenHubLifecycle(probe.bridge, {
          onDeviceStatus: (deviceStatus) => {
            setBridgeProbe((prev) =>
              prev
                ? {
                    ...prev,
                    connectType: deviceStatus.connectType,
                    batteryLevel: deviceStatus.batteryLevel ?? null,
                    isWearing: deviceStatus.isWearing ?? null,
                    reason:
                      deviceStatus.connectType === DeviceConnectType.ConnectionFailed
                        ? 'Even G2 connection failed — falling back to browser simulator preview.'
                        : deviceStatus.connectType === DeviceConnectType.Disconnected
                          ? 'Even G2 glasses disconnected.'
                          : `Even G2 ${formatConnectType(deviceStatus.connectType)}${
                              deviceStatus.batteryLevel !== undefined
                                ? ` (Battery ${deviceStatus.batteryLevel}%)`
                                : ''
                            }`,
                  }
                : prev
            );
          },
          onLaunchSource: (source) => {
            setBridgeProbe((prev) => (prev ? { ...prev, launchSource: source } : prev));
          },
          onEvenHubEvent: (event) => {
            setHudState((prev) => {
              const gesture = mapEvenHubEventToGesture(event, prev.screen);
              if (!gesture) return prev;
              return reduceCareCueGesture(prev, gesture, messagesRef.current, {
                telegramConnected: Boolean(statusRef.current?.telegramConfigured),
                sessionPaused: Boolean(statusRef.current?.sessionPaused),
                customStagedText: customDraftRef.current,
              });
            });
          },
        });
      }
    });

    return () => {
      active = false;
      unsubscribeLifecycle?.();
    };
  }, []);

  // Push HUD frame changes to physical/simulator Even Bridge whenever native host is connected
  useEffect(() => {
    if (!bridgeProbe?.available || !bridgeProbe.bridge) return;
    let cancelled = false;
    void pushFrameToEvenBridge(bridgeProbe.bridge, g2Frame, hasCreatedStartupPage).then((res) => {
      if (cancelled) return;
      if (res.ok && !hasCreatedStartupPage) {
        setHasCreatedStartupPage(true);
      }
      setLastBridgeSync(res.detail);
    });
    return () => {
      cancelled = true;
    };
  }, [bridgeProbe, g2Frame, hasCreatedStartupPage]);

  // Apply brightness upgrade via SDK TextContainerUpgrade when running inside live host
  useEffect(() => {
    if (!bridgeProbe?.available || !bridgeProbe.bridge || !hasCreatedStartupPage) return;
    void upgradeTextBrightnessOnBridge(
      bridgeProbe.bridge,
      2,
      g2Frame.bodyLines.join('\n'),
      hudState.displayPrefs.brightnessLevel
    );
  }, [
    bridgeProbe,
    hasCreatedStartupPage,
    hudState.displayPrefs.brightnessLevel,
    g2Frame.bodyLines,
  ]);

  // Hardware simulator keyboard shortcuts (disabled while typing inside inputs/textareas)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleGesture('R1_NEXT');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleGesture('R1_PREV');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleGesture('R1_SELECT');
      } else if (e.key === 'Backspace' || e.key === 'Escape') {
        e.preventDefault();
        handleGesture('TEMPLE_BACK');
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleGesture('TEMPLE_HOLD_HOME');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleGesture]);

  const handleToggleTelegramSession = async (nextPaused: boolean) => {
    setBusyAction('session');
    setErrorBanner(null);
    setNoticeBanner(null);
    try {
      const res = await fetch('/api/carecue/telegram/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paused: nextPaused }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not update Telegram session state.');
      }
      if (data.status) setStatus(data.status);
      setNoticeBanner(
        nextPaused
          ? 'Telegram session paused/disconnected in CareCue Settings. Polling and outbound sends are blocked until reconnected.'
          : 'Telegram session reconnected.'
      );
      const auditRes = await fetch('/api/carecue/audit');
      if (auditRes.ok) {
        const auditData = (await auditRes.json()) as { entries: CareCueAuditEntry[] };
        setAuditEntries(auditData.entries || []);
      }
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Session toggle failed.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleSummarize = async (messageId: string, advanceToSummary = true) => {
    setBusyAction(`summarize:${messageId}`);
    setErrorBanner(null);
    setNoticeBanner(null);
    try {
      const res = await fetch('/api/carecue/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate AI glance summary.');
      }

      setMessages((prev) => prev.map((m) => (m.id === messageId ? data.message : m)));
      const firstDraft = data.summary?.drafts?.[0]?.text || '';
      setCustomReplyDraft(firstDraft);
      if (advanceToSummary) {
        setHudState((prev) => ({
          ...prev,
          screen: 'AI_SUMMARY',
          selectedDraftIndex: 0,
          stagedReplyText: firstDraft,
          lastGesture: `AI glance summary ready (${data.summary?.modelProvider})`,
        }));
      }

      const auditRes = await fetch('/api/carecue/audit');
      if (auditRes.ok) {
        const auditData = (await auditRes.json()) as { entries: CareCueAuditEntry[] };
        setAuditEntries(auditData.entries || []);
      }

      if (data.summary?.modelProvider === 'deterministic_fallback') {
        setNoticeBanner(data.summary.fallbackReason || 'Deterministic G2 summary generated.');
      } else {
        setNoticeBanner('Gemini 4 Hydrogen summary and 3 reply drafts staged for G2 review.');
      }
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Summarization failed.');
    } finally {
      setBusyAction(null);
    }
  };

  const handlePollTelegram = async () => {
    setBusyAction('poll');
    setErrorBanner(null);
    setNoticeBanner(null);
    try {
      const res = await fetch('/api/carecue/telegram/poll', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Telegram poll returned HTTP ${res.status}`);
      }
      setMessages(data.messages || []);
      setHudState((prev) => ({
        ...prev,
        screen: 'INCOMING_MESSAGE',
        selectedMessageIndex: 0,
        lastGesture: `Polled Telegram (${data.added || 0} new)`,
      }));
      setNoticeBanner(
        `Polled @${data.bot?.username || 'bot'}: ${data.added || 0} new message(s) added.`
      );
      await loadWorkspace();
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Telegram poll failed.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleSimulateIncoming = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction('simulate');
    setErrorBanner(null);
    setNoticeBanner(null);
    try {
      const res = await fetch('/api/carecue/telegram/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: simSender,
          senderHandle: simHandle,
          rawText: simText,
          chatType: 'private_bot_chat',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not simulate incoming Telegram message.');
      }
      setShowSimulatorForm(false);
      setHudState((prev) => ({
        ...prev,
        screen: 'INCOMING_MESSAGE',
        selectedMessageIndex: 0,
        selectedDraftIndex: 0,
        stagedReplyText: '',
        lastGesture: `Incoming message from ${data.message.senderName}`,
      }));
      setNoticeBanner(`Simulated Telegram thread added from ${data.message.senderName}.`);
      await loadWorkspace();
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Simulation failed.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleStageConfirmScreen = () => {
    if (!activeMessage) return;
    if (activeMessage.status === 'REPLIED') {
      setErrorBanner(
        'A reply was already sent for this message. CareCue blocks duplicate sends.'
      );
      return;
    }
    const text = customReplyDraft.trim();
    if (!text) {
      setErrorBanner('Select or enter a short reply draft before staging confirmation.');
      return;
    }
    setErrorBanner(null);
    setHudState((prev) => ({
      ...prev,
      screen: 'CONFIRM_SEND',
      stagedReplyText: text,
      lastGesture: 'Staged reply onto G2 wearer confirmation gate',
    }));
  };

  const handleConfirmedSend = async () => {
    if (!activeMessage) return;
    if (activeMessage.status === 'REPLIED') {
      setErrorBanner('Already sent — duplicate outbound Telegram sends are blocked.');
      return;
    }
    const replyText = (hudState.stagedReplyText || customReplyDraft).trim();
    if (!replyText) {
      setErrorBanner('Reply text cannot be empty.');
      return;
    }

    setBusyAction('send');
    setErrorBanner(null);
    setNoticeBanner(null);
    try {
      const res = await fetch('/api/carecue/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: activeMessage.id,
          replyText,
          wearerConfirmed: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch Telegram reply.');
      }

      setMessages((prev) => prev.map((m) => (m.id === activeMessage.id ? data.message : m)));
      setHudState((prev) => ({
        ...prev,
        screen: 'SENT',
        stagedReplyText: replyText,
        lastGesture: `Confirmed & sent via ${data.deliveryMode}`,
      }));
      setNoticeBanner(
        data.deliveryMode === 'telegram_bot_api'
          ? `Reply sent via live Telegram Bot API to ${activeMessage.senderName}.`
          : `Wearer-confirmed reply recorded locally (${activeMessage.source} mode).`
      );

      const auditRes = await fetch('/api/carecue/audit');
      if (auditRes.ok) {
        const auditData = (await auditRes.json()) as { entries: CareCueAuditEntry[] };
        setAuditEntries(auditData.entries || []);
      }
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Send failed.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleVerifyBot = async () => {
    setBusyAction('verify-bot');
    setErrorBanner(null);
    setNoticeBanner(null);
    try {
      const res = await fetch('/api/carecue/telegram/verify-bot', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Bot getMe verification failed.');
      }
      if (data.status) setStatus(data.status);
      setNoticeBanner(
        `Verified Telegram bot @${data.bot?.username || 'bot'} (ID ${data.bot?.id}) via getMe.`
      );
      const auditRes = await fetch('/api/carecue/audit');
      if (auditRes.ok) {
        const auditData = (await auditRes.json()) as { entries: CareCueAuditEntry[] };
        setAuditEntries(auditData.entries || []);
      }
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Telegram verification failed.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleSendTestPing = async () => {
    if (!confirmTestSend) {
      setErrorBanner('Check the confirmation box before sending a test message to Telegram.');
      return;
    }
    setBusyAction('test-send');
    setErrorBanner(null);
    setNoticeBanner(null);
    try {
      const res = await fetch('/api/carecue/telegram/test-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wearerConfirmed: true,
          text: `Dr. T CareCue G2 live verification (${new Date().toLocaleTimeString()})`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Test message delivery failed.');
      }
      if (data.status) setStatus(data.status);
      setConfirmTestSend(false);
      setNoticeBanner(
        `Confirmed delivery to chat ${data.deliveryVerification?.maskedChatId} (Telegram message_id ${data.deliveryVerification?.telegramMessageId}).`
      );
      const auditRes = await fetch('/api/carecue/audit');
      if (auditRes.ok) {
        const auditData = (await auditRes.json()) as { entries: CareCueAuditEntry[] };
        setAuditEntries(auditData.entries || []);
      }
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Test send failed.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleResetDemo = async () => {
    setBusyAction('reset');
    setErrorBanner(null);
    setNoticeBanner(null);
    try {
      const res = await fetch('/api/carecue/demo/reset', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not reset demo queue.');
      setMessages(data.messages || []);
      setAuditEntries(data.audit || []);
      if (data.status) setStatus(data.status);
      setHudState(createInitialCareCueState());
      setCustomReplyDraft('');
      setNoticeBanner('CareCue G2 queue restored to 3 synthetic demo Telegram threads.');
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Reset failed.');
    } finally {
      setBusyAction(null);
    }
  };

  const brightnessClass = BRIGHTNESS_OPACITY[hudState.displayPrefs.brightnessLevel];

  const hudCanvasCard = (
    <section className="rounded-2xl border border-slate-800 bg-[#0B1117] text-slate-100 p-5 sm:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">
              {bridgeProbe?.available ? 'LIVE EVEN G2 DEVICE' : 'SIMULATOR MODE'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {G2_DISPLAY_WIDTH} × {G2_DISPLAY_HEIGHT} px · 4-bit Monochrome
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {bridgeProbe?.available
                ? `${bridgeProbe.deviceModel || 'G2'} (${formatConnectType(bridgeProbe.connectType)}${
                    bridgeProbe.batteryLevel !== null ? `, ${bridgeProbe.batteryLevel}%` : ''
                  })`
                : 'Browser Optical HUD Preview'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Gesture State: <span className="text-slate-200">{hudState.lastGesture}</span>
          </p>
        </div>

        <nav aria-label="Even G2 7-Screen Navigation" className="flex flex-wrap items-center gap-1.5">
          {SCREEN_STEP_LABELS.map((step) => {
            const isCurrent = hudState.screen === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => jumpToScreen(step.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 2:1 Aspect Ratio G2 Monochrome Canvas */}
        <div className="lg:col-span-8 space-y-3">
          <div
            aria-label="Even G2 576x288 Monochrome Display Simulator"
            className={`w-full aspect-[2/1] rounded-xl border border-emerald-500/35 bg-[#040906] p-4 sm:p-6 flex flex-col justify-between font-mono text-[#52F28D] shadow-inner select-none overflow-hidden transition-opacity ${brightnessClass}`}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#38B86A] border-b border-emerald-500/20 pb-2">
              <span className="truncate">
                {g2Frame.headerLeft} · {g2Frame.screenTitle}
              </span>
              <span className="tabular-nums shrink-0 ml-2">[{g2Frame.headerRight}]</span>
            </div>

            {/* Main 576x288 Body */}
            <div className="flex-1 flex flex-col justify-center py-2 space-y-1.5 overflow-hidden">
              {g2Frame.bodyLines.map((line, idx) => {
                const isHighlighted =
                  g2Frame.highlightedListIndex !== undefined &&
                  idx === g2Frame.highlightedListIndex;
                return (
                  <div
                    key={`${hudState.screen}-${idx}`}
                    className={`px-2.5 py-1 rounded truncate transition-colors ${
                      hudState.displayPrefs.compactMode
                        ? 'text-[11px] sm:text-xs leading-tight'
                        : 'text-xs sm:text-sm leading-snug'
                    } ${
                      isHighlighted
                        ? 'bg-[#52F28D]/15 border border-[#52F28D]/60 text-[#8CFFBA] font-semibold'
                        : 'text-[#52F28D]/90'
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>

            {/* Bottom Gesture Bar */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#35A660] border-t border-emerald-500/20 pt-2">
              <span className="truncate">{g2Frame.footerHint}</span>
              <span className="tabular-nums shrink-0 ml-2">
                SDK: {g2Frame.validation.valid ? 'VALID' : 'INVALID'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>
              Shortcuts:{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">↓</kbd> scroll ·{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">Enter</kbd> select ·{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">Esc</kbd> back ·{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">H</kbd> home
            </span>
            <button
              type="button"
              onClick={() => setShowSdkJson((v) => !v)}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              {showSdkJson ? 'Hide Even Hub Container JSON' : 'Inspect Even Hub Container JSON'}
            </button>
          </div>
        </div>

        {/* Right: R1 Ring & Temple Hardware Controls */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">R1 Ring & Temple Controls</h2>
            <p className="text-xs text-slate-400">
              Executes the exact reducer bound to Even Hub SDK gestures.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleGesture('R1_PREV')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-100 border border-slate-700"
            >
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>R1 Swipe Up</span>
            </button>
            <button
              type="button"
              onClick={() => handleGesture('R1_NEXT')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-100 border border-slate-700"
            >
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>R1 Swipe Down</span>
            </button>
            <button
              type="button"
              onClick={() => handleGesture('R1_SELECT')}
              className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-slate-950"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>R1 Tap / Select</span>
            </button>
            <button
              type="button"
              onClick={() => handleGesture('TEMPLE_BACK')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Temple Back</span>
            </button>
            <button
              type="button"
              onClick={() => handleGesture('TEMPLE_HOLD_HOME')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hold Home</span>
            </button>
          </div>

          {hudState.screen === 'CONFIRM_SEND' && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              {activeMessage?.status === 'REPLIED' ? (
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Already replied — duplicate sends blocked.</span>
                </div>
              ) : (
                <>
                  <div className="text-xs font-medium text-amber-300">
                    Wearer Confirmation Gate Active
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleConfirmedSend()}
                    disabled={busyAction !== null || sessionPaused}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {busyAction === 'send' ? 'Sending...' : 'Confirm & Send Telegram Reply'}
                    </span>
                  </button>
                </>
              )}
            </div>
          )}

          {hudState.screen === 'SETTINGS' && (
            <div className="pt-2 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-emerald-400" />
                  Brightness {hudState.displayPrefs.brightnessLevel}/4
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setHudState((prev) => ({
                      ...prev,
                      displayPrefs: {
                        ...prev.displayPrefs,
                        brightnessLevel: (((prev.displayPrefs.brightnessLevel % 4) + 1) as
                          | 1
                          | 2
                          | 3
                          | 4),
                      },
                      lastGesture: 'Updated optical brightness',
                    }))
                  }
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-[11px]"
                >
                  Cycle
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                  {hudState.displayPrefs.compactMode ? 'Compact Type' : 'Standard Type'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setHudState((prev) => ({
                      ...prev,
                      displayPrefs: {
                        ...prev.displayPrefs,
                        compactMode: !prev.displayPrefs.compactMode,
                      },
                      lastGesture: 'Toggled compact typography',
                    }))
                  }
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-[11px]"
                >
                  Toggle
                </button>
              </div>
              <button
                type="button"
                onClick={() => void handleToggleTelegramSession(!sessionPaused)}
                disabled={busyAction !== null}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-100 border border-slate-700 disabled:opacity-50"
              >
                <Power className="w-3.5 h-3.5 text-emerald-400" />
                <span>{sessionPaused ? 'Reconnect Telegram Session' : 'Disconnect Telegram Session'}</span>
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div>Host Probe: {bridgeProbe?.reason || 'Checking Even Hub WebView...'}</div>
            <div>Bridge Sync: {lastBridgeSync}</div>
          </div>
        </div>
      </div>

      {showSdkJson && (
        <pre className="rounded-xl border border-slate-800 bg-black/70 p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-72">
          {JSON.stringify(g2Frame.containerPayload.toJson(), null, 2)}
        </pre>
      )}
    </section>
  );

  if (wearableOnly) {
    return (
      <div className="min-h-screen bg-[#070B10] text-slate-100 p-4 sm:p-6 space-y-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Glasses className="w-5 h-5 text-emerald-400" />
            <span>Dr. T CareCue G2 · Even Hub Wearable Entry</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handlePollTelegram()}
              disabled={busyAction !== null || sessionPaused}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-100 border border-slate-700 disabled:opacity-50"
            >
              Poll Telegram
            </button>
            {activeMessage && !activeMessage.summary && (
              <button
                type="button"
                onClick={() => void handleSummarize(activeMessage.id, true)}
                disabled={busyAction !== null}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-slate-950 disabled:opacity-50"
              >
                AI Summarize Active
              </button>
            )}
            <a
              href="/?tab=carecue-g2"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800"
            >
              Open Full Console
            </a>
          </div>
        </div>

        {errorBanner && (
          <div className="max-w-5xl mx-auto rounded-lg border border-rose-500/40 bg-rose-950/60 px-4 py-2.5 text-xs text-rose-200">
            {errorBanner}
          </div>
        )}
        {noticeBanner && (
          <div className="max-w-5xl mx-auto rounded-lg border border-emerald-500/40 bg-emerald-950/60 px-4 py-2.5 text-xs text-emerald-200">
            {noticeBanner}
          </div>
        )}

        <div className="max-w-5xl mx-auto">{hudCanvasCard}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Top Action Contract */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Even Realities G2 Hackathon 2026</span>
            <span aria-hidden="true">·</span>
            <span>Even Hub SDK 576 × 288 Monochrome</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {sessionPaused
                ? 'Telegram Session Paused'
                : status?.telegramConfigured
                  ? `Telegram Bot @${status.botUsername || 'configured'}`
                  : 'Demo / Simulated Telegram Mode'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Glasses className="w-7 h-7 text-emerald-700 shrink-0" />
            <span>Dr. T CareCue G2 — Telegram, Without Looking Down</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl">
            Glanceable Telegram triage on Even Realities G2 micro-LED optics with server-side AI reply
            drafting, R1 ring / temple navigation, and mandatory wearer confirmation before send.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => void handlePollTelegram()}
            disabled={busyAction !== null || sessionPaused}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${busyAction === 'poll' ? 'animate-spin' : ''}`} />
            <span>Poll Telegram Bot</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSimulatorForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <span>Simulate Incoming</span>
          </button>
          <button
            type="button"
            onClick={() => jumpToScreen('SETTINGS')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors whitespace-nowrap"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>G2 Settings</span>
          </button>
          <button
            type="button"
            onClick={() => void handleResetDemo()}
            disabled={busyAction !== null}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Feedback Banners */}
      {errorBanner && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-900"
        >
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorBanner(null)}
            className="text-rose-700 font-semibold hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {noticeBanner && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-950">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{noticeBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setNoticeBanner(null)}
            className="text-emerald-800 font-semibold hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Backend Telegram Bot Authentication, Session Toggle & Delivery Verification */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Telegram Bot Backend & Delivery Verification
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span>
                Bot Token:{' '}
                <strong className={status?.telegramConfigured ? 'text-emerald-700' : 'text-slate-700'}>
                  {status?.telegramConfigured ? 'Configured on server' : 'Not configured'}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Default Chat ID:{' '}
                <strong className={status?.defaultChatIdConfigured ? 'text-emerald-700' : 'text-slate-700'}>
                  {status?.defaultChatIdConfigured
                    ? `Configured (${status.defaultChatIdHint})`
                    : 'Not configured'}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                getMe:{' '}
                <strong className={status?.botVerified ? 'text-emerald-700' : 'text-slate-700'}>
                  {status?.botVerified
                    ? `@${status.botUsername} (ID ${status.botId})`
                    : status?.botError || 'Unverified'}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Session:{' '}
                <strong className={sessionPaused ? 'text-amber-700' : 'text-emerald-700'}>
                  {sessionPaused ? 'Paused' : 'Active'}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => void handleToggleTelegramSession(!sessionPaused)}
              disabled={busyAction !== null}
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 disabled:opacity-50 whitespace-nowrap"
            >
              {sessionPaused ? 'Reconnect Session' : 'Disconnect Session'}
            </button>

            <button
              type="button"
              onClick={() => void handleVerifyBot()}
              disabled={busyAction !== null || !status?.telegramConfigured || sessionPaused}
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 disabled:opacity-50 whitespace-nowrap"
            >
              {busyAction === 'verify-bot' ? 'Verifying...' : 'Verify Bot (getMe)'}
            </button>

            <label className="inline-flex items-center gap-2 text-xs text-slate-700 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={confirmTestSend}
                onChange={(e) => setConfirmTestSend(e.target.checked)}
                className="rounded border-slate-300 text-emerald-700"
              />
              <span>Confirm test send</span>
            </label>

            <button
              type="button"
              onClick={() => void handleSendTestPing()}
              disabled={
                busyAction !== null ||
                sessionPaused ||
                !status?.telegramConfigured ||
                !status?.defaultChatIdConfigured ||
                !confirmTestSend
              }
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold disabled:opacity-50 whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{busyAction === 'test-send' ? 'Sending...' : 'Send Test Message'}</span>
            </button>
          </div>
        </div>

        {status?.lastDeliveryVerification && (
          <div
            className={`rounded-lg border px-3.5 py-2.5 text-xs ${
              status.lastDeliveryVerification.ok
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'border-rose-200 bg-rose-50 text-rose-900'
            }`}
          >
            {status.lastDeliveryVerification.ok ? (
              <span>
                Last Live Delivery Confirmed · Chat {status.lastDeliveryVerification.maskedChatId} ·
                Telegram <span className="font-mono tabular-nums">message_id={status.lastDeliveryVerification.telegramMessageId}</span> ·{' '}
                <span className="tabular-nums">{formatShortTime(status.lastDeliveryVerification.sentAt)}</span>{' '}
                — "{status.lastDeliveryVerification.previewText}"
              </span>
            ) : (
              <span>
                Last Delivery Failed · Chat {status.lastDeliveryVerification.maskedChatId} —{' '}
                {status.lastDeliveryVerification.error}
              </span>
            )}
          </div>
        )}
      </section>

      {/* Optional Simulate Telegram Form */}
      {showSimulatorForm && (
        <form
          onSubmit={handleSimulateIncoming}
          className="rounded-xl border border-slate-200 bg-white p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Simulate Incoming Telegram Message (Marked simulated_webhook)
            </h2>
            <button
              type="button"
              onClick={() => setShowSimulatorForm(false)}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block text-xs font-medium text-slate-700 space-y-1">
              <span>Sender Name</span>
              <input
                type="text"
                value={simSender}
                onChange={(e) => setSimSender(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
            <label className="block text-xs font-medium text-slate-700 space-y-1">
              <span>Telegram Handle</span>
              <input
                type="text"
                value={simHandle}
                onChange={(e) => setSimHandle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={busyAction !== null}
                className="w-full md:w-auto px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
              >
                Push to G2 Queue
              </button>
            </div>
          </div>
          <label className="block text-xs font-medium text-slate-700 space-y-1">
            <span>Message Body</span>
            <textarea
              rows={2}
              value={simText}
              onChange={(e) => setSimText(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </label>
        </form>
      )}

      {/* Primary Focal Anchor: Even Realities G2 Waveguide HUD + Hardware Controls */}
      {hudCanvasCard}

      {/* Pipeline Workspace: Telegram Queue (Left) + AI Summary & Confirmed Reply Gate (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Incoming Telegram Threads */}
        <section className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">01. Telegram Message Queue</h2>
              <p className="text-xs text-slate-500 tabular-nums">
                {messages.length} thread(s) · Bot API or synthetic demo queue
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              <div className="h-20 rounded-lg bg-slate-100 animate-pulse" />
              <div className="h-20 rounded-lg bg-slate-100 animate-pulse" />
            </div>
          ) : messages.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm font-medium text-slate-700">No Telegram messages queued yet.</p>
              <p className="text-xs text-slate-500">
                Poll a configured bot token or simulate an incoming thread to begin.
              </p>
              <button
                type="button"
                onClick={() => void handleResetDemo()}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Load Synthetic Demo Threads
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((msg, index) => {
                const isSelected = activeMessage?.id === msg.id;
                return (
                  <button
                    key={msg.id}
                    type="button"
                    onClick={() =>
                      setHudState((prev) => ({
                        ...prev,
                        selectedMessageIndex: index,
                        selectedDraftIndex: 0,
                        screen: msg.summary ? 'AI_SUMMARY' : 'INCOMING_MESSAGE',
                        stagedReplyText: msg.summary?.drafts?.[0]?.text || '',
                        lastGesture: `Selected ${msg.senderName}`,
                      }))
                    }
                    className={`w-full text-left py-3.5 px-3 rounded-lg transition-colors space-y-1.5 ${
                      isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-900 truncate">
                        {msg.senderName}{' '}
                        <span className="font-normal text-slate-500">{msg.senderHandle}</span>
                      </span>
                      <span className="text-slate-500 tabular-nums shrink-0">
                        {formatShortTime(msg.receivedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-2">{msg.rawText}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>{msg.source}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {msg.status === 'REPLIED'
                          ? 'Sent (Confirmed)'
                          : msg.summary
                            ? `Summarized (${msg.summary.urgency})`
                            : 'Needs AI Summary'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Honest Telegram Bot API Permission Disclosure */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Telegram Bot API Permission Scope</div>
            <p>
              {status?.permissionBoundary ||
                'Telegram Bot API only reads direct /start bot chats or groups where the bot is added—never unrelated private user-to-user DMs.'}
            </p>
          </div>
        </section>

        {/* Right: AI Glance Summary, Draft Editor & Mandatory Wearer Confirmation */}
        <section className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          {!activeMessage ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Select a Telegram message on the left to generate a G2 glance summary and drafts.
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{activeMessage.senderHandle}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeMessage.chatType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeMessage.source}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {activeMessage.senderName}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => void handleSummarize(activeMessage.id, true)}
                  disabled={busyAction !== null}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {busyAction === `summarize:${activeMessage.id}`
                      ? 'Summarizing...'
                      : activeMessage.summary
                        ? 'Refresh AI Summary'
                        : 'Summarize for G2'}
                  </span>
                </button>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                <div className="text-xs font-medium text-slate-500">Original Telegram Message</div>
                <p className="text-sm text-slate-800 leading-relaxed">{activeMessage.rawText}</p>
              </div>

              {activeMessage.summary ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        G2 Glance Summary — {activeMessage.summary.glanceHeadline}
                      </span>
                      <span className="text-xs text-slate-500">
                        Urgency: {activeMessage.summary.urgency} · Provider:{' '}
                        {activeMessage.summary.modelProvider}
                      </span>
                    </div>
                    <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                      {activeMessage.summary.bulletPoints.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                    {activeMessage.summary.fallbackReason && (
                      <p className="text-[11px] text-amber-800 pt-1">
                        Fallback Note: {activeMessage.summary.fallbackReason}
                      </p>
                    )}
                  </div>

                  {/* AI Reply Drafts */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900">
                        02. AI Reply Drafts (Unverified Until Wearer Confirms)
                      </h3>
                      <span className="text-xs text-slate-500">
                        Select with R1 or click below
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {activeMessage.summary.drafts.map((draft, idx) => {
                        const isChosen =
                          hudState.selectedDraftIndex === idx &&
                          customReplyDraft === draft.text;
                        return (
                          <button
                            key={draft.id}
                            type="button"
                            onClick={() => {
                              setCustomReplyDraft(draft.text);
                              setHudState((prev) => ({
                                ...prev,
                                screen: 'REPLY_DRAFT',
                                selectedDraftIndex: idx,
                                stagedReplyText: draft.text,
                                lastGesture: `Selected ${draft.tone} AI draft`,
                              }));
                            }}
                            className={`text-left rounded-lg border p-3 text-xs transition-colors ${
                              isChosen
                                ? 'border-emerald-600 bg-emerald-50/70 text-slate-900'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                              <span className="font-semibold text-slate-800">
                                Option {idx + 1} · {draft.tone}
                              </span>
                              <span>Unverified AI draft</span>
                            </div>
                            <p className="text-xs text-slate-900">{draft.text}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Explicit Wearer Edit & Confirmation Gate */}
                  <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                    <label className="block text-xs font-semibold text-slate-900 space-y-1.5">
                      <span>03. Wearer Confirmation Gate — Final Reply Text</span>
                      <textarea
                        rows={2}
                        value={customReplyDraft}
                        onChange={(e) => setCustomReplyDraft(e.target.value)}
                        disabled={activeMessage.status === 'REPLIED'}
                        placeholder="Edit or select an AI draft..."
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 font-normal disabled:bg-slate-100"
                      />
                    </label>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500">
                        {activeMessage.status === 'REPLIED'
                          ? 'Delivered once — duplicate sends are locked server-side.'
                          : 'Server blocks send unless wearer confirmation is explicitly executed.'}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        {activeMessage.status === 'REPLIED' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 text-xs font-semibold">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Sent — Duplicate Locked</span>
                          </span>
                        ) : hudState.screen !== 'CONFIRM_SEND' ? (
                          <button
                            type="button"
                            onClick={handleStageConfirmScreen}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-xs font-semibold"
                          >
                            <span>Stage on G2 Confirmation Screen</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void handleConfirmedSend()}
                            disabled={busyAction !== null || sessionPaused}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>
                              {busyAction === 'send'
                                ? 'Dispatching...'
                                : 'Confirm & Send Telegram Reply'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center space-y-3">
                  <p className="text-sm font-medium text-slate-800">
                    This Telegram thread has not been summarized for the G2 HUD yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleSummarize(activeMessage.id, true)}
                    disabled={busyAction !== null}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Glance Summary & Drafts</span>
                  </button>
                </div>
              )}

              {activeMessage.sentReply && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950 space-y-1">
                  <div className="font-semibold">
                    Sent Receipt ({activeMessage.sentReply.deliveryMode}) ·{' '}
                    <span className="tabular-nums">
                      {formatShortTime(activeMessage.sentReply.sentAt)}
                    </span>
                    {activeMessage.sentReply.telegramResultMessageId
                      ? ` · msg_id=${activeMessage.sentReply.telegramResultMessageId}`
                      : ''}
                  </div>
                  <p>"{activeMessage.sentReply.text}"</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Outbound & Event Audit Log */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-semibold text-slate-900">CareCue G2 Event & Safety Audit Log</h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {auditEntries.length} recorded event(s)
          </span>
        </div>

        {auditEntries.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">
            No events recorded in this session yet. Summarize a thread or send a confirmed reply to
            log entries.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Time</th>
                  <th className="py-2 pr-4 font-medium">Event</th>
                  <th className="py-2 pr-4 font-medium">Source</th>
                  <th className="py-2 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditEntries.slice(0, 12).map((entry) => (
                  <tr key={entry.id}>
                    <td className="py-2 pr-4 font-mono tabular-nums whitespace-nowrap text-slate-500">
                      {formatShortTime(entry.timestamp)}
                    </td>
                    <td className="py-2 pr-4 font-medium whitespace-nowrap text-slate-900">
                      {entry.eventType}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap text-slate-600">{entry.sourceMode}</td>
                    <td className="py-2 text-slate-700">{entry.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
