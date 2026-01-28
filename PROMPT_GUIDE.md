# 🛠️ Clay County Directory: AI Development Guide (v1.59)

**INSTRUCTIONS:** Copy and paste this guide into any AI session (Gemini, ChatGPT, Claude) to ensure development follows Kevin and Scott's locked standards.

---

## 1. Core Development Standards
* **Full Code Mandate:** Never provide snippets. Always provide the full, exhaustive code block (HTML, CSS, JS) to prevent broken logic [cite: 2026-01-26].
* **Universal Compatibility:** Code must work on Chrome, Edge, Safari, Brave, Opera GX, and DuckDuckGo [cite: 2026-01-26].
* **Universal Screens:** Use % for sizes (90% default width) and ensure content stacks vertically on mobile/smaller screens (max-width: 600px) [cite: 2026-01-26].
* **Cache Busting:** All index.html and profile.html files must include "No-Cache" meta tags and versioned assets (e.g., style.css?v=1.59) [cite: 2026-01-26].

---

## 2. Updated A–N Column Structure Mapping
All data processing must follow this specific index mapping from the source Google Sheet:

| Index | Column | Data Point | Purpose |
| :--- | :--- | :--- | :--- |
| 0 | **A** | Image ID | Logo filename (image_id.jpeg) [cite: 2026-01-28] |
| 1 | **B** | Name | Primary Business Title [cite: 2026-01-28] |
| 2 | **C** | Tier | Controls "Premium Shine" and Phone visibility [cite: 2026-01-28] |
| 3 | **D** | Category | Centered industry label [cite: 2026-01-28] |
| 4 | **E** | Phone | 10-digit number (no +1) [cite: 2026-01-26, 2026-01-28] |
| 5 | **F** | Address | Street location for the Pop-out Modal [cite: 2026-01-28] |
| 6 | **G** | Town | **CRITICAL:** Triggers the Colored Town Bar [cite: 2026-01-28] |
| 7 | **H** | State | Combined with Address for Google Maps accuracy [cite: 2026-01-28] |
| 12 | **M** | Established | Year shown in Premium Modals [cite: 2026-01-28] |
| 13 | **N** | Coupon Link | Triggers top-right corner badge [cite: 2026-01-28] |

---

## 3. Visual Stacking & Branding (Yellow Layout)
* **Color Lock Mapping:** * Flora: Deep Blue (#0c0b82) / Orange (#fe4f00) [cite: 2026-01-28]
    * Louisville/North Clay: Black (#010101) / Red (#eb1c24) [cite: 2026-01-28]
    * Clay City: Blue (#0c30f0) / Grey (#8a8a88) [cite: 2026-01-28]
    * Xenia: Black (#000000) / Yellow (#fdb813) [cite: 2026-01-28]
* **Card Hierarchy (Top to Bottom):** 1. **Top Corner Badges:** Tier Badge (Top Left) / Coupon Icon (Top Right)
    2. **Business Logo:** Must sit at the top, fitting inside the box
    3. **Town Bar (Middle):** Locked in the center horizontally with town-specific colors
    4. **Business Name:** Directly under the Town Bar
    5. **Bottom Details (Centered):** Phone (Premium/Plus Only) & Category at the bottom [cite: 2026-01-26, 2026-01-28]

---

## 4. Affiliate Standards
* **Amazon Tag:** Always use `werewolf3788-20` for links [cite: 2026-01-27].
* **Tracking Strategy:** Prioritize "View Details" or "Check Price" to activate global tracking window [cite: 2026-01-27].
