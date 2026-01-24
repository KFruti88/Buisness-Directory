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

async function loadDirectory() {
    try {
        const res = await fetch(csvUrl);
        const csvText = await res.text();
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                masterData = results.data;
                if (document.getElementById('directory-grid')) {
                    renderCards(masterData);
                } else if (document.getElementById('profile-wrap')) {
                    loadProfile(masterData);
                }
            }
        });
    } catch (err) {
        console.error("Live Sync Error:", err);
    }
}

function renderCards(data) {
    const counter = document.getElementById('counter-display');
    if (counter) { counter.innerText = `${data.length} Businesses Listed`; }

    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.sort((a,b) => a.town.localeCompare(b.town)).map(biz => {
        const tier = (biz.tier || 'basic').toLowerCase();
        const hasCoupon = biz.coupon && biz.coupon !== "N/A" && biz.coupon !== "";

        return `
        <div class="card ${tier}" ${tier === 'premium' ? `onclick="window.location.href='profile.html?id=${biz.id}'"` : ''}>
            <div class="plan-badge">${tier}</div>
            ${hasCoupon ? '<div class="coupon-badge">COUPON</div>' : ''}
            <div class="logo-box">
                ${getSmartImage(biz.id)}
            </div>
            <div class="town-bar ${biz.town.toLowerCase().replace(' ', '-')}-bar">${biz.town}</div>
            <div class="biz-name">${biz.name}</div>
            ${tier === 'plus' && biz.phone ? `<div class="plus-phone">PH: ${biz.phone}</div>` : ''}
            <div class="cat-text">${biz.category || ''}</div>
        </div>`;
    }).join('');
}

function loadProfile(data) {
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get('id');
    const biz = data.find(b => b.id === bizId);
    if (!biz) return;

    const tier = (biz.tier || 'basic').toLowerCase();
    const container = document.getElementById('profile-wrap');
    container.className = `profile-container ${tier}`;

    const mapUrl = biz.address ? `https://maps.google.com/maps?q=${encodeURIComponent(biz.address)}&output=embed` : '';
    const facebookHtml = (biz.facebook_url && biz.facebook_url !== "N/A" && biz.facebook_url !== "") 
        ? `<div class="info-item"><strong>Facebook:</strong> <a href="${biz.facebook_url}" target="_blank">View Page</a></div>` : '';
    const websiteBtn = (tier === 'premium' && biz.website && biz.website !== "N/A" && biz.website !== "")
        ? `<a href="${biz.website}" target="_blank" class="action-btn">Visit Website</a>` : '';

    document.getElementById('profile-details').innerHTML = `
        <div class="tier-indicator">${tier} Member</div>
        <a class="back-link" onclick="history.back()">← Back to Directory</a>
        <div class="profile-header">
            ${getSmartImage(biz.id, true)}
            <div>
                <h1 class="biz-title">${biz.name}</h1>
                <p class="biz-meta">${biz.town} — ${biz.category}</p>
                ${websiteBtn}
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
        ${tier === 'premium' && mapUrl ? `<iframe class="map-box" src="${mapUrl}"></iframe>` : ''}
    `;
}

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
