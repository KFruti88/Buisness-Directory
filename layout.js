/**
 * PROJECT: Clay County Directory Engine
 * VERSION: 1.58 (Locked A-N Mapping)
 * UPDATES: Corrected indices for Town (6), Phone (4), and Tier (2).
 */

async function fetchDirectoryData() {
    Papa.parse(`${baseCsvUrl}&t=${new Date().getTime()}`, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            masterData = results.data.slice(1).map(row => ({
                ImageID: row[0],  // Col A
                Name: row[1],     // Col B
                Tier: row[2],     // Col C
                Category: row[3], // Col D
                Phone: row[4],    // Col E
                Address: row[5],  // Col F
                Town: row[6],     // Col G
                State: row[7],    // Col H
                Est: row[12],     // Col M
                Coupon: row[13]   // Col N
            })).filter(b => b.Name && b.Name !== "Name");
            renderDirectoryGrid(masterData);
        }
    });
}

function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    grid.innerHTML = data.map(biz => {
        const tierL = (biz.Tier || 'basic').toLowerCase();
        // Uses the Color Lock mapping for the bar color [cite: 2026-01-28]
        const townStyle = townColors[biz.Town.trim()] || { bg: "#333", text: "#fff" };
        const hasCoupon = (biz.Coupon && biz.Coupon !== "N/A");

        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.Name}')" style="background-color: #fff5ba; height: 480px; display: flex; flex-direction: column; position: relative; border: 2px solid #000;">
            <div class="tier-badge" style="position:absolute; top:8px; left:8px; z-index:10;">${biz.Tier}</div>
            ${hasCoupon ? `<img src="coupon.png" style="position:absolute; top:8px; right:8px; width:30px; z-index:10;">` : ""}

            <div class="logo-box" style="height: 150px; display: flex; align-items: center; justify-content: center; padding: 10px;">
                <img src="${imageRepo}${biz.ImageID}.jpeg" onerror="this.src='placeholder.png'" style="max-height: 100%; max-width: 100%; object-fit: contain;">
            </div>

            <div class="town-bar" style="background-color: ${townStyle.bg}; color: ${townStyle.text}; height: 35px; display: flex; align-items: center; justify-content: center; font-weight: 900; border-top: 2px solid #000; border-bottom: 2px solid #000;">
                ${biz.Town}
            </div>

            <div class="biz-name" style="height: 80px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.4rem; padding: 5px;">
                ${biz.Name}
            </div>

            <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding-bottom: 15px;">
                ${(tierL === 'premium' || tierL === 'plus') ? `<div style="color:#0c30f0; font-weight:bold; font-size:1.2rem;">📞 ${biz.Phone}</div>` : ''}
                <div style="font-weight: bold; color: #444;">📁 ${biz.Category}</div>
            </div>
        </div>`;
    }).join('');
}
