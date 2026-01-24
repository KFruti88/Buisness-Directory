/* script.js */
let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

// 1. THE STARTUP KEY: This kicks off the whole process the second the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadDirectory();
});

async function loadDirectory() {
    try {
        // Fetching your master JSON from your GitHub
        const res = await fetch('https://raw.githubusercontent.com/KFruti88/Buisness-Directory/main/directory.json');
        masterData = await res.json();
        
        // Determine which page we are on and run the correct function
        if (document.getElementById('directory-grid')) {
            renderCards(masterData);
        } else if (document.getElementById('profile-wrap')) {
            loadProfile(masterData);
        }
    } catch (err) {
        console.error("Sync Error:", err);
        const grid = document.getElementById('directory-grid');
        if (grid) grid.innerHTML = "<h2>Error: Could not load data from GitHub.</h2>";
    }
}

// 2. DIRECTORY RENDER (Handles index.html)
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.sort((a,b) => a.town.localeCompare(b.town)).map(biz => {
        const tier = (biz.tier || 'basic').toLowerCase();
        const hasCoupon = biz.coupon && biz.coupon !== "N/A";
        
        // AUTO-BUILD IMAGE LINK: repo + id + extension
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

// 3. PROFILE RENDER (Handles profile.html)
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
    const mapUrl = biz.address ? `https://maps.google.com/maps?q=${encodeURIComponent(biz.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : '';

    document.getElementById('profile-details').innerHTML = `
        <div class="tier-indicator">${tier} Member</div>
        <a class="back-link" onclick="history.back()">← Back to Directory</a>
        
        <div class="profile-header">
            <img src="${autoLogo}" class="profile-logo" onerror="this.src='https://via.placeholder.com/200?text=Logo+Pending'">
            <div>
                <h1 class="biz-title">${biz.name}</h1>
                <p class="biz-meta">${biz.town} — ${biz.category}</p>
                ${tier === 'premium' && biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" class="action-btn">Visit Website</a>` : ''}
            </div>
        </div>

        <div class="details-grid">
            <div class="info-section">
                <h3>Contact Information</h3>
                <div class="info-item"><strong>Phone:</strong> ${biz.phone}</div>
                ${tier === 'premium' && biz.facebook_url !== "N/A" ? `<div class="info-item"><strong>Facebook:</strong> <a href="${biz.facebook_url}" target="_blank">View Page</a></div>` : ''}
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
            </div>
        ` : ''}
    `;
}

// 4. FILTER LOGIC
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
