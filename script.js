let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImgUrl = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

document.addEventListener("DOMContentLoaded", () => {
    loadDirectory();
});

// 1. SMART IMAGE HELPER
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

// 2. LOAD DATA
async function loadDirectory() {
    try {
         Papa.parse(csvUrl, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
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
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.sort((a,b) => (a.Town || "").localeCompare(b.Town || "")).map(biz => {
        const tier = (biz.Teir || 'basic').toLowerCase();
        const imageID = biz["Image ID"] || "";
        const townClass = (biz.Town || "unknown").toLowerCase().replace(/\s+/g, '-');
        const hasCoupon = biz.Coupon && biz.Coupon.toUpperCase() !== "N/A" && biz.Coupon.trim() !== "";

        // --- DETERMINING THE CLICK ACTION ---
        let clickAction = "";
        if (tier === 'premium') {
            clickAction = `onclick="window.location.href='profile.html?id=${imageID}'"`;
        } else if (tier === 'plus') {
            clickAction = `onclick="this.classList.toggle('expanded')"`;
        }

        return `
        <div class="card ${tier}" ${clickAction}>
            ${hasCoupon ? `<img src="${couponImgUrl}" class="coupon-corner-image" alt="Coupon Available">` : ''}
            <div class="tier-badge">${tier}</div>

            <div class="logo-box">
                ${getSmartImage(imageID)}
            </div>

            <div class="town-bar ${townClass}-bar">${biz.Town || 'Unknown'}</div>

            <div class="biz-name">${biz.Name || 'Unnamed Business'}</div>

            ${tier === 'plus' ? `<div class="plus-reveal">📞 ${biz.Phone || 'Contact for info'}</div>` : ''}
            
            <div class="cat-text">${tier === 'basic' ? '' : (biz.Category || '')}</div>
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

    const mapUrl = biz.Address ? `https://maps.google.com/maps?q=${encodeURIComponent(biz.Address)}&t=&z=13&ie=UTF8&iwloc=&output=embed` : '';
    
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
