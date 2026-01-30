/**
 * PROJECT: Clay County Directory Engine v6.99
 * LOCK: A-P Spreadsheet Mapping & Global Scope [cite: 2026-01-29]
 * FEATURES: Smart Dropdowns, Emoji Mapping, Premium CTA, Modal Handshake
 */
const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    
    // HARD-LOCKED INDICES TO STOP SCRAMBLING [cite: 2026-01-29]
    MAP: { IMG: 0, NAME: 1, TOWN: 3, ADDR: 6, PHONE: 5, CAT: 8, TIER: 11, BIO: 12, EST: 13, COUPON: 14 },
    
    TOWN_COLORS: {
        "Flora": { bg: "#0c0b82", text: "#fe4f00" },
        "Louisville": { bg: "#010101", text: "#eb1c24" },
        "North Clay": { bg: "#010101", text: "#eb1c24" },
        "Clay City": { bg: "#8a8a88", text: "#0c30f0" },
        "Xenia": { bg: "#000000", text: "#fdb813" },
        "Sailor Springs": { bg: "#000000", text: "#a020f0" },
        "Clay County": { bg: "#333333", text: "#ffffff" }
    },

    CAT_EMOJIS: {
        "Restaurant": "🍴", "Food": "🍔", "Bar": "🍺", "Grill": "🥩",
        "Beauty": "💈", "Salon": "💇", "Retail": "🛍️", "Shop": "🏷️",
        "Automotive": "🚗", "Repair": "🔧", "Construction": "🏗️", 
        "Manufacturing": "🏭", "Health": "🏥", "Church": "⛪"
    }
};

// [cite: 2026-01-26] Global Data Store for Modal Handshake
window.allData = []; 

function getCategoryEmoji(catText) {
    if (!catText) return "📁";
    const found = Object.keys(CONFIG.CAT_EMOJIS).find(key => catText.includes(key));
    return CONFIG.CAT_EMOJIS[found] || "📁";
}

function fetchData() {
    const v = new Date().getTime(); 
    Papa.parse(`${CONFIG.CSV_URL}&v=${v}`, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            // [cite: 2026-01-29] Locked A-P JSON Mapping
            window.allData = results.data.slice(1).map(row => ({
                ImageID: row[CONFIG.MAP.IMG] || "",
                name: row[CONFIG.MAP.NAME] || "",         // Match lowercase for modal.js
                town: row[CONFIG.MAP.TOWN] || "Clay County",
                address: row[CONFIG.MAP.ADDR] || "",
                phone: row[CONFIG.MAP.PHONE] || "",
                category: row[CONFIG.MAP.CAT] || "",
                tier: row[CONFIG.MAP.TIER] || "Basic",
                full_location: `${row[CONFIG.MAP.ADDR] || ""}, ${row[CONFIG.MAP.TOWN] || ""} IL`,
                bio: row[CONFIG.MAP.BIO] || "",
                established: row[CONFIG.MAP.EST] || "",
                coupon: row[CONFIG.MAP.COUPON] || ""
            })).filter(b => b.name && b.name.trim() !== "" && b.name !== "Business Name");
            
            populateFilters(window.allData);
            renderCards(window.allData);
        }
    });
}

function populateFilters(data) {
    const citySelect = document.getElementById('city-filter');
    const catSelect = document.getElementById('cat-filter');
    if (!citySelect || !catSelect) return;

    const cities = [...new Set(data.map(b => b.town))].sort();
    const cats = [...new Set(data.map(b => b.category))].sort();

    citySelect.innerHTML = '<option value="all">All Cities</option>';
    catSelect.innerHTML = '<option value="all">All Categories</option>';

    cities.forEach(city => { citySelect.innerHTML += `<option value="${city}">${city}</option>`; });
    cats.forEach(cat => { catSelect.innerHTML += `<option value="${cat}">${cat}</option>`; });
}

function applyFilters() {
    const cityVal = document.getElementById('city-filter').value;
    const catVal = document.getElementById('cat-filter').value;

    const filtered = window.allData.filter(biz => {
        const cityMatch = (cityVal === 'all' || biz.town === cityVal);
        const catMatch = (catVal === 'all' || biz.category === catVal);
        return cityMatch && catMatch;
    });

    renderCards(filtered);
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    const tierWeight = { "premium": 1, "gold": 1, "plus": 2, "basic": 3 };
    const sortedData = data.sort((a, b) => 
        (tierWeight[a.tier.toLowerCase()] || 4) - (tierWeight[b.tier.toLowerCase()] || 4) || a.name.localeCompare(b.name)
    );

    grid.innerHTML = sortedData.map(biz => {
        const style = CONFIG.TOWN_COLORS[biz.town.trim()] || CONFIG.TOWN_COLORS["Clay County"];
        const tierL = biz.tier.toLowerCase();
        const emoji = getCategoryEmoji(biz.category);
        
        const cleanPhone = biz.phone.replace(/\D/g, '').slice(-10);
        const displayPhone = cleanPhone.length === 10 ? `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}` : "";

        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.name.replace(/'/g, "\\'")}')">
            <div class="tier-badge">${biz.tier}</div>
            <div class="logo-box">
                <img src="${CONFIG.IMAGE_REPO}${biz.ImageID}.jpeg" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <div class="town-bar" style="background-color: ${style.bg}; color: ${style.text};">
                ${biz.town}
            </div>
            <div class="biz-name">${biz.name}</div>
            <div class="card-content">
                ${(tierL === 'premium' || tierL === 'plus') && displayPhone ? `<div class="biz-phone">📞 ${displayPhone}</div>` : ''}
                <div class="biz-cat">${emoji} ${biz.category}</div>
                ${tierL === 'premium' ? `<div style="margin-top:10px; font-weight:900; color:#fe4f00; font-size:0.75rem; text-transform:uppercase;">⚡ CLICK FOR DETAILS</div>` : ''}
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
