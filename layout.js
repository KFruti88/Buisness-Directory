function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid || !data) return;

    grid.innerHTML = data.map(biz => {
        // 1. MUST use lowercase 'tier' to match JSON output
        const tierL = (biz.tier || 'basic').toLowerCase();
        
        // 2. MUST use lowercase 'town' for the Color Lock check [cite: 2026-01-28]
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
