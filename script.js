/**
 * 1. PROJECT CONFIGURATION
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

/**
 * 2. CATEGORY EMOJI MAPPING
 * Ensure these names match your "Category" column in Google Sheets exactly.
 */
const catEmojis = {
    "Agriculture": "🚜",
    "Auto Parts": "⚙️",
    "Auto Repair": "🔧",
    "Bars/Saloon": "🍺",
    "Beauty Salon / Barber Shop": "💇",
    "Carwash": "🧼",
    "Church": "⛪",
    "Community": "👥",
    "Education & Health": "📚",
    "Financial Services": "💰",
    "Flower Shop": "💐",
    "Freight Trucking": "🚛",
    "Healthcare": "🏥",
    "Insurance": "📄",
    "Manufacturing": "🏗️",
    "Non-Profit": "🤝",
    "Restaurants": "🍴",
    "Stores": "🛍️",
    "USPS/Post Office": "📬"
};

/**
 * 3. INITIALIZATION
 */
document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader();
    loadDirectory();
});

function updateNewspaperHeader() {
    const now = new Date();
    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const headerElement = document.getElementById('header-info');
    if(headerElement) {
        headerElement.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${dateString}`;
    }
}

/**
 * 4. SMART IMAGE HELPER
 */
function getSmartImage(id, bizName, isProfile = false) {
    const placeholder = `https://via.placeholder.com/${isProfile ? '250' : '150'}?text=Logo+Pending`;
    if (!id) return `<img src="${placeholder}" class="${isProfile ? 'profile-logo' : ''}">`;
    
    let fileName = id.trim().toLowerCase();
    const primaryUrl = `${imageRepo}${fileName}.jpeg`;
    
    return `<img src="${primaryUrl}" class="${isProfile ? 'profile-logo' : ''}" 
            onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; 
            this.onerror=function(){this.onerror=null; this.src='${imageRepo}${fileName}.jpg'; 
            this.onerror=function(){this.src='${placeholder}'};};">`;
}

/**
 * 5. DATA LOADING ENGINE (WITH CACHE BUSTER)
 */
async function loadDirectory() {
    const cacheBuster = new Date().getTime();
    const finalUrl = `${baseCsvUrl}&cachebuster=${cacheBuster}`;

    Papa.parse(finalUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            // SYNC CHECK: Ensure headers match your sheet
            // We trim headers to prevent hidden space errors
            masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
            
            generateCategoryDropdown(masterData);

            if (document.getElementById('directory-grid')) {
                renderCards(masterData);
            } else if (document.getElementById('profile-wrap')) {
                loadProfile(masterData);
            }
        }
    });
}

function generateCategoryDropdown(data) {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;

    // Pull unique categories, removing any "Searching" or empty strings
    const categories = [...new Set(data.map(biz => (biz.Category || "Other").trim()))];
    catSelect.innerHTML = '<option value="All">📂 All Industries</option>';

    categories.sort().forEach(cat => {
        if (cat === "" || cat === "undefined") return;
        const option = document.createElement('option');
        option.value = cat;
        const emoji = catEmojis[cat] || "📁"; 
        option.textContent = `${emoji} ${cat}`;
        catSelect.appendChild(option);
    });
}

/**
 * 6. RENDER CARDS
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
        const townName = (biz.Town || "Clay County").trim(); 
        const townClass = townName.toLowerCase().replace(/\s+/g, '-'); 
        const category = (biz.Category || "Other").trim(); 
        const imageID = (biz['Image ID'] || "").trim();

        return `
            <div class="card ${tier}" ${tier === 'premium' ? `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID.toLowerCase())}'"` : ''}>
                <div class="tier-badge">${tier}</div>
                <div class="logo-box">${getSmartImage(imageID, biz.Name)}</div>
                <div class="town-bar ${townClass}-bar">${townName}</div>
                <h2 style="font-size: 1.3rem;">${biz.Name}</h2>
                <div style="margin-top: auto; font-style: italic; font-size: 0.85rem; color: #444;">
                    ${catEmojis[category] || "📁"} ${category}
                </div>
            </div>`;
    }).join('');
}

/**
 * 7. PROFILE LOAD
 */
function loadProfile(data) {
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get('id');
    const wrap = document.getElementById('profile-wrap');
    if (!bizId || !wrap) return;

    const biz = data.find(b => b['Image ID'] && b['Image ID'].trim().toLowerCase() === bizId.toLowerCase());
    if (!biz) return;

    const category = (biz.Category || "Other").trim();
    const mapAddress = encodeURIComponent(`${biz.Address}, ${biz.Town}, IL`);

    wrap.innerHTML = `
        <div class="profile-container">
            <a href="index.html" class="back-link">← BACK TO DIRECTORY</a>
            <div class="profile-header">
                <div class="profile-logo-box">${getSmartImage(biz['Image ID'], biz.Name, true)}</div>
                <div>
                    <h1>${biz.Name}</h1>
                    <p>${catEmojis[category] || "📂"} ${category} | ${biz.Town}</p>
                </div>
            </div>
            <div class="details-grid">
                <div class="info-section">
                    <h3>Contact</h3>
                    <p>📞 ${biz.Phone}</p>
                    <p>📍 ${biz.Address}</p>
                    <p>⏰ ${biz['Business Hours'] || 'N/A'}</p>
                    ${biz.Website && biz.Website !== "N/A" ? `<a href="${biz.Website}" target="_blank" class="action-btn">Website</a>` : ''}
                </div>
                <div class="info-section">
                    <h3>Location</h3>
                    <iframe width="100%" height="300" frameborder="0" src="https://maps.google.com/maps?q=${mapAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
                </div>
            </div>
        </div>`;
}

function applyFilters() {
    const selectedTown = document.getElementById('town-select').value;
    const selectedCat = document.getElementById('cat-select').value;

    const filtered = masterData.filter(biz => {
        const matchTown = (selectedTown === 'All' || (biz.Town || "").trim() === selectedTown);
        const matchCat = (selectedCat === 'All' || (biz.Category || "").trim() === selectedCat);
        return matchTown && matchCat;
    });
    renderCards(filtered);
}
