/**
 * 1. PROJECT CONFIGURATION
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

/**
 * 2. MASTER CATEGORY LIST
 */
const catEmojis = {
    "Agriculture": "🚜", "Auto Parts": "⚙️", "Auto Repair": "🔧", "Bars/Saloon": "🍺",
    "Beauty Salon": "💇", "Carwash": "🧼", "Church": "⛪", "Community": "👥",
    "Delivery": "🚚", "Education & Health": "📚", "Executive & Administrative": "🏛️",
    "Financial Services": "💰", "Flower Shop": "💐", "Freight Trucking": "🚛",
    "Gambiling Industries": "🎰", "Gas Station": "⛽", "Government": "🏛️",
    "Handmade Ceramics & Pottery": "🏺", "Healthcare": "🏥", "Insurance": "📄",
    "Internet": "🌐", "Legal Services": "⚖️", "Libraries and Archives": "📚",
    "Manufacturing": "🏗️", "Medical": "🏥", "Professional Services": "💼",
    "Propane": "🔥", "Public Safety & Justice": "⚖️", "Public Works & Infrastructure": "🏗️",
    "Restaurants": "🍴", "Storage": "📦", "Stores": "🛍️", "USPS/Post Office": "📬",
    "Non-Profit": "📝"
};

/**
 * 3. CATEGORY MAPPING
 */
function mapCategory(raw) {
    if (!raw || raw === "Searching..." || raw === "N/A") return "Professional Services";
    const val = raw.toLowerCase().trim();
    if (val.includes("city hall") || val.includes("court") || val.includes("government")) return "Government";
    if (val.includes("restaurant") || val.includes("bar") || val.includes("saloon")) return "Restaurants";
    if (val.includes("medical") || val.includes("healthcare")) return "Healthcare";
    if (val.includes("flower") || val.includes("pottery") || val.includes("store")) return "Stores";
    if (val.includes("legion") || val.includes("non-profit")) return "Non-Profit";
    if (val.includes("factory") || val.includes("warehouse") || val.includes("delivery") || val.includes("manufacturing")) return "Manufacturing";
    return raw; 
}

/**
 * 4. INITIALIZATION & CACHE BUSTING
 */
document.addEventListener("DOMContentLoaded", () => {
    loadDirectory();
});

async function loadDirectory() {
    const cacheBuster = new Date().getTime(); // Forced cache clean
    
    Papa.parse(`${baseCsvUrl}&cb=${cacheBuster}`, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Header Normalization Engine
            masterData = results.data.map(row => {
                let obj = {};
                for (let key in row) {
                    let cleanKey = key.trim().replace(/\s+/g, '').toLowerCase();
                    obj[cleanKey] = row[key];
                }
                return obj;
            }).filter(row => row.name && row.name !== "" && row.name !== "Searching...");

            renderCards(masterData);
        }
    });
}

/**
 * 5. RENDERING ENGINE (Includes 90% Width & Height Logic)
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.map(biz => {
        const tier = (biz.tier || biz.teir || 'basic').toLowerCase();
        let townName = (biz.town || "").trim();
        if (townName === "" || townName === "Searching...") townName = "Clay County";
        
        const townClass = townName.toLowerCase().replace(/\s+/g, '-');
        const displayCat = mapCategory(biz.category || "");
        const imageID = (biz.imageid || "").trim();

        return `
            <div class="card ${tier}" 
                 style="width: 95%; max-width: 400px; height: 420px; margin: 10px auto; display: flex; flex-direction: column;"
                 ${tier === 'premium' ? `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID.toLowerCase())}'"` : ''}>
                
                <div class="tier-badge" style="font-size: 0.7rem;">${tier}</div>
                
                <div class="logo-box" style="height: 150px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${getSmartImage(imageID, biz.name)}
                </div>

                <div class="town-bar ${townClass}-bar" style="width: 100%; text-align: center; font-weight: bold; padding: 10px 0;">
                    ${townName}
                </div>

                <h2 style="font-size: 1.4rem; flex-grow: 1; display: flex; align-items: center; justify-content: center; text-align: center; margin: 10px 0;">
                    ${biz.name}
                </h2>

                <div class="category-footer" style="margin-top: auto; padding-bottom: 15px; font-weight: bold; font-style: italic; font-size: 0.9rem;">
                    ${catEmojis[displayCat] || "📁"} ${displayCat}
                </div>
            </div>`;
    }).join('');
}

function getSmartImage(id, bizName) {
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    if (!id || id === "N/A" || id === "Searching...") return `<img src="${placeholder}" style="max-height: 100%; max-width: 100%; object-fit: contain;">`;
    let fileName = id.trim().toLowerCase();
    return `<img src="${imageRepo}${fileName}.jpeg" 
                 style="max-height: 100%; max-width: 100%; object-fit: contain;"
                 onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; 
                 this.onerror=function(){this.src='${placeholder}'};">`;
}
