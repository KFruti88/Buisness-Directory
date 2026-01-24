/* script.js */
let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

// Load the master directory
async function loadDirectory() {
    try {
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
    }
}

// Function for the main index page
function renderCards(data) {
    const grid = document.getElementById('directory-grid');
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

// Filter Logic for index page
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
