/**
 * PROJECT: Clay County Compact Modal v9.8
 * LOCK: 50vh Height | Glossy Yellow | Zero-Scroll
 * [cite: 2026-01-30]
 */

function openFullModal(bizName) {
    // 1. Find the business in the global window.allData
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    // 2. Identify target containers
    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body-content');
    const tierL = (biz.tier || 'basic').toLowerCase();
    
    // 3. Safety check for map encoding
    const mapAddr = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);

    // 4. COMPACT LAYOUT (50vh Lock)
    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div class="modal-inner-padding">
                <span class="close-x" onclick="closeModal()">×</span>
                
                <div style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; display: flex; align-items: center; gap: 15px;">
                    <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:55px; height:55px; border:1px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/55'">
                    <div>
                        <h2 style="margin:0; font-size: 1.6rem; text-transform: uppercase; line-height:1; color:#000;">${biz.name}</h2>
                        <p style="margin:2px 0 0 0; font-weight: 900; font-size: 0.85rem; color:#000;">📁 ${biz.category}</p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex-grow: 1; min-height: 0;">
                    <div style="font-size: 0.95rem; line-height: 1.3; color:#000;">
                        <p style="margin: 0 0 8px 0;"><strong>📍 ADDR:</strong><br>${biz.address}, ${biz.town}</p>
                        <p style="margin: 0 0 8px 0;"><strong>📞 PH:</strong><br>${biz.phone}</p>
                        <div style="margin-top: 12px; display: flex; gap: 8px;">
                            ${biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="padding:6px 12px; background:#000; color:#fff; text-decoration:none; font-weight:bold; font-size:0.75rem; border:1px solid #fff;">WEB</a>` : ''}
                            ${biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="padding:6px 12px; background:#0c0b82; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff; font-size:0.75rem;">FB</a>` : ''}
                        </div>
                    </div>

                    <div class="map-side-container" style="border: 2px solid #000; height: 140px; box-shadow: 6px 6px 0px rgba(0,0,0,0.1);">
                        <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>

                <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 8px;">
                    <p style="font-size: 0.85rem; margin: 0; line-height: 1.4; color:#000;">${biz.bio || 'Serving the Clay County community.'}</p>
                </div>
            </div>
        `;
    } else {
        // BASIC: Simple Compact Centered View
        body.innerHTML = `
            <div class="modal-inner-padding" style="text-align: center; justify-content: center;">
                <span class="close-x" onclick="closeModal()">×</span>
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:80px; margin-bottom: 15px; border: 1px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/80'">
                <h2 style="font-size: 1.8rem; text-transform: uppercase; margin: 0; color:#000;">${biz.name}</h2>
                <div style="margin-top: 15px; padding: 15px; border: 3px dashed #000; background: rgba(255,255,255,0.2);">
                     <p style="font-weight:900; font-size: 1.1rem; text-transform:uppercase; margin:0; color:#000;">Visit us in ${biz.town}!</p>
                </div>
            </div>
        `;
    }

    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('premium-modal');
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('premium-modal');
    if (event.target == modal) closeModal();
}
