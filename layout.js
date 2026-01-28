/**
 * PROJECT: Clay County Directory Engine - Main Layout
 * VERSION: 1.25
 * FEATURES: Full Category/Emoji Set, Custom Town Palette, Live Cache Buster, Heartbeat.
 */

let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

// --- LIVE DATA CONFIG ---
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

function getLiveCsvUrl() {
    return `${baseCsvUrl}&t=${new Date().getTime()}`;
}

// --- MASTER TOWN COLOR PALETTE ---
const townStyles = {
    "Flora": { bg: "#0c0b82", text: "#fe4f00" },
    "Louisville": { bg: "#010101", text: "#eb1c24" },
    "North Clay": { bg: "#010101", text: "#eb1c24" },
    "Clay City": { bg: "#0c30f0", text: "#8a8a88" },
    "Xenia": { bg: "#000000", text: "#fdb813" },
    "Sailor Springs": { bg: "#000000", text: "#a020f0" },
    "Clay County": { bg: "#333333", text: "#ffffff" }
};

// --- MASTER CATEGORY LIST ---
const catEmojis = {
    "Bars": "🍺", "Emergency": "🚨", "Church": "⛪", "Post Office": "📬", 
    "Restaurants": "🍴", "Retail": "🛒", "Shopping": "🛍️", "Manufacturing": "🏗️", 
    "Industry": "🏭", "Financial Services": "💰", "Healthcare": "🏥", 
    "Gas Station": "⛽", "Internet": "🌐", "Support Services": "🛠️", 
    "Professional Services": "💼", "Agriculture": "🚜", "Education": "🎓",
    "Beauty & Hair": "✂️", "Automotive": "🚗", "Construction": "🔨",
    "Real Estate": "🏠", "Legal": "⚖️", "Lodging": "🏨", "Parks & Rec": "🌳",
    "Non-Profit": "🤝", "Cleaning Services": "🧹", "Entertainment": "🍿",
    "Fitness": "💪", "Insurance": "📄", "Technology": "💻"
};

document.addEventListener("DOMContentLoaded", () => { 
    updateHeaderDate(); 
    fetchDirectoryData();
    
    // Heartbeat: Check for live changes every 5 minutes
    setInterval(() => {
        console.log("Heartbeat Sync: Fetching latest CSV data...");
        fetchDirectoryData();
    }, 300000); 
});

function updateHeaderDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const headerInfo = document.getElementById('header-info');
    if (headerInfo) headerInfo.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${dateStr}`;
}

function getSmartLogo(imageID, bizName) {
    let fileName = imageID ? imageID.trim() : "";
    if (!fileName && bizName) fileName = bizName.toLowerCase().replace(/['\s]/g, "");
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    return `<img src="${imageRepo}${fileName}.jpeg" class="logo-img" alt="${bizName}" 
            onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${placeholder}'};">`;
}

async function fetchDirectoryData() {
    Papa.parse(getLiveCsvUrl(), {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            masterData = results.data.slice(1).map(row => {
                const addr = row[6] || "";
                const townFromAddr = addr.split(',').length >= 2 ? addr.split(',')[1].trim() : "Clay County";
                return {
                    ImageID: row[0] || "", Name: row[1] || "N/A", Town: row[2] || townFromAddr,
                    Tier: row[3] || "Basic", Category: row[4] || "N/A", Phone: row[5] || "",
                    Address: row[6] || "", Hours: row[7] || "", Website: row[8] || "",
                    Facebook: row[9] || "", Bio: row[10] || "", CouponText: row[11] || "",
                    Established: row[12] || "", CouponLink: row[13] || ""
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
        const townName = biz.Town.trim();
        const style = townStyles[townName] || { bg: "#d3d3d3", text: "#1a1a1a" };
        const inlineStyle = `style="background-color: ${style.bg}; color: ${style.text}; font-weight: bold; text-align: center; border-top: 1px solid #999; border-bottom: 1px solid #999;"`;

        let clickAction = (tierL === 'premium' || (biz.CouponLink && biz.CouponLink !== "")) 
                    ? `onclick="openFullModal('${biz.Name.replace(/'/g, "\\'")}')"` : "";

        return `
        <div class="card ${tierL}" ${clickAction} style="cursor: ${clickAction ? 'pointer' : 'default'}">
            <div class="tier-badge">${biz.Tier}</div> 
            <div class="logo-box">${getSmartLogo(biz.ImageID, biz.Name)}</div>
            <div class="town-bar" ${inlineStyle}>${biz.Town}</div> 
            <div class="biz-name">${biz.Name}</div> 
            ${(tierL === 'premium' || tierL === 'plus') ? `<div class="biz-phone">📞 ${biz.Phone}</div>` : ''}
            <div class="cat-text">${catEmojis[biz.Category] || "📁"} ${biz.Category}</div> 
        </div>`;
    }).join('');
}

function applyFilters() {
    const cat = document.getElementById('cat-select').value;
    const town = document.getElementById('town-select').value;
    const filtered = masterData.filter(b => (cat === 'All' || b.Category === cat) && (town === 'All' || b.Town === town));
    renderDirectoryGrid(filtered);
}
