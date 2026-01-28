/**
 * PROJECT: Clay County Directory Engine
 * VERSION: 1.10
 * MAPPING: A=ImageID, B=Name, G=Address (Index 6), D=Teir, F=Phone
 * UPDATES: Corrected extension to .jpeg; Phone visible for Premium/Plus.
 */

let masterData = [];

// 2. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => { 
    updateNewspaperHeader(); 
    loadDirectory();         
});

// 3. NEWSPAPER HEADER
function updateNewspaperHeader() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const headerInfo = document.getElementById('header-info');
    if (headerInfo) { 
        headerInfo.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${dateString}`; 
    }
}

// 4. SMART IMAGE ENGINE (Targets .jpeg specifically)
function getSmartImage(imageID, bizName) {
    let fileName = imageID ? imageID.trim() : "";
    
    // Fallback if Column A is empty
    if (!fileName && bizName) {
        fileName = bizName.toLowerCase().replace(/['\s]/g, ""); 
    }

    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    
    // Updated to try .jpeg -> .jpg -> .png
    return `<img src="${imageRepo}${fileName}.jpeg" 
            class="logo-img" 
            alt="${bizName}"
            onerror="this.onerror=null; 
                     this.src='${imageRepo}${fileName}.jpg'; 
                     this.onerror=function(){
                        this.src='${imageRepo}${fileName}.png'; 
                        this.onerror=function(){this.src='${placeholder}'};
                     };">`;
}

// 5. DATA LOADING & ADDRESS PARSING
async function loadDirectory() {
    Papa.parse(csvUrl, {
        download: true, 
        header: false, 
        skipEmptyLines: true,
        complete: function(results) {
            const rawRows = results.data;
            
            masterData = rawRows.slice(1).map(row => {
                // Extract Town from Column G (Index 6)
                const fullAddress = row[6] || "";
                const parts = fullAddress.split(',');
                let town = "Clay County";
                if (parts.length >= 2) { town = parts[1].trim(); }

                return {
                    ImageID: row[0] || "",    // Column A
                    Name: row[1] || "N/A",    // Column B
                    Town: town,               // From Column G
                    Tier: row[3] || "Basic",  // Column D
                    Category: (row[4] || "N/A").trim(),// Column E
                    Phone: row[5] || ""       // Column F
                };
            }).filter(biz => biz.Name !== "N/A" && biz.Name !== "Name");

            if (document.getElementById('directory-grid')) {
                renderCards(masterData);
            }
        }
    });
}

// 6. RENDER CARDS
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    const tierOrder = { "premium": 1, "plus": 2, "basic": 3 };

    grid.innerHTML = data.sort((a, b) => {
        const tA = a.Tier.toLowerCase();
        const tB = b.Tier.toLowerCase();
        if (tierOrder[tA] !== tierOrder[tB]) {
            return (tierOrder[tA] || 4) - (tierOrder[tB] || 4);
        }
        return a.Town.localeCompare(b.Town);
    }).map(biz => {
        const tierL = biz.Tier.toLowerCase();
        const townClass = biz.Town.toLowerCase().replace(/\s+/g, '-');

        // Click logic: ONLY Premium goes to profile.html
        let clickAttr = "";
        let cursorStyle = "default";
        if (tierL === 'premium') {
            clickAttr = `onclick="window.location.href='profile.html?id=${encodeURIComponent(biz.ImageID)}'"` ;
            cursorStyle = "pointer";
        }

        // Phone logic: Display for Premium and Plus only
        const showPhone = (tierL === 'premium' || tierL === 'plus') && biz.Phone;

        return `
        <div class="card ${tierL}" ${clickAttr} style="cursor: ${cursorStyle};">
            <div class="tier-badge">${biz.Tier}</div> 
            <div class="logo-box">
                ${getSmartImage(biz.ImageID, biz.Name)} 
            </div>
            <div class="town-bar ${townClass}-bar">${biz.Town}</div> 
            <div class="biz-name">${biz.Name}</div> 
            
            ${showPhone ? `<div class="biz-phone">📞 ${biz.Phone}</div>` : ''}
            
            <div class="cat-text">${catEmojis[biz.Category] || "📁"} ${biz.Category}</div> 
        </div>`;
    }).join('');
}

// 7. FILTERS
function applyFilters() {
    const catVal = document.getElementById('cat-select').value;
    const townVal = document.getElementById('town-select').value;
    const filtered = masterData.filter(biz => 
        (catVal === 'All' || biz.Category === catVal) && 
        (townVal === 'All' || biz.Town === townVal)
    );
    renderCards(filtered);
}
