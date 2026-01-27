/**
 * 1. PROJECT CONFIGURATION
 */
let masterData = []; 
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";
const placeholderImg = "https://via.placeholder.com/150?text=Member";

/**
 * 2. MASTER CATEGORY LIST
 */
const catEmojis = {
    "Agriculture": "🚜", "Auto Parts": "⚙️", "Auto Repair": "🔧", "Bars/Saloon": "🍺",
    "Beauty Salon": "💇", "Carwash": "🧼", "Church": "⛪", "Community": "👥",
    "Delivery": "🚚", "Education & Health": "📚", "Executive & Administrative": "🏛️",
    "Financial Services": "💰", "Flower Shop": "💐", "Freight Trucking": "🚛",
    "Gambiling Industries": "🎰", "Gas Station": "⛽", "Government": "🏛️",
    "Handmade Ceramics & Pottery": "🏺", "Healthcare": "🏥", "Insurance": "📄",
    "Internet": "🌐", "Legal Services": "⚖️", "Libraries and Archives": "📚",
    "Manufacturing": "🏗️", "Medical": "🏥", "Professional Services": "💼",
    "Utility/Gas": "🔥", "Public Safety & Justice": "⚖️", "Public Works & Infrastructure": "🏗️",
    "Restaurants": "🍴", "Storage": "📦", "Stores": "🛍️", "USPS/Post Office": "📬",
    "Non-Profit": "📝"
};

/**
 * 3. INITIALIZATION
 */
document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader();
    loadDirectory();
    setupModalClose(); // Listener for the pop-out close button
});

async function loadDirectory() {
    const cacheBuster = new Date().getTime();
    Papa.parse(`${baseCsvUrl}&cb=${cacheBuster}`, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            masterData = results.data.map(row => {
                let obj = {};
                for (let key in row) {
                    let cleanKey = key.trim().replace(/\s+/g, '').toLowerCase();
                    obj[cleanKey] = row[key];
                }
                return obj;
            }).filter(row => row.name && row.name.trim() !== "");

            generateCategoryDropdown();
            renderCards(masterData);
        }
    });
}

/**
 * 4. RENDERING ENGINE (TIER-BASED LOGIC)
 */
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.map((biz, index) => {
        const tier = (biz.tier || 'basic').toLowerCase();
        const town = (biz.town || "Clay County").split(',')[0].replace(" IL", "").trim();
        const townClass = town.toLowerCase().replace(/\s+/g, '-');
        const displayCat = biz.category || "Professional Services";
        
        // Coupon Check
        const hasCoupon = biz.coupon && biz.coupon !== "N/A" && biz.coupon !== "";

        // TIER CONTENT LOGIC
        let imageHtml = `<img src="${placeholderImg}" style="height:150px; object-fit:contain;">`;
        let phoneHtml = "";
        let actionHtml = "";
        let cardClick = "";

        if (tier === "plus" || tier === "premium") {
            imageHtml = getSmartImage(biz.imageid, biz.name);
            phoneHtml = `<p style="margin:5px 0; font-weight:bold;">📞 ${biz.phone || 'N/A'}</p>`;
        }

        if (tier === "premium") {
            actionHtml = `<div style="color:blue; font-weight:bold; margin-top:10px;">Click for Details</div>`;
            cardClick = `onclick="openPremiumModal(${index})" style="cursor:pointer;"`;
        }

        return `
            <div class="card ${tier}" ${cardClick} 
                 style="width: 95%; max-width: 380px; height: 450px; margin: 10px auto; display: flex; flex-direction: column; position:relative;">
                
                <div class="tier-badge">${tier}</div>
                ${hasCoupon ? `<img src="${couponImg}" style="position:absolute; top:10px; right:10px; width:60px; z-index:5;">` : ""}
                
                <div class="logo-box" style="height: 150px; display: flex; align-items: center; justify-content: center; background:#f9f9f9;">
                    ${imageHtml}
                </div>

                <div class="town-bar ${townClass}-bar">${town}</div>

                <div style="flex-grow: 1; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <h2 style="margin:0; font-size:1.4rem;">${biz.name}</h2>
                    ${phoneHtml}
                    ${actionHtml}
                </div>

                <div class="category-footer" style="padding-bottom: 15px; font-weight: bold; font-style: italic; font-size: 0.85rem;">
                    ${catEmojis[displayCat] || "📁"} ${displayCat}
                </div>
            </div>`;
    }).join('');
}

