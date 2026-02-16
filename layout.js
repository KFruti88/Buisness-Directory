/**
 * PROJECT: Clay County Master Directory v9.1
 * LOCKS: Town Middle Color Fill | Centered Bottom Stack
 * PRIMARY SHEET: BusinessDirectory (A-P) [cite: 2026-01-30]
 */

const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOri1Xv-jHW8JnLbK0lBG_Or0e99RcIXqoBHc31HE5RxppszjFz3akDCHXaZxFmrepuCOUTD9jLL0B/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    
    // [cite: 2026-01-28] THE "COLOR LOCK" TOWN BRANDING
    TOWN_COLORS: {
        "Flora": { bg: "#0c0b82", text: "#fe4f00" },          // Deep Blue / Orange
        "Louisville": { bg: "#010101", text: "#eb1c24" },     // Black / Cardinal Red
        "Clay City": { bg: "#8a8a88", text: "#0c30f0" },      // Grey / Blue
        "Xenia": { bg: "#000000", text: "#fdb813" },          // Black / School Bus Yellow
        "Sailor Springs": { bg: "#000000", text: "#a020f0" }, // Black / Purple
        "Clay County": { bg: "#333333", text: "#ffffff" }      // Charcoal / White
    },

    // Hard-Locked A-P Mapping [cite: 2026-01-30]
    MAP: { 
        IMG: 0, NAME: 1, ADDR: 2, TOWN: 3, ZIP: 4, PHONE: 5, WEB: 6, FB: 7, 
        CAT: 8, BIO: 9, HOURS: 10, TIER: 11, EST: 12, CPN_TXT: 13, CPN_IMG: 14 
    }
};
window.CONFIG = CONFIG; // Ensure global visibility for modal.js

window.allData = []; 

function updateHeader(isLoading = false) {
    const now = new Date();
    const infoBox = document.getElementById('header-info');
    if (infoBox) {
        // Vol = Month, No = Day
        infoBox.innerText = `VOL. ${now.getMonth() + 1} — NO. ${now.getDate()}${isLoading ? ' | LOADING...' : ''}`;
    }
}

function fetchData() {
    updateHeader(true);
    Papa.parse(`${CONFIG.CSV_URL}&v=${new Date().getTime()}`, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            window.allData = results.data.slice(1).map(row => ({
                id: row[CONFIG.MAP.IMG] || "",
                name: row[CONFIG.MAP.NAME] || "",
                address: row[CONFIG.MAP.ADDR] || "N/A",
                town: row[CONFIG.MAP.TOWN] || "Clay County", 
                zip: row[CONFIG.MAP.ZIP] || "",
                phone: row[CONFIG.MAP.PHONE] || "",
                website: row[CONFIG.MAP.WEB] || "N/A",
                facebook: row[CONFIG.MAP.FB] || "N/A",
                category: row[CONFIG.MAP.CAT] || "",
                bio: row[CONFIG.MAP.BIO] || "",
                hours: row[CONFIG.MAP.HOURS] || "",
                tier: row[CONFIG.MAP.TIER] || "Basic",
                established: row[CONFIG.MAP.EST] || "",
                couponTxt: row[CONFIG.MAP.CPN_TXT] || "",
                coupon: row[CONFIG.MAP.CPN_IMG] || ""
            })).filter(b => b.name && b.name.trim() !== "");
            
            console.log(`✅ Live Data Loaded: ${window.allData.length} businesses found.`);
            updateHeader(false);
            renderCards(window.allData);
        },
        error: function(err) {
            console.error("❌ Data Fetch Error:", err);
            const infoBox = document.getElementById('header-info');
            if (infoBox) infoBox.innerText = "⚠️ CONNECTION FAILED - CHECK CONSOLE";
        }
    });
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.map(biz => {
        const tierL = biz.tier.toLowerCase();
        
        // Get Town Brand Colors
        const colors = CONFIG.TOWN_COLORS[biz.town] || CONFIG.TOWN_COLORS["Clay County"];
        
        const cleanPhone = biz.phone.replace(/\D/g, '').slice(-10);
        const displayPhone = cleanPhone.length === 10 ? `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}` : "";

        const couponHTML = (biz.couponTxt && biz.couponTxt.trim() !== "") 
            ? `<img src="https://github.com/KFruti88/images/blob/main/Coupon.png?raw=true" class="coupon-img-top" alt="Coupon Available">`
            : "";

        return `
        <div class="business-card ${tierL}" onclick="openFullModal('${biz.name.replace(/'/g, "\\'")}')">
            <div class="badge">${biz.tier}</div>
            <div class="coupon-container">${couponHTML}</div>
            
            <div class="card-image">
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" alt="${biz.name} Logo" onerror="this.src='https://via.placeholder.com/150'">
            </div>

            <div class="black-box" style="background-color: ${colors.bg} !important; color: ${colors.text} !important;">
                <h3 class="town-name">${biz.town}</h3>
            </div>

            <div class="biz-name">${biz.name}</div>

            <div class="card-footer">
                <span class="category-text">${biz.category}</span>
                <div class="hours-info">
                    ${(tierL === 'premium' || tierL === 'plus') && displayPhone ? `📞 ${displayPhone}` : `<i class="folder-icon"></i> ${biz.hours || 'See Details'}`}
                </div>
            </div>
        </div>`;
    }).join('');
}

function filterData() {
    const town = document.getElementById('town-filter').value;
    const filtered = town === 'all' ? window.allData : window.allData.filter(b => b.town === town);
    renderCards(filtered);
}

document.addEventListener("DOMContentLoaded", fetchData);
