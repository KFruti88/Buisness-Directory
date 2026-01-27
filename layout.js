/**
 * LAYOUT.JS - FINAL PRODUCTION VERSION (COLOR SYNCED)
 * Locked: Name-Match Pop-out System
 * Locked: GitHub Raw Image Integration
 * Locked: Tier-Priority Pinning
 * Added: Town-Color Synced Modal Header
 */
let masterData = [];
const rawRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

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
        let town = (biz.town || "Clay County").trim();
        town = town.split(',')[0].replace(" IL", "").trim();
        
        const townClass = town.toLowerCase().replace(/\s+/g, '-');
        const displayCat = mapCategory(biz.category);

        let imageHtml = "";
        let phoneHtml = "";
        let actionHint = "";
        let clickAction = "";

        if (tier === "basic") {
            imageHtml = `<img src="${placeholderImg}" style="height:150px; object-fit:contain;">`;
        } 
        else {
            imageHtml = getSmartImage(biz.imageid);
            phoneHtml = `<p style="font-weight:bold; margin-top:5px; font-size:1.1rem;">📞 ${biz.phone || 'N/A'}</p>`;
            
            if (tier === "premium") {
                actionHint = `<div style="color:#0c30f0; font-weight:bold; margin-top:10px; text-decoration:underline;">Click for Details</div>`;
                const safeName = biz.name.replace(/'/g, "\\'");
                clickAction = `onclick="openFullModal('${safeName}')" style="cursor:pointer;"`;
            }
        }

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

/**
 * FIXED POP-OUT LOGIC (COLOR SYNCED)
 */
function openFullModal(bizName) {
    const biz = masterData.find(b => b.name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const content = document.getElementById('modal-body');
    if (!modal || !content) return;

    // Logic to get the color class same as the main card
    let town = (biz.town || "Clay County").trim().split(',')[0].replace(" IL", "").trim();
    const townClass = town.toLowerCase().replace(/\s+/g, '-');
    const mapAddress = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);
    
    content.innerHTML = `
        <div style="text-align:center;">
            <div style="height:120px; margin-bottom:10px;">${getSmartImage(biz.imageid)}</div>
            <h1 style="font-family:'Times New Roman', serif; margin:0;">${biz.name}</h1>
            <p style="color:#666;">${biz.category} | ${town}</p>
        </div>
        
        <div class="town-bar ${townClass}-bar" style="margin: 15px -30px; border-radius: 0;">${town}</div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:25px;">
            <div>
                <h3>Business Details</h3>
                <p><strong>📞 Phone:</strong> ${biz.phone}</p>
                <p><strong>📍 Address:</strong> ${biz.address}</p>
                <p><strong>⏰ Hours:</strong> ${biz.hours || 'N/A'}</p>
                <div style="margin-top:20px;">
                    ${biz.website && biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="background:#0c30f0; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; display:inline-block; margin-right:10px;">Website</a>` : ""}
                    ${biz.facebook && biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="background:#3b5998; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; display:inline-block;">Facebook</a>` : ""}
                </div>
            </div>
            <div>
                <h3>Map Location</h3>
                <iframe width="100%" height="250" frameborder="0" style="border:1px solid #ddd; border-radius:8px;" src="https://maps.google.com/maps?q=${mapAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
            </div>
        </div>
        ${biz.bio && biz.bio !== "N/A" ? `<div style="margin-top:20px; padding-top:20px; border-top:1px solid #eee;"><h3>Our Story</h3><p style="line-height:1.6;">${biz.bio}</p></div>` : ""}
    `;
    modal.style.display = "flex";
}

function getSmartImage(id) {
    const fallback = `${rawRepo}default.png`; 
    if (!id || id === "N/A" || id === "Searching...") return `<img src="${fallback}" style="max-height:100%; object-fit:contain;">`;
    
    let fileName = id.trim().toLowerCase();
    return `<img src="${rawRepo}${fileName}.jpeg" 
                 style="max-height:100%; object-fit:contain;" 
                 onerror="this.onerror=null; this.src='${rawRepo}${fileName}.png'; 
                 this.onerror=function(){this.src='${fallback}'};">`;
}

function setupModalClose() {
    const modal = document.getElementById('premium-modal');
    const closeBtn = document.querySelector('.close-modal');
    if(closeBtn) closeBtn.onclick = () => { modal.style.display = "none"; };
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
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
