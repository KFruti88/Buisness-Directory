/**
 * PROJECT: Clay County Master Directory v2.7
 * LOCKS: Slate Theme | Logo = Col A | Coupon Media = Col O | Coupon Text = Col P
 * [cite: 2026-01-30]
 */

const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/Buisness-Directory/main/images/", 
    COUPON_REPO: "https://raw.githubusercontent.com/KFruti88/Buisness-Directory/main/coupon-images/",
    
    TOWN_COLORS: {
        "Flora": { bg: "#0c0b82", text: "#fe4f00" },
        "Louisville": { bg: "#010101", text: "#eb1c24" },
        "North Clay": { bg: "#010101", text: "#eb1c24" },
        "Clay City": { bg: "#0c30f0", text: "#8a8a88" },
        "Xenia": { bg: "#000000", text: "#fdb813" },
        "Sailor Springs": { bg: "#000000", text: "#a020f0" },
        "Clay County": { bg: "#333333", text: "#ffffff" }
    },

    // Hard-Locked Column Index Mapping [cite: 2026-01-30]
    MAP: { 
        ID: 0, NAME: 1, ADDR: 2, TOWN: 3, ZIP: 4, PHONE: 5, WEB: 6, FB: 7, 
        CAT: 8, BIO: 9, HOURS: 10, TIER: 11, EST: 12, CPN_TXT: 13, CPN_IMG: 14, CPN_PREVIEW: 15
    }
};

window.allData = []; 

function fetchData() {
    Papa.parse(`${CONFIG.CSV_URL}&v=${new Date().getTime()}`, {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: function(results) {
            window.allData = results.data.slice(1).map(row => ({
                id: row[CONFIG.MAP.ID] || "",
                name: row[CONFIG.MAP.NAME] || "",
                address: row[CONFIG.MAP.ADDR] || "N/A",
                town: row[CONFIG.MAP.TOWN] || "Clay County", 
                phone: row[CONFIG.MAP.PHONE] || "N/A",
                website: row[CONFIG.MAP.WEB] || "N/A",
                facebook: row[CONFIG.MAP.FB] || "N/A",
                category: row[CONFIG.MAP.CAT] || "",
                bio: row[CONFIG.MAP.BIO] || "",
                hours: row[CONFIG.MAP.HOURS] || "",
                tier: row[CONFIG.MAP.TIER] || "Basic",
                established: row[CONFIG.MAP.EST] || "N/A",
                couponTxt: row[CONFIG.MAP.CPN_TXT] || "", // Column N logic
                couponMedia: row[CONFIG.MAP.CPN_IMG] || "", // Column O Filename
                preview: row[CONFIG.MAP.CPN_PREVIEW] || "" // Column P Text
            })).filter(b => b.name && b.name.trim() !== "");
            
            updateNewspaperMeta();
            populateFilters(window.allData);
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
        
        // Show Ribbon if either Column N has "Yes" OR Column O has a filename
        const hasCoupon = (biz.couponTxt.toLowerCase() === 'yes' || (biz.couponMedia && biz.couponMedia !== "N/A"));
        const couponHTML = hasCoupon ? `<img src="https://github.com/KFruti88/images/blob/main/Coupon.png?raw=true" class="coupon-img-top">` : "";

        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.name.replace(/'/g, "\\'")}')">
            <div class="coupon-container">${couponHTML}</div>
            <div class="tier-badge-top">${biz.tier}</div>
            <div class="logo-box"><img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" onerror="this.src='https://via.placeholder.com/150'"></div>
            <div class="town-bar" style="background-color: ${colors.bg} !important; color: ${colors.text} !important;">${biz.town}</div>
            <div class="biz-name">${biz.name}</div>
            <div class="bottom-stack">
                ${(tierL === 'premium' || tierL === 'plus') && displayPhone ? `<div class="biz-phone">📞 ${displayPhone}</div>` : ''}
                <div class="category-locked">📁 ${biz.category}</div>
            </div>
        </div>`;
    }).join('');
}

// Helpers for Newspaper Meta and Date
function updateNewspaperMeta() {
    const now = new Date();
    const infoBox = document.getElementById('header-info');
    if (infoBox) {
        const vol = now.getMonth() + 1;
        const no = now.getDate();
        infoBox.innerText = `VOL. ${vol} — NO. ${no}`;
    }
}

function populateFilters(data) {
    const townSelect = document.getElementById('city-filter');
    const catSelect = document.getElementById('cat-filter');
    if(townSelect) {
        const towns = [...new Set(data.map(b => b.town))].sort();
        townSelect.innerHTML = '<option value="all">All Cities</option>' + towns.map(t => `<option value="${t}">${t}</option>`).join('');
    }
    if(catSelect) {
        const cats = [...new Set(data.map(b => b.category))].sort();
        catSelect.innerHTML = '<option value="all">All Categories</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
    }
}

document.addEventListener("DOMContentLoaded", fetchData);
