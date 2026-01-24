let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImgUrl = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

// --- 1. PERMANENT EMOJI LOCK ---
const catEmojis = {
    "Church": "⛪", "Post Office": "📬", "Restaurants": "🍴", "Retail": "🛒", 
    "Shopping": "🛍️", "Manufacturing": "🏗️", "Industry": "🏭", 
    "Financial Services": "💰", "Healthcare": "🏥", "Gas Station": "⛽", 
    "Internet": "🌐", "Services": "🛠️", "Professional Services": "💼"
};

document.addEventListener("DOMContentLoaded", () => { loadDirectory(); });

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
    return `<img src="${firstUrl}" class="${isProfile ? 'profile-logo' : ''}" onerror="${errorChain.replace(/else$/, '')}">`;
}

// 3. DATA LOADING
async function loadDirectory() {
    Papa.parse(csvUrl, {
        download: true, header: true, skipEmptyLines: true,
        complete: function(results) {
            masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
            if (document.getElementById('directory-grid')) renderCards(masterData);
            else if (document.getElementById('profile-wrap')) loadProfile(masterData);
        }
    });
}

// 4. RENDER MAIN DIRECTORY (QR Codes added for Premium)
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.sort((a,b) => (a.Town || "").localeCompare(b.Town || "")).map(biz => {
        const tier = (biz.Teir || 'basic').toLowerCase();
        const imageID = (biz["Image ID"] || "").trim(); 
        const townClass = (biz.Town || "unknown").toLowerCase().replace(/\s+/g, '-');
        const category = (biz.Category || "Industry").trim(); 
        const emoji = catEmojis[category] || "📁";
        const hasCoupon = biz.Coupon && biz.Coupon.toUpperCase() !== "N/A" && biz.Coupon.trim() !== "";

        // --- QR CODE LOGIC ---
        // This creates a link to the profile page
        const profileUrl = `https://kfruti88.github.io/Buisness-Directory/profile.html?id=${encodeURIComponent(imageID)}`;
        // This sends that link to Google's API to get back a QR image
        const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=100x100&chl=${encodeURIComponent(profileUrl)}`;

        let clickAttr = "";
        if (tier === 'premium') {
            const targetUrl = `profile.html?id=${encodeURIComponent(imageID)}`;
            clickAttr = `onclick="window.location.href='${targetUrl}';"`;
        } else if (tier === 'plus') {
            clickAttr = `onclick="this.classList.toggle('expanded')"`;
        }

        return `
        <div class="card ${tier}" ${clickAttr} style="cursor: ${tier === 'premium' ? 'pointer' : 'default'};">
            ${hasCoupon ? `<img src="${couponImgUrl}" class="coupon-corner-image" alt="Coupon">` : ''}
            <div class="tier-badge">${tier}</div>
            <div class="logo-box">${getSmartImage(imageID)}</div>
            <div class="town-bar ${townClass}-bar">${biz.Town || 'Unknown'}</div>
            <div class="biz-name">${biz.Name || 'Unnamed Business'}</div>

            ${tier === 'plus' ? `<div class="plus-reveal">📞 ${biz.Phone || 'Contact for info'}</div>` : ''}
            
            ${tier === 'premium' ? `
                <div class="premium-info">
                    <div class="premium-phone">📞 ${biz.Phone || 'N/A'}</div>
                    <img src="${qrCodeUrl}" class="qr-code" alt="Scan for info">
                </div>
            ` : ''}

            <div class="cat-text">${emoji} ${category}</div>
        </div>`;
    }).join('');
}

// 5. LOAD PROFILE
function loadProfile(data) {
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get('id');
    const biz = data.find(b => (b["Image ID"] || "").trim() === bizId);
    
    if (!biz || (biz.Teir || "").toLowerCase() !== 'premium') {
        window.location.href = 'index.html'; 
        return;
    }

    const emoji = catEmojis[biz.Category] || "📁";
    const mapUrl = biz.Address ? `https://maps.google.com/maps?q=${encodeURIComponent(biz.Address)}&output=embed` : '';
    
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
        ${mapUrl ? `<iframe class="map-box" src="${mapUrl}" width="100%" height="350" style="border:0;" allowfullscreen></iframe>` : ''}
    `;
}

function applyFilters() {
    const catVal = document.getElementById('cat-select').value;
    const townVal = document.getElementById('town-select').value;
    const filtered = masterData.filter(biz => (catVal === 'All' || biz.Category === catVal) && (townVal === 'All' || biz.Town === townVal));
    renderCards(filtered);
}
