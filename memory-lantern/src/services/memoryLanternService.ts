// ============================================================================
// MEMORY LANTERN — STORIES THAT STAY
// Client Storage & Synchronization Service (Firestore & Isolated Guest Sandbox)
// ============================================================================

import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';
import { MemoryLanternItem, LanternStoryRequest, LanternStoryResponse, GemmaProviderStatus } from '../types';
import { FICTIONAL_SAMPLE_MEMORIES } from '../data/sampleMemories';

const GUEST_STORAGE_KEY = 'memory_lantern_guest_memories_v1';
const FICTIONAL_SAMPLE_FLAG_KEY = 'memory_lantern_sample_seeded_v1';

export class MemoryLanternService {
  /**
   * Loads memories for the active user. If authenticated, reads from Firestore;
   * otherwise reads from browser localStorage guest sandbox.
   */
  public static async loadMemories(userId?: string | null): Promise<MemoryLanternItem[]> {
    if (userId && db) {
      try {
        const memRef = collection(db, 'memory_lantern_memories');
        const q = query(memRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        const list: MemoryLanternItem[] = [];
        snapshot.forEach(docSnap => {
          list.push(docSnap.data() as MemoryLanternItem);
        });
        
        // If empty on first authenticated visit, provide sample memories locally
        if (list.length === 0 && !localStorage.getItem(`${FICTIONAL_SAMPLE_FLAG_KEY}_${userId}`)) {
          return FICTIONAL_SAMPLE_MEMORIES.map(m => ({ ...m, userId }));
        }
        return list;
      } catch (err) {
        console.warn('[MemoryLanternService] Firestore read failed, falling back to local sandbox:', err);
      }
    }

    // Guest sandbox fallback
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) {
      // Seed initial sample data for guest preview
      const initial = [...FICTIONAL_SAMPLE_MEMORIES];
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    try {
      return JSON.parse(raw) as MemoryLanternItem[];
    } catch {
      return [...FICTIONAL_SAMPLE_MEMORIES];
    }
  }

  /**
   * Saves or updates a memory.
   */
  public static async saveMemory(memory: MemoryLanternItem, userId?: string | null): Promise<void> {
    const record: MemoryLanternItem = {
      ...memory,
      userId: userId || memory.userId || 'guest_user',
      updatedAt: new Date().toISOString()
    };

    if (userId && db) {
      try {
        const docRef = doc(db, 'memory_lantern_memories', record.id);
        await setDoc(docRef, record);
        return;
      } catch (err) {
        console.error('[MemoryLanternService] Firestore save error:', err);
      }
    }

    // Local guest sandbox
    const current = await this.loadMemories(null);
    const index = current.findIndex(m => m.id === record.id);
    if (index >= 0) {
      current[index] = record;
    } else {
      current.unshift(record);
    }
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(current));
  }

