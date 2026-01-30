/**
 * PROJECT: Clay County Directory Engine v7.03
 * STATUS: Transparent Filters & Stable Layout Locked [cite: 2026-01-30]
 * LOCK: A-P Spreadsheet Mapping (Indices 0-13)
 */
const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    
    // HARD-LOCKED INDICES [cite: 2026-01-28]
    MAP: { IMG: 0, NAME: 1, TOWN: 2, TIER: 3, CAT: 4, PHONE: 5, ADDR: 6, HOURS: 7, WEB: 8, FB: 9, BIO: 10, EST: 12, COUPON: 13 },
    
    TOWN_COLORS: {
        "Flora": { bg: "#0c0b82", text: "#fe4f00" },
        "Louisville": { bg: "#010101", text: "#eb1c24" },
        "North Clay": { bg: "#010101", text: "#eb1c24" },
        "Clay City": { bg: "#0c30f0", text: "#8a8a88" },
        "Xenia": { bg: "#000000", text: "#fdb813" },
        "Sailor Springs": { bg: "#000000", text: "#a020f0" },
        "Clay County": { bg: "#333333", text: "#ffffff" }
    }
};

window.allData = []; 

function fetchData() {
    const v = new Date().getTime(); 
    Papa.parse(`${CONFIG.CSV_URL}&v=${v}`, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            // [cite: 2026-01-29] Build global store for Modal Brain
            window.allData = results.data.slice(1).map(row => ({
                ImageID: row[CONFIG.MAP.IMG] || "",
                name: row[CONFIG.MAP.NAME] || "",
                town: row[CONFIG.MAP.TOWN] || "Clay County",
                tier: row[CONFIG.MAP.TIER] || "Basic",
                category: row[CONFIG.MAP.CAT] || "",
                phone: row[CONFIG.MAP.PHONE] || "",
                address: row[CONFIG.MAP.ADDR] || "",
                hours: row[CONFIG.MAP.HOURS] || "",
                website: row[CONFIG.MAP.WEB] || "N/A",
                facebook: row[CONFIG.MAP.FB] || "N/A",
                bio: row[CONFIG.MAP.BIO] || "",
                established: row[CONFIG.MAP.EST] || "",
                coupon: row[CONFIG.MAP.COUPON] || "",
                full_location: `${row[CONFIG.MAP.ADDR] || ""}, ${row[CONFIG.MAP.TOWN] || ""} IL`
            })).filter(b => b.name && b.name.trim() !== "" && b.name !== "Name");
            
            populateFilters(window.allData);
            renderCards(window.allData);
        }
    });
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // Standard Tier Sorting [cite: 2026-01-28]
    const tierWeight = { "premium": 1, "gold": 2, "plus": 3, "basic": 4 };
    const sorted = data.sort((a, b) => 
        (tierWeight[a.tier.toLowerCase()] || 5) - (tierWeight[b.tier.toLowerCase()] || 5) || a.name.localeCompare(b.name)
    );

    grid.innerHTML = sorted.map(biz => {
        const style = CONFIG.TOWN_COLORS[biz.town] || CONFIG.TOWN_COLORS["Clay County"];
        const tierL = biz.tier.toLowerCase();
        
        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.name.replace(/'/g, "\\'")}')">
            <div class="tier-badge">${biz.tier}</div>
            <div class="logo-box">
                <img src="${CONFIG.IMAGE_REPO}${biz.ImageID}.jpeg" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <div class="town-bar" style="background-color: ${style.bg}; color: ${style.text};">
                ${biz.town}
            </div>
            <div class="biz-name" style="height:80px; font-weight:bold; text-align:center; display:flex; align-items:center; justify-content:center; padding:10px;">${biz.name}</div>
            <div class="card-content" style="text-align:center; padding-bottom:15px;">
                <div class="biz-cat">📁 ${biz.category}</div>
                ${tierL === 'premium' ? `<div style="color:#fe4f00; font-weight:900; font-size:0.75rem; margin-top:10px;">⚡ CLICK FOR DETAILS</div>` : ''}
            </div>
        </div>`;
    }).join('');
    updateHeader();
}

function populateFilters(data) {
    const citySelect = document.getElementById('city-filter');
    const catSelect = document.getElementById('cat-filter');
    if (!citySelect || !catSelect) return;

    const cities = [...new Set(data.map(b => b.town))].sort();
    const cats = [...new Set(data.map(b => b.category))].sort();

    citySelect.innerHTML = '<option value="all">All Cities</option>';
    catSelect.innerHTML = '<option value="all">All Categories</option>';

    cities.forEach(c => citySelect.innerHTML += `<option value="${c}">${c}</option>`);
    cats.forEach(c => catSelect.innerHTML += `<option value="${c}">${c}</option>`);
}

function applyFilters() {
    const city = document.getElementById('city-filter').value;
    const cat = document.getElementById('cat-filter').value;
    const filtered = window.allData.filter(b => (city === 'all' || b.town === city) && (cat === 'all' || b.category === cat));
    renderCards(filtered);
}

function updateHeader() {
    const now = new Date();
    const info = document.getElementById('header-info');
    if (info) info.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${now.toLocaleDateString()}`;
}

document.addEventListener("DOMContentLoaded", fetchData);
