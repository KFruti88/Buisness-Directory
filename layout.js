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
                    Phone: row[5] || "",      // Column F
                    Address: row[6] || "",    // Column G
                    Hours: row[7] || "N/A",   // Column H
                    Website: row[8] || "",    // Column I
                    Facebook: row[9] || "",   // Column J
                    Bio: row[10] || "",       // Column K
                    Coupon: row[11] || "",    // Column L
                    Established: row[12] || "", // Column M
                    CouponLink: row[13] || ""   // Column N (QR/Barcode Image URL)
                };
            }).filter(biz => biz.Name !== "N/A" && biz.Name !== "Name");

            if (document.getElementById('directory-grid')) {
                renderCards(masterData);
            }
            
            // Check if we are on the profile page
            if (document.getElementById('profile-wrap')) {
                renderProfilePage(masterData);
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

        // Click logic: Premium OR anyone with a Coupon Link opens the Modal
        const hasCouponLink = (biz.CouponLink && biz.CouponLink.trim() !== "");
        const isPremium = (tierL === 'premium');
        const isPlus = (tierL === 'plus');

        let clickAttr = "";
        let cursorStyle = "default";
        
        if (isPremium || hasCouponLink) {
            clickAttr = `onclick="openFullModal('${biz.Name.replace(/'/g, "\\'")}')"`;
            cursorStyle = "pointer";
        }

        // Phone logic: Display for Premium and Plus only
        const showPhone = (tierL === 'premium' || tierL === 'plus') && biz.Phone;

        // Coupon logic: Show badge if Column L has content
        const showCoupon = (biz.Coupon && biz.Coupon.trim() !== "");
        
        // Premium "Click for Details" Hint
        const detailsHint = isPremium ? 
            `<div style="font-size: 0.8rem; color: #0c30f0; text-decoration: underline; margin-top: 5px;">Click for Details</div>` : 
            ``;

        return `
        <div class="card ${tierL}" ${clickAttr} style="cursor: ${cursorStyle};">
            <div class="tier-badge">${biz.Tier}</div> 
            ${showCoupon ? `<img src="${imageRepo}coupon.png" class="coupon-badge" alt="Coupon">` : ''}
            <div class="logo-box">
                ${getSmartImage(biz.ImageID, biz.Name)} 
            </div>
            <div class="town-bar ${townClass}-bar">${biz.Town}</div> 
            <div class="biz-name">${biz.Name}</div> 
            
            ${showPhone ? `<div class="biz-phone">📞 ${biz.Phone}</div>` : ''}
            ${detailsHint}
            
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

// 8. PROFILE PAGE RENDERER
function renderProfilePage(data) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.getElementById('profile-wrap');
    
    if (!id || !container) return;

    const biz = data.find(b => b.ImageID === id);
    
    if (!biz) {
        container.innerHTML = "<h2>Business Not Found</h2>";
        return;
    }

    const mapAddress = encodeURIComponent(`${biz.Address}, ${biz.Town}, IL`);

    container.innerHTML = `
        <div class="profile-container">
            <div class="tier-indicator">${biz.Tier} MEMBER</div>
            <div class="profile-header">
                <div class="profile-logo-box">
                    ${getSmartImage(biz.ImageID, biz.Name)}
                </div>
                <div>
                    <h1 class="biz-title">${biz.Name}</h1>
                    <p class="biz-meta">${biz.Category} | ${biz.Town}</p>
                    <a href="tel:${biz.Phone}" class="action-btn">📞 Call: ${biz.Phone}</a>
                    ${biz.Website ? `<a href="${biz.Website}" target="_blank" class="action-btn">🌐 Website</a>` : ''}
                    ${biz.Facebook ? `<a href="${biz.Facebook}" target="_blank" class="action-btn">f Facebook</a>` : ''}
                </div>
            </div>

            <div class="details-grid">
                <div class="info-section">
                    <h3>Business Details</h3>
                    <div class="info-item"><strong>📍 Address:</strong> ${biz.Address}</div>
                    <div class="info-item"><strong>⏰ Hours:</strong> ${biz.Hours}</div>
                    ${biz.Bio ? `<div class="bio-box">${biz.Bio}</div>` : ''}
                </div>
                <div class="info-section">
                    <h3>Location</h3>
                    <iframe class="map-box" frameborder="0" src="https://maps.google.com/maps?q=${mapAddress}&output=embed"></iframe>
                </div>
            </div>
        </div>
    `;
}
