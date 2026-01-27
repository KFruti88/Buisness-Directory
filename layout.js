/**
 * LAYOUT.JS - THE "SUNDAY" STRUCTURE FIX
 * Locked: Equal card heights via consistent HTML structure
 * Locked: GitHub Raw image paths
 */
var masterData = [];

document.addEventListener("DOMContentLoaded", () => {
    loadDirectory();
    if (typeof setupModalClose === "function") {
        setupModalClose();
    }
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
            }).filter(row => row.name && row.name.trim() !== "" && row.name !== "Searching...");
            
            generateCategoryDropdown();
            renderCards(masterData);
        }
    });
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    const tierPriority = { "premium": 1, "plus": 2, "basic": 3 };

    const sortedData = [...data].sort((a, b) => {
        const tierA = (a.tier || 'basic').toLowerCase();
        const tierB = (b.tier || 'basic').toLowerCase();
        if (tierPriority[tierA] !== tierPriority[tierB]) {
            return tierPriority[tierA] - tierPriority[tierB];
        }
        return (a.name || "").localeCompare(b.name || "");
    });

    grid.innerHTML = sortedData.map((biz) => {
        const tier = (biz.tier || 'basic').toLowerCase();
        let town = (biz.town || "Clay County").trim().split(',')[0].replace(" IL", "").trim();
        const townClass = town.toLowerCase().replace(/\s+/g, '-');
        const displayCat = mapCategory(biz.category);

        // Sunday Rule: Every card has the SAME elements, even if they are empty
        // This ensures the "flex" engine keeps them the same size.
        let imageHtml = (tier === "basic") ? 
            `<img src="${placeholderImg}" style="height:150px; object-fit:contain;">` : 
            getSmartImage(biz.imageid);
        
        let phoneHtml = (tier === "plus" || tier === "premium") ? 
            `<p style="font-weight:bold; margin-top:5px; font-size:1.1rem;">📞 ${biz.phone || 'N/A'}</p>` : 
            `<p style="margin-top:5px; visibility:hidden;">Placeholder</p>`; // Keeps height consistent
            
        let actionHint = (tier === "premium") ? 
            `<div style="color:#0c30f0; font-weight:bold; margin-top:10px; text-decoration:underline;">Click for Details</div>` : 
            `<div style="margin-top:10px; visibility:hidden;">Placeholder</div>`;

        let clickAction = (tier === "premium") ? 
            `onclick="openFullModal('${biz.name.replace(/'/g, "\\'")}')" style="cursor:pointer;"` : "";

        return `
            <div class="card ${tier}" ${clickAction} style="width: 95%; max-width: 380px; height: 460px; margin: 10px auto; display: flex; flex-direction: column; position:relative;">
                <div class="tier-badge">${tier}</div>
                
                <div class="logo-box" style="height: 160px; display: flex; align-items: center; justify-content: center; background:#f4f4f4; overflow:hidden;">
                    ${imageHtml}
                </div>

                <div class="town-bar ${townClass}-bar">${town}</div>

                <div style="flex-grow: 1; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align:center;">
                    <h2 style="margin:0; font-size:1.4rem; color:#222;">${biz.name}</h2>
                    ${phoneHtml}
                    ${actionHint}
                </div>

                <div class="category-footer" style="padding-bottom:15px; font-weight:bold; font-style:italic; font-size:0.85rem;">
                    ${catEmojis[displayCat] || "📁"} ${displayCat}
                </div>
            </div>`;
    }).join('');
}

function getSmartImage(id) {
    const fallback = `${rawRepo}default.png`; 
    if (!id || id === "N/A" || id === "Searching..." || id.trim() === "") {
        return `<img src="${fallback}" style="max-height:100%; object-fit:contain;">`;
    }
    
    let fileName = id.trim().toLowerCase();
    
    // Attempting direct raw access
    return `<img src="${rawRepo}${fileName}.jpeg" 
                 style="max-height:100%; object-fit:contain;" 
                 onerror="this.onerror=null; this.src='${rawRepo}${fileName}.png'; 
                 this.onerror=function(){this.src='${fallback}'};">`;
}

function generateCategoryDropdown() {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;
    catSelect.innerHTML = '<option value="All">📂 All Industries</option>';
    Object.keys(catEmojis).sort().forEach(cat => {
        catSelect.innerHTML += `<option value="${cat}">${catEmojis[cat]} ${cat}</option>`;
    });
}
