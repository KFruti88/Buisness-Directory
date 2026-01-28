/**
 * PROJECT: Clay County Directory Engine - Main Layout
 * VERSION: 1.33
 * FEATURES: 93% Width Row Centering, Transparent Bottoms, Live Sync, 450px Grid.
 */

let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

// --- LIVE DATA CONFIG WITH CACHE BUSTER ---
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
    
    // HEARTBEAT: Auto-sync every 5 mins
    setInterval(() => {
        console.log("Live Sync: Refreshing data...");
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
    return `<img src="${imageRepo}${fileName}.jpeg" style="max-height:100%; max-width:100%; object-fit:contain;" alt="${bizName}" 
            onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${placeholder}'};">`;
}

function getBizFontSize(name) {
    if (name.length > 35) return "0.95rem"; 
    if (name.length > 22) return "1.1rem";    
    return "1.3rem";                       
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
    
    // --- FORCE 93% WIDTH AND CENTERING ON THE ROW CONTAINER ---
    grid.style.width = "93%";
    grid.style.margin = "0 auto";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    grid.style.gap = "20px";

    const tierOrder = { "premium": 1, "plus": 2, "basic": 3 };

    grid.innerHTML = data.sort((a, b) => {
        const tA = a.Tier.toLowerCase();
        const tB = b.Tier.toLowerCase();
        return (tierOrder[tA] || 4) - (tierOrder[tB] || 4) || a.Town.localeCompare(b.Town);
    }).map(biz => {
        const tierL = biz.Tier.toLowerCase();
        const townName = biz.Town.trim();
        const style = townStyles[townName] || { bg: "#d3d3d3", text: "#1a1a1a" };
        const bizFontSize = getBizFontSize(biz.Name);
        let clickAction = (tierL === 'premium' || (biz.CouponLink && biz.CouponLink !== "")) 
                    ? `onclick="openFullModal('${biz.Name.replace(/'/g, "\\'")}')"` : "";

        return `
        <div class="card ${tierL}" ${clickAction} style="cursor: ${clickAction ? 'pointer' : 'default'}; height: 450px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #000; background: #fff;">
            <div class="tier-badge" style="position:absolute; top:5px; right:5px; font-size: 0.7rem; background:rgba(0,0,0,0.1); padding:2px 5px; border-radius:3px;">${biz.Tier}</div> 
            
            <div class="logo-box" style="height: 140px; display: flex; align-items: center; justify-content: center; padding: 15px;">
                ${getSmartLogo(biz.ImageID, biz.Name)}
            </div>

            <div class="town-bar" style="background-color: ${style.bg}; color: ${style.text}; height: 35px; display: flex; align-items: center; justify-content: center; text-transform: uppercase; font-weight: bold; font-size: 0.95rem; border-top: 2px solid #000; border-bottom: 2px solid #000;">
                ${biz.Town}
            </div> 

            <div class="biz-name" style="height: 90px; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: 800; padding: 10px; font-size: ${bizFontSize}; line-height: 1.2; font-family: 'Times New Roman', serif;">
                ${biz.Name}
            </div> 
            
            <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-around; padding: 10px; background: transparent;">
                ${(tierL === 'premium' || tierL === 'plus') ? `<div class="biz-phone" style="text-align:center; font-weight:bold; font-size: 1.1rem; color: #0c30f0;">📞 ${biz.Phone}</div>` : ''}
                <div class="cat-text" style="text-align:center; font-size: 0.9rem; color: #444;">
                    ${catEmojis[biz.Category] || "📁"} ${biz.Category}
                </div> 
            </div>
        </div>`;
    }).join('');
}

// 7. WEATHER WIDGET
async function getLocalWeather() {
    const weatherBox = document.getElementById('weather-box');
    if (!weatherBox) return;
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.66&longitude=-88.48&current_weather=true');
        const data = await response.json();
        if (data.current_weather) {
            weatherBox.innerHTML = ` | 🌡️ Flora: ${Math.round((data.current_weather.temperature * 9/5) + 32)}°F`;
        }
    } catch (e) { console.log("Weather failed"); }
}
