# Screenshot & Visual Capture Checklist — Dr. T CareCue G2

Capture these screenshots from `http://localhost:3000/?tab=carecue-g2` and `http://localhost:3000/carecue-g2` prior to uploading your DoraHacks media gallery:

> Note: Automated headless Chromium capture is not bundled inside this container environment; capture from your local browser or Codespaces preview at `1440×900` (desktop console) and `576×288` / `1024×640` (standalone wearable).

| # | Shot | Route / State | What Must Be Visible |
| :--- | :--- | :--- | :--- |
| 1 | Hero Console + Home HUD | `/?tab=carecue-g2` -> `01. Home` | Top Telegram Backend verification bar (`@DrTCareCueBot` / masked chat ID), `SIMULATOR MODE` badge, 7-screen selector, `576×288` green waveguide HUD. |
| 2 | Incoming Message | `02. Incoming` after polling/simulating | Sender handle, clock timestamp, message snippet inside monochrome box, R1 hardware button deck. |
| 3 | AI Summary | `03. AI Summary` | `gemini-4-hydrogen` concise headline, <=3 bullets, urgency tag, and unverified draft list on right panel. |
| 4 | Reply Draft Selection | `04. Reply Draft` | `DRAFT · UNCONFIRMED` header, highlighted active draft (`>`), editable final text box. |
| 5 | Wearer Confirmation Gate | `05. Confirm Gate` | Recipient preview, `EXPLICIT WEARER CONFIRMATION REQUIRED` footer, amber `Confirm & Send Telegram Reply` gate. |
| 6 | Sent Receipt & Duplicate Lock | `06. Sent` + console receipt | Telegram `message_id=#...`, `Sent — Duplicate Locked` badge, audit log showing `REPLY_CONFIRMED_AND_SENT`. |
| 7 | Settings Screen | `07. Settings` | Brightness `B:4/4`, typography toggle (`COMPACT`/`STANDARD`), Disconnect/Reconnect session toggle. |
| 8 | Standalone Wearable View | `/carecue-g2` | Distraction-free dark background Even Hub WebView layout matching `app.json` `"entry": "/carecue-g2"`. |
| 9 | Telegram Mobile Delivery | Telegram app on phone | Live bot thread showing incoming prompt and confirmed CareCue G2 reply. |
