/**
 * PROJECT: Clay County Directory Engine - Universal Fix
 * VERSION: 1.49
 */

// Color Lock Standard for Towns [cite: 2026-01-28]
const townColors = { 
    "Flora": { bg: "#0c0b82", text: "#fe4f00" }, 
    "Louisville": { bg: "#010101", text: "#eb1c24" }, 
    "North Clay": { bg: "#010101", text: "#eb1c24" }, 
    "Clay City": { bg: "#0c30f0", text: "#8a8a88" }, 
    "Xenia": { bg: "#000000", text: "#fdb813" }, 
    "Sailor Springs": { bg: "#000000", text: "#a020f0" }, 
    "Clay County": { bg: "#333333", text: "#ffffff" } 
};

async function fetchDirectoryData() {
    const grid = document.getElementById('directory-grid');
    try {
        // Universal Cache Busting [cite: 2026-01-26]
        const response = await fetch('directory.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error("Connection failed");
        
        const data = await response.json();
        renderDirectoryGrid(data);
    } catch (error) {
        console.error("Universal Sync Error:", error);
        grid.innerHTML = `<h2 style="text-align:center;">Checking for Updates...</h2>`;
    }
}

function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    // Cross-browser mapping logic
    grid.innerHTML = data.map(biz => {
        const style = townColors[biz.town] || townColors["Clay County"];
        const tierL = (biz.tier || 'basic').toLowerCase();
        
        return `
        <div class="card ${tierL}">
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

            <div style="padding-bottom: 20px; font-family: Arial, Helvetica, sans-serif;">
                <div style="font-size: 0.9rem; color: #444;">📁 ${biz.category}</div>
                ${tierL !== 'basic' ? `<div style="color: #0c30f0; font-weight: bold; margin-top: 5px;">📞 ${biz.phone}</div>` : ''}
            </div>
        </div>`;
    }).join('');
}

// Initial Universal Listener
document.addEventListener('DOMContentLoaded', fetchDirectoryData);
