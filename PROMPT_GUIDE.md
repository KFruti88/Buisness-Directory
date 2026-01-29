# 🛠️ Master Directory Logic & Column Mapping (0-17 Structure)

When generating or updating code for the Business Directory, you MUST adhere to the following mapping and logic. This ensures compatibility with Kevin's Google Sheet and "Color Lock" standards.

### 📋 Column Index Mapping (Zero-Based)
| Index | Data Field | Implementation Detail |
| :--- | :--- | :--- |
| **0** | Image ID | Primary source for business logo. |
| **1** | Name | Business name title. |
| **3** | Tier | Used for card styling/priority (Index 2 is SKIPPED). |
| **4** | Category | Used for filtering and tags. |
| **5** | Phone | Format: 10 digits only (No +1). |
| **6** | Addressed | Street Address. |
| **7** | **Town** | **CRITICAL: Used for Color Lock Branding.** |
| **8** | State Zip | Combined City/State/Zip. |
| **9** | Hours | Displayed in business details. |
| **10** | Website | "View Website" link button. |
| **11** | Facebook | "Facebook" link button. |
| **12** | Bio | Main business description text. |
| **13** | Established | Display as "Since [Year]". |
| **14** | Coupon | Special offer/deal text. |
| **15** | Coupon Link | URL or Image link for the coupon. |
| **16** | GitHub Preview | Secondary/Fallback image source. |
| **17** | #VALUE! | DO NOT USE (Reserved/Error field). |

### 🎨 Branding & Style "Color Lock"
- **Trigger Column:** Index 7 (Town).
- **Flora:** BG: `#0c0b82`, Text: `#fe4f00`.
- **Louisville:** BG: `#010101`, Text: `#eb1c24`.
- **Default (Other):** Use standard dark theme percentages.

### ⚙️ Coding Requirements
1. **Address Fusion:** Combine Indices [6], [7], and [8] into a single formatted string for Google Maps links.
2. **Zero Snippets:** Always provide the full, exhaustive code block (HTML/CSS/JS).
3. **Accuracy:** Use "N/A" for any empty cells. Check that the business is active (e.g., Flora Pizza Hut is closed).
4. **Dimensions:** Use % for widths. Container default is 90%.
