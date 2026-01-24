/* script.js */
let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

document.addEventListener("DOMContentLoaded", () => {
    loadDirectory();
});

// 1. SMART IMAGE HELPER: The "Fallback Ladder"
function getSmartImage(id, isProfile = false) {
    const extensions = ['jpg', 'png', 'jpeg', 'gif', 'webp'];
    const placeholder = isProfile ? '200' : '150';
    const firstUrl = `${imageRepo}${id}.jpg`;
    
    let errorChain = `this.onerror=null;`; 
    
    extensions.forEach((ext, index) => {
        if (ext === 'jpg') return; 
        const nextUrl = `${imageRepo}${id}.${ext}`;
        const fallback = (index === extensions.length - 1) 
            ? `this.src='https://via.placeholder.com/${placeholder}?text=Logo+Pending'` 
            : `this.src='${nextUrl}'`;
        
        errorChain += ` if(this.src.includes('.${extensions[index-1]}')) { ${fallback}; } else`;
    });

    errorChain = errorChain.replace(/else$/, '');
    return `<img src="${firstUrl}" class="${isProfile ? 'profile-logo' : ''}" onerror="${errorChain}">`;
}

// 2. LOAD DATA: Uses PapaParse with 'download: true' matched to your specific Sheet Headers
async function loadDirectory() {
    try {
         Papa.parse(csvUrl, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                // Filter out empty rows; matching capitalized 'Name' from your sheet
                masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
                console.log("Data successfully synced. Count:", masterData.length);
                
                if (document.getElementById('directory-grid')) {
                    renderCards(masterData);
                } else if (document.getElementById('profile-wrap')) {
                    loadProfile(masterData);
                }
            },
            error: function(err) {
                console.error("Live Sync Error (PapaParse):", err);
            }
        });
    } catch (err) {
        console.error("General Script Error:", err);
    }
}

// 3. RENDER MAIN DIRECTORY
function renderCards(data) {
    const counter = document.getElementById('counter-display');
    if (counter) { counter.innerText = `${data.length} Businesses Listed`; }

    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // Sorts by 'Town' (Capitalized) and builds HTML cards
    grid.innerHTML = data.sort((a,b) => (a.Town || "").localeCompare(b.Town || "")).map(biz => {
        // MAPPING TO YOUR SHEET HEADERS
        const name = biz.Name || "Unnamed Business";
        const town = biz.Town || "Unknown";
        const tier = (biz.Teir || 'basic').toLowerCase(); // Matching your 'Teir' spelling
        const category = biz.Category || "";
        const imageID = biz["Image ID"] || ""; // Matching 'Image ID' with space
        const hasCoupon = biz.coupon && biz.coupon !== "N/A" && biz.coupon !== "";

        const townClass = town.toLowerCase().replace(/\s+/g, '-');

        return `
        <div class="card ${tier}" ${tier === 'premium' ? `onclick="window.location.href='profile.html?id=${imageID}'"` : ''}>
            <div class="plan-badge">${tier}</div>
            ${hasCoupon ? '<div class="coupon-badge">COUPON</div>' : ''}
            <div class="logo-box">
                ${getSmartImage(imageID)}
            </div>
            <div class="town-bar ${townClass}-bar">${town}</div>
            <div class="biz-name">${name}</div>
            <div class="cat-text">${category}</div>
        </div>`;
    }).join('');
}

// 4. LOAD INDIVIDUAL PROFILE PAGE
function loadProfile(data) {
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get('id');
    const biz = data.find(b => b["Image ID"] === bizId);
    if (!biz) return;

    const tier = (biz.Teir || 'basic').toLowerCase();
    const container = document.getElementById('profile-wrap');
    if (!container) return;
    
    container.className = `profile-container ${tier}`;

    const mapUrl = biz.Address ? `https://maps.google.com/maps?q=${encodeURIComponent(biz.Address)}&output=embed` : '';
    const facebookHtml = (biz.Facebook && biz.Facebook !== "N/A" && biz.Facebook !== "") 
        ? `<div class="info-item"><strong>Facebook:</strong> <a href="${biz.Facebook}" target="_blank">View Page</a></div>` : '';
    const websiteBtn = (tier === 'premium' && biz.Website && biz.Website !== "N/A" && biz.Website !== "")
        ? `<a href="${biz.Website}" target="_blank" class="action-btn">Visit Website</a>` : '';

    document.getElementById('profile-details').innerHTML = `
        <div class="tier-indicator">${tier} Member</div>
        <a class="back-link" onclick="history.back()">← Back to Directory</a>
        <div class="profile-header">
            ${getSmartImage(biz["Image ID"], true)}
            <div>
                <h1 class="biz-title">${biz.Name}</h1>
                <p class="biz-meta">${biz.Town} — ${biz.Category}</p>
                ${websiteBtn}
            </div>
        </div>
        <div class="details-grid">
            <div class="info-section">
                <h3>Contact Information</h3>
                <div class="info-item"><strong>Phone:</strong> ${biz.Phone || 'N/A'}</div>
                ${facebookHtml}
                <div class="info-item"><strong>Location:</strong> ${biz.Address || 'N/A'}</div>
            </div>
            <div class="info-section">
                <h3>About Us</h3>
                <div class="bio-box">${biz.Bio || "No description provided."}</div>
            </div>
        </div>
        ${tier === 'premium' && mapUrl ? `<iframe class="map-box" src="${mapUrl}"></iframe>` : ''}
    `;
}

// 5. FILTER LOGIC
function applyFilters() {
    const catVal = document.getElementById('cat-select').value;
    const townVal = document.getElementById('town-select') ? document.getElementById('town-select').value : 'All';
    
    const filtered = masterData.filter(biz => {
        const catMatch = (catVal === 'All' || biz.Category === catVal);
        const townMatch = (townVal === 'All' || biz.Town === townVal);
        return catMatch && townMatch;
    });
    renderCards(filtered);
}

// 6. NAVIGATION FILTER HELPER
function filterByTown(townName) {
    if (townName === 'All') {
        renderCards(masterData);
    } else {
        const filtered = masterData.filter(biz => biz.Town === townName);
        renderCards(filtered);
    }
}
