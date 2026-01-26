/**
 * 1. PROJECT CONFIGURATION
 * Connects to GitHub images and Google Sheets.
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

/**
 * 2. BRAND & CATEGORY SETTINGS
 * These names must match the "Grouped Names" we create in Section 6.
 */
const sharedBrands = ["casey's", "mcdonald's", "huck's", "subway", "dollar general", "mach 1"];

const catEmojis = {
    "Auto Repair": "🔧",
    "Beauty & Hair": "💇", // For Salon, Barber, Beauty
    "Bar & Saloon": "🍺",  // For Bars, Grills, Saloons
    "Agriculture": "🚜",
    "Handmade Ceramics & Pottery": "🏺",
    "Libraries and Archives": "📚",
    "Gambiling Industries": "🎰",
    "Freight Trucking": "🚛",
    "Insurance": "📄",
    "Flower Shop": "💐",
    "Storage": "📦",
    "Delivery": "🚚",
    "Propane": "🔥",
    "Emergency": "🚨",
    "Manufacturing": "🏗️",
    "Restaurants": "🍴",
    "Retail": "🛒",
    "Financial Services": "💰",
    "Professional Services": "💼"
};

/**
 * 3. INITIALIZATION
 */
document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader();
    loadDirectory();
});

/**
 * 4. NEWSPAPER HEADER LOGIC
 */
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
 * 5. SMART IMAGE HELPER
 */
