/**
 * PROJECT: Clay County Directory Engine v6.82
 * LOCK: A-P Spreadsheet Mapping [cite: 2026-01-29]
 */
const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    
    // HARD-LOCKED INDICES TO STOP SCRAMBLING [cite: 2026-01-29]
    MAP: { IMG: 0, NAME: 1, TOWN: 3, PHONE: 5, CAT: 8, TIER: 11 },
    
    TOWN_COLORS: {
        "Flora": { bg: "#0c0b82", text: "#fe4f00" },
        "Louisville": { bg: "#010101", text: "#eb1c24" },
        "North Clay": { bg: "#010101", text: "#eb1c24" },
        "Clay City": { bg: "#8a8a88", text: "#0c30f0" },
        "Xenia": { bg: "#000000", text: "#fdb813" },
        "Sailor Springs": { bg: "#000000", text: "#a020f0" },
        "Clay County": { bg: "#333333", text: "#ffffff" }
    },

    // [cite: 2026-01-28] Emoji-Mapping Engine
    CAT_EMOJIS: {
        "Restaurant": "🍴", "Food": "🍔", "Bar": "🍺", "Grill": "🥩",
        "Beauty": "💈", "Salon": "💇", "Retail": "🛍️", "Shop": "🏷️",
        "Automotive": "🚗", "Repair": "🔧", "Construction": "🏗️", 
        "Manufacturing": "🏭", "Health": "🏥", "Church": "⛪"
    }
};

function getCategoryEmoji(catText) {
    if (!catText) return "📁";
    const found = Object.keys(CONFIG.CAT_EMOJIS).find(key => catText.includes(key));
    return CONFIG.CAT_EMOJIS[found] || "📁";
}

function fetchData() {
    const v = new Date().getTime(); // Cache busting [cite: 2026-01-26]
    Papa.parse(`${CONFIG.CSV_URL}&v=${v}`, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            // Mapping directly to A-P Column Layout
            const data = results.data.slice(1).map(row => ({
                ImageID: row[CONFIG.MAP.IMG] || "",
                Name: row[CONFIG.MAP.NAME] || "",
                Town: row[CONFIG.MAP.TOWN] || "Clay County",
                Phone: row[CONFIG.MAP.PHONE] || "",
                Category: row[CONFIG.MAP.CAT] || "",
                Tier: row[CONFIG.MAP.TIER] || "Basic"
            })).filter(b => b.Name && b.Name.trim() !== "" && b.Name !== "Business Name");
            
            renderCards(data);
        }
    });
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // Premium/Plus Sorting Logic [cite: 2026-01-28]
    const tierWeight = { "premium": 1, "gold": 1, "plus": 2, "basic": 3 };
    const sortedData = data.sort((a, b) => 
        (tierWeight[a.Tier.toLowerCase()] || 4) - (tierWeight[b.Tier.toLowerCase()] || 4) || a.Name.localeCompare(b.Name)
    );

    grid.innerHTML = sortedData.map(biz => {
        const style = CONFIG.TOWN_COLORS[biz.Town.trim()] || CONFIG.TOWN_COLORS["Clay County"];
        const tierL = biz.Tier.toLowerCase();
        const emoji = getCategoryEmoji(biz.Category);
        
        // Format phone to (XXX) XXX-XXXX [cite: 2026-01-26]
        const cleanPhone = biz.Phone.replace(/\D/g, '').slice(-10);
        const displayPhone = cleanPhone.length === 10 ? 
            `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}` : "";

        return `
        <div class="card ${tierL}">
            <div class="tier-badge">${biz.Tier}</div>
            <div class="logo-box">
                <img src="${CONFIG.IMAGE_REPO}${biz.ImageID}.jpeg" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <div class="town-bar" style="background-color: ${style.bg}; color: ${style.text};">
                ${biz.Town}
            </div>
            <div class="biz-name">${biz.Name}</div>
            <div class="card-content">
                ${(tierL === 'premium' || tierL === 'plus') && displayPhone ? `<div class="biz-phone">📞 ${displayPhone}</div>` : ''}
                <div class="biz-cat">${emoji} ${biz.Category}</div>
            </div>
        </div>`;
    }).join('');
    updateHeader();
}

function updateHeader() {
    const now = new Date();
    const headerInfo = document.getElementById('header-info');
    if (headerInfo) {
        headerInfo.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${now.toLocaleDateString()}`;
    }
}

document.addEventListener("DOMContentLoaded", fetchData);
