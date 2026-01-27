/**
 * 1. PROJECT CONFIGURATION
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";
const placeholderImg = "https://via.placeholder.com/150?text=Member";

/**
 * 2. MASTER CATEGORY LIST & EMOJI SYNC
 */
const catEmojis = {
    "Agriculture": "🚜", "Airport": "🚁", "Automotive / Auto Sales": "🚗",
    "Auto Parts": "⚙️", "Auto Repair": "🔧", "Bars/Saloon": "🍺",
    "Beauty Salon / Barber": "💈💇", "Carwash": "🧼", "Church": "⛪",
    "Community": "👥", "Delivery": "🚚", "Education & Health": "📚",
    "Executive & Administrative": "🏛️", "Financial Services": "💰",
    "Flower Shop": "💐", "Freight Trucking": "🚛", "Gambling Industries": "🎰",
    "Gas Station": "⛽", "Government": "🏛️", "Handmade Ceramics & Pottery": "🏺",
    "Healthcare": "🏥", "Insurance": "📄", "Internet": "🌐", "Legal Services": "⚖️",
    "Libraries and Archives": "📚", "Manufacturing": "🏗️", "Medical": "🏥",
    "Non-Profit": "📝", "Professional Services": "💼", "Utility/Gas": "🔥",
    "Public Safety & Justice": "⚖️", "Public Works & Infrastructure": "🏗️",
    "Restaurants": "🍴", "Storage": "📦", "Stores": "🛍️", "USPS/Post Office": "📬"
};

/**
 * 3. CATEGORY MAPPING LOGIC
 */
function mapCategory(raw) {
    if (!raw || raw === "Searching..." || raw === "N/A") return "Professional Services";
    const val = raw.toLowerCase().trim();
    if (val.includes("airport") || val.includes("hangar")) return "Airport";
    if (val.includes("car sales") || val.includes("automotive") || val.includes("dealership")) return "Automotive / Auto Sales";
    if (val.includes("barber") || val.includes("haircut") || val.includes("salon")) return "Beauty Salon / Barber";
    if (val.includes("city hall") || val.includes("court") || val.includes("government")) return "Government";
    if (val.includes("restaurant") || val.includes("bar") || val.includes("saloon")) return "Restaurants";
    if (val.includes("medical") || val.includes("healthcare")) return "Healthcare";
    if (val.includes("factory") || val.includes("warehouse") || val.includes("manufacturing")) return "Manufacturing";
    if (val.includes("propane") || val.includes("gas") || val.includes("utility")) return "Utility/Gas";
    if (val.includes("legion") || val.includes("non-profit")) return "Non-Profit";
    return raw; 
}

/**
 * 4. INITIALIZATION & DATA LOADING
 */
document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader();
    loadDirectory();
    setupModalClose();
});

async function loadDirectory() {
    const cacheBuster = new Date().getTime();
    Papa.parse(`${baseCsvUrl}&cb=${cacheBuster}`, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Header Normalizer: Ensures 'tier' is found even if spelled 'Teir' or capitalized
            masterData = results.data.map(row => {
                let obj = {};
                for (let key in row) {
                    let cleanKey = key.trim().toLowerCase();
                    if (cleanKey === "teir") cleanKey = "tier"; 
                    obj[cleanKey] = row[key];
                }
                return obj;
            }).filter(row => row.name && row.name.trim() !== "");

            generateCategoryDropdown();
            renderCards(masterData);
        }
    });
}

/**
 * 5. TIER-BASED RENDERING ENGINE (PINNED TIERS)
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // PINNING LOGIC: Premium (1), Plus (2), Basic (3)
    const tierPriority = { "premium": 1, "plus": 2, "basic": 3 };

    const sortedData = [...data].sort((a, b) => {
        const tierA = (a.tier || 'basic').toLowerCase();
        const tierB = (b.tier || 'basic').toLowerCase();
        
        // First sort by Tier Priority
        if (tierPriority[tierA] !== tierPriority[tierB]) {
            return tierPriority[tierA] - tierPriority[tierB];
        }
        // Then sort alphabetically by Business Name
        return (a.name || "").localeCompare(b.name || "");
    });

    grid.innerHTML = sortedData.map((biz, index) => {
        const tier = (biz.tier || 'basic').toLowerCase();
        let town = (biz.town || "Clay County").trim();
        town = town.split(',')[0].replace(" IL", "").trim();
        
        const townClass = town.toLowerCase().replace(/\s+/g, '-');
        const displayCat = mapCategory(biz.category);
        const hasCoupon = biz.coupon && biz.coupon !== "N/A" && biz.coupon !== "";

        let imageHtml = `<img src="${placeholderImg}" style="height:150px; object-fit:contain;">`;
        let phoneHtml = "";
        let premiumHint = "";
        let clickAction = "";

        if (tier === "plus" || tier === "premium") {
            imageHtml = getSmartImage(biz.imageid, biz.name);
            phoneHtml = `<p style="font-weight:bold; margin-top:5px; font-size:1.1rem;">📞 ${biz.phone || 'N/A'}</p>`;
        }

        if (tier === "premium") {
            premiumHint = `<div style="color:#0c30f0; font-weight:bold; margin-top:10px; text-decoration:underline;">Click for Details</div>`;
            clickAction = `onclick="openPremiumModal(${index})" style="cursor:pointer;"`;
        }

        return `
            <div class="card ${tier}" ${clickAction} style="width: 95%; max-width: 380px; height: 460px; margin: 10px auto; display: flex; flex-direction: column; position:relative;">
                <div class="tier-badge">${tier}</div>
                ${hasCoupon ? `<img src="${couponImg}" style="position:absolute; top:10px; right:10px; width:60px; z-index:5;">` : ""}
                
                <div class="logo-box" style="height: 160px; display: flex; align-items: center; justify-content: center; background:#f4f4f4; overflow:hidden;">
                    ${imageHtml}
                </div>

                <div class="town-bar ${townClass}-bar">${town}</div>

                <div style="flex-grow: 1; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align:center;">
                    <h2 style="margin:0; font-size:1.4rem; color:#222;">${biz.name}</h2>
                    ${phoneHtml}
                    ${premiumHint}
                </div>

                <div class="category-footer" style="padding-bottom:15px; font-weight:bold; font-style:italic; font-size:0.85rem;">
                    ${catEmojis[displayCat] || "📁"} ${displayCat}
                </div>
            </div>`;
    }).join('');
}

/**
 * 6. POP-OUT MODAL LOGIC (PREMIUM ONLY)
 */
