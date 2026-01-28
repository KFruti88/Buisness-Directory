/**
 * PROJECT: Clay County Directory Engine - Main Layout
 * VERSION: 1.12
 * STANDARDS: A=ImageID, B=Name, G=Address, D=Tier, F=Phone
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
    loadCSVData();
});

function updateHeaderDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const headerInfo = document.getElementById('header-info');
    if (headerInfo) headerInfo.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${dateStr}`;
}

function getSmartImage(imageID, bizName) {
    let fileName = imageID ? imageID.trim() : "";
    if (!fileName && bizName) fileName = bizName.toLowerCase().replace(/['\s]/g, "");
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    return `<img src="${imageRepo}${fileName}.jpeg" class="logo-img" onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${placeholder}'};">`;
}

async function loadCSVData() {
    Papa.parse(csvUrl, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            masterData = results.data.slice(1).map(row => {
                const addr = row[6] || "";
                const town = addr.split(',').length >= 2 ? addr.split(',')[1].trim() : "Clay County";
                return {
                    ImageID: row[0], Name: row[1], Town: town, Tier: row[3], Category: row[4],
                    Phone: row[5], Address: row[6], Hours: row[7], Website: row[8], 
                    Facebook: row[9], Bio: row[10], Coupon: row[11], Established: row[12], CouponLink: row[13]
                };
            }).filter(b => b.Name && b.Name !== "N/A");
            renderGrid(masterData);
        }
    });
}

function renderGrid(data) {
    const grid = document.getElementById('directory-grid');
    const tierOrder = { "premium": 1, "plus": 2, "basic": 3 };

    grid.innerHTML = data.sort((a, b) => {
        const tA = a.Tier.toLowerCase();
        const tB = b.Tier.toLowerCase();
        return (tierOrder[tA] || 4) - (tierOrder[tB] || 4) || a.Town.localeCompare(b.Town);
    }).map(biz => {
        const tierL = biz.Tier.toLowerCase();
        const townClass = biz.Town.toLowerCase().replace(/\s+/g, '-');
        const showPhone = (tierL === 'premium' || tierL === 'plus');
        
        // Modal logic: Premium gets full view, others with coupons get coupon view
        let click = (tierL === 'premium' || (biz.CouponLink && biz.CouponLink !== "N/A")) 
                    ? `onclick="openFullModal('${biz.Name.replace(/'/g, "\\'")}')"` : "";

        return `
        <div class="card ${tierL}" ${click} style="cursor: ${click ? 'pointer' : 'default'}">
            <div class="tier-badge">${biz.Tier}</div> 
            <div class="logo-box">${getSmartImage(biz.ImageID, biz.Name)}</div>
            <div class="town-bar ${townClass}-bar">${biz.Town}</div> 
            <div class="biz-name">${biz.Name}</div> 
            ${showPhone ? `<div class="biz-phone">📞 ${biz.Phone}</div>` : ''}
            <div class="cat-text">${catEmojis[biz.Category] || "📁"} ${biz.Category}</div> 
        </div>`;
    }).join('');
}

function applyFilters() {
    const cat = document.getElementById('cat-select').value;
    const town = document.getElementById('town-select').value;
    const filtered = masterData.filter(b => (cat === 'All' || b.Category === cat) && (town === 'All' || b.Town === town));
    renderGrid(filtered);
}
