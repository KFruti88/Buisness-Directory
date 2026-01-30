/**
 * 🛠️ LAYOUT ENGINE v2.98
 * SECURITY LOCK: Forces Category to Index 4 and Phone to Index 5 [cite: 2026-01-28]
 */
let masterData = [];

async function fetchData() {
    const v = new Date().getTime(); // Smart Cache [cite: 2026-01-26]
    Papa.parse(`${CONFIG.CSV_URL}&v=${v}`, {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: function(results) {
            // THE HARD-LOCK MAPPING [cite: 2026-01-28]
            masterData = results.data.slice(1).map(row => ({
                ImageID:  row[0] || "",        // A
                Name:     row[1] || "",        // B
                Tier:     row[3] || "Basic",   // D (INDEX 2 IS SKIPPED)
                Category: row[4] || "",        // E (WORDS ONLY - STORES, BARS, ETC)
                Phone:    row[5] || "",        // F (NUMBERS ONLY)
                Address:  row[6] || "",        // G
                Town:     row[7] || "Clay County", // H (LOCKED MIDDLE)
                Zip:      row[8] || "",        // I
                Bio:      row[12] || "",       // M
                Est:      row[13] || "",       // N
                Coupon:   row[14] || ""        // O
            })).filter(b => b.Name.trim() !== "");
            
            renderCards(masterData);
        }
    });
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    grid.innerHTML = data.map(biz => {
        const style = CONFIG.TOWN_COLORS[biz.Town.trim()] || CONFIG.TOWN_COLORS["Clay County"];
        const tierL = biz.Tier.toLowerCase();
        
        // Ensure Phone is clean and formatted [cite: 2026-01-26]
        const cleanPhone = biz.Phone.replace(/\D/g, '').slice(-10);
        const displayPhone = cleanPhone.length === 10 ? 
            `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}` : biz.Phone;

        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.Name.replace(/'/g, "\\'")}')">
            <div class="tier-badge">${biz.Tier}</div>
            <div class="logo-box">
                <img src="${CONFIG.IMAGE_REPO}${biz.ImageID}.jpeg" onerror="this.src='https://via.placeholder.com/150'">
            </div>

            <div class="town-bar" style="background-color: ${style.bg}; color: ${style.text};">
                ${biz.Town}
            </div>

            <div class="biz-name">${biz.Name}</div>

            <div class="card-content">
                <div>
                    ${(tierL === 'premium' || tierL === 'plus') ? `<div class="biz-phone">📞 ${displayPhone}</div>` : ''}
                </div>
                
                <div class="biz-cat">📁 Category: ${biz.Category}</div>
            </div>
        </div>`;
    }).join('');
}
