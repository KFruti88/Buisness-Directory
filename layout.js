/**
 * PROJECT: Clay County Master Directory v9.2
 * FEATURE: Auto-Meta Handshake & Dynamic Category Loading
 * LOCKS: Town Color Fill | Centered Bottom Stack | Image Coupon
 */

const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    
    // [cite: 2026-01-28] THE "COLOR LOCK" TOWN BRANDING
    TOWN_COLORS: {
        "Flora": { bg: "#0c0b82", text: "#fe4f00" },
        "Louisville": { bg: "#010101", text: "#eb1c24" },
        "Clay City": { bg: "#8a8a88", text: "#0c30f0" },
        "Xenia": { bg: "#000000", text: "#fdb813" },
        "Sailor Springs": { bg: "#000000", text: "#a020f0" },
        "Clay County": { bg: "#333333", text: "#ffffff" }
    },

    // Hard-Locked A-P Mapping [cite: 2026-01-30]
    MAP: { 
        IMG: 0, NAME: 1, ADDR: 2, TOWN: 3, ZIP: 4, PHONE: 5, WEB: 6, FB: 7, 
        CAT: 8, BIO: 9, HOURS: 10, TIER: 11, EST: 12, CPN_TXT: 13, CPN_IMG: 14 
    }
};

window.allData = []; 

/**
 * Newspaper Handshake: VOL = Month, NO = Today's Date
 */
function updateNewspaperMeta() {
    const now = new Date();
    const infoBox = document.getElementById('header-info');
    if (infoBox) {
        const vol = now.getMonth() + 1;
        const no = now.getDate();
        // [cite: 2026-01-30] Format: VOL. 1 - NO. 30
        infoBox.innerText = `VOL. ${vol} — NO. ${no} | ${now.toLocaleDateString()}`;
    }
}

/**
 * Dynamic Filter Population: Pulls unique towns/categories from CSV
 */
function populateFilters(data) {
    const townSelect = document.getElementById('town-filter');
    const catSelect = document.getElementById('cat-filter');

    const towns = [...new Set(data.map(b => b.town))].sort();
    const categories = [...new Set(data.map(b => b.category))].sort();

    if(townSelect) {
        townSelect.innerHTML = '<option value="all">All Towns</option>' + 
            towns.map(t => `<option value="${t}">${t}</option>`).join('');
    }
    if(catSelect) {
        catSelect.innerHTML = '<option value="all">All Categories</option>' + 
            categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }
}

/**
 * Core Data Fetch
 */
function fetchData() {
    Papa.parse(`${CONFIG.CSV_URL}&v=${new Date().getTime()}`, {
        download: true,
        header: false,
        skipEmptyLines: true,
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
            
            // EXECUTE HANDSHAKES
            updateNewspaperMeta();
            populateFilters(window.allData);
            renderCards(window.allData);
        }
    });
}

/**
 * Render Cards Logic [cite: 2026-01-30]
 */
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
