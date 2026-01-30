/**
 * PROJECT: Clay County Master Directory v9.6
 * LOCK: Zero-Scroll Scaling | High-Gloss Yellow | Tiered Logic
 * [cite: 2026-01-30]
 */

function openFullModal(bizName) {
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body-content');
    const tierL = (biz.tier || 'basic').toLowerCase();
    const mapAddr = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);

    // PREMIUM & PLUS: Full Fluid Layout
    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div class="modal-inner-padding">
                <span class="close-x" onclick="closeModal()">×</span>
                
                <div style="border-bottom: 3px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:70px; height:70px; border:2px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/70'">
                        <div>
                            <h2 style="margin:0; font-size: 2rem; text-transform: uppercase; line-height:1;">${biz.name}</h2>
                            <p style="margin:5px 0 0 0; font-weight: 900; font-size: 1rem;">📁 ${biz.category} | Est. ${biz.established || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex-grow: 1; min-height: 0;">
                    <div style="font-size: 1rem; overflow: hidden;">
                        <p style="margin: 0 0 10px 0;"><strong>📍 ADDRESS:</strong><br>${biz.address}, ${biz.town}, IL</p>
                        <p style="margin: 0 0 10px 0;"><strong>📞 PHONE:</strong><br>${biz.phone}</p>
                        <p style="margin: 0 0 10px 0;"><strong>🕒 HOURS:</strong><br>${biz.hours || 'Call for Details'}</p>
                        
                        <div style="margin-top: 15px; display: flex; gap: 10px;">
                            ${biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="padding:10px 15px; background:#000; color:#fff; text-decoration:none; font-weight:bold; font-size:0.8rem; border:1px solid #fff;">WEBSITE</a>` : ''}
                            ${biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="padding:10px 15px; background:#0c0b82; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff; font-size:0.8rem;">FACEBOOK</a>` : ''}
                        </div>
                    </div>

                    <div class="map-side-container" style="border: 3px solid #000; height: 180px; box-shadow: 8px 8px 0px rgba(0,0,0,0.1);">
                        <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>

                <div style="margin-top: 15px; border-top: 2px dashed #000; padding-top: 10px;">
                    <h3 style="text-transform: uppercase; margin:0; font-size: 1rem;">About Us</h3>
                    <p style="font-size: 0.95rem; margin: 5px 0 0 0; line-height: 1.4;">${biz.bio || 'Proudly serving the Clay County community.'}</p>
                    
                    ${biz.couponTxt ? `
                    <div style="margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.3); border: 2px solid #fe4f00;">
                        <p style="margin:0; font-weight:bold; font-size:0.9rem; color:#fe4f00;">COUPON: ${biz.couponTxt}</p>
                    </div>` : ''}
                </div>
            </div>
        `;
    } else {
        // BASIC: Simplified Centered Content
        body.innerHTML = `
            <div class="modal-inner-padding" style="text-align: center; justify-content: center;">
                <span class="close-x" onclick="closeModal()">×</span>
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:100px; margin-bottom: 15px; border: 2px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/100'">
                <h2 style="font-size: 2.2rem; text-transform: uppercase; margin: 0;">${biz.name}</h2>
                <p style="font-size: 1.2rem; font-weight:bold; margin: 10px 0;">📍 ${biz.town} | 📁 ${biz.category}</p>
                <div style="margin-top: 20px; padding: 20px; border: 4px dashed #000; background: rgba(255,255,255,0.2);">
                     <p style="font-weight:900; font-size: 1.4rem; text-transform:uppercase; margin:0;">Visit us in ${biz.town}!</p>
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
