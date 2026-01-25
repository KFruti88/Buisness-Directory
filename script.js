let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

// Shared brands that use one logo for multiple towns
const sharedBrands = ["casey's", "mcdonald's", "huck's", "subway", "dollar general", "mach 1"];

const catEmojis = {
    "Emergency": "🚨", "Manufacturing": "🏗️", "Bars": "🍺", "Professional Services": "💼",
    "Financial Services": "💰", "Retail": "🛒", "Shopping": "🛍️", "Restaurants": "🍴",
    "Church": "⛪", "Post Office": "📬", "Healthcare": "🏥", "Support Services": "🛠️",
    "Internet": "🌐", "Gas Station": "⛽", "Industry": "🏭", "Agriculture": "🚜"
};

document.addEventListener("DOMContentLoaded", () => {
    updateNewspaperHeader();
    loadDirectory();
});

function updateNewspaperHeader() {
    const now = new Date();
    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('header-info').innerText = `VOL. 1 — NO. ${now.getMonth() + 1} | ${dateString}`;
}

// SMART IMAGE HELPER - Integrated to handle extensions and shared brands
function getSmartImage(id, bizName) {
    if (!id && !bizName) return `https://via.placeholder.com/150?text=Logo+Pending`;
    
    let fileName = id.trim().toLowerCase();
    const nameLower = bizName ? bizName.toLowerCase() : "";

    const brandMatch = sharedBrands.find(brand => nameLower.includes(brand));
    if (brandMatch) {
        fileName = brandMatch.replace(/['\s]/g, ""); 
    }

    const placeholder = `https://via.placeholder.com/150?text=Logo+Pending`;
    const firstUrl = `${imageRepo}${fileName}.jpg`;
    
    return `<img src="${firstUrl}" 
            onerror="this.onerror=null; 
            this.src='${imageRepo}${fileName}.png'; 
            this.onerror=function(){this.src='${placeholder}'};">`;
}

async function loadDirectory() {
    Papa.parse(csvUrl, {
        download: true, header: true, skipEmptyLines: true,
        complete: (results) => {
            masterData = results.data.filter(row => row.Name && row.Name.trim() !== "");
            renderCards(masterData);
        }
    });
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // Maintain Tier Sorting: Premium -> Plus -> Basic
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
        const hasCoupon = biz.Coupon && biz.Coupon !== "N/A" && biz.Coupon.trim() !== "";
        const townClass = (biz.Town || "unknown").toLowerCase().replace(/\s+/g, '-');
        const imageID = (biz['Image ID'] || "").trim();
        const category = (biz.Category || "Industry").trim();

        let clickAttr = "";
        if (tier === 'premium') {
            clickAttr = `onclick="window.location.href='profile.html?id=${encodeURIComponent(imageID.toLowerCase())}'"`;
        } else if (tier === 'plus') {
            clickAttr = `onclick="this.classList.toggle('expanded')"`;
        }

        return `
            <div class="card ${tier}" ${clickAttr} style="cursor: ${tier === 'premium' ? 'pointer' : (tier === 'plus' ? 'pointer' : 'default')};">
                <div class="tier-badge">${tier}</div>
                ${hasCoupon ? `<img src="${couponImg}" class="coupon-badge" alt="Discount Available">` : ''}
                
                <div class="logo-box">
                    ${getSmartImage(imageID, biz.Name)}
                </div>

                <div class="town-bar ${townClass}-bar">${biz.Town || 'Unknown'}</div>
                <h2 style="font-size: 1.4rem; margin: 5px 0; line-height: 1.1;">${biz.Name}</h2>

                ${tier === 'plus' ? `
                    <div class="plus-reveal">
                        <p style="margin: 5px 0;"><strong>Phone:</strong> ${biz.Phone || 'N/A'}</p>
                        <p style="margin: 5px 0;"><strong>Est:</strong> ${biz['Date Started'] || 'N/A'}</p>
                    </div>
                ` : ''}

                <div style="margin-top: auto; font-style: italic; font-size: 0.85rem; color: #444;">
                    ${catEmojis[category] || "🏭"} ${category}
                </div>
            </div>
        `;
    }).join('');
}

function applyFilters() {
    const t = document.getElementById('town-select').value;
    const c = document.getElementById('cat-select').value;
    const filtered = masterData.filter(b => (t === 'All' || b.Town === t) && (c === 'All' || b.Category === c));
    renderCards(filtered);
}

function resetFilters() {
    document.getElementById('town-select').value = 'All';
    document.getElementById('cat-select').value = 'All';
    renderCards(masterData);
}