function getSmartImage(id, bizName, isProfile = false) {
    if (!id && !bizName) return `https://via.placeholder.com/${isProfile ? '250' : '150'}?text=Logo+Pending`;
    let fileName = id.trim().toLowerCase();
    const nameLower = bizName ? bizName.toLowerCase() : "";
    const brandMatch = sharedBrands.find(brand => nameLower.includes(brand));
    if (brandMatch) { fileName = brandMatch.replace(/['\s]/g, ""); }
    const placeholder = `https://via.placeholder.com/${isProfile ? '250' : '150'}?text=Logo+Pending`;
    const primaryUrl = `${imageRepo}${fileName}.jpeg`;
    return `<img src="${primaryUrl}" class="${isProfile ? 'profile-logo' : ''}" onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.onerror=null; this.src='${imageRepo}${fileName}.jpg'; this.onerror=function(){this.src='${placeholder}'};};">`;
}

/**
 * 6. DYNAMIC CATEGORY GENERATOR (Smart Grouping)
 * This logic specifically separates Saloons (Drinking) from Salons (Hair).
 */
function getGroupedCategory(rawCat) {
    const low = (rawCat || "").trim().toLowerCase();
    if (!low) return "Other";

    // 1. HAIRCUTS & BEAUTY: Matches "Barber" and "Salon" (ending in N)
    if (low.includes("barber") || low === "salon" || low.includes("beauty")) {
        return "Beauty & Hair";
    }

    // 2. DRINKING SPOTS: Matches "Bar" and "Saloon" (ending in N)
    if (low.includes("bar") || low.includes("saloon") || low.includes("gambiling")) {
        return "Bar & Saloon";
    }

    // 3. AUTOMOTIVE
    if (low.includes("auto")) {
        return "Auto Repair";
    }
    
    // Default: use the original name from the sheet if no group matches
    return rawCat.trim();
}

function generateCategoryDropdown(data) {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;

    // Filter categories through our smart grouping logic
    const categories = [...new Set(data.map(biz => getGroupedCategory(biz.Category)))];
    
    catSelect.innerHTML = '<option value="All">📂 All Industries</option>';
    categories.sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        const emoji = catEmojis[cat] || "📁";
        option.textContent = `${emoji} ${cat}`;
        catSelect.appendChild(option);
    });
}

/**
 * 7. DATA LOADING ENGINE
 */
async function loadDirectory() {
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
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

/**
 * 8. RENDER MAIN DIRECTORY
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;
    const tierOrder = { "premium": 1, "plus": 2, "basic": 3 };
    grid.innerHTML = data.sort((a, b) => {
        const tierA = (a.Teir || 'basic').toLowerCase();
        const tierB = (b.Teir || 'basic').toLowerCase();
        if (tierOrder[tierA] !== tierOrder[tierB]) return tierOrder[tierA] - tierOrder[tierB];
        return (a.Town || "").localeCompare(b.Town || "");
    }).map(biz => {
        const tier = (biz.Teir || 'basic').toLowerCase();
        const hasCoupon = biz.Coupon && biz.Coupon !== "N/A" && biz.Coupon.trim() !== "";
        const townClass = (biz.Town || "unknown").toLowerCase().replace(/\s+/g, '-');
        const imageID = (biz['Image ID'] || "").trim();
        const category = getGroupedCategory(biz.Category);
        
        let clickAttr = tier === 'premium' ? 
            `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID.toLowerCase())}'"` : 
            (tier === 'plus' ? `onclick="this.classList.toggle('expanded')"` : "");

        return `
            <div class="card ${tier}" ${clickAttr} style="cursor: ${tier !== 'basic' ? 'pointer' : 'default'};">
                <div class="tier-badge">${tier}</div>
                ${hasCoupon ? `<img src="${couponImg}" class="coupon-badge" alt="Discount">` : ''}
                <div class="logo-box">${getSmartImage(imageID, biz.Name)}</div>
                <div class="town-bar ${townClass}-bar">${biz.Town || 'Unknown'}</div>
                <h2 style="font-size: 1.4rem; margin: 5px 0;">${biz.Name}</h2>
                ${tier === 'plus' ? `<div class="plus-reveal"><p><strong>Phone:</strong> ${biz.Phone || 'N/A'}</p></div>` : ''}
                <div style="margin-top: auto; font-style: italic; font-size: 0.85rem; color: #444;">
                    ${catEmojis[category] || "📁"} ${category}
                </div>
            </div>`;
    }).join('');
}

/**
 * 9. PROFILE PAGE ENGINE
 */
function loadProfile(data) {
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get('id');
    const wrap = document.getElementById('profile-wrap');
    if (!bizId || !wrap) return;

    const biz = data.find(b => b['Image ID'] && b['Image ID'].trim().toLowerCase() === bizId.toLowerCase());
    if (!biz) {
        wrap.innerHTML = `<div style="text-align:center;"><h2>Business Not Found</h2><a href="index.html">Back</a></div>`;
        return;
    }

    const hasCoupon = biz.Coupon && biz.Coupon !== "N/A" && biz.Coupon.trim() !== "";
    const category = getGroupedCategory(biz.Category);

    wrap.innerHTML = `
        <div class="profile-container">
            <div class="tier-indicator">${biz.Teir} Member</div>
            <a href="index.html" class="back-link">← BACK TO DIRECTORY</a>
            <div class="profile-header">
                <div class="profile-logo-box">${getSmartImage(biz['Image ID'], biz.Name, true)}</div>
                <div>
                    <h1 class="biz-title">${biz.Name}</h1>
                    <p class="biz-meta">${catEmojis[category] || "📂"} ${category} | ${biz.Town}</p>
                    <p class="biz-meta"><strong>Established:</strong> ${biz.Established || 'N/A'}</p>
                </div>
            </div>
            <div class="details-grid">
                <div class="info-section">
                    <h3>Contact & Hours</h3>
                    <div class="info-item"><strong>📞 Phone:</strong> ${biz.Phone}</div>
                    <div class="info-item"><strong>📍 Address:</strong><br>${biz.Address || 'N/A'}</div>
                    <div class="info-item"><strong>⏰ Hours:</strong><br>${biz['Business Hours'] || 'N/A'}</div>
                    ${biz.Website && biz.Website !== "N/A" ? `<a href="${biz.Website}" target="_blank" class="action-btn">Website</a>` : ''}
                    ${biz.Facebook && biz.Facebook !== "N/A" ? `<br><a href="${biz.Facebook}" target="_blank">Facebook</a>` : ''}
                </div>
                <div class="info-section">
                    <h3>Member Specials</h3>
                    ${hasCoupon ? `<div style="text-align:center;"><img src="${couponImg}" style="width:80px;"><p>Special Offer!</p></div>` : '<p>No current coupons.</p>'}
                </div>
            </div>
            ${biz.Bio && biz.Bio !== "N/A" ? `<div class="info-section"><h3>About Us</h3><div class="bio-box">${biz.Bio}</div></div>` : ''}
            ${biz.Address && biz.Address !== "N/A" ? `<div class="info-section"><h3>Location</h3><div class="map-box"><iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${encodeURIComponent(biz.Address + " " + (biz.Town || "") + " IL")}&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe></div></div>` : ''}
        </div>`;
}

/**
 * 10. BULLETPROOF FILTER LOGIC
 */
function applyFilters() {
    const selectedTown = document.getElementById('town-select').value;
    const selectedCat = document.getElementById('cat-select').value;
    const searchVal = document.getElementById('search-input') ? document.getElementById('search-input').value.toLowerCase() : "";

    const filtered = masterData.filter(biz => {
        const sheetCat = getGroupedCategory(biz.Category);
        const sheetTown = (biz.Town || "").trim().toLowerCase();
        const sheetName = (biz.Name || "").toLowerCase();
        
        const matchTown = (selectedTown === 'All' || sheetTown === selectedTown.toLowerCase());
        const matchCat = (selectedCat === 'All' || sheetCat === selectedCat);
        const matchSearch = sheetName.includes(searchVal);

        return matchTown && matchCat && matchSearch;
    });

    renderCards(filtered);
}
