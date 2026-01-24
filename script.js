let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImgUrl = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

// 1. LOCKED EMOJI MAPPING
// Add this to your catEmojis object
const catEmojis = {
    "Emergency": "🚨", // New Emergency Category
    "Church": "⛪", "Post Office": "📬", "Restaurants": "🍴", "Retail": "🛒", 
    "Shopping": "🛍️", "Manufacturing": "🏗️", "Industry": "🏭", 
    "Financial Services": "💰", "Healthcare": "🏥", "Gas Station": "⛽", 
    "Internet": "🌐", "Services": "🛠️", "Professional Services": "💼"
};

document.addEventListener("DOMContentLoaded", () => { loadDirectory(); });

// 2. SMART IMAGE HELPER: Handles multiple extensions and fallback placeholders
function getSmartImage(id, isProfile = false) {
    if(!id) return '';
    const cleanID = id.trim();
    const placeholder = `https://via.placeholder.com/${isProfile ? '200' : '150'}?text=Logo+Pending`;
    const firstUrl = `${imageRepo}${cleanID}.jpg`;
    
    return `<img src="${firstUrl}" class="${isProfile ? 'profile-logo' : ''}" 
            onerror="this.onerror=null; this.src='${imageRepo}${cleanID}.png'; 
            this.onerror=function(){this.src='${placeholder}'};">`;
}

// 3. DATA LOADING ENGINE
async function loadDirectory() {
    Papa.parse(csvUrl, {
        download: true, header: true, skipEmptyLines: true,
        complete: function(results) {
            masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
            if (document.getElementById('directory-grid')) {
                renderCards(masterData);
            } else if (document.getElementById('profile-wrap')) {
                loadProfile(masterData);
            }
        }
    });
}

// 4. RENDER MAIN DIRECTORY (Clean teaser cards)
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.sort((a,b) => (a.Town || "").localeCompare(b.Town || "")).map(biz => {
        const tier = (biz.Teir || 'basic').toLowerCase();
        const imageID = (biz["Image ID"] || "").trim(); 
        const category = (biz.Category || "Industry").trim(); 
        const townClass = (biz.Town || "unknown").toLowerCase().replace(/\s+/g, '-');

        let clickAttr = "";
        if (tier === 'premium') {
            clickAttr = `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID)}'"` ;
        } else if (tier === 'plus') {
            clickAttr = `onclick="this.classList.toggle('expanded')"`;
        }

        return `
        <div class="card ${tier}" ${clickAttr} style="cursor: ${tier === 'premium' ? 'pointer' : 'default'};">
            <div class="tier-badge">${tier}</div>
            <div class="logo-box">${getSmartImage(imageID)}</div>
            <div class="town-bar ${townClass}-bar">${biz.Town || 'Unknown'}</div>
            <div class="biz-name">${biz.Name || 'Unnamed Business'}</div>
            
            ${tier === 'plus' ? `<div class="plus-reveal">📞 ${biz.Phone || 'Contact for Info'}</div>` : ''}
            
            <div class="cat-text">${catEmojis[category] || "📁"} ${category}</div>
        </div>`;
    }).join('');
    
    const counter = document.getElementById('counter-display');
    if (counter) counter.innerText = `${data.length} Businesses Listed`;
}

// 5. LOAD INDIVIDUAL PROFILE (QR Code logic removed)
function loadProfile(data) {
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get('id');
    const biz = data.find(b => (b["Image ID"] || "").trim().toLowerCase() === (bizId || "").toLowerCase());
    
    const container = document.getElementById('profile-wrap');
    if (!biz) {
        container.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Business Not Found</h2><p>Check the ID: ${bizId}</p></div>`;
        return;
    }

    // MAP URL FIX
    const mapUrl = biz.Address ? `https://maps.google.com/maps?q=${encodeURIComponent(biz.Address)}&t=&z=13&ie=UTF8&iwloc=&output=embed` : '';

    container.innerHTML = `
        <div class="profile-container premium">
            <a href="index.html" class="back-link">← Back to Directory</a>
            <div class="profile-header">
                <div class="profile-logo-box">${getSmartImage(biz["Image ID"], true)}</div>
                <div class="profile-titles">
                    <h1 class="biz-title">${biz.Name}</h1>
                    <p class="biz-meta">${catEmojis[biz.Category] || "📁"} ${biz.Town} — ${biz.Category}</p>
                    ${biz.Website && biz.Website !== "N/A" ? `<a href="${biz.Website}" target="_blank" class="action-btn">🌐 Visit Website</a>` : ''}
                </div>
            </div>

            <div class="details-grid">
                <div class="info-section">
                    <h3>Contact Information</h3>
                    <div class="info-item">📞 <strong>Phone:</strong> ${biz.Phone || 'N/A'}</div>
                    <div class="info-item">📍 <strong>Location:</strong> ${biz.Address || 'N/A'}</div>
                </div>
                <div class="info-section">
                    <h3>About Us</h3>
                    <div class="bio-box">${biz.Bio || "No description provided."}</div>
                </div>
            </div>
            
            ${mapUrl ? `<iframe class="map-box" src="${mapUrl}" width="100%" height="350" style="border:0;" allowfullscreen></iframe>` : ''}
        </div>`;
}

// 6. FILTER LOGIC
function applyFilters() {
    const catVal = document.getElementById('cat-select').value;
    const townVal = document.getElementById('town-select').value;
    const filtered = masterData.filter(biz => (catVal === 'All' || biz.Category === catVal) && (townVal === 'All' || biz.Town === townVal));
    renderCards(filtered);
}
