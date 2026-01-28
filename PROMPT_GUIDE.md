# 🛠️ Clay County Directory: AI Development Guide

**INSTRUCTIONS:** Copy and paste this guide into any AI session (Gemini, ChatGPT, Claude) to ensure development follows Kevin and Scott's locked standards.

---

## 1. Core Development Standards
* **Full Code Mandate:** Never provide snippets. Always provide the full, exhaustive code block (HTML, CSS, JS) to prevent broken logic [cite: 2026-01-26].
* **Zero-Inference Rule:** Treat user data as immutable fact. Do not guess business details [cite: 2026-01-26].
* **Universal Compatibility:** Code must work on Chrome, Edge, Safari, Brave, Opera GX, and DuckDuckGo [cite: 2026-01-26].
* **Universal Screens:** Use % for sizes (90% default width) and ensure content stacks vertically on mobile/smaller screens [cite: 2026-01-26].
* **Cache Busting:** All index.html and profile.html files must include "No-Cache" meta tags and versioned assets (e.g., style.css?v=1.57) [cite: 2026-01-26].

---

## 2. A–N Column Structure Mapping
All data processing must follow this specific index mapping from the source Google Sheet [cite: 2026-01-28]:

| Index | Column | Data Point | Purpose |
| :--- | :--- | :--- | :--- |
| 0 | **A** | Image ID | Logo filename (image_id.jpeg) [cite: 2026-01-28] |
| 1 | **B** | Name | Primary Business Title [cite: 2026-01-28] |
| 2 | **C** | Town | (Fallback) [cite: 2026-01-28] |
| 3 | **D** | Tier | Controls "Premium Shine" and Phone visibility [cite: 2026-01-28] |
| 4 | **E** | Category | Centered industry label [cite: 2026-01-28] |
| 5 | **F** | Phone | 10-digit number (no +1) [cite: 2026-01-26, 2026-01-28] |
| 6 | **G** | Address | Includes Town for the Middle Bar color check [cite: 2026-01-28] |
| 12 | **M** | Established | Displayed in Premium Modals [cite: 2026-01-28] |
| 13 | **N** | Coupon Link | Triggers top-right coupon badge [cite: 2026-01-28] |

---

## 3. Visual & Branding Standards (Yellow Layout)
* **Color Lock Mapping:** * Flora: Deep Blue (#0c0b82) / Orange (#fe4f00) [cite: 2026-01-28]
    * Louisville/North Clay: Black (#010101) / Red (#eb1c24) [cite: 2026-01-28]
    * Clay City: Blue (#0c30f0) / Grey (#8a8a88) [cite: 2026-01-28]
    * Xenia: Black (#000000) / Yellow (#fdb813) [cite: 2026-01-28]
* **Card Hierarchy:** 1. Tier Badge (Top Left) / Coupon Icon (Top Right) [cite: 2026-01-26, 2026-01-28]
    2. Business Logo (Top Center) [cite: 2026-01-28]
    3. Town Bar (Middle Center) - Locked horizontally [cite: 2026-01-28]
    4. Business Name [cite: 2026-01-28]
    5. Phone (Premium/Plus Only) & Category - Centered Bottom [cite: 2026-01-26, 2026-01-28]

---

## 4. Affiliate Standards
* **Amazon Tag:** Always use `werewolf3788-20` for links [cite: 2026-01-27].
* **Link Format:** `https://www.amazon.com/dp/ASIN_HERE?tag=werewolf3788-20` [cite: 2026-01-27].
