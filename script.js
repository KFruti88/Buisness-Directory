/**
 * 1. PROJECT CONFIGURATION
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

/**
 * 2. CATEGORY SETTINGS
 */
const sharedBrands = ["casey's", "mcdonald's", "huck's", "subway", "dollar general", "mach 1"];

const catEmojis = {
    "Agriculture": "🚜",
    "Auto Parts": "⚙️",
    "Auto Repair": "🔧",
    "Bars/Saloon": "🍺",
    "Beauty Salon / Barber Shop": "💇",
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
    "USPS/Post Office": "📬"
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
 * 6. CATEGORY DROPDOWN GENERATOR
 */
function generateCategoryDropdown(data) {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;

    const categories = [...new Set(data.map(biz => (biz.Category || "Other").trim()))];
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
 * 8. RENDER MAIN DIRECTORY (Tier-Priority Sorting)
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    const tierOrder = { 
        "premium": 1, 
        "plus": 2, 
        "basic": 3 
    };

    grid.innerHTML = data.sort((a, b) => {
        const tierA = (a.Teir || 'basic').toLowerCase();
        const tierB = (b.Teir || 'basic').toLowerCase();

        // Sort by Tier first
        if (tierOrder[tierA] !== tierOrder[tierB]) {
            return tierOrder[tierA] - tierOrder[tierB];
        }
        // Then sort alphabetically by Town within the tier
        return (a.Town || "").localeCompare(b.Town || "");

    }).map(biz => {
        const tier = (biz.Teir || 'basic').toLowerCase();
        const hasCoupon = biz.Coupon && biz.Coupon !== "N/A" && biz.Coupon.trim() !== "";
        const townClass = (biz.Town || "unknown").toLowerCase().replace(/\s+/g, '-');
        const imageID = (biz['Image ID'] || "").trim();
        const category = (biz.Category || "Other").trim();
        const displayEmoji = catEmojis[category] || "📁";

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
                    ${displayEmoji} ${category}
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

    const category = (biz.Category || "Other").trim();
    const displayEmoji = catEmojis[category] || "📂";

    wrap.innerHTML = `
        <div class="profile-container">
            <div class="tier-indicator">${biz.Teir} Member</div>
            <a href="index.html" class="back-link">← BACK TO DIRECTORY</a>
            <div class="profile-header">
                <div class="profile-logo-box">${getSmartImage(biz['Image ID'], biz.Name, true)}</div>
                <div>
                    <h1 class="biz-title">${biz.Name}</h1>
                    <p class="biz-meta">${displayEmoji} ${category} | ${biz.Town}</p>
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
                    ${biz.Coupon && biz.Coupon !== "N/A" ? `<div style="text-align:center;"><img src="${couponImg}" style="width:80px;"><p>Special Offer!</p></div>` : '<p>No current coupons.</p>'}
                </div>
            </div>
            ${biz.Bio && biz.Bio !== "N/A" ? `<div class="info-section"><h3>About Us</h3><div class="bio-box">${biz.Bio}</div></div>` : ''}
            ${biz.Address && biz.Address !== "N/A" ? `<div class="info-section"><h3>Location</h3><div class="map-box"><iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${encodeURIComponent(biz.Address + " " + (biz.Town || "") + " IL")}&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe></div></div>` : ''}
        </div>`;
}

/**
 * 10. FILTER LOGIC
 */
function applyFilters() {
    const selectedTown = document.getElementById('town-select').value;
    const selectedCat = document.getElementById('cat-select').value;

    const filtered = masterData.filter(biz => {
        const sheetCat = (biz.Category || "Other").trim();
        const sheetTown = (biz.Town || "").trim().toLowerCase();
        
        const matchTown = (selectedTown === 'All' || sheetTown === selectedTown.toLowerCase());
        const matchCat = (selectedCat === 'All' || sheetCat === selectedCat);

        return matchTown && matchCat;
    });

    renderCards(filtered);
}
