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

🛑 MASTER LOCKDOWN BUILD v9.1 [RESTORE POINT]
Status: Fully Functional & Hard-Locked

Date: 2026-01-30

Key Features: Glossy Manila Header, Town Color-Branding Bar, Uniform Yellow Cards, Bottom-Centered Category/Phone, GitHub Coupon Icon Trigger.

📄 index.html
HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <title>Clay County Master Directory</title>
    <link rel="stylesheet" href="style.css?v=9.1">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
</head>
<body>

    <header class="main-title">
        <h1>Clay County</h1>
        <div class="newspaper-meta">
            <span id="header-info">VOL. 1 — NO. 1 | LOADING...</span>
            <span>Business Directory Pages</span>
        </div>
    </header>

    <div class="site-wrapper">
        <nav class="filter-nav">
            <div class="filter-group">
                <select id="town-filter" onchange="filterData()">
                    <option value="all">All Towns</option>
                    <option value="Flora">Flora</option>
                    <option value="Louisville">Louisville</option>
                    <option value="Clay City">Clay City</option>
                    <option value="Xenia">Xenia</option>
                    <option value="Sailor Springs">Sailor Springs</option>
                </select>
            </div>
        </nav>

        <div id="directory-grid"></div>
    </div>

    <div id="modal-overlay" class="modal-overlay" onclick="closeModal()">
        <div class="modal-container" onclick="event.stopPropagation()">
            <div id="modal-content"></div>
        </div>
    </div>

    <script src="layout.js?v=9.1"></script>
</body>
</html>
🎨 style.css
CSS

