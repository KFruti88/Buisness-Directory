/**
 * PROJECT: Clay County Directory Engine - Yellow Layout
 * VERSION: 1.46
 * STANDARDS: A-M Mapping, Color Lock Town Bars [cite: 2026-01-28]
 */

// Master Town Color Palette [cite: 2026-01-28]
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
        // Fetch JSON from your GitHub Python automation
        const response = await fetch('directory.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error("Directory JSON not found");
        
        const data = await response.json();
        renderDirectoryGrid(data);
    } catch (error) {
        console.error("Sync Error:", error);
        grid.innerHTML = `<h2 style="color:red; text-align:center;">Error: ${error.message}</h2>`;
    }
}

function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.map(biz => {
        // Town color mapping from Column G [cite: 2026-01-28]
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

            <div style="padding-bottom: 20px;">
                <div style="font-size: 0.9rem; color: #444;">📁 ${biz.category}</div>
                ${tierL !== 'basic' ? `<div style="color: #0c30f0; font-weight: bold; margin-top: 5px;">📞 ${biz.phone}</div>` : ''}
            </div>
        </div>`;
    }).join('');
}

// Start the directory on page load
document.addEventListener('DOMContentLoaded', fetchDirectoryData);
