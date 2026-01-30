/**
 * PROJECT: Clay County Master Directory v7.85
 * LOCK: City-Only Town Bar & Uniform Yellow Card DNA
 * [cite: 2026-01-30]
 */
const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    
    // HARD-LOCKED MAPPING BASED ON A-P SHEET
    // A=0, B=1, C=2 (TOWN), D=3, E=4, F=5, G=6 (ADDR)
    MAP: { IMG: 0, NAME: 1, TOWN: 2, TIER: 3, CAT: 4, PHONE: 5, ADDR: 6, BIO: 10, EST: 12, COUPON: 13 }
};

window.allData = []; 

function fetchData() {
    Papa.parse(`${CONFIG.CSV_URL}&v=${new Date().getTime()}`, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            // Mapping CSV to Global Object
            window.allData = results.data.slice(1).map(row => ({
                ImageID: row[CONFIG.MAP.IMG] || "",
                name: row[CONFIG.MAP.NAME] || "",
                // HARD LOCKED TOWN ONLY
                town: row[CONFIG.MAP.TOWN] || "Clay County", 
                tier: row[CONFIG.MAP.TIER] || "Basic",
                category: row[CONFIG.MAP.CAT] || "",
                phone: row[CONFIG.MAP.PHONE] || "",
                address: row[CONFIG.MAP.ADDR] || "",
                bio: row[CONFIG.MAP.BIO] || "",
                established: row[CONFIG.MAP.EST] || "",
                coupon: row[CONFIG.MAP.COUPON] || ""
            })).filter(b => b.name && b.name.trim() !== "");
            
            renderCards(window.allData);
        }
    });
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    grid.innerHTML = data.map(biz => {
        const tierL = biz.tier.toLowerCase();
        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.name.replace(/'/g, "\\'")}')">
            <div class="tier-badge">${biz.tier}</div>
            <div class="logo-box">
                <img src="${CONFIG.IMAGE_REPO}${biz.ImageID}.jpeg" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <div class="town-bar">${biz.town}</div>
            <div class="biz-name">${biz.name}</div>
            <div class="card-content">
                <div class="biz-cat">📁 ${biz.category}</div>
                ${tierL === 'premium' ? `<div style="color:#fe4f00; font-weight:900; font-size:0.75rem; margin-top:10px;">⚡ CLICK FOR DETAILS</div>` : ''}
            </div>
        </div>`;
    }).join('');
}
