/**
 * LAYOUT.JS - TIER PINNING & VISUALS (ADJUSTABLE)
 */
let masterData = [];

document.addEventListener("DOMContentLoaded", () => {
    loadDirectory();
    setupModalClose();
});

async function loadDirectory() {
    const cacheBuster = new Date().getTime();
    Papa.parse(`${baseCsvUrl}&cb=${cacheBuster}`, {
        download: true, header: true, skipEmptyLines: true,
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
            renderCards(masterData);
        }
    });
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    const tierPriority = { "premium": 1, "plus": 2, "basic": 3 };

    // PINNING LOGIC
    const sortedData = [...data].sort((a, b) => {
        const tierA = (a.tier || 'basic').toLowerCase();
        const tierB = (b.tier || 'basic').toLowerCase();
        if (tierPriority[tierA] !== tierPriority[tierB]) return tierPriority[tierA] - tierPriority[tierB];
        return (a.name || "").localeCompare(b.name || "");
    });

    grid.innerHTML = sortedData.map((biz, index) => {
        const tier = (biz.tier || 'basic').toLowerCase();
        const town = (biz.town || "Clay County").split(',')[0].replace(" IL", "").trim();
        const displayCat = mapCategory(biz.category);

        let imageHtml = `<img src="${placeholderImg}" style="height:150px; object-fit:contain;">`;
        let phoneHtml = "";
        let premiumHint = "";
        let clickAction = "";

        if (tier === "plus" || tier === "premium") {
            imageHtml = `<img src="${imageRepo}${biz.imageid}.jpeg" style="max-height:100%; object-fit:contain;" onerror="this.src='${imageRepo}${biz.imageid}.png';">`;
            phoneHtml = `<p style="font-weight:bold; margin-top:5px;">📞 ${biz.phone || 'N/A'}</p>`;
        }

        if (tier === "premium") {
            premiumHint = `<div style="color:#0c30f0; font-weight:bold; text-decoration:underline;">Click for Details</div>`;
            clickAction = `onclick="openPremiumModal(${index})"`;
        }

        return `
            <div class="card ${tier}" ${clickAction} style="width:95%; max-width:380px; height:460px; margin:10px auto; position:relative; display:flex; flex-direction:column;">
                <div class="tier-badge">${tier}</div>
                <div class="logo-box" style="height:160px; display:flex; align-items:center; justify-content:center;">${imageHtml}</div>
                <div class="town-bar ${town.toLowerCase().replace(/\s+/g, '-')}-bar">${town}</div>
                <div style="flex-grow:1; text-align:center; padding:10px;">
                    <h2>${biz.name}</h2>
                    ${phoneHtml}
                    ${premiumHint}
                </div>
                <div class="category-footer">${catEmojis[displayCat] || "📁"} ${displayCat}</div>
            </div>`;
    }).join('');
}
