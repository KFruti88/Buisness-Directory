/**
 * 1. PROJECT CONFIGURATION
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

/**
 * 2. CATEGORY DISPLAY SETTINGS
 * This is the master list of what people will actually see on the cards.
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
 * 3. CATEGORY MAPPING ENGINE
 * This merges your various spreadsheet categories into your display list.
 */
function mapCategory(rawCat) {
    if (!rawCat) return "Professional Services";
    const cat = rawCat.trim().toLowerCase();

    if (cat.includes("city hall") || cat.includes("court") || cat.includes("government")) return "Government";
    if (cat.includes("restaurant") || cat.includes("bar") || cat.includes("saloon") || cat.includes("grill")) return "Restaurants";
    if (cat.includes("medical") || cat.includes("healthcare") || cat.includes("hospital") || cat.includes("clinic")) return "Healthcare";
    if (cat.includes("flower") || cat.includes("pottery") || cat.includes("art") || cat.includes("boutique")) return "Stores";
    if (cat.includes("carwash") || cat.includes("laundry") || cat.includes("laundromat")) return "Carwash";
    if (cat.includes("legion") || cat.includes("charity") || cat.includes("foundation") || cat.includes("non-profit")) return "Non-Profit";
    if (cat.includes("factory") || cat.includes("warehouse") || cat.includes("delivery") || cat.includes("manufacturing")) return "Manufacturing";
    if (cat.includes("post office") || cat.includes("usps")) return "USPS/Post Office";

    // Fallback to the original name if no match found, capitalized
    return rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
}

/**
 * 4. INITIALIZATION & DATA LOADING
 */
document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader();
    loadDirectory();
});

async function loadDirectory() {
    const cacheBuster = new Date().getTime();
    const finalUrl = `${baseCsvUrl}&cachebuster=${cacheBuster}`;

    Papa.parse(finalUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
            generateCategoryDropdown();

            if (document.getElementById('directory-grid')) {
                renderCards(masterData);
            } else if (document.getElementById('profile-wrap')) {
                loadProfile(masterData);
            }
        }
    });
}

function generateCategoryDropdown() {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;

    catSelect.innerHTML = '<option value="All">📂 All Industries</option>';
    Object.keys(catEmojis).sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = `${catEmojis[cat]} ${cat}`;
        catSelect.appendChild(option);
    });
}

/**
 * 5. RENDERING ENGINE
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    const tierOrder = { "premium": 1, "plus": 2, "basic": 3 };

    grid.innerHTML = data.sort((a, b) => {
        const tierA = (a.Tier || a.Teir || 'basic').toLowerCase();
        const tierB = (b.Tier || b.Teir || 'basic').toLowerCase();
        if (tierOrder[tierA] !== tierOrder[tierB]) return tierOrder[tierA] - tierOrder[tierB];
        return (a.Name || "").localeCompare(b.Name || "");
    }).map(biz => {
        const tier = (biz.Tier || biz.Teir || 'basic').toLowerCase();
        const rawTown = biz.Town || biz.town || "Clay County";
        const townClass = rawTown.toLowerCase().replace(/\s+/g, '-');
        
        // Use the Mapping Engine for Categories
        const displayCategory = mapCategory(biz.Category || biz.category);
        const emoji = catEmojis[displayCategory] || "📁";

        const imageID = (biz['Image ID'] || biz['image id'] || "").trim();

        return `
            <div class="card ${tier}" ${tier === 'premium' ? `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID.toLowerCase())}'"` : ''}>
                <div class="tier-badge">${tier}</div>
                <div class="logo-box">${getSmartImage(imageID, biz.Name)}</div>
                <div class="town-bar ${townClass}-bar">${rawTown}</div>
                <h2>${biz.Name}</h2>
                <div style="margin-top: auto; font-style: italic; font-size: 0.9rem; color: #222; font-weight: bold;">
                    ${emoji} ${displayCategory}
                </div>
            </div>`;
    }).join('');
}

/**
 * 6. SMART IMAGE HELPER
 */
function getSmartImage(id, bizName) {
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    if (!id) return `<img src="${placeholder}">`;
    let fileName = id.trim().toLowerCase();
    return `<img src="${imageRepo}${fileName}.jpeg" onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${placeholder}'};">`;
}

function updateNewspaperHeader() {
    const now = new Date();
    const headerElement = document.getElementById('header-info');
    if(headerElement) {
        headerElement.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }
}

function applyFilters() {
    const selectedTown = document.getElementById('town-select').value;
    const selectedCat = document.getElementById('cat-select').value;

    const filtered = masterData.filter(biz => {
        const bizTown = (biz.Town || biz.town || "").trim();
        const bizCat = mapCategory(biz.Category || biz.category);
        
        const matchTown = (selectedTown === 'All' || bizTown === selectedTown);
        const matchCat = (selectedCat === 'All' || bizCat === selectedCat);
        return matchTown && matchCat;
    });
    renderCards(filtered);
}
