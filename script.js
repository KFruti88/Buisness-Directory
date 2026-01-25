let masterData = [];

// 1. PROJECT CONFIGURATION
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

// Shared brands that use one logo for multiple towns
const sharedBrands = ["casey's", "mcdonald's", "huck's", "subway", "dollar general", "mach 1"];

const catEmojis = {
    "Bars": "🍺", "Emergency": "🚨", "Church": "⛪", "Post Office": "📬", 
    "Restaurants": "🍴", "Retail": "🛒", "Shopping": "🛍️", "Manufacturing": "🏗️", 
    "Industry": "🏭", "Financial Services": "💰", "Healthcare": "🏥", 
    "Gas Station": "⛽", "Internet": "🌐", "Support Services": "🛠️", 
    "Professional Services": "💼", "Agriculture": "🚜"
};

// 2. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => { 
    updateNewspaperHeader(); // Set header date/weather
    loadDirectory();         // Load CSV data
});

// 3. NEWSPAPER HEADER LOGIC (Date & Weather)
async function updateNewspaperHeader() {
    const now = new Date();
    
    // 1. Set Date and Dynamic Issue Number (January=1, February=2, etc.)
    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const issueNum = now.getMonth() + 1;
    
    const headerInfo = document.getElementById('header-info');
    if (headerInfo) {
        headerInfo.innerText = `VOL. 1 — NO. ${issueNum} | ${dateString}`;
    }

    // 2. Fetch Accurate Weather for Flora (62839)
    // IMPORTANT: Replace 'YOUR_FREE_OPENWEATHER_API_KEY' with your actual key
    const apiKey = 'YOUR_FREE_OPENWEATHER_API_KEY'; 
    const zip = '62839';
    const weatherElem = document.getElementById('weather-display');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${apiKey}`);
        const data = await response.json();
        
        if (data.main) {
            const temp = Math.round(data.main.temp);
            const condition = data.weather[0].main;
            weatherElem.innerHTML = `${temp}°F <small>${condition}</small>`;
        }
    } catch (error) {
        if (weatherElem) weatherElem.innerText = "Weather N/A";
        console.error("Weather Error:", error);
    }
}

// 4. SMART IMAGE HELPER
function getSmartImage(id, bizName, isProfile = false) {
    if(!id && !bizName) return '';
    
    let fileName = id.trim().toLowerCase();
    const nameLower = bizName ? bizName.toLowerCase() : "";

    const brandMatch = sharedBrands.find(brand => nameLower.includes(brand));
    if (brandMatch) {
        fileName = brandMatch.replace(/['\s]/g, ""); 
    }

    const placeholder = `https://via.placeholder.com/${isProfile ? '200' : '150'}?text=Logo+Pending`;
    const firstUrl = `${imageRepo}${fileName}.jpg`;
    
    return `<img src="${firstUrl}" class="${isProfile ? 'profile-logo' : ''}" 
            onerror="this.onerror=null; 
            this.src='${imageRepo}${fileName}.png'; 
            this.onerror=function(){this.src='${placeholder}'};">`;
}

// 5. DATA LOADING ENGINE
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

// 6. RENDER MAIN DIRECTORY
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    const tierOrder = { "premium": 1, "plus": 2, "basic": 3 };

    grid.innerHTML = data.sort((a, b) => {
        const tierA = (a.Teir || 'basic').toLowerCase();
        const tierB = (b.Teir || 'basic').toLowerCase();
        
        if (tierOrder[tierA] !== tierOrder[tierB]) {
            return tierOrder[tierA] - tierOrder[tierB];
        }
        return (a.Town || "").localeCompare(b.Town || "");
    }).map(biz => {
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
            <div class="logo-box">${getSmartImage(imageID, biz.Name)}</div>
            <div class="town-bar ${townClass}-bar">${biz.Town || 'Unknown'}</div>
            <div class="biz-name">${biz.Name || 'Unnamed Business'}</div>
            ${tier === 'plus' ? `<div class="plus-reveal">📞 ${biz.Phone || 'Contact for Info'}</div>` : ''}
            <div class="cat-text">${catEmojis[category] || "📁"} ${category}</div>
        </div>`;
    }).join('');
    
    const counter = document.getElementById('counter-display');
    if (counter) counter.innerText = `${data.length} Businesses Listed`;
}

// 7. LOAD INDIVIDUAL PROFILE
function loadProfile(data) {
    const params = new URLSearchParams(window.location.search);
    const bizId = params.get('id');
    const biz = data.find(b => (b["Image ID"] || "").trim().toLowerCase() === (bizId || "").toLowerCase());
    
    const container = document.getElementById('profile-wrap');
    if (!biz) {
        container.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Business Not Found</h2></div>`;
        return;
    }

    // Fixed Google Maps encoding syntax
    const simpleMap = biz.Address && biz.Address !== "N/A" 
        ? `https://maps.google.com/maps?q=${encodeURIComponent(biz.Address)}&t=&z=13&ie=UTF8&iwloc=&output=embed` 
        : '';

    container.innerHTML = `
        <div class="profile-container premium">
            <a href="index.html" class="back-link">← Back to Directory</a>
            <div class="profile-header">
                <div class="profile-logo-box">${getSmartImage(biz["Image ID"], biz.Name, true)}</div>
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
            ${simpleMap ? `<iframe class="map-box" src="${simpleMap}" width="100%" height="350" style="border:0;" allowfullscreen></iframe>` : ''}
        </div>`;
}

// 8. FILTER LOGIC
function applyFilters() {
    const catVal = document.getElementById('cat-select').value;
    const townVal = document.getElementById('town-select').value;
    const filtered = masterData.filter(biz => (catVal === 'All' || biz.Category === catVal) && (townVal === 'All' || biz.Town === townVal));
    renderCards(filtered);
}
