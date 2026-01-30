/**
 * PROJECT: Clay County Master Directory v9.9
 * LOCK: 65vh Height | 75% Width | Zero-Scroll Scaling
 * THEME: High-Gloss Balanced Index Card [cite: 2026-01-30]
 */

function openFullModal(bizName) {
    // 1. Find the business in the global window.allData
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    // 2. Target the isolated Safety Wall containers
    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body-content');
    const tierL = (biz.tier || 'basic').toLowerCase();
    
    // 3. Safety check for map encoding
    const mapAddr = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);

    // 4. BALANCED LAYOUT (65vh Height Lock)
    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div class="modal-inner-padding">
                <span class="close-x" onclick="closeModal()">×</span>
                
                <div style="border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 20px; display: flex; align-items: center; gap: 20px;">
                    <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:80px; height:80px; border:2px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/80'">
                    <div>
                        <h2 style="margin:0; font-size: 2.2rem; text-transform: uppercase; line-height:1; color:#000;">${biz.name}</h2>
                        <p style="margin:5px 0 0 0; font-weight: 900; font-size: 1.1rem; color:#000;">📁 ${biz.category} | Est. ${biz.established || 'N/A'}</p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; flex-grow: 1; min-height: 0;">
                    <div style="font-size: 1.1rem; line-height: 1.6; color:#000;">
                        <p style="margin: 0 0 12px 0;"><strong>📍 ADDRESS:</strong><br>${biz.address}<br>${biz.town}, IL</p>
                        <p style="margin: 0 0 12px 0;"><strong>📞 PHONE:</strong><br>${biz.phone}</p>
                        <div style="margin-top: 15px; display: flex; gap: 12px;">
                            ${biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="padding:10px 18px; background:#000; color:#fff; text-decoration:none; font-weight:bold; font-size:0.85rem; border:1px solid #fff;">WEBSITE</a>` : ''}
                            ${biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="padding:10px 18px; background:#0c0b82; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff; font-size:0.85rem;">FACEBOOK</a>` : ''}
                        </div>
                    </div>
                    <div class="map-side-container">
                        <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>

                <div style="margin-top: 20px; border-top: 2px dashed #000; padding-top: 15px; color:#000;">
                    <h3 style="text-transform: uppercase; margin:0; font-size: 1.1rem;">About Us</h3>
                    <p style="font-size: 1.05rem; margin: 5px 0 0 0; line-height: 1.5;">${biz.bio || 'Proudly serving the Clay County community.'}</p>
                </div>
            </div>
        `;
    } else {
        // BASIC: Balanced Summary View
        body.innerHTML = `
            <div class="modal-inner-padding" style="text-align: center; justify-content: center; color:#000;">
                <span class="close-x" onclick="closeModal()">×</span>
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:100px; margin-bottom: 20px; border: 2px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/100'">
                <h2 style="font-size: 2.2rem; text-transform: uppercase; margin: 0;">${biz.name}</h2>
                <div style="margin-top: 25px; padding: 20px; border: 4px dashed #000; background: rgba(255,255,255,0.2);">
                     <p style="font-weight:900; font-size: 1.3rem; text-transform:uppercase; margin:0;">Visit us in ${biz.town}!</p>
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
