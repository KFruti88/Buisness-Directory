/**
 * PROJECT: Clay County Master Directory v9.9.1
 * LOCK: 65vh Height | 75% Width | No Empty Space Refinement
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

    // 4. BALANCED REFINED LAYOUT (65vh Height Lock)
    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div class="modal-inner-padding" style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
                <span class="close-x" onclick="closeModal()">×</span>
                
                <div style="border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 15px;">
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:90px; height:90px; border:2px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/90'">
                        <div>
                            <h2 style="margin:0; font-size: 2.4rem; text-transform: uppercase; line-height:1; color:#000;">${biz.name}</h2>
                            <p style="margin:8px 0 0 0; font-weight: 900; font-size: 1.1rem; color:#444;">📁 ${biz.category} | Est. ${biz.established || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; flex-grow: 1; align-items: start;">
                    <div style="font-size: 1.1rem; line-height: 1.6; color:#000;">
                        <p style="margin: 0 0 15px 0;"><strong>📍 ADDRESS:</strong><br>${biz.address}<br>${biz.town}, IL</p>
                        <p style="margin: 0 0 15px 0;"><strong>📞 PHONE:</strong><br>${biz.phone}</p>
                        <p style="margin: 0 0 15px 0;"><strong>🕒 HOURS:</strong><br>${biz.hours || 'Call for Details'}</p>
                        <div style="margin-top: 15px; display: flex; gap: 12px;">
                            ${biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="padding:12px 20px; background:#000; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff;">WEBSITE</a>` : ''}
                            ${biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="padding:12px 20px; background:#0c0b82; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff;">FACEBOOK</a>` : ''}
                        </div>
                    </div>
                    <div style="border: 3px solid #000; height: 260px; box-shadow: 10px 10px 0px rgba(0,0,0,0.1); overflow:hidden;">
                        <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>

                <div style="margin-top: 20px; border-top: 2px dashed #000; padding-top: 15px;">
                    <h3 style="text-transform: uppercase; margin:0 0 8px 0; font-size: 1.2rem; color:#000;">About Our Business</h3>
                    <p style="font-size: 1.1rem; margin: 0; line-height: 1.5; color:#000;">${biz.bio || 'Proudly serving the Clay County community.'}</p>
                    
                    ${biz.couponTxt ? `
                    <div style="margin-top: 15px; padding: 12px; background: rgba(255,255,255,0.3); border: 2px solid #fe4f00;">
                        <p style="margin:0; font-weight:900; font-size:1rem; color:#fe4f00; text-transform:uppercase;">Community Coupon: ${biz.couponTxt}</p>
                    </div>` : ''}
                </div>
            </div>
        `;
    } else {
        // BASIC: Refined Summary View
        body.innerHTML = `
            <div class="modal-inner-padding" style="display: flex; flex-direction: column; height: 100%; justify-content: center; text-align: center; color:#000;">
                <span class="close-x" onclick="closeModal()">×</span>
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:100px; margin: 0 auto 20px auto; border: 2px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/100'">
                <h2 style="font-size: 2.4rem; text-transform: uppercase; margin: 0;">${biz.name}</h2>
                <div style="margin-top: 25px; padding: 25px; border: 4px dashed #000; background: rgba(255,255,255,0.2);">
                     <p style="font-weight:900; font-size: 1.4rem; text-transform:uppercase; margin:0;">Visit us in ${biz.town}!</p>
                </div>
            </div>
        `;
    }

    // 5. ACTIVATE MODAL
    modal.style.display = 'flex';
}

/**
 * CLOSE HANDSHAKE
 */
function closeModal() {
    const modal = document.getElementById('premium-modal');
    if (modal) modal.style.display = 'none';
}

// Global click-off listener
window.onclick = function(event) {
    const modal = document.getElementById('premium-modal');
    if (event.target == modal) closeModal();
}
