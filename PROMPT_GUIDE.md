# 🛠️ Master Directory Instructions (Index 0-17 Mapping)

This document serves as the "Source of Truth" for the Business Directory project. All AI agents must follow these indices and logic rules to ensure data accuracy.

### 📍 Column Index Mapping (Zero-Based)
Use these exact numbers when writing JavaScript for the data array:

| Index | Data Field | Implementation Logic |
| :--- | :--- | :--- |
| **0** | Image ID | Primary Logo source. |
| **1** | Name | Business Title. |
| **3** | Tier | Priority/Membership level (Index 2 is SKIPPED). |
| **4** | Category | Business type for filtering. |
| **5** | Phone | 10-digit format (e.g., 6181234567). |
| **6** | Addressed | **Street Address only.** |
| **7** | **Town** | **THE COLOR LOCK TRIGGER** (e.g., Flora). |
| **8** | State Zip | **State and Zip only.** |
| **9** | Hours | Operating schedule. |
| **10** | Website | Main URL button. |
| **11** | Facebook | Social media button. |
| **12** | Bio | Full business description. |
| **13** | Established | Display as "Since [Year]". |
| **14** | Coupon | Special deal text. |
| **15** | Coupon Link | Direct link or image for the deal. |
| **16** | GitHub Preview | Fallback/Secondary image source. |
| **17** | #VALUE! | Error field—DO NOT USE. |

### 🎨 Color Lock Branding (Index 7)
The UI colors must change automatically based on the value in **Index 7**:
- **Flora:** Background: `#0c0b82`, Text: `#fe4f00`.
- **Louisville:** Background: `#010101`, Text: `#eb1c24`.
- **Default:** Charcoal `#333333` with White text.

### ⚙️ UI Development Standards
1. **Address Fusion:** On the card, display the address by joining indices: `[6] [7], [8]`.
2. **Zero Snippets:** Always provide the full file code (HTML/CSS/JS).
3. **Accuracy:** Use "N/A" for empty cells. Do not include permanently closed businesses.
4. **Dimensions:** Use % for widths. Main container must be **90%**.
5. **Cross-Compatible:** Must work on GitHub Pages, WordPress (Divi 4/5), and Mobile.
