# 🛠️ Master Directory Instructions (Index 0-17 Mapping)
**Version:** 2.4 (Color Swaps & Full Layout Logic)
**Status:** Use these rules for all HTML/CSS/JS generation.

## 📍 1. Column Index Mapping (Zero-Based)
| Index | Data Field | Implementation Logic |
| :--- | :--- | :--- |
| **0** | Image ID | Primary Logo / Business Image. |
| **1** | Name | Business Title. |
| **3** | Tier | Priority Level (Index 2 is SKIPPED). |
| **4** | Category | Business category/tag. |
| **5** | Phone | 10-digit clickable format (No +1). |
| **6** | Addressed | **Street Address only.** |
| **7** | **Town** | **COLOR LOCK TRIGGER** (Flora, Louisville, Clay City, etc.). |
| **8** | State Zip | **State and Zip only.** |
| **9** | Hours | Operating schedule. |
| **10** | Website | Main URL button. |
| **11** | Facebook | Social media button. |
| **12** | Bio | Full business description text. |
| **13** | Established | Display as "Since [Year]". |
| **14** | Coupon Text | Special deal description. |
| **15** | Coupon Link | URL or Image link for the deal. |
| **16** | GitHub Preview | Fallback/Secondary image source. |

## 🎨 2. Town Color Lock Branding
- **Flora:** BG: `#0c0b82` | Text: `#fe4f00` (Deep Blue / Orange)
- **Louisville:** BG: `#010101` | Text: `#eb1c24` (Black / Red)
- **Clay City:** BG: `#8a8a88` | Text: `#0c30f0` (Gray / Bright Blue)
- **Xenia:** BG: `#000000` | Text: `#fdb813` (Black / Yellow)
- **Sailor Springs:** BG: `#000000` | Text: `#a020f0` (Black / Purple)
- **Clay County:** BG: `#333333` | Text: `#ffffff` (Charcoal / White)

## 🎴 3. Main Grid Card Layout & Tier Rules
- **Overlays:** Tier (3) at Top-Left, Coupon Icon (15) at Top-Right. Set margins at exactly **5%**.
- **Basic Tier:** Show Photo, Name, Tier, Category, Town. If Coupon exists, click for **Deal-Only Pop-out**.
- **Plus Tier:** Show Basic info + Phone (5) below Name. If Coupon exists, click for **Deal-Only Pop-out**.
- **Premium/Gold:** Show Plus layout + "View Details" button. Click for **Full Profile Pop-out**.

## 📱 4. Pop-Out Card Designs (Modals)
- **A. Deal-Only Pop-out (Basic/Plus):** Centered Logo (0), Name (1), and Coupon Section (14/15) inside dashed border. Hide all other info.
- **B. Full Profile Pop-out (Premium/Gold):** - **Header:** Centered Logo (0) [Max-width 150px] + Centered Name (1).
    - **Contact/Map Row:** Left: Phone (5), Hours (9), Stacked Address ([6] on top, [7, 8] on bottom). Right: 180px Square Map iframe.
    - **Story:** Full Width Bio (12) spans 100% width below the Map row.
    - **Coupon:** Disappearing section (Hide if 14 is empty/NA).

## ⚙️ 5. Universal Compatibility & Caching
- **Browser Support:** Use standard CSS Grid/Flexbox for Chrome, Safari, Firefox, Edge.
- **Dimensions:** Width: **90%**. Height: **Auto** to match directory row count.
- **Cache Busting:** Use Version Query Strings (e.g., `style.css?v=1.01`) on all assets.
- **Data Integrity:** "N/A" for missing data. No closed businesses.
