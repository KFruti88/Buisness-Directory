/**
 * PROJECT: Clay County Directory Engine (Sandbox Fix)
 * VERSION: 1.43
 */

// Your Town Color Map Standard
const townColors = { 
    "Flora": { bg: "#0c0b82", text: "#fe4f00" }, 
    "Louisville": { bg: "#010101", text: "#eb1c24" }, 
    "North Clay": { bg: "#010101", text: "#eb1c24" }, 
    "Clay City": { bg: "#0c30f0", text: "#8a8a88" }, 
    "Xenia": { bg: "#000000", text: "#fdb813" }, 
    "Sailor Springs": { bg: "#000000", text: "#a020f0" }, 
    "Clay County": { bg: "#333333", text: "#ffffff" } 
};

async function loadDirectory() {
    try {
        // Cache buster ensures Sandbox fetches the LATEST data
        const response = await fetch('directory.json?t=' + new Date().getTime());
        
        if (!response.ok) throw new Error("File not found in Sandbox root");
        
        const data = await response.json();
        const grid = document.getElementById('directory-grid');
        
        if (data.length === 0) {
            grid.innerHTML = "<h2>No business data found in JSON.</h2>";
            return;
        }

        grid.innerHTML = data.map(biz => {
            const style = townColors[biz.town] || townColors["Clay County"];
            
            return `
                <div class="card" style="background-color: #fff5ba !important; border: 2px solid #000;">
                    <div class="logo-box">
                        <img src="https://raw.githubusercontent.com/KFruti88/images/main/${biz.image_id}.jpeg" 
                             onerror="this.src='https://via.placeholder.com/150?text=Logo+Pending'">
                    </div>
                    <div class="town-bar" style="background-color: ${style.bg}; color: ${style.text}; border: 2px solid #000;">
                        ${biz.town}
                    </div>
                    <div class="biz-name">${biz.name}</div>
                    <div style="padding-bottom: 10px;">
                        <p>📁 ${biz.category}</p>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error("Sandbox Error:", error);
        // Fallback for blank screens
        document.getElementById('directory-grid').innerHTML = `<h2>Error: ${error.message}</h2><p>Make sure directory.json is in the root folder.</p>`;
    }
}

window.onload = loadDirectory;
