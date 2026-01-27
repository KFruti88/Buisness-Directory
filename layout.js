/**
 * LAYOUT.JS - TIER PINNING & VISUALS (FINAL IMAGE FIX)
 */
let masterData = [];

document.addEventListener("DOMContentLoaded", () => {
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

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // PINNING LOGIC: Premium (1), Plus (2), Basic (3)
    const tierPriority = { "premium": 1, "plus": 2, "basic": 3 };

    const sortedData = [...data].sort((a, b) => {
        const tierA = (a.tier || 'basic').toLowerCase();
        const tierB = (b.tier || 'basic').toLowerCase();
        if (tierPriority[tierA] !== tierPriority[tierB]) {
            return tierPriority[tierA] - tierPriority[tierB];
        }
        return (a.name || "").localeCompare(b.name || "");
    });

    grid.innerHTML = sortedData.map((biz, index) => {
        const tier = (biz.tier || 'basic').toLowerCase();
        let town = (biz.town || "Clay County").trim();
        town = town.split(',')[0].replace(" IL", "").trim();
        
        const townClass = town.toLowerCase().replace(/\s+/g, '-');
        const displayCat = mapCategory(biz.category);
        const hasCoupon = biz.coupon && biz.coupon !== "N/A" && biz.coupon !== "";

        // IMAGE LOGIC: 
        // 1. Basic gets the #default placeholder.
        // 2. Plus/Premium get the Smart Image function.
        let imageHtml = "";
        let phoneHtml = "";
        let premiumHint = "";
        let clickAction = "";

        if (tier === "basic") {
            // Rule: Basic ALWAYS shows the default placeholder
            imageHtml = `<img src="${placeholderImg}" style="height:150px; object-fit:contain;" alt="Placeholder">`;
        } else if (tier === "plus" || tier === "premium") {
            // Rule: Plus/Premium pull the custom image
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
 * SMART IMAGE LOGIC
 * Fixes the "Searching..." bug from Google formulas
 */
function getSmartImage(id, bizName) {
    const fallback = `https://via.placeholder.com/150?text=Logo+Pending`;
    
    // Check if ID is empty or stuck on "Searching..." formula text
    if (!id || id === "N/A" || id === "Searching..." || id.trim() === "") {
        return `<img src="${fallback}" style="max-height:100%; object-fit:contain;">`;
    }

    let fileName = id.trim().toLowerCase();
    
    // Attempts to load .jpeg, then .png, then fallbacks to placeholder
    return `<img src="${imageRepo}${fileName}.jpeg" 
                 style="max-height:100%; object-fit:contain;" 
                 onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; 
                 this.onerror=function(){this.src='${fallback}'};">`;
}
