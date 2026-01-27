/**
 * 1. PROJECT CONFIGURATION
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
// UPDATED URL: Using the exact raw CSV endpoint to prevent 404 errors
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

/**
 * 2. MASTER CATEGORY LIST
 * This is the final display list for the directory.
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
    "Propane": "🔥",
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
 * Merges raw spreadsheet entries into your defined Master List.
 */
function mapCategory(raw) {
    if (!raw) return "Professional Services";
    const val = raw.toLowerCase().trim();

    if (val.includes("city hall") || val.includes("court") || val.includes("government")) return "Government";
    if (val.includes("restaurant") || val.includes("bar") || val.includes("saloon") || val.includes("grill")) return "Restaurants";
    if (val.includes("medical") || val.includes("healthcare") || val.includes("hospital") || val.includes("clinic")) return "Healthcare";
    if (val.includes("flower") || val.includes("pottery") || val.includes("art") || val.includes("store") || val.includes("boutique")) return "Stores";
    if (val.includes("carwash") || val.includes("laundry") || val.includes("laundromat")) return "Carwash";
    if (val.includes("legion") || val.includes("charity") || val.includes("foundation") || val.includes("non-profit")) return "Non-Profit";
    if (val.includes("factory") || val.includes("warehouse") || val.includes("delivery") || val.includes("manufacturing")) return "Manufacturing";
    if (val.includes("post office") || val.includes("usps")) return "USPS/Post Office";
    
    // Default fallback: return the original string capitalized if no match
    return raw.charAt(0).toUpperCase() + raw.slice(1); 
}

/**
 * 4. INITIALIZATION
 */
document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader();
    loadDirectory();
});

/**
 * 5. DATA LOADING ENGINE
 */
async function loadDirectory() {
    const grid = document.getElementById('directory-grid');
    const cacheBuster = new Date().getTime();
    const finalUrl = `${baseCsvUrl}&cachebuster=${cacheBuster}`;

    Papa.parse(finalUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Filter out empty rows or rows without a Business Name
            masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
            
            if (masterData.length === 0) {
                if(grid) grid.innerHTML = "<h2 style='text-align:center;'>Waiting for Data...</h2>";
                return;
            }

            generateCategoryDropdown();

            if (grid) {
                renderCards(masterData);
            } else if (document.getElementById('profile-wrap')) {
                loadProfile(masterData);
            }
        },
        error: (err) => {
            console.error("Critical Load Error:", err);
            if(grid) grid.innerHTML = "<h2 style='text-align:center;'>System Offline - Check Connection</h2>";
        }
    });
}

function generateCategoryDropdown() {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;

    catSelect.innerHTML = '<option value="All">📂 All Industries</option>';
    // Build dropdown from your defined emoji list
    Object.keys(catEmojis).sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = `${catEmojis[cat]} ${cat}`;
        catSelect.appendChild(option);
    });
}

/**
 * 6. RENDERING ENGINE
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    const tierOrder = { "premium": 1, "plus": 2, "basic": 3 };

    grid.innerHTML = data.sort((a, b) => {
        const tierA = (a.Tier || a.Teir || 'basic').toLowerCase();
        const tierB = (b.Tier || b.Teir || 'basic').toLowerCase();
        
        if (tierOrder[tierA] !== tierOrder[tierB]) {
            return tierOrder[tierA] - tierOrder[tierB];
        }
        return (a.Name || "").localeCompare(b.Name || "");

    }).map(biz => {
        const tier = (biz.Tier || biz.Teir || 'basic').toLowerCase();
        const townName = (biz.Town || biz.town || "Clay County").trim();
        const townClass = townName.toLowerCase().replace(/\s+/g, '-');
        const mappedCat = mapCategory(biz.Category || biz.category);
        const imageID = (biz['Image ID'] || "").trim();

        return `
            <div class="card ${tier}" ${tier === 'premium' ? `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID.toLowerCase())}'"` : ''}>
                <div class="tier-badge">${tier}</div>
                <div class="logo-box">${getSmartImage(imageID, biz.Name)}</div>
                <div class="town-bar ${townClass}-bar">${townName}</div>
                <h2>${biz.Name}</h2>
                <div style="margin-top: auto; font-style: italic; font-size: 0.9rem; color: #222; font-weight: bold;">
                    ${catEmojis[mappedCat] || "📁"} ${mappedCat}
                </div>
            </div>`;
    }).join('');
}

/**
 * 7. UTILITIES & FILTERS
 */
function applyFilters() {
    const selectedTown = document.getElementById('town-select').value;
    const selectedCat = document.getElementById('cat-select').value;
    const searchBar = document.getElementById('search-bar');
    const searchVal = searchBar ? searchBar.value.toLowerCase() : "";

    const filtered = masterData.filter(biz => {
        const bizTown = (biz.Town || biz.town || "").trim();
        const bizCat = mapCategory(biz.Category || biz.category);
        const bizName = (biz.Name || "").toLowerCase();

        const matchTown = (selectedTown === 'All' || bizTown === selectedTown);
        const matchCat = (selectedCat === 'All' || bizCat === selectedCat);
        const matchSearch = bizName.includes(searchVal);

        return matchTown && matchCat && matchSearch;
    });
    renderCards(filtered);
}

function getSmartImage(id, bizName) {
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    if (!id) return `<img src="${placeholder}">`;
    let fileName = id.trim().toLowerCase();
    return `<img src="${imageRepo}${fileName}.jpeg" 
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
