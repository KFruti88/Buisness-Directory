/**
 * LAYOUT.JS - TIER PINNING & VISUALS (ADJUSTABLE)
 * Rules: 
 * - Premium (Top), Plus (Middle), Basic (Bottom)
 * - Plus/Premium: Show Image + Phone
 * - Basic: Show Placeholder + No Phone
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

        // IMAGE LOGIC: Plus and Premium get the real Image
        let imageHtml = `<img src="${placeholderImg}" style="height:150px; object-fit:contain;">`;
        let phoneHtml = "";
        let premiumHint = "";
        let clickAction = "";

        if (tier === "plus" || tier === "premium") {
            // Pulls correct custom image from GitHub repo
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
 * CORE UTILITIES
 */
function getSmartImage(id, bizName) {
    const fallback = `https://via.placeholder.com/150?text=Logo+Pending`;
    if (!id || id === "N/A" || id === "Searching...") return `<img src="${fallback}" style="max-height:100%; object-fit:contain;">`;
    let fileName = id.trim().toLowerCase();
    return `<img src="${imageRepo}${fileName}.jpeg" style="max-height:100%; object-fit:contain;" onerror="this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${fallback}'};">`;
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

function applyFilters() {
    const selectedTown = document.getElementById('town-select').value;
    const selectedCat = document.getElementById('cat-select').value;

    const filtered = masterData.filter(biz => {
        const bizTown = (biz.town || "").trim();
        const bizCat = mapCategory(biz.category);
        const matchTown = (selectedTown === 'All' || bizTown === selectedTown);
        const matchCat = (selectedCat === 'All' || bizCat === selectedCat);
        return matchTown && matchCat;
    });
    renderCards(filtered);
}
