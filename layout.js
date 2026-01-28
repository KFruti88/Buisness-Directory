/**
 * PROJECT: Clay County Directory - Universal Yellow Layout
 * VERSION: 1.55 (Image Top, Town Middle, Centered Bottom)
 */
let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const couponIcon = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

// Color Lock Mapping [cite: 2026-01-28]
const townStyles = {
    "Flora": { bg: "#0c0b82", text: "#fe4f00" },
    "Louisville": { bg: "#010101", text: "#eb1c24" },
    "North Clay": { bg: "#010101", text: "#eb1c24" },
    "Clay City": { bg: "#0c30f0", text: "#8a8a88" },
    "Xenia": { bg: "#000000", text: "#fdb813" },
    "Sailor Springs": { bg: "#000000", text: "#a020f0" },
    "Clay County": { bg: "#333333", text: "#ffffff" }
};

document.addEventListener("DOMContentLoaded", () => { 
    fetchDirectoryData();
    setInterval(fetchDirectoryData, 300000); 
});

async function fetchDirectoryData() {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";
    Papa.parse(`${csvUrl}&t=${new Date().getTime()}`, {
        download: true, header: false, skipEmptyLines: true,
        complete: function(results) {
            masterData = results.data.slice(1).map(row => ({
                ImageID: row[0], Name: row[1], Tier: row[2], Category: row[3],
                Phone: row[4], Address: row[5], Town: row[6], StateZip: row[7],
                CouponLink: row[13]
            })).filter(b => b.Name);
            renderDirectoryGrid(masterData);
        }
    });
}

function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;
    
    // Universal Grid Layout [cite: 2026-01-26]
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(310px, 1fr))";
    grid.style.gap = "25px";

    grid.innerHTML = data.map(biz => {
        const tierL = (biz.Tier || 'basic').toLowerCase();
        const style = townColors[biz.Town.trim()] || townColors["Clay County"];
        const hasCoupon = (biz.CouponLink && biz.CouponLink !== "N/A");

        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.Name}')" style="background-color: #fff5ba; border: 2px solid #000; height: 480px; display: flex; flex-direction: column; position: relative; overflow: hidden; box-shadow: 6px 6px 0px rgba(0,0,0,0.1);">
            
            <div style="position:absolute; top:8px; left:8px; font-size: 0.65rem; border: 1px solid #000; background: #fff; padding: 2px 6px; font-weight: bold; z-index: 10;">${biz.Tier}</div>
            ${hasCoupon ? `<img src="${couponIcon}" style="position:absolute; top:8px; right:8px; width:30px; z-index: 10;">` : ""}

            <div class="logo-box" style="height: 160px; display: flex; align-items: center; justify-content: center; padding: 15px; background: transparent;">
                <img src="${imageRepo}${biz.ImageID}.jpeg" onerror="this.src='https://via.placeholder.com/150?text=Logo+Pending'" style="max-height: 100%; max-width: 100%; object-fit: contain;">
            </div>

            <div class="town-bar" style="background-color: ${style.bg}; color: ${style.text}; height: 35px; display: flex; align-items: center; justify-content: center; text-transform: uppercase; font-weight: 900; border-top: 2px solid #000; border-bottom: 2px solid #000; margin: 10px 0;">
                ${biz.Town}
            </div> 

            <div class="biz-name" style="height: 80px; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: bold; font-size: 1.3rem; padding: 0 10px; font-family: 'Times New Roman', serif;">
                ${biz.Name}
            </div> 
            
            <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding-bottom: 15px;">
                ${(tierL === 'premium' || tierL === 'plus') ? 
                    `<div style="font-weight:bold; font-size: 1.15rem; color: #0c30f0; margin-bottom: 5px;">📞 ${biz.Phone}</div>` : ''}
                <div style="font-size: 0.95rem; color: #444; font-weight: bold;">📁 ${biz.Category}</div> 
            </div>
        </div>`;
    }).join('');
}
