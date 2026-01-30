/**
 * PROJECT: Clay County Directory Engine
 * VERSION: 2.8 (Middle-Lock Town & A-N Index Enforcement)
 * UPDATES: Enforced Index 2 Skip, Locked Town Bar to Middle, Added Category Label.
 */

let masterData = [];

// 1. CONFIGURATION [cite: 2026-01-28]
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

// 2. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => { 
    updateNewspaperHeader(); 
    fetchDirectoryData();
});

function updateNewspaperHeader() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const headerInfo = document.getElementById('header-info');
    const headerMain = document.querySelector('.main-title');
    
    // Apply Newspaper Yellow to Header [cite: 2026-01-28]
    if (headerMain) headerMain.style.backgroundColor = "#fff5ba";
    if (headerInfo) { 
        headerInfo.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${dateString}`; 
    }
}

// 3. DATA LOADING (A-N INDEX ENFORCEMENT) [cite: 2026-01-28]
async function fetchDirectoryData() {
    Papa.parse(`${baseCsvUrl}&t=${new Date().getTime()}`, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            masterData = results.data.slice(1).map(row => ({
                ImageID: row[0] || "",   // A
                Name: row[1] || "",      // B
                Tier: row[3] || "Basic", // D (INDEX 2 SKIPPED) [cite: 2026-01-28]
                Category: row[4] || "",  // E (Corrected Index)
                Phone: row[5] || "",     // F (Corrected Index)
                Address: row[6] || "",   // G
                Town: row[7] || "Clay County", // H (Corrected Index - LOCKED MIDDLE) [cite: 2026-01-28]
                Zip: row[8] || "",       // I
                Est: row[13] || "",      // N
                Coupon: row[14] || ""    // O
            })).filter(b => b.Name.trim() !== ""); // Filter blanks [cite: 2026-01-26]
            
            renderDirectoryGrid(masterData);
        }
    });
}

// 4. RENDER CARDS (LOCKED MIDDLE TOWN) [cite: 2026-01-26, 2026-01-28]
function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // Premium Sorting [cite: 2026-01-26]
    const tierOrder = { "premium": 1, "gold": 1, "plus": 2, "basic": 3 };
    
    grid.innerHTML = data.sort((a, b) => {
        return (tierOrder[a.Tier.toLowerCase()] || 4) - (tierOrder[b.Tier.toLowerCase()] || 4) 
               || a.Name.localeCompare(b.Name);
    }).map(biz => {
        const tierL = (biz.Tier || 'basic').toLowerCase();
        // Color Lock Logic [cite: 2026-01-28]
        const townStyle = townColors[biz.Town.trim()] || { bg: "#333", text: "#fff" };
        const hasCoupon = (biz.Coupon && biz.Coupon !== "");

        // 10-Digit Phone Cleanup [cite: 2026-01-26]
        const cleanPhone = biz.Phone.replace(/\D/g, '').slice(-10);
        const displayPhone = cleanPhone.length === 10 ? 
            `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}` : biz.Phone;

        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.Name.replace(/'/g, "\\'")}')" 
             style="background-color: #fff5ba; height: 480px; display: flex; flex-direction: column; position: relative; border: 2px solid #000; overflow: hidden; cursor: pointer;">
            
            <div class="tier-badge" style="position:absolute; top:5%; left:5%; z-index:10; background:#fff; border:1px solid #000; padding:2px 5px; font-weight:bold; font-size:0.7rem; text-transform:uppercase;">${biz.Tier}</div>
            ${hasCoupon ? `<img src="coupon.png" style="position:absolute; top:5%; right:5%; width:30px; z-index:10;">` : ""}

            <div class="logo-box" style="height: 160px; display: flex; align-items: center; justify-content: center; padding: 10px;">
                <img src="${imageRepo}${biz.ImageID}.jpeg" onerror="this.src='https://via.placeholder.com/150'" style="max-height: 100%; max-width: 100%; object-fit: contain;">
            </div>

            <div class="town-bar" style="background-color: ${townStyle.bg}; color: ${townStyle.text}; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: 900; border-top: 2px solid #000; border-bottom: 2px solid #000; text-transform: uppercase;">
                ${biz.Town}
            </div>

            <div class="biz-name" style="height: 80px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.4rem; padding: 5px; text-align: center;">
                ${biz.Name}
            </div>

            <div class="card-content" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding-bottom: 15px;">
                <div>
                    ${(tierL === 'premium' || tierL === 'plus') ? `<div style="color:#0c30f0; font-weight:bold; font-size:1.2rem;">📞 ${displayPhone}</div>` : ''}
                </div>
                
                <div style="font-weight: bold; color: #444;">📁 Category: ${biz.Category}</div>
            </div>
        </div>`;
    }).join('');
}
