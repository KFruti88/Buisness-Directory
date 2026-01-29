# 🛠️ Master Directory Instructions (Index 0-17 Mapping)
**Version:** 2.0 (Finalized Design)
**Status:** Use these rules for all HTML/CSS/JS generation.

## 📍 1. Column Index Mapping (Zero-Based)
| Index | Data Field | Implementation Logic |
| :--- | :--- | :--- |
| **0** | Image ID | Primary Logo / Business Image. |
| **1** | Name | Business Title. |
| **3** | Tier | Priority Level (Index 2 is SKIPPED). |
| **4** | Category | Business category/tag. |
| **5** | Phone | 10-digit clickable format (e.g., 6185551234). |
| **6** | Addressed | **Street Address only.** |
| **7** | **Town** | **THE COLOR LOCK TRIGGER** (e.g., Flora). |
| **8** | State Zip | **State and Zip only.** |
| **9** | Hours | Operating schedule. |
| **10** | Website | Main URL button. |
| **11** | Facebook | Social media button. |
| **12** | Bio | Full business description text. |
| **13** | Established | Display as "Since [Year]". |
| **14** | Coupon Text | Special deal description. |
| **15** | Coupon Link | URL or Image link for the deal. |
| **16** | GitHub Preview | Fallback/Secondary image source. |
| **17** | #VALUE! | Error field—DO NOT USE. |

## 🎨 2. Town Color Lock Branding
- **Flora:** BG: `#0c0b82` | Text: `#fe4f00`
- **Louisville:** BG: `#010101` | Text: `#eb1c24`
- **Clay City:** BG: `#0c30f0` | Text: `#8a8a88`
- **Default:** BG: `#333333` | Text: `#ffffff`

## 🎴 3. Main Grid Card Layout
- **Overlays:** Tier (Index 3) at Top-Left, Coupon Icon (Index 15) at Top-Right. 
- **Margins:** Set overlays exactly **5%** from edges.
- **Tier Rules:**
    - **Basic:** ONLY show Photo, Name, Tier, Category, Town, Coupon Icon. No click action.
    - **Plus:** Same as Basic PLUS **Phone Number** (Index 5) positioned between Name and Category.
    - **Premium/Gold:** Same as Plus PLUS a **"View Details"** button to trigger Pop-out.

## 📱 4. Pop-Out Card Design (Premium Only)
- **Header:** Logo (Index 0) Centered at top (Max-width 150px). Business Name (Index 1) centered directly underneath.
- **Mid-Section (Flex Row):**
    - **Left Side:** Contact Info. Phone (5), Hours (9), and Stacked Address ([6] on top, [7, 8] on bottom).
    - **Right Side:** Square 180px x 180px Interactive Google Map iframe.
- **Full Width Section:** Bio (Index 12) sits below the Address/Map row, spanning 100% width.
- **Conditional Coupon:** If Index 14 is empty or "N/A," the coupon box must **disappear** entirely.

## ⚙️ Coding Standards
- **Widths:** Use % for all box/screen sizes. Container default is **90%**.
- **Compatibility:** Code must work on GitHub, WordPress (Divi 4/5), and all Mobile devices.
- **Accuracy:** Put "N/A" if info is missing. Do not include closed businesses.
