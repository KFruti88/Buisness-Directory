/**
 * 1. PROJECT CONFIGURATION
 * This section connects your code to your external data sources.
 */
let masterData = []; // Storage for spreadsheet data

// Your GitHub image repository path
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

// The Published CSV link from your Google Sheet
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

// The badge used for businesses with active coupons
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

/**
 * 2. BRAND & CATEGORY SETTINGS
 * Syncs Category names (Column E) to Emojis and handles shared logos.
 */
const sharedBrands = ["casey's", "mcdonald's", "huck's", "subway", "dollar general", "mach 1"];

const catEmojis = {
    "Emergency": "🚨", "Manufacturing": "🏗️", "Bars": "🍺", "Professional Services": "💼",
    "Financial Services": "💰", "Retail": "🛒", "Shopping": "🛍️", "Restaurants": "🍴",
    "Church": "⛪", "Post Office": "📬", "Healthcare": "🏥", "Support Services": "🛠️",
    "Internet": "🌐", "Gas Station": "⛽", "Industry": "🏭", "Agriculture": "🚜",
    "Wholesale": "📦", "Education": "🎓"
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
 * Updates the date automatically.
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
 * Tries .jpeg -> .png -> .jpg for universal image support.
 */
function getSmartImage(id, bizName, isProfile = false) {
    if (!id && !bizName) return `https://via.placeholder.com/${isProfile ? '250' : '150'}?text=Logo+Pending`;
    
    let fileName = id.trim().toLowerCase();
    const nameLower = bizName ? bizName.toLowerCase() : "";

    const brandMatch = sharedBrands.find(brand => nameLower.includes(brand));
    if (brandMatch) {
        fileName = brandMatch.replace(/['\s]/g, ""); 
    }

    const placeholder = `https://via.placeholder.com/${isProfile ? '250' : '150'}?text=Logo+Pending`;
    const primaryUrl = `${imageRepo}${fileName}.jpeg`;
    
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
 * 6. DATA LOADING ENGINE
 */
async function loadDirectory() {
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
            
            if (document.getElementById('directory-grid')) {
                renderCards(masterData);
            } else if (document.getElementById('profile-wrap')) {
                loadProfile(masterData);
            }
        }
    });
}

/**
 * 7. RENDER MAIN DIRECTORY (index.html)
 * Plus cards only show the phone number in the reveal.
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
        const category = (biz.Category || "Industry").trim();

        let clickAttr = "";
        if (tier === 'premium') {
            clickAttr = `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID.toLowerCase())}'"`;
        } else if (tier === 'plus') {
            clickAttr = `onclick="this.classList.toggle('expanded')"`;
        }

        return `
            <div class="card ${tier}" ${clickAttr} style="cursor: ${tier !== 'basic' ? 'pointer' : 'default'};">
                <div class="tier-badge">${tier}</div>
                ${hasCoupon ? `<img src="${couponImg}" class="coupon-badge" alt="Discount">` : ''}
                <div class="logo-box">${getSmartImage(imageID, biz.Name)}</div>
                <div class="town-bar ${townClass}-bar">${biz.Town || 'Unknown'}</div>
                <h2 style="font-size: 1.4rem; margin: 5px 0;">${biz.Name}</h2>
                
                ${tier === 'plus' ? `
                    <div class="plus-reveal">
                        <p><strong>Phone:</strong> ${biz.Phone || 'N/A'}</p>
                    </div>` : ''}

                <div style="margin-top: auto; font-style: italic; font-size: 0.85rem; color: #444;">
                    ${catEmojis[category] || "📁"} ${category}
                </div>
            </div>`;
    }).join('');
}

/**
 * 8. PROFILE PAGE ENGINE (profile.html)
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
            ${biz.Bio && biz.Bio !== "N/A" ? `<div><h3>About Us</h3><div class="bio-box">${biz.Bio}</div></div>` : ''}
            ${biz.Address && biz.Address !== "N/A" ? `<div><h3>Location</h3><div class="map-box"><iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${encodeURIComponent(biz.Address + " " + (biz.Town || "") + " IL")}&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe></div></div>` : ''}
        </div>`;
}

/**
 * 9. BULLETPROOF FILTER LOGIC
 * Syncs the dropdowns with Column C (Town) and Column E (Category).
 */
function applyFilters() {
    const selectedTown = document.getElementById('town-select').value;
    const selectedCat = document.getElementById('cat-select').value;

    const filtered = masterData.filter(biz => {
        // Clean spreadsheet data for comparison (lowercase & no extra spaces)
        const sheetCat = (biz.Category || "").trim().toLowerCase();
        const sheetTown = (biz.Town || "").trim().toLowerCase();
        
        // Match Town (All or exact match)
        const matchTown = (selectedTown === 'All' || sheetTown === selectedTown.toLowerCase());
        
        // Match Category (All or exact match)
        const matchCat = (selectedCat === 'All' || sheetCat === selectedCat.toLowerCase());

        return matchTown && matchCat;
    });

    renderCards(filtered);
}

function resetFilters() {
    document.getElementById('town-select').value = 'All';
    document.getElementById('cat-select').value = 'All';
    renderCards(masterData);
}
