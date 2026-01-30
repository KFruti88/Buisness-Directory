# 🛠️ Master Directory Instructions (Index 0-17 Mapping)
**Version:** 2.4 (Color Swaps & Full Layout Logic)
**Status:** Use these rules for all HTML/CSS/JS generation.

{
  "sheetLayout": {
    "MasterData": {
      "Column_A": { "index": 0, "label": "Empty Space", "content": null },
      "Column_B": { "index": 1, "label": "Business Name", "key": "name" },
      "Column_C": { "index": 2, "label": "Address", "key": "address" },
      "Column_D": { "index": 3, "label": "Town", "key": "town" },
      "Column_E": { "index": 4, "label": "State Zip", "key": "zip" },
      "Column_F": { "index": 5, "label": "Phone", "key": "phone", "format": "10-digits" },
      "Column_G": { "index": 6, "label": "Website", "key": "website" },
      "Column_H": { "index": 7, "label": "Facebook", "key": "facebook" },
      "Column_I": { "index": 8, "label": "Category", "key": "category" },
      "Column_J": { "index": 9, "label": "Bio", "key": "bio" },
      "Column_K": { "index": 10, "label": "Hours", "key": "hours" },
      "Column_L": { "index": 11, "label": "Established", "key": "established" }
    },
    "BusinessDirectory": {
      "Column_A": { "index": 0, "label": "Image ID", "key": "id" },
      "Column_B": { "index": 1, "label": "Name", "key": "name" },
      "Column_C": { "index": 2, "label": "Address", "key": "address" },
      "Column_D": { "index": 3, "label": "Town", "key": "town" },
      "Column_E": { "index": 4, "label": "State Zip", "key": "zip" },
      "Column_F": { "index": 5, "label": "Phone", "key": "phone" },
      "Column_G": { "index": 6, "label": "Website", "key": "website" },
      "Column_H": { "index": 7, "label": "Facebook", "key": "facebook" },
      "Column_I": { "index": 8, "label": "Category", "key": "category" },
      "Column_J": { "index": 9, "label": "Bio", "key": "bio" },
      "Column_K": { "index": 10, "label": "Hours", "key": "hours" },
      "Column_L": { "index": 11, "label": "Tier", "key": "tier" },
      "Column_M": { "index": 12, "label": "Established", "key": "established" },
      "Column_N": { "index": 13, "label": "Coupon Text", "key": "couponText" },
      "Column_O": { "index": 14, "label": "Coupon Link/Image", "key": "couponMedia" },
      "Column_P": { "index": 15, "label": "GitHub Preview", "key": "preview" }
    }
  }
}

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
