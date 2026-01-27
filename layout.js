/**
 * LAYOUT.JS - TIER PINNING, INFO CONTROL, & DROPDOWN FIX
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
            
            // Fix: Call dropdown generator ONLY after data is loaded
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

    grid.innerHTML = sortedData.map((biz, index) => {
        const tier = (biz.tier || 'basic').toLowerCase();
        let town = (biz.town || "Clay County").trim();
        town = town.split(',')[0].replace(" IL", "").trim();
        
        const townClass = town.toLowerCase().replace(/\s+/g, '-');
        const displayCat = mapCategory(biz.category);
        const hasCoupon = biz.coupon && biz.coupon !== "N/A" && biz.coupon !== "";

        let imageHtml = "";
        let phoneHtml = "";
        let actionHint = "";
        let clickAction = "";

        // MAIN SCREEN CONTENT CONTROL
        if (tier === "basic") {
            imageHtml = `<img src="${placeholderImg}" style="height:150px; object-fit:contain;">`;
        } 
        else if (tier === "plus") {
            imageHtml = getSmartImage(biz.imageid, biz.name);
            phoneHtml = `<p style="font-weight:bold; margin-top:5px; font-size:1.1rem;">📞 ${biz.phone || 'N/A'}</p>`;
            // PLUS: No clickAction defined here = No Pop-out
        }
        else if (tier === "premium") {
            imageHtml = getSmartImage(biz.imageid, biz.name);
            phoneHtml = `<p style="font-weight:bold; margin-top:5px; font-size:1.1rem;">📞 ${biz.phone || 'N/A'}</p>`;
            actionHint = `<div style="color:#0c30f0; font-weight:bold; margin-top:10px; text-decoration:underline;">Click for Details</div>`;
            // PREMIUM: Enable pop-out
            clickAction = `onclick="openFullModal(${index})" style="cursor:pointer;"`;
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
                    ${actionHint}
                </div>

                <div class="category-footer" style="padding-bottom:15px; font-weight:bold; font-style:italic; font-size:0.85rem;">
                    ${catEmojis[displayCat] || "📁"} ${displayCat}
                </div>
            </div>`;
    }).join('');
}

/**
 * PREMIUM POP-OUT (SAVES THE "EVERYTHING" FOR HERE)
 */
function openFullModal(index) {
    // We find the specific business in the masterData array
    const biz = masterData[index];
    const modal = document.getElementById('premium-modal');
    const content = document.getElementById('modal-body');
    if (!modal || !content) return;

    const mapAddress = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);
    
    const websiteBtn = (biz.website && biz.website !== "N/A") ? 
        `<a href="${biz.website}" target="_blank" style="background:#0c30f0; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; display:inline-block; margin-right:10px;">Website</a>` : "";

    const facebookBtn = (biz.facebook && biz.facebook !== "N/A") ? 
        `<a href="${biz.facebook}" target="_blank" style="background:#3b5998; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; display:inline-block;">Facebook</a>` : "";

    content.innerHTML = `
        <div style="text-align:center;">
            <div style="height:120px; margin-bottom:10px;">${getSmartImage(biz.imageid, biz.name)}</div>
            <h1 style="font-family:'Times New Roman', serif; margin:0;">${biz.name}</h1>
            <p style="color:#666; font-size:1.1rem;">${biz.category} | ${biz.town}</p>
        </div>
        <hr style="margin:20px 0;">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:25px;">
            <div>
                <h3>Full Details</h3>
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

function getSmartImage(id, bizName) {
    const fallback = `https://via.placeholder.com/150?text=Logo+Pending`;
    if (!id || id === "N/A" || id === "Searching..." || id.trim() === "") {
        return `<img src="${fallback}" style="max-height:100%; object-fit:contain;">`;
    }
    let fileName = id.trim().toLowerCase();
    return `<img src="${imageRepo}${fileName}.jpeg" style="max-height:100%; object-fit:contain;" onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${fallback}'};">`;
}

/**
 * FIXED DROPDOWN GENERATOR
 */
function generateCategoryDropdown() {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;
    
    // Clear and add default
    catSelect.innerHTML = '<option value="All">📂 All Industries</option>';
    
    // Use the locked catEmojis from config.js
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