function openPremiumModal(index) {
    const biz = masterData[index]; // Use masterData to ensure correct indexing
    const modal = document.getElementById('premium-modal');
    const content = document.getElementById('modal-body');
    if (!modal || !content) return;

    const mapAddress = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);
    
    const couponBox = (biz.coupon && biz.coupon !== "N/A") ? 
        `<div style="background:#fff3cd; border:2px dashed #856404; padding:15px; margin-bottom:15px; border-radius:8px; text-align:center;">
            <h3 style="margin:0;">🎟️ SPECIAL OFFER</h3><p style="font-size:1.2rem; margin:10px 0;">${biz.coupon}</p>
        </div>` : "";

    const websiteBtn = (biz.website && biz.website !== "N/A") ? 
        `<a href="${biz.website}" target="_blank" style="background:#0c30f0; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; display:inline-block; margin-right:10px;">Website</a>` : "";

    const facebookBtn = (biz.facebook && biz.facebook !== "N/A") ? 
        `<a href="${biz.facebook}" target="_blank" style="background:#3b5998; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; display:inline-block;">Facebook</a>` : "";

    content.innerHTML = `
        <div style="text-align:center;">
            <div style="height:120px; margin-bottom:10px;">${getSmartImage(biz.imageid, biz.name)}</div>
            <h1 style="font-family:'Playfair Display', serif; margin:0;">${biz.name}</h1>
            <p style="color:#666; font-size:1.1rem;">${biz.category} | ${biz.town}</p>
        </div>
        <hr style="margin:20px 0;">
        ${couponBox}
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:25px;">
            <div>
                <h3>Contact & Info</h3>
                <p><strong>📞 Phone:</strong> ${biz.phone}</p>
                <p><strong>📍 Address:</strong> ${biz.address}</p>
                <p><strong>⏰ Hours:</strong> ${biz.hours || 'N/A'}</p>
                ${biz.established && biz.established !== "N/A" ? `<p><strong>Established:</strong> ${biz.established}</p>` : ""}
                <div style="margin-top:20px;">${websiteBtn} ${facebookBtn}</div>
            </div>
            <div>
                <h3>Map Location</h3>
                <iframe width="100%" height="250" frameborder="0" style="border:1px solid #ddd; border-radius:8px;" src="https://maps.google.com/maps?q=${mapAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
            </div>
        </div>
        ${biz.bio && biz.bio !== "N/A" ? `<div style="margin-top:20px; padding-top:20px; border-top:1px solid #eee;"><h3>Our Story</h3><p style="line-height:1.6; font-size:1.05rem;">${biz.bio}</p></div>` : ""}
    `;

    modal.style.display = "flex";
}

function setupModalClose() {
    const modal = document.getElementById('premium-modal');
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
    const closeBtn = document.querySelector('.close-modal');
    if(closeBtn) closeBtn.onclick = () => { modal.style.display = "none"; };
}

/**
 * 7. CORE UTILITIES
 */
function getSmartImage(id, bizName) {
    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    if (!id || id === "N/A" || id === "Searching...") return `<img src="${placeholder}" style="max-height:100%; object-fit:contain;">`;
    let fileName = id.trim().toLowerCase();
    return `<img src="${imageRepo}${fileName}.jpeg" style="max-height:100%; object-fit:contain;" onerror="this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${placeholder}'};">`;
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

function updateNewspaperHeader() {
    const header = document.getElementById('header-info');
    if(header) {
        const now = new Date();
        header.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${now.toLocaleDateString()}`;
    }
}
