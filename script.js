/**
 * 1. PROJECT CONFIGURATION
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

/**
 * 2. MASTER CATEGORY LIST (With Emoji Mapping)
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
 * 3. CATEGORY MAPPING LOGIC
 * Fixes the "Searching..." bug by mapping it to a real category.
 */
function mapCategory(raw) {
    if (!raw || raw === "Searching..." || raw === "N/A") return "Professional Services";
    const val = raw.toLowerCase().trim();

    if (val.includes("city hall") || val.includes("court") || val.includes("government")) return "Government";
    if (val.includes("restaurant") || val.includes("bar") || val.includes("saloon")) return "Restaurants";
    if (val.includes("medical") || val.includes("healthcare")) return "Healthcare";
    if (val.includes("flower") || val.includes("pottery") || val.includes("store")) return "Stores";
    if (val.includes("legion") || val.includes("non-profit")) return "Non-Profit";
    if (val.includes("factory") || val.includes("manufacturing") || val.includes("delivery")) return "Manufacturing";
    
    return raw; 
}

/**
 * 4. INITIALIZATION
 */
document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader();
    loadDirectory();
});

async function loadDirectory() {
    const cacheBuster = new Date().getTime();
    Papa.parse(`${baseCsvUrl}&cb=${cacheBuster}`, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Formula Header Cleanup
            const cleaned = results.data.map(row => {
                const newRow = {};
                Object.keys(row).forEach(key => {
                    newRow[key.trim()] = row[key]; 
                });
                return newRow;
            });

            // Filter out empty formula rows
            masterData = cleaned.filter(row => row.Name && row.Name !== "" && row.Name !== "Searching...");
            renderCards(masterData);
        }
    });
}

/**
 * 5. RENDERING ENGINE (Fixes the Blank Town Bars)
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.map(biz => {
        const tier = (biz.Tier || biz.Teir || 'basic').toLowerCase();
        
        // Fix: If Town is "Searching..." or blank, default to "Clay County"
        let town = (biz.Town || biz.town || "").trim();
        if (town === "" || town === "Searching..." || town === "UNKNOWN") town = "Clay County";
        
        const townClass = town.toLowerCase().replace(/\s+/g, '-');
        const displayCat = mapCategory(biz.Category || biz.category);

        return `
            <div class="card ${tier}">
                <div class="tier-badge">${tier}</div>
                <div class="logo-box">${getSmartImage(biz['Image ID'], biz.Name)}</div>
                <div class="town-bar ${townClass}-bar">${town}</div>
                <h2>${biz.Name}</h2>
                <div style="margin-top: auto; font-weight: bold; font-style: italic; color: #333;">
                    ${catEmojis[displayCat] || "📁"} ${displayCat}
                </div>
            </div>`;
    }).join('');
}

function getSmartImage(id, bizName) {
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    if (!id || id === "N/A") return `<img src="${placeholder}">`;
    return `<img src="${imageRepo}${id.trim().toLowerCase()}.jpeg" onerror="this.src='${placeholder}'">`;
}

function updateNewspaperHeader() {
    const header = document.getElementById('header-info');
    if(header) header.innerText = `VOL. 1 | ${new Date().toLocaleDateString()}`;
}
