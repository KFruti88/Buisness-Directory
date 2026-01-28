/**
 * PROJECT: Clay County Directory Engine - Main Layout
 * VERSION: 1.11
 * MAPPING: A=ImageID, B=Name, G=Address (Index 6), D=Tier, F=Phone
 */

let masterData = [];

// 1. CONFIGURATION
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

const catEmojis = {
    "Bars": "🍺", "Emergency": "🚨", "Church": "⛪", "Post Office": "📬", 
    "Restaurants": "🍴", "Retail": "🛒", "Shopping": "🛍️", "Manufacturing": "🏗️", 
    "Industry": "🏭", "Financial Services": "💰", "Healthcare": "🏥", 
    "Gas Station": "⛽", "Internet": "🌐", "Support Services": "🛠️", 
    "Professional Services": "💼", "Agriculture": "🚜"
};

// 2. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => { 
    updateNewspaperHeader(); 
    loadDirectory();
    if (typeof setupModalClose === "function") { setupModalClose(); }
});

function updateNewspaperHeader() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const headerInfo = document.getElementById('header-info');
    if (headerInfo) { 
        headerInfo.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${dateString}`; 
    }
}

// 3. SMART IMAGE ENGINE (.jpeg)
function getSmartImage(imageID, bizName) {
    let fileName = imageID ? imageID.trim() : "";
    if (!fileName && bizName) {
        fileName = bizName.toLowerCase().replace(/['\s]/g, ""); 
    }
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    const imgUrl = `${imageRepo}${fileName}.jpeg`;
    
    return `<img src="${imgUrl}" class="logo-img" alt="${bizName}"
            onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${placeholder}'};">`;
}

// 4. DATA LOADING
async function loadDirectory() {
    Papa.parse(csvUrl, {
        download: true, 
        header: false, 
        skipEmptyLines: true,
        complete: function(results) {
            const rawRows = results.data;
            masterData = rawRows.slice(1).map(row => {
                const fullAddress = row[6] || "";
                const parts = fullAddress.split(',');
                let townName = "Clay County";
                if (parts.length >= 2) { townName = parts[1].trim(); }

                return {
                    ImageID: row[0] || "",    // A
                    Name: row[1] || "N/A",    // B
                    Town: townName,           // G
                    Tier: row[3] || "Basic",  // D
                    Category: row[4] || "N/A",// E
                    Phone: row[5] || "",      // F
                    Address: row[6] || "",    // G
                    Hours: row[7] || "",      // H
                    Website: row[8] || "",    // I
                    Facebook: row[9] || "",   // J
                    Bio: row[10] || "",       // K
                    CouponLink: row[13]       // N
                };
            }).filter(biz => biz.Name !== "N/A" && biz.Name !== "Name");

            renderCards(masterData);
        }
    });
}

// 5. RENDER CARDS
function renderCards(data) {
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
        
        // Premium cards trigger the Modal
        let clickAttr = (tierL === 'premium') ? `onclick="openFullModal('${biz.Name.replace(/'/g, "\\'")}')"` : "";
        let cursorStyle = (tierL === 'premium') ? "pointer" : "default";
        const showPhone = (tierL === 'premium' || tierL === 'plus') && biz.Phone;

        return `
        <div class="card ${tierL}" ${clickAttr} style="cursor: ${cursorStyle};">
            <div class="tier-badge">${biz.Tier}</div> 
            <div class="logo-box">${getSmartImage(biz.ImageID, biz.Name)}</div>
            <div class="town-bar ${townClass}-bar">${biz.Town}</div> 
            <div class="biz-name">${biz.Name}</div> 
            ${showPhone ? `<div class="biz-phone">📞 ${biz.Phone}</div>` : ''}
            <div class="cat-text">${catEmojis[biz.Category] || "📁"} ${biz.Category}</div> 
        </div>`;
    }).join('');
}
