/**
 * 1. PROJECT CONFIGURATION
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

/**
 * 2. MASTER CATEGORY LIST & EMOJI SYNC
 * This is the source of truth for both the cards and the dropdown menu.
 */
const catEmojis = {
    "Agriculture": "🚜",
    "Auto Parts": "⚙️",
    "Auto Repair": "🔧",
    "Bars/Saloon": "🍺",
    "Beauty Salon": "💇",
    "Carwash": "🧼",
    "Church": "⛪",
    "Community": "👥",
    "Delivery": "🚚",
    "Education & Health": "📚",
    "Executive & Administrative": "🏛️",
    "Financial Services": "💰",
    "Flower Shop": "💐",
    "Freight Trucking": "🚛",
    "Gambiling Industries": "🎰",
    "Gas Station": "⛽",
    "Government": "🏛️",
    "Handmade Ceramics & Pottery": "🏺",
    "Healthcare": "🏥",
    "Insurance": "📄",
    "Internet": "🌐",
    "Legal Services": "⚖️",
    "Libraries and Archives": "📚",
    "Manufacturing": "🏗️",
    "Medical": "🏥",
    "Professional Services": "💼",
    "Utility/Gas": "🔥",
    "Public Safety & Justice": "⚖️",
    "Public Works & Infrastructure": "🏗️",
    "Restaurants": "🍴",
    "Storage": "📦",
    "Stores": "🛍️",
    "USPS/Post Office": "📬",
    "Non-Profit": "📝"
};

/**
 * 3. CATEGORY MAPPING LOGIC
 * This cleans up the data coming from your ARRAYFORMULAS.
 */
function mapCategory(raw) {
    if (!raw || raw === "Searching..." || raw === "N/A") return "Professional Services";
    const val = raw.toLowerCase().trim();

    if (val.includes("city hall") || val.includes("court") || val.includes("government")) return "Government";
    if (val.includes("restaurant") || val.includes("bar") || val.includes("saloon") || val.includes("grill")) return "Restaurants";
    if (val.includes("medical") || val.includes("healthcare") || val.includes("hospital") || val.includes("clinic")) return "Healthcare";
    if (val.includes("flower") || val.includes("pottery") || val.includes("art") || val.includes("store") || val.includes("boutique")) return "Stores";
    if (val.includes("carwash") || val.includes("laundry") || val.includes("laundromat")) return "Carwash";
    if (val.includes("legion") || val.includes("charity") || val.includes("foundation") || val.includes("non-profit")) return "Non-Profit";
    if (val.includes("factory") || val.includes("warehouse") || val.includes("delivery") || val.includes("manufacturing")) return "Manufacturing";
    if (val.includes("post office") || val.includes("usps")) return "USPS/Post Office";
    
    return raw; 
}

/**
 * 4. INITIALIZATION & DATA LOADING (WITH CLEAN CACHE)
 */
document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader();
    loadDirectory();
});

async function loadDirectory() {
    const grid = document.getElementById('directory-grid');
    const cacheBuster = new Date().getTime(); // The "Clean Cache" logic
    const finalUrl = `${baseCsvUrl}&cb=${cacheBuster}`;

    Papa.parse(finalUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Header Normalization: Fixes "UNKNOWN" Town bars caused by formula spacing
            masterData = results.data.map(row => {
                let obj = {};
                for (let key in row) {
                    let cleanKey = key.trim().replace(/\s+/g, '').toLowerCase();
                    obj[cleanKey] = row[key];
                }
                return obj;
            }).filter(row => row.name && row.name.trim() !== "" && row.name !== "Searching...");

            // Sync the Dropdown with the Emoji List
            generateCategoryDropdown();

            if (grid) {
                renderCards(masterData);
            }
        },
        error: (err) => {
            console.error("Critical Load Error:", err);
            if(grid) grid.innerHTML = "<h2 style='text-align:center;'>System Offline - Check Connection</h2>";
        }
    });
}

/**
 * 5. SYNCED DROPDOWN GENERATOR
 */
function generateCategoryDropdown() {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;

    // Reset dropdown and sync with the catEmojis list provided in the prompt
    catSelect.innerHTML = '<option value="All">📂 All Industries</option>';
    Object.keys(catEmojis).sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = `${catEmojis[cat]} ${cat}`;
        catSelect.appendChild(option);
    });
}

/**
 * 6. RENDERING ENGINE (MOBILE SETUP & SIZE LOCK)
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    const tierOrder = { "premium": 1, "plus": 2, "basic": 3 };

    grid.innerHTML = data.sort((a, b) => {
        const tierA = (a.tier || a.teir || 'basic').toLowerCase();
        const tierB = (b.tier || b.teir || 'basic').toLowerCase();
        if (tierOrder[tierA] !== tierOrder[tierB]) return tierOrder[tierA] - tierOrder[tierB];
        return (a.name || "").localeCompare(b.name || "");
    }).map(biz => {
        const tier = (biz.tier || biz.teir || 'basic').toLowerCase();
        
        // Fix: Extract town name and handle "Searching..." or missing data
        let townName = (biz.town || "").trim();
        if (townName === "" || townName === "Searching...") townName = "Clay County";
        
        // Strip " IL" or Zip if formula pulled too much
        townName = townName.split(',')[0].replace(" IL", "").trim();
        
        const townClass = townName.toLowerCase().replace(/\s+/g, '-');
        const displayCat = mapCategory(biz.category || "");
        const imageID = (biz.imageid || "").trim();

        // The card uses 95% mobile width and fixed height to prevent "shit look"
        return `
            <div class="card ${tier}" 
                 style="width: 95%; max-width: 380px; height: 420px; margin: 10px auto; display: flex; flex-direction: column;"
                 ${tier === 'premium' ? `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID.toLowerCase())}'"` : ''}>
                
                <div class="tier-badge">${tier}</div>
                
                <div class="logo-box" style="height: 150px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${getSmartImage(imageID, biz.name)}
                </div>

                <div class="town-bar ${townClass}-bar">${townName}</div>

                <h2 style="font-size: 1.3rem; flex-grow: 1; display: flex; align-items: center; justify-content: center; text-align: center; padding: 0 10px;">
                    ${biz.name}
                </h2>

                <div class="category-footer" style="padding-bottom: 15px; font-weight: bold; font-style: italic; font-size: 0.85rem;">
                    ${catEmojis[displayCat] || "📁"} ${displayCat}
                </div>
            </div>`;
    }).join('');
}

/**
 * 7. UTILITIES
 */
function getSmartImage(id, bizName) {
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    if (!id || id === "N/A" || id === "Searching...") return `<img src="${placeholder}" style="max-height: 100%; object-fit: contain;">`;
    let fileName = id.trim().toLowerCase();
    return `<img src="${imageRepo}${fileName}.jpeg" 
                 style="max-height: 100%; object-fit: contain;"
                 onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; 
                 this.onerror=function(){this.src='${placeholder}'};">`;
}

function updateNewspaperHeader() {
    const headerElement = document.getElementById('header-info');
    if(headerElement) {
        const now = new Date();
        headerElement.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }
}

function applyFilters() {
    const selectedTown = document.getElementById('town-select').value;
    const selectedCat = document.getElementById('cat-select').value;

    const filtered = masterData.filter(biz => {
        // Find Town regardless of capitalization
        const bizTown = (biz.town || "").trim();
        const bizCat = mapCategory(biz.category);

        const matchTown = (selectedTown === 'All' || bizTown === selectedTown);
        const matchCat = (selectedCat === 'All' || bizCat === selectedCat);

        return matchTown && matchCat;
    });
    renderCards(filtered);
}