  /**
   * Deletes a memory completely.
   */
  public static async deleteMemory(memoryId: string, userId?: string | null): Promise<void> {
    if (userId && db) {
      try {
        const docRef = doc(db, 'memory_lantern_memories', memoryId);
        await deleteDoc(docRef);
      } catch (err) {
        console.error('[MemoryLanternService] Firestore delete error:', err);
      }
    }

    // Also remove from guest storage if present
    const current = await this.loadMemories(null);
    const filtered = current.filter(m => m.id !== memoryId);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Removes all sample memories.
   */
  public static async clearSampleMemories(userId?: string | null): Promise<void> {
    if (userId) {
      localStorage.setItem(`${FICTIONAL_SAMPLE_FLAG_KEY}_${userId}`, 'true');
    }

    const current = await this.loadMemories(userId);
    const samplesToRemove = current.filter(m => m.isSample);
    for (const sample of samplesToRemove) {
      await this.deleteMemory(sample.id, userId);
    }
  }

  /**
   * Seeds or restores sample memories.
   */
  public static async seedSampleMemories(userId?: string | null): Promise<MemoryLanternItem[]> {
    const user = userId || 'guest_user';
    const samples = FICTIONAL_SAMPLE_MEMORIES.map(m => ({
      ...m,
      id: `sample-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: user
    }));

    for (const sample of samples) {
      await this.saveMemory(sample, userId);
    }

    return this.loadMemories(userId);
  }

  /**
   * Queries the server for open-weight Gemma inference provider status.
   */
  public static async fetchProviderStatus(): Promise<GemmaProviderStatus> {
    try {
      const res = await fetch('/api/memory-lantern/provider-status');
      if (res.ok) {
        return (await res.json()) as GemmaProviderStatus;
      }
    } catch (err) {
      console.warn('[MemoryLanternService] Provider status check failed:', err);
    }

    return {
      status: 'NOT_CONFIGURED',
      providerType: 'none',
      modelId: 'gemma-2-9b-it',
      endpointUrl: 'none',
      message: 'Could not connect to narrative server.',
      isLocal: false,
      checkedAt: new Date().toISOString(),
      supportedModels: ['gemma2:2b', 'gemma2:9b', 'google/gemma-2-9b-it'],
      reproductionCommand: 'ollama run gemma2:2b'
    };
  }

  /**
   * Requests a generated narrative story via the server-side open-weight Gemma adapter.
   */
  public static async generateStory(req: LanternStoryRequest, isTestFixture = false): Promise<LanternStoryResponse> {
    const res = await fetch(`/api/memory-lantern/generate-story?testFixture=${isTestFixture}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({ error: 'Inference request failed' }));
      throw new Error(errorJson.error || `Generation failed with status ${res.status}`);
    }

    return (await res.json()) as LanternStoryResponse;
  }

  /**
   * Generates a clean Markdown export of a memory or story.
   */
  public static exportToMarkdown(memory: MemoryLanternItem): string {
    const lines: string[] = [
      `# 🏮 ${memory.title}`,
      `**Category**: ${memory.category} | **Privacy**: ${memory.privacyLevel}`,
      memory.dateOrPeriod ? `**Date / Period**: ${memory.dateOrPeriod}` : '',
      memory.peopleRemembered?.length ? `**People Remembered**: ${memory.peopleRemembered.join(', ')}` : '',
      memory.tags?.length ? `**Tags**: ${memory.tags.map(t => `#${t}`).join(' ')}` : '',
      '',
      '## Memory Story',
      memory.story,
      ''
    ];

    if (memory.meaningfulDetails?.length) {
      lines.push('## Meaningful Details & Traditions');
      memory.meaningfulDetails.forEach(d => {
        lines.push(`* **[${d.type.replace('_', ' ').toUpperCase()}] ${d.label}**: ${d.value}`);
      });
      lines.push('');
    }

    if (memory.audioNote?.recorded) {
      lines.push('## Oral History Note');
      lines.push(`* Duration: ${memory.audioNote.durationSeconds}s`);
      if (memory.audioNote.transcriptSummary) {
        lines.push(`* Summary: ${memory.audioNote.transcriptSummary}`);
      }
      lines.push('');
    }

    lines.push('---');
    lines.push(`*Preserved with Memory Lantern — Stories That Stay on ${new Date().toLocaleDateString()}*`);
    return lines.filter(Boolean).join('\n');
  }

  /**
   * Generates a clean shareable text representation excluding private metadata and database keys.
   */
  public static exportShareableText(memory: MemoryLanternItem): string {
    const header = `🏮 ${memory.title.toUpperCase()}`;
    const period = memory.dateOrPeriod ? `(${memory.dateOrPeriod})` : '';
    const people = memory.peopleRemembered?.length ? `In remembrance of: ${memory.peopleRemembered.join(', ')}` : '';
    
    const details = memory.meaningfulDetails?.length 
      ? '\nTraditions & Keepsakes:\n' + memory.meaningfulDetails.map(d => `• ${d.label}: ${d.value}`).join('\n')
      : '';

    return [
      header,
      period,
      people,
      '',
      memory.story,
      details,
      '',
      '— Preserved in the Memory Lantern garden'
    ].filter(Boolean).join('\n');
  }
}
