/**
 * PROJECT: Clay County Directory Engine - Main Layout
 * VERSION: 1.12
 * MAPPING: A=ImageID, B=Name, C=Town, D=Tier, E=Category, F=Phone, G=Address
 */

let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

const catEmojis = {
    "Bars": "🍺", "Emergency": "🚨", "Church": "⛪", "Post Office": "📬", 
    "Restaurants": "🍴", "Retail": "🛒", "Shopping": "🛍️", "Manufacturing": "🏗️", 
    "Industry": "🏭", "Financial Services": "💰", "Healthcare": "🏥", 
    "Gas Station": "⛽", "Internet": "🌐", "Support Services": "🛠️", 
    "Professional Services": "💼", "Agriculture": "🚜"
};

document.addEventListener("DOMContentLoaded", () => { 
    updateHeaderDate(); 
    fetchDirectoryData();
});

function updateHeaderDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const headerInfo = document.getElementById('header-info');
    if (headerInfo) headerInfo.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${dateStr}`;
}

// Business Logos are .jpeg
function getSmartLogo(imageID, bizName) {
    let fileName = imageID ? imageID.trim() : "";
    if (!fileName && bizName) fileName = bizName.toLowerCase().replace(/['\s]/g, "");
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    return `<img src="${imageRepo}${fileName}.jpeg" class="logo-img" alt="${bizName}" 
            onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${placeholder}'};">`;
}

async function fetchDirectoryData() {
    Papa.parse(csvUrl, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            masterData = results.data.slice(1).map(row => {
                // Address-to-Town Extraction (Fallback if Column C is messy)
                const addr = row[6] || "";
                const townFromAddr = addr.split(',').length >= 2 ? addr.split(',')[1].trim() : "Clay County";
                
                return {
                    ImageID: row[0] || "",    // A
                    Name: row[1] || "N/A",    // B
                    Town: row[2] || townFromAddr, // C
                    Tier: row[3] || "Basic",  // D
                    Category: row[4] || "N/A",// E
                    Phone: row[5] || "",      // F
                    Address: row[6] || "",    // G
                    Hours: row[7] || "",      // H
                    Website: row[8] || "",    // I
                    Facebook: row[9] || "",   // J
                    Bio: row[10] || "",       // K
                    CouponText: row[11] || "", // L
                    Established: row[12] || "",// M
                    CouponLink: row[13] || ""  // N
                };
            }).filter(b => b.Name !== "N/A" && b.Name !== "Name");
            renderDirectoryGrid(masterData);
        }
    });
}

function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;
    const tierOrder = { "premium": 1, "plus": 2, "basic": 3 };

    grid.innerHTML = data.sort((a, b) => {
        const tA = a.Tier.toLowerCase();
        const tB = b.Tier.toLowerCase();
        return (tierOrder[tA] || 4) - (tierOrder[tB] || 4) || a.Town.localeCompare(b.Town);
    }).map(biz => {
        const tierL = biz.Tier.toLowerCase();
        const townClass = biz.Town.toLowerCase().replace(/\s+/g, '-');
        
        // Modal logic: Premium gets full view, others with coupons get coupon view
        let clickAction = (tierL === 'premium' || (biz.CouponLink && biz.CouponLink !== "")) 
                    ? `onclick="openFullModal('${biz.Name.replace(/'/g, "\\'")}')"` : "";

        return `
        <div class="card ${tierL}" ${clickAction} style="cursor: ${clickAction ? 'pointer' : 'default'}">
            <div class="tier-badge">${biz.Tier}</div> 
            <div class="logo-box">${getSmartLogo(biz.ImageID, biz.Name)}</div>
            
            <div class="town-bar" style="background-color: #d3d3d3; color: #333; font-weight: bold; border-top: 1px solid #999; border-bottom: 1px solid #999;">
                ${biz.Town}
            </div> 

            <div class="biz-name">${biz.Name}</div> 
            ${(tierL === 'premium' || tierL === 'plus') ? `<div class="biz-phone">📞 ${biz.Phone}</div>` : ''}
            <div class="cat-text">${catEmojis[biz.Category] || "📁"} ${biz.Category}</div> 
        </div>`;;
    }).join('');
}

function applyFilters() {
    const cat = document.getElementById('cat-select').value;
    const town = document.getElementById('town-select').value;
    const filtered = masterData.filter(b => (cat === 'All' || b.Category === cat) && (town === 'All' || b.Town === town));
    renderDirectoryGrid(filtered);
}
