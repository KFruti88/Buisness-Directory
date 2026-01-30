/**
 * PROJECT: Clay County Master Directory v8.0
 * LOCK: City-Only Town Bar & Header Handshake [cite: 2026-01-30]
 * STATUS: Exhaustive Build (No Snippets)
 */

const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    
    // [cite: 2026-01-28] HARD-LOCKED A-N SPREADSHEET MAPPING
    // A=0(IMG), B=1(NAME), C=2(TOWN), D=3(TIER), E=4(CAT), F=5(PHONE), G=6(ADDR)
    MAP: { IMG: 0, NAME: 1, TOWN: 2, TIER: 3, CAT: 4, PHONE: 5, ADDR: 6, BIO: 10, EST: 12, COUPON: 13 }
};

// [cite: 2026-01-26] Global Data Bridge for Modal Handshake
window.allData = []; 

/**
 * Updates the Glossy Header Meta-Data [cite: 2026-01-28]
 */
function updateHeader() {
    const now = new Date();
    const infoBox = document.getElementById('header-info');
    if (infoBox) {
        // Keeps Volume matching the current month
        infoBox.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${now.toLocaleDateString()}`;
    }
}

/**
 * Fetches and Processes Spreadsheet Data
 */
function fetchData() {
    // Cache-busting timestamp
    const v = new Date().getTime(); 
    
    Papa.parse(`${CONFIG.CSV_URL}&v=${v}`, {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: function(results) {
            // [cite: 2026-01-29] Build global store for Modal Brain
            window.allData = results.data.slice(1).map(row => ({
                ImageID: row[CONFIG.MAP.IMG] || "",
                name: row[CONFIG.MAP.NAME] || "",
                // HARD LOCKED: CITY NAME ONLY
                town: row[CONFIG.MAP.TOWN] || "Clay County", 
                tier: row[CONFIG.MAP.TIER] || "Basic",
                category: row[CONFIG.MAP.CAT] || "",
                phone: row[CONFIG.MAP.PHONE] || "",
                address: row[CONFIG.MAP.ADDR] || "",
                bio: row[CONFIG.MAP.BIO] || "",
                established: row[CONFIG.MAP.EST] || "",
                coupon: row[CONFIG.MAP.COUPON] || ""
            })).filter(b => b.name && b.name.trim() !== "" && b.name !== "Name");
            
            updateHeader();
            renderCards(window.allData);
        }
    });
}

/**
 * Renders the Uniform Yellow Cards into the Grid
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // Standard Tier Sorting: Premium -> Gold -> Plus -> Basic
    const tierWeight = { "premium": 1, "gold": 2, "plus": 3, "basic": 4 };
    const sorted = data.sort((a, b) => 
        (tierWeight[a.tier.toLowerCase()] || 5) - (tierWeight[b.tier.toLowerCase()] || 5) || a.name.localeCompare(b.name)
    );

    grid.innerHTML = sorted.map(biz => {
        const tierL = biz.tier.toLowerCase();
        
        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.name.replace(/'/g, "\\'")}')">
            <div class="tier-badge">${biz.tier}</div>
            <div class="logo-box">
                <img src="${CONFIG.IMAGE_REPO}${biz.ImageID}.jpeg" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <div class="town-bar">${biz.town}</div>
            <div class="biz-name" style="height:80px; font-weight:bold; text-align:center; display:flex; align-items:center; justify-content:center; padding:10px;">${biz.name}</div>
            <div class="card-content" style="text-align:center; padding-bottom:15px;">
                <div class="biz-cat">📁 ${biz.category}</div>
                ${tierL === 'premium' ? `<div style="color:#fe4f00; font-weight:900; font-size:0.75rem; margin-top:10px;">⚡ CLICK FOR DETAILS</div>` : ''}
            </div>
        </div>`;
    }).join('');
}

// Initial Launch
document.addEventListener("DOMContentLoaded", fetchData);
