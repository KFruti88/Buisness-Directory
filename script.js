let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImgUrl = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

// 1. EMOJI MAPPING
const catEmojis = {
    "Church": "⛪",
    "Post Office": "📬",
    "Restaurants": "🍴",
    "Retail": "🛒",
    "Shopping": "🛍️",
    "Manufacturing": "🏗️",
    "Industry": "🏭",
    "Financial Services": "💰",
    "Healthcare": "🏥",
    "Gas Station": "⛽",
    "Internet": "🌐",
    "Services": "🛠️",
    "Professional Services": "💼"
};

document.addEventListener("DOMContentLoaded", () => {
    loadDirectory();
});

// 2. SMART IMAGE HELPER
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

// 3. LOAD DATA
async function loadDirectory() {
    try {
         Papa.parse(csvUrl, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
                if (document.getElementById('directory-grid')) {
                    renderCards(masterData);
                } else if (document.getElementById('profile-wrap')) {
                    loadProfile(masterData);
                }
            }
        });
    } catch (err) { console.error("Script Error:", err); }
}

// 4. RENDER MAIN DIRECTORY (Emojis Default for All)
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.sort((a,b) => (a.Town || "").localeCompare(b.Town || "")).map(biz => {
        const tier = (biz.Teir || 'basic').toLowerCase();
        const imageID = biz["Image ID"] || "";
        const townClass = (biz.Town || "unknown").toLowerCase().replace(/\s+/g, '-');
        const category = biz.Category || "Industry"; 
        const hasCoupon = biz.Coupon && biz.Coupon.toUpperCase() !== "N/A" && biz.Coupon.trim() !== "";
        
        // Emoji logic applied to all tiers by default
        const emoji = catEmojis[category] || "📁";

        // URL ENCODING for Premium Redirects
        let clickAction = "";
        if (tier === 'premium') {
            clickAction = `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID)}'"` ;
        } else if (tier === 'plus') {
            clickAction = `onclick="this.classList.toggle('expanded')"`;
        }

        return `
        <div class="card ${tier}" ${clickAction}>
            ${hasCoupon ? `<img src="${couponImgUrl}" class="coupon-corner-image" alt="Coupon">` : ''}
            <div class="tier-badge">${tier}</div>
            <div class="logo-box">${getSmartImage(imageID)}</div>
            <div class="town-bar ${townClass}-bar">${biz.Town || 'Unknown'}</div>
            <div class="biz-name">${biz.Name || 'Unnamed Business'}</div>

            ${tier === 'plus' ? `<div class="plus-reveal">📞 ${biz.Phone || 'Contact for info'}</div>` : ''}
            
            <div class="cat-text">
                ${emoji} ${category}
            </div>
        </div>`;
    }).join('');
}

// 5. LOAD PROFILE (Premium Only)
function loadProfile(data) {
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get('id');
    const biz = data.find(b => b["Image ID"] === bizId);
    
    if (!biz || (biz.Teir || "").toLowerCase() !== 'premium') {
        window.location.href = 'index.html'; 
        return;
    }

    const container = document.getElementById('profile-wrap');
    if (!container) return;
    
    // Fixed Map URL Logic
    const mapUrl = biz.Address ? `https://maps.google.com/maps?q=${encodeURIComponent(biz.Address)}&output=embed` : '';
    const emoji = catEmojis[biz.Category] || "📁";

    document.getElementById('profile-details').innerHTML = `
        <div class="tier-indicator">Premium Member</div>
        <a class="back-link" href="index.html">← Back to Directory</a>
        <div class="profile-header">
            ${getSmartImage(biz["Image ID"], true)}
            <div>
                <h1 class="biz-title">${biz.Name}</h1>
                <p class="biz-meta">${emoji} ${biz.Town} — ${biz.Category}</p>
                ${biz.Website && biz.Website !== "N/A" ? `<a href="${biz.Website}" target="_blank" class="action-btn">🌐 Visit Website</a>` : ''}
            </div>
        </div>
        <div class="details-grid">
            <div class="info-section">
                <h3>Contact & Social</h3>
                <div class="info-item">📞 <strong>Phone:</strong> ${biz.Phone || 'N/A'}</div>
                ${biz.Facebook && biz.Facebook !== "N/A" ? `<div class="info-item">📱 <strong>Facebook:</strong> <a href="${biz.Facebook}" target="_blank">View Page</a></div>` : ''}
                <div class="info-item">📍 <strong>Location:</strong> ${biz.Address || 'N/A'}</div>
            </div>
            <div class="info-section">
                <h3>About Us</h3>
                <div class="bio-box">${biz.Bio || "No description provided."}</div>
            </div>
        </div>
        ${mapUrl ? `<iframe class="map-box" src="${mapUrl}" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>` : ''}
    `;
}

// 6. FILTER LOGIC
function applyFilters() {
    const catVal = document.getElementById('cat-select').value;
    const townVal = document.getElementById('town-select').value;
    
    const filtered = masterData.filter(biz => {
        const catMatch = (catVal === 'All' || biz.Category === catVal);
        const townMatch = (townVal === 'All' || biz.Town === townVal);
        return catMatch && townMatch;
    });
    renderCards(filtered);
}
