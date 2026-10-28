# 🏛️ Memory Lantern — Architecture & Technical Design

## 1. System Overview

Memory Lantern is an intergenerational memory preservation sanctuary designed to provide emotional warmth, factual fidelity, and open-weight AI narrative capabilities without compromising user privacy or crossing ethical boundaries.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React 18 SPA)                     │
│  • MemoryLanternModule (Central Garden, Timeline, Storybook & Privacy) │
│  • LanternCard (Glowing interactive memory cards with flame visualizer)│
│  • CreateMemoryModal (Rich memory intake: recipes, proverbs, oral note)│
│  • LanternStoriesModal (Gemma 2 narrative workbench & draft editor)   │
│  • TributeReaderModal (Clean reading & printable remembrance format)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP JSON REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SERVER PROXY LAYER (Node.js Express 5)               │
│  • GET  /api/memory-lantern/provider-status (Real connectivity check)  │
│  • POST /api/memory-lantern/generate-story  (Prompt builder & parser)  │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
                    ▼                               ▼
       ┌────────────────────────┐      ┌─────────────────────────────┐
       │   Local Ollama Engine  │      │  Hosted Open-Weight Gemma   │
       │  http://localhost:11434│      │  OpenAI-Compatible endpoint │
       │  • gemma2:2b / 9b      │      │  • google/gemma-2-9b-it     │
       │  • 100% offline        │      │  • 15-20s timeout budget    │
       └────────────────────────┘      └─────────────────────────────┘
```

---

## 2. Open-Weight Model Integration: Gemma 2

Memory Lantern integrates Google's open-weight **Gemma** model family (specifically Gemma 2 2B / 9B / 27B).

### A. Provider Interface
The provider is managed via `MemoryLanternServerService` behind a typed contract:

```typescript
export interface GemmaProviderStatus {
  status: 'READY' | 'CONFIGURED' | 'UNREACHABLE' | 'NOT_CONFIGURED';
  providerType: 'ollama' | 'hosted_open_weight' | 'none';
  modelId: string;
  endpointUrl: string;
  message: string;
  isLocal: boolean;
  checkedAt: string;
  supportedModels: string[];
  reproductionCommand: string;
}
```

### B. Prompt Engineering & Ethical Safeguards
The server constructs prompts with non-negotiable ethical constraints:
1. **No Necromancy / Impersonation**: The model is prohibited from speaking in the first-person voice of a deceased person (e.g. "I am still watching over you").
2. **Factual Immutability**: All names, dates, recipes, sayings, and places supplied by the user must remain unaltered.
3. **Restraint over Hallucination**: When memory notes are brief, the model produces a gentle, restrained reflection rather than inventing fictional biographical events or relatives.

### C. Output Provenance Parsing
The server splits model output into:
- The narrative draft
- `Supplied Facts Honored`: Bullet points verifying which user facts were explicitly preserved.
- `Narrative Enhancements`: A brief explanation of the stylistic transitions added.

---

## 3. Data Persistence & Access Control

```
                      ┌────────────────────────────────┐
                      │    User Authentication State   │
                      └───────┬────────────────┬───────┘
                              │                │
            [Authenticated]   ▼                ▼  [Unauthenticated Guest]
┌──────────────────────────────────────┐  ┌────────────────────────────────────┐
│      Firebase Firestore Collection   │  │       Browser localStorage         │
│      /memory_lantern_memories        │  │       memory_lantern_guest_memories│
│                                      │  │                                    │
│  Security Rules:                     │  │  • Scoped strictly to browser     │
│  allow read, write: if               │  │  • Zero transmission over network  │
│    request.auth.uid == userId;       │  │  • One-click purge available       │
└──────────────────────────────────────┘  └────────────────────────────────────┘
```

---

## 4. Invariant Testing & Verification

The system is validated by an automated test suite (`scripts/test-memory-lantern.ts`):
1. **CRUD Invariants**: Creation, editing, filtering, and permanent deletion.
2. **Data Ownership**: Verifies that user A cannot query or mutate user B's records.
3. **Provider Honesty**: Checks that unconfigured models report `NOT_CONFIGURED` truthfully without faking closed-model responses.
4. **Safety Boundaries**: Validates that prompt construction rejects deceased persona channeling.
