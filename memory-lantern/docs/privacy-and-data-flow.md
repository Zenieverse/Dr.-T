# 🔒 Privacy & Data Flow Specification — Memory Lantern

## 1. Principles of Respectful Data Stewardship

Family memories, eulogies, recipes, and personal narratives hold irreplaceable emotional value. Memory Lantern was engineered with a privacy-first doctrine:

1. **Explicit Data Boundaries**: We never send memory text to an AI model until the user explicitly selects memories and clicks "Generate Story".
2. **Local Inference First**: Memory Lantern supports 100% offline local inference using Ollama (`gemma2:2b`), meaning family stories can remain entirely within the user's private computer.
3. **Strict Ownership & Isolation**: When authenticated with Firebase, memories are stored in the `/memory_lantern_memories` collection where Firestore rules enforce `resource.data.userId == request.auth.uid`. No user can query or modify another user's memories.
4. **Zero Telemetry on Sensitive Content**: Story narratives, deceased relatives' names, oral audio snippets, and recipes are strictly prohibited from analytics, system logging, or telemetry pipelines.
5. **Real, Permanent Deletion**: Deletion immediately purges the record from Firestore or localStorage—it is not merely hidden from the UI.

---

## 2. Data Flow Matrix

| Feature | Data Handled | Storage Location | Leaves Device? | Encryption |
| :--- | :--- | :--- | :--- | :--- |
| **Guest Memory Creation** | Title, Story, Details | Browser `localStorage` | **No** | Browser Sandbox |
| **Authenticated Creation** | Title, Story, Details | Firebase Firestore | Yes (Transit to Firestore) | TLS 1.3 / AES-256 |
| **Local Story Generation** | Selected Memories Text | Local Ollama (`:11434`) | **No (Localhost only)** | N/A (Local socket) |
| **Hosted Story Generation** | Selected Memories Text | Configured Gemma Endpoint | Yes (To chosen provider) | TLS 1.3 |
| **Audio History Recording** | Voice snippet & duration | Browser / Firestore | Only if signed in | TLS 1.3 / AES-256 |
| **Shareable Text Export** | Clean memory text | Clipboard | Only by user action | Client clipboard |

---

## 3. Firestore Security Rules

```rules
match /memory_lantern_memories/{memoryId} {
  // Read: Only the authenticated creator or system admin
  allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());

  // Create: Enforces authenticated user identity matching document userId
  allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;

  // Update: Prohibits changing ownership or mutating another user's record
  allow update: if isAuthenticated() && (
    (resource.data.userId == request.auth.uid && request.resource.data.userId == resource.data.userId) ||
    isAdmin()
  );

  // Delete: Permanent removal by owner or admin
  allow delete: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
}
```

---

## 4. User Warnings & Consent Checkpoints

* **No Secrets Policy**: The UI explicitly advises users against storing credentials, passwords, social security numbers, or financial account details.
* **Inference Transmission Disclosure**: Before sending story text to hosted Gemma endpoints, the UI displays the target endpoint URL, model name, and an explicit notice: *"Selected text is transmitted only to the configured inference provider."*