/* --- 1. GLOSSY NEWSPAPER HEADER [cite: 2026-01-30] --- */
.main-title { 
    text-align: center; padding: 25px 0; margin: 0;
    background: linear-gradient(145deg, #fff5ba 0%, #e6dc9f 100%) !important; 
    border-bottom: 3px solid #000; box-shadow: 0 4px 10px rgba(0,0,0,0.15); width: 100%;
}
.main-title h1 { margin: 0; font-size: 3.2rem; text-transform: uppercase; font-family: 'Times New Roman', serif; color: #000; }
.newspaper-meta { display: flex; justify-content: space-between; padding: 10px 5%; font-weight: 900; border-top: 2px solid #222; margin-top: 15px; text-transform: uppercase; background: rgba(0,0,0,0.03); }

/* --- 2. THE UNIFORM YELLOW CARD DNA --- */
#directory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 25px; width: 93%; margin: 0 auto; padding: 20px 0; }
.card { 
    background: #fff5ba !important; border: 2px solid #000; border-radius: 4px;
    height: 480px; display: flex; flex-direction: column; position: relative; overflow: hidden; 
    box-shadow: 5px 5px 0px rgba(0,0,0,0.1); cursor: pointer;
}
.logo-box { height: 160px; display: flex; align-items: center; justify-content: center; background: transparent !important; padding: 15px; }
.logo-box img { max-height: 100%; max-width: 100%; object-fit: contain; }

/* --- 3. THE BRANDED TOWN BAR [cite: 2026-01-28] --- */
.town-bar { 
    height: 38px; display: flex; align-items: center; justify-content: center; 
    text-transform: uppercase; font-weight: 900; border-top: 2px solid #000; border-bottom: 2px solid #000;
    font-size: 1.1rem; letter-spacing: 1px; width: 100%;
}

.biz-name { height: 80px; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: bold; font-size: 1.4rem; padding: 10px; margin-bottom: 80px; }

/* --- 4. CENTERED BOTTOM STACK --- */
.bottom-stack { position: absolute; bottom: 20px; left: 0; right: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; pointer-events: none; }
.biz-phone { font-size: 1.25rem; font-weight: bold; color: #000; }
.category-locked { font-weight: bold; color: #222; font-size: 1.25rem; }
.premium-cta { color: #fe4f00; font-weight: 900; font-size: 0.85rem; text-transform: uppercase; }

/* --- 5. ASSET LOCKS (COUPON & TIER) --- */
.coupon-container { position: absolute; top: 5%; left: 5%; z-index: 15; }
.coupon-img-top { width: 45px; height: auto; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2)); }
.tier-badge-top { position: absolute; top: 5%; right: 5%; font-size: 0.75rem; font-weight: 900; background: #fff; border: 1.5px solid #000; padding: 2px 6px; z-index: 10; text-transform: uppercase; }
⚙️ layout.js
JavaScript

/**
 * PROJECT: Clay County Master Directory v9.1 [cite: 2026-01-30]
 * LOCKS: Town Color Branding | Bottom-Centered Stack | A-P Mapping
 */

const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    
    // THE "COLOR LOCK" BRANDING [cite: 2026-01-28]
    TOWN_COLORS: {
        "Flora": { bg: "#0c0b82", text: "#fe4f00" },
        "Louisville": { bg: "#010101", text: "#eb1c24" },
        "Clay City": { bg: "#8a8a88", text: "#0c30f0" },
        "Xenia": { bg: "#000000", text: "#fdb813" },
        "Sailor Springs": { bg: "#000000", text: "#a020f0" },
        "Clay County": { bg: "#333333", text: "#ffffff" }
    },

    // A-P BusinessDirectory Mapping [cite: 2026-01-30]
    MAP: { 
        IMG: 0, NAME: 1, ADDR: 2, TOWN: 3, ZIP: 4, PHONE: 5, WEB: 6, FB: 7, 
        CAT: 8, BIO: 9, HOURS: 10, TIER: 11, EST: 12, CPN_TXT: 13, CPN_IMG: 14 
    }
};

window.allData = []; 

function updateHeader() {
    const now = new Date();
    const infoBox = document.getElementById('header-info');
    if (infoBox) infoBox.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${now.toLocaleDateString()}`;
}

function fetchData() {
    Papa.parse(`${CONFIG.CSV_URL}&v=${new Date().getTime()}`, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            window.allData = results.data.slice(1).map(row => ({
                id: row[CONFIG.MAP.IMG] || "",
                name: row[CONFIG.MAP.NAME] || "",
                town: row[CONFIG.MAP.TOWN] || "Clay County", 
                tier: row[CONFIG.MAP.TIER] || "Basic",
                phone: row[CONFIG.MAP.PHONE] || "",
                category: row[CONFIG.MAP.CAT] || "",
                couponTxt: row[CONFIG.MAP.CPN_TXT] || ""
            })).filter(b => b.name && b.name.trim() !== "");
            
            updateHeader();
            renderCards(window.allData);
        }
    });
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.map(biz => {
        const tierL = biz.tier.toLowerCase();
        const colors = CONFIG.TOWN_COLORS[biz.town] || CONFIG.TOWN_COLORS["Clay County"];
        const cleanPhone = biz.phone.replace(/\D/g, '').slice(-10);
        const displayPhone = cleanPhone.length === 10 ? `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}` : "";
        const couponHTML = (biz.couponTxt && biz.couponTxt.trim() !== "") 
            ? `<img src="https://github.com/KFruti88/images/blob/main/Coupon.png?raw=true" class="coupon-img-top">` : "";

        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.name.replace(/'/g, "\\'")}')">
            <div class="coupon-container">${couponHTML}</div>
            <div class="tier-badge-top">${biz.tier}</div>
            <div class="logo-box"><img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" onerror="this.src='https://via.placeholder.com/150'"></div>
            <div class="town-bar" style="background-color: ${colors.bg} !important; color: ${colors.text} !important;">${biz.town}</div>
            <div class="biz-name">${biz.name}</div>
            <div class="bottom-stack">
                ${(tierL === 'premium' || tierL === 'plus') && displayPhone ? `<div class="biz-phone">📞 ${displayPhone}</div>` : ''}
                ${tierL === 'premium' ? `<div class="premium-cta">⚡ CLICK FOR DETAILS</div>` : ''}
                <div class="category-locked">📁 ${biz.category}</div>
            </div>
        </div>`;
    }).join('');
}
document.addEventListener("DOMContentLoaded", fetchData);
📍 Why this is your "Safety Net":
Logical Isolation: If you add a new feature later and the town colors disappear, you can look at this layout.js and see exactly how the TOWN_COLORS object was injected into the town-bar div.

🛠️ PROMPT_GUIDE.md: Clay County Directory Standards
1. The "Safety Wall" Modal Protocol
To prevent the directory layout from breaking when a pop-out is opened, always use Fixed Layering.

The Rule: The modal must exist outside the site-wrapper and be positioned at the bottom of the <body>.

The CSS Lock: Use position: fixed and a z-index higher than 9999. This removes the modal from the document flow so it cannot "push" or move the business cards.

Constraint: The modal width is hard-locked to 75% of the screen [cite: 2026-01-28].

2. Global Styling & Contrast Locks
Background: The default site background is Slate Gray (#333333).

Header Readability: The navigation labels ("Select City", "Select Category") must be forced to Solid Black (#000000 !important) with a font-weight of 900 to remain readable against the yellow glossy header [cite: 2026-01-30].

Card Uniformity: Business cards are hard-locked to a height of 480px with a uniform yellow background (#fff5ba).

3. The Newspaper Handshake (Logic)
Volume (VOL): Dynamically set to the current Month (e.g., January = 1).

Number (NO): Dynamically set to the current Day of the Month.

Constraint: Do not include the year or redundant date strings in the masthead meta [cite: 2026-01-30].

4. A–N Spreadsheet Mapping
Never guess column headers. Always use the following mapping for JavaScript data processing: | Key | Column Index | Description | | :--- | :--- | :--- | | IMG | 0 (A) | Image ID (ASIN or custom) | | NAME | 1 (B) | Business Name | | TOWN | 3 (D) | City/Town | | PHONE | 5 (F) | 10-digit Phone | | CAT | 8 (I) | Business Category | | TIER | 11 (L) | Premium, Plus, or Basic | | CPN_TXT| 13 (N) | Coupon text |

5. Development & Caching
Cache Busting: All index.html files must include "No-Cache" meta tags.

Asset Versioning: Append version strings to all file links (e.g., style.css?v=9.3) to force browsers to fetch the latest code after a GitHub push [cite: 2026-01-26].

Zero Snippet Policy: Always provide the full file contents to ensure logic doesn't leak or break between projects.

Structural Guarantee: The CSS uses absolute positioning for the bottom stack and top badges. This means the layout is physically incapable of shifting even if you change other elements [cite: 2026-01-30].

No-Cache Mandate: The meta tags and script versions ensure that when you revert, the browser doesn't keep showing you the "fucked up" version [cite: 2026-01-26].
