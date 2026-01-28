/**
 * PROJECT: Clay County Directory Engine
 * VERSION: 1.54 (Scott's Priority Layout)
 */
let masterData = [];
const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const couponIcon = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";

const townStyles = {
    "Flora": { bar: "flora-bar" },
    "Louisville": { bar: "louisville-bar" },
    "North Clay": { bar: "louisville-bar" },
    "Clay City": { bar: "clay-city-bar" },
    "Xenia": { bar: "xenia-bar" },
    "Sailor Springs": { bar: "sailor-springs-bar" }
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
                Established: row[12], CouponLink: row[13]
            })).filter(b => b.Name);
            renderDirectoryGrid(masterData);
        }
    });
}

function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    grid.innerHTML = data.map(biz => {
        const tierL = (biz.Tier || 'basic').toLowerCase();
        const townClass = townStyles[biz.Town.trim()]?.bar || "";
        const hasCoupon = (biz.CouponLink && biz.CouponLink !== "N/A");

        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.Name}')" style="background-color: #fff5ba !important;">
            <div class="tier-badge">${biz.Tier}</div>
            ${hasCoupon ? `<img src="${couponIcon}" style="position:absolute; top:8px; right:8px; width:30px; z-index:20;">` : ""}

            <div class="logo-box">
                <img src="${imageRepo}${biz.ImageID}.jpeg" onerror="this.src='https://via.placeholder.com/150'">
            </div>

            <div class="town-bar ${townClass}">${biz.Town}</div> 

            <div class="biz-name">${biz.Name}</div> 
            
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding-bottom:15px; text-align:center;">
                ${(tierL === 'premium' || tierL === 'plus') ? `<div style="color:#0c30f0; font-weight:bold; font-size:1.15rem; margin-bottom:5px;">📞 ${biz.Phone}</div>` : ''}
                <div style="font-size:0.9rem; color:#444; font-weight:bold;">📁 ${biz.Category}</div>
            </div>
        </div>`;
    }).join('');
}
