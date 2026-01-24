/* script.js */
let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

// THE LIVE LINK: Points directly to your published Google Sheet CSV
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

document.addEventListener("DOMContentLoaded", () => {
    loadDirectory();
});

async function loadDirectory() {
    try {
        const res = await fetch(csvUrl);
        const csvText = await res.text();
        
        // Use PapaParse to turn the spreadsheet into usable data
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                masterData = results.data;
                
                // Detect which page we are on and render accordingly
                if (document.getElementById('directory-grid')) {
                    renderCards(masterData);
                } else if (document.getElementById('profile-wrap')) {
                    loadProfile(masterData);
                }
            }
        });
    } catch (err) {
        console.error("Live Sync Error:", err);
        const grid = document.getElementById('directory-grid');
        if (grid) grid.innerHTML = "<h2>Error: Could not sync with Google Sheets.</h2>";
    }
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // Sort alphabetically by town for a clean look
    grid.innerHTML = data.sort((a,b) => a.town.localeCompare(b.town)).map(biz => {
        const tier = (biz.tier || 'basic').toLowerCase();
        const hasCoupon = biz.coupon && biz.coupon !== "N/A";
        const autoLogo = `${imageRepo}${biz.id}.jpg`; 

        return `
        <div class="card ${tier}" ${tier === 'premium' ? `onclick="window.location.href='profile.html?id=${biz.id}'"` : ''}>
            <div class="plan-badge">${tier}</div>
            ${hasCoupon ? '<div class="coupon-badge">COUPON</div>' : ''}
            <div class="logo-box">
                <img src="${autoLogo}" onerror="this.src='https://via.placeholder.com/150?text=Logo+Pending'">
            </div>
            <div class="town-bar ${biz.town.toLowerCase().replace(' ', '-')}-bar">${biz.town}</div>
            <div class="biz-name">${biz.name}</div>
            ${tier === 'plus' ? `<div class="plus-phone">PH: ${biz.phone}</div>` : ''}
            <div class="cat-text">${biz.category || ''}</div>
        </div>`;
    }).join('');
}

function loadProfile(data) {
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get('id');
    const biz = data.find(b => b.id === bizId);

    if (!biz) {
        document.getElementById('profile-details').innerHTML = "<h2>Business not found.</h2>";
        return;
    }

    const tier = (biz.tier || 'basic').toLowerCase();
    const container = document.getElementById('profile-wrap');
    container.className = `profile-container ${tier}`;

    const autoLogo = `${imageRepo}${biz.id}.jpg`;
    // Encodes the address for a valid Google Maps embed
    const mapUrl = biz.address ? `https://maps.google.com/maps?q=${encodeURIComponent(biz.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : '';

    const facebookHtml = (biz.facebook_url && biz.facebook_url !== "N/A") 
        ? `<div class="info-item"><strong>Facebook:</strong> <a href="${biz.facebook_url}" target="_blank">View Page</a></div>` 
        : '';

    document.getElementById('profile-details').innerHTML = `
        <div class="tier-indicator">${tier} Member</div>
        <a class="back-link" onclick="history.back()">← Back to Directory</a>
        <div class="profile-header">
            <img src="${autoLogo}" class="profile-logo" onerror="this.src='https://via.placeholder.com/200?text=Logo+Pending'">
            <div>
                <h1 class="biz-title">${biz.name}</h1>
                <p class="biz-meta">${biz.town} — ${biz.category}</p>
                ${tier === 'premium' && biz.website && biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" class="action-btn">Visit Website</a>` : ''}
            </div>
        </div>
        <div class="details-grid">
            <div class="info-section">
                <h3>Contact Information</h3>
                <div class="info-item"><strong>Phone:</strong> ${biz.phone}</div>
                ${facebookHtml}
                <div class="info-item"><strong>Location:</strong> ${biz.address}</div>
            </div>
            <div class="info-section">
                <h3>About Us</h3>
                <div class="bio-box">${biz.bio || "No description provided."}</div>
            </div>
        </div>
        ${tier === 'premium' && mapUrl ? `
            <div class="info-section" style="margin-top:30px;">
                <h3>Our Location</h3>
                <iframe class="map-box" src="${mapUrl}" frameborder="0"></iframe>
            </div>` : ''}
    `;
}

// Handles the dropdown menus for Town and Category
function applyFilters() {
    const townVal = document.getElementById('town-select').value;
    const catVal = document.getElementById('cat-select').value;
    
    const filtered = masterData.filter(biz => {
        const townMatch = (townVal === 'All' || biz.town === townVal);
        const catMatch = (catVal === 'All' || biz.category === catVal);
        return townMatch && catMatch;
    });
    renderCards(filtered);
}
