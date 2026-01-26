/**
 * 1. PROJECT CONFIGURATION
 * This section connects your code to your external data sources.
 * If you rename your GitHub repo or change your Google Sheet, update these URLs.
 */
let masterData = []; // Storage for spreadsheet data once it's loaded

// Link to your GitHub image folder (Raw version so the browser can display files)
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

// The "Published" CSV link from your Google Sheet
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

// The universal coupon image used for all businesses with a discount
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

/**
 * 2. BRAND & CATEGORY SETTINGS
 * Syncs Category names (Column E) to Emojis and handles shared logos.
 */
// Brands that share one logo (e.g., all Casey's locations use the same image)
const sharedBrands = ["casey's", "mcdonald's", "huck's", "subway", "dollar general", "mach 1"];

// Maps your Category names (from Column E) to Emojis for the cards
const catEmojis = {
    "Auto Repair": "🔧",
    "Beauty Saloon": "💇",
    "Barber": "💈",
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
    "Agriculture": "🚜",
    "Financial Services": "💰",
    "Professional Services": "💼"
};

/**
 * 3. INITIALIZATION
 * These functions run as soon as the website page finishes loading.
 */
document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader(); // Sets the date in the top bar
    loadDirectory();         // Starts fetching the Google Sheet data
});

/**
 * 4. NEWSPAPER HEADER LOGIC
 * Automatically finds the current date and puts it in your "VOL. 1" header.
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
 * Tries .jpeg -> .png -> .jpg for universal image support from your GitHub.
 */
function getSmartImage(id, bizName, isProfile = false) {
    if (!id && !bizName) return `https://via.placeholder.com/${isProfile ? '250' : '150'}?text=Logo+Pending`;
    
    let fileName = id.trim().toLowerCase(); // Matches GitHub lowercase file naming
    const nameLower = bizName ? bizName.toLowerCase() : "";

    // Brand logic for shared logos (Subway, Casey's, etc.)
    const brandMatch = sharedBrands.find(brand => nameLower.includes(brand));
    if (brandMatch) { fileName = brandMatch.replace(/['\s]/g, ""); }

    const placeholder = `https://via.placeholder.com/${isProfile ? '250' : '150'}?text=Logo+Pending`;
    const primaryUrl = `${imageRepo}${fileName}.jpeg`;
    
    // Attempt 1: .jpeg -> Attempt 2: .png -> Attempt 3: .jpg -> Fallback: Placeholder
    return `<img src="${primaryUrl}" 
            class="${isProfile ? 'profile-logo' : ''}" 
            onerror="this.onerror=null; 
            this.src='${imageRepo}${fileName}.png'; 
            this.onerror=function(){
                this.onerror=null; 
                this.src='${imageRepo}${fileName}.jpg';
                this.onerror=function(){this.src='${placeholder}'};
            };">`;
}

/**
 * 6. DATA LOADING & AUTO-SYNC ENGINE
 * Uses PapaParse to read your Google Sheet. It also triggers the dynamic category menu.
 */
async function loadDirectory() {
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Filters out empty rows
            masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
            
            // AUTOMATION: Builds the category dropdown based on Column E of your sheet
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
 * 7. DYNAMIC CATEGORY GENERATOR
 * This scans Column E of your sheet and updates the HTML dropdown automatically.
 */
function generateCategoryDropdown(data) {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;

    // Get unique categories from Column E, ignore empty ones
    const categories = [...new Set(data.map(biz => (biz.Category || "Other").trim()))];
    
    // Keep "All Industries" at the top and clear the rest
    catSelect.innerHTML = '<option value="All">📂 All Industries</option>';

    // Sort alphabetically and add to the menu
    categories.sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        const emoji = catEmojis[cat] || "📁";
        option.textContent = `${emoji} ${cat}`;
        catSelect.appendChild(option);
    });
}

/**
 * 8. RENDER MAIN DIRECTORY (index.html)
 * Builds the cards. Plus tier only reveals the phone number.
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // Defines display order (Premium first)
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
        const category = (biz.Category || "Industry").trim();

        // Premium cards link to profiles, Plus cards expand on click
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
 * 9. PROFILE PAGE ENGINE (profile.html)
 * Detailed view for Premium members including Hours and Establishment dates.
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
    const category = biz.Category || "Industry";

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
 * Syncs the dropdowns with Column C (Town) and Column E (Category).
 */
function applyFilters() {
    const selectedTown = document.getElementById('town-select').value;
    const selectedCat = document.getElementById('cat-select').value;

    const filtered = masterData.filter(biz => {
        // Clean spreadsheet data for comparison (removes extra spaces)
        const sheetCat = (biz.Category || "").trim();
        const sheetTown = (biz.Town || "").trim();
        
        const matchTown = (selectedTown === 'All' || sheetTown.toLowerCase() === selectedTown.toLowerCase());
        const matchCat = (selectedCat === 'All' || sheetCat === selectedCat);

        return matchTown && matchCat;
    });

    renderCards(filtered);
}

// Resets all menus to "All"
function resetFilters() {
    document.getElementById('town-select').value = 'All';
    document.getElementById('cat-select').value = 'All';
    renderCards(masterData);
}
