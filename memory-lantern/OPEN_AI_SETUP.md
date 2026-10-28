# 🤖 Open-Weight Gemma Setup & Reproduction Guide

Memory Lantern uses Google's open-weight **Gemma** model family (specifically Gemma 2). This guide explains how to run Gemma locally or connect a hosted open-weight inference endpoint.

---

## Option A: 100% Offline Local Inference via Ollama (Recommended)

Running Gemma locally ensures complete data privacy: **no memory text ever leaves your machine**.

### 1. Install Ollama
Download and install Ollama from [ollama.com](https://ollama.com) (available for macOS, Linux, and Windows).

### 2. Pull & Run Gemma 2
Choose the model size that fits your hardware:

* **For standard laptops / 8GB RAM (Lightweight & Fast)**:
  ```bash
  ollama run gemma2:2b
  ```

* **For modern workstations / 16GB+ RAM (Higher Nuance & Depth)**:
  ```bash
  ollama run gemma2:9b
  ```

### 3. Verify Local Connectivity
Ollama runs an HTTP REST server on port 11434 by default:
```bash
curl -s http://localhost:11434/api/tags | jq .
```
You should see `gemma2:2b` or `gemma2:9b` listed in the returned models array.

### 4. Memory Lantern Auto-Discovery
Memory Lantern automatically detects `http://localhost:11434`. When you click **Check Provider** in the UI, the status pill will turn green:
`● Connected (Local Ollama: gemma2:2b)`

---

## Option B: Hosted Open-Weight Gemma API

If you do not want to run models locally, you can connect any OpenAI-compatible provider serving Gemma 2:

### 1. Supported Providers
* **Groq** (`model: gemma2-9b-it`)
* **Hugging Face Inference Endpoints** (`model: google/gemma-2-9b-it`)
* **OpenRouter** (`model: google/gemma-2-9b-it`)
* **vLLM / Self-Hosted Kubernetes**

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root of the project:

```bash
# Set your provider endpoint URL and API key
GEMMA_API_BASE_URL=https://api.groq.com/openai/v1
GEMMA_API_KEY=gsk_your_actual_key_here
GEMMA_MODEL_ID=gemma2-9b-it
```

### 3. Restart the Server
```bash
npm run dev
```

---

## Option C: Offline Demonstration Test Fixture

If neither Ollama nor a hosted API key is configured, Memory Lantern provides an explicit, labeled verification button:
**"Run Verification Fixture"**

This returns a deterministic, pre-computed story structure clearly labeled:
`Model: gemma-2-9b-it (Deterministic Test Fixture)`
`Provider: deterministic_test_fixture`

This allows judges and reviewers to test the entire preview, edit, formatting, and saving flow even in isolated environments without network access.