/**
 * 5. PREMIUM POP-OUT MODAL LOGIC
 */
function openPremiumModal(index) {
    const biz = masterData[index];
    const modal = document.getElementById('premium-modal');
    const content = document.getElementById('modal-body');
    if (!modal || !content) return;

    const mapAddress = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);
    
    // Conditional Sections
    const couponSection = (biz.coupon && biz.coupon !== "N/A") ? `<div class="modal-section" style="background:#fff3cd; padding:15px; border-radius:8px; border:1px dashed #856404; margin-bottom:15px; text-align:center;"><h3>🎟️ LIVE COUPON</h3><p>${biz.coupon}</p></div>` : "";
    const webBtn = (biz.website && biz.website !== "N/A") ? `<a href="${biz.website}" target="_blank" class="modal-btn">Visit Website</a>` : "";
    const fbBtn = (biz.facebook && biz.facebook !== "N/A") ? `<a href="${biz.facebook}" target="_blank" class="modal-btn" style="background:#3b5998;">Facebook</a>` : "";
    const estDate = (biz.established && biz.established !== "N/A") ? `<p><strong>Established:</strong> ${biz.established}</p>` : "";
    const bioText = (biz.bio && biz.bio !== "N/A") ? `<div class="modal-section"><h3>About Us</h3><p>${biz.bio}</p></div>` : "";

    content.innerHTML = `
        <div style="text-align:center;">
            <div style="height:120px;">${getSmartImage(biz.imageid, biz.name)}</div>
            <h1 style="margin:10px 0;">${biz.name}</h1>
            <p>${biz.town} | ${biz.category}</p>
        </div>
        <hr>
        ${couponSection}
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
            <div>
                <h3>Contact Info</h3>
                <p>📞 ${biz.phone}</p>
                <p>📍 ${biz.address}</p>
                <p>⏰ ${biz.hours || 'N/A'}</p>
                ${estDate}
                <div style="margin-top:15px;">${webBtn} ${fbBtn}</div>
            </div>
            <div>
                <h3>Location</h3>
                <iframe width="100%" height="200" frameborder="0" src="https://maps.google.com/maps?q=${mapAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
            </div>
        </div>
        ${bioText}
    `;

    modal.style.display = "flex";
}

function setupModalClose() {
    const modal = document.getElementById('premium-modal');
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    }
}

/**
 * 6. UTILITIES
 */
function getSmartImage(id, bizName) {
    const fallback = `https://via.placeholder.com/150?text=Logo+Pending`;
    if (!id || id === "N/A") return `<img src="${fallback}" style="max-height:100%; object-fit:contain;">`;
    let fileName = id.trim().toLowerCase();
    return `<img src="${imageRepo}${fileName}.jpeg" style="max-height:100%; object-fit:contain;" onerror="this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${fallback}'};">`;
}

function updateNewspaperHeader() {
    const header = document.getElementById('header-info');
    if(header) {
        const now = new Date();
        header.innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${now.toLocaleDateString()}`;
    }
}

function generateCategoryDropdown() {
    const catSelect = document.getElementById('cat-select');
    if (!catSelect) return;
    catSelect.innerHTML = '<option value="All">📂 All Industries</option>';
    Object.keys(catEmojis).sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = `${catEmojis[cat]} ${cat}`;
        catSelect.appendChild(option);
    });
}
