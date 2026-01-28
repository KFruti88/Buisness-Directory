/**
 * PROJECT: Clay County Directory Engine
 * VERSION: 1.42 (Yellow Layout Sync)
 */

// Color Lock Mapping Standard [cite: 2026-01-28]
const townColors = { 
    "Flora": { bg: "#0c0b82", text: "#fe4f00" }, 
    "Louisville": { bg: "#010101", text: "#eb1c24" }, 
    "North Clay": { bg: "#010101", text: "#eb1c24" }, 
    "Clay City": { bg: "#0c30f0", text: "#8a8a88" }, 
    "Xenia": { bg: "#000000", text: "#fdb813" }, 
    "Sailor Springs": { bg: "#000000", text: "#a020f0" }, 
    "Clay County": { bg: "#333333", text: "#ffffff" } 
};

function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.map(biz => {
        const tierL = biz.tier.toLowerCase();
        // Pull Town color mapping based on Column G [cite: 2026-01-28]
        const style = townColors[biz.town] || townColors["Clay County"];
        
        return `
        <div class="card ${tierL}" onclick="openFullModal('${biz.name}')">
            <div class="logo-box">
                <img src="https://raw.githubusercontent.com/KFruti88/images/main/${biz.image_id}.jpeg" 
                     onerror="this.src='https://via.placeholder.com/150?text=Logo+Pending'">
            </div>

            <div class="town-bar" style="background-color: ${style.bg}; color: ${style.text};">
                ${biz.town}
            </div> 

            <div class="biz-name">
                ${biz.name}
            </div> 
            
            <div style="padding-bottom: 20px;">
                <div style="font-size: 1.1rem; font-weight: bold; color: #0c30f0;">
                    ${tierL !== 'basic' ? `📞 ${biz.phone}` : ''}
                </div>
                <div style="font-size: 0.9rem; color: #444; margin-top: 5px;">
                    📁 ${biz.category}
                </div>
            </div>
        </div>`;
    }).join('');
}
