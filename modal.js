/**
 * PROJECT: Clay County Glossy Modal v9.5
 * LOCK: Info -> Map -> Bio -> Coupon Flow [cite: 2026-01-30]
 * THEME: High-Gloss Yellow Gradient | 75% Wide | Isolated Layer
 */

function openFullModal(bizName) {
    // 1. Find the business in the global data
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    // 2. Target the isolated Safety Wall containers
    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body-content');
    const tierL = (biz.tier || 'basic').toLowerCase();
    
    // 3. Safety check for map encoding
    const mapAddr = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);

    // 4. PREMIUM & PLUS LAYOUT (Full Glossy Detail)
    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div class="modal-inner-padding">
                <span class="close-x" onclick="closeModal()">×</span>
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
                    <div style="display: flex; gap: 25px; align-items: center;">
                        <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:110px; height:110px; border:2px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/110'">
                        <div>
                            <h2 style="margin:0; font-size: 2.8rem; text-transform: uppercase; line-height:1; color:#000;">${biz.name}</h2>
                            <p style="margin:10px 0 0 0; font-weight: 900; font-size: 1.2rem; color:#000;">📁 ${biz.category} | Est. ${biz.established || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
                    <div style="font-size: 1.15rem; line-height: 1.6; color:#000;">
                        <p style="margin:0 0 15px 0;"><strong>📍 ADDRESS:</strong><br>${biz.address}<br>${biz.town}, IL</p>
                        <p style="margin:0 0 15px 0;"><strong>📞 PHONE:</strong><br>${biz.phone}</p>
                        <p style="margin:0 0 15px 0;"><strong>🕒 HOURS:</strong><br>${biz.hours || 'Call for Hours'}</p>
                        
                        <div style="margin-top: 25px; display: flex; gap: 15px;">
                            ${biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="padding:12px 20px; background:#000; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff; font-size:0.9rem;">WEBSITE</a>` : ''}
                            ${biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="padding:12px 20px; background:#0c0b82; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff; font-size:0.9rem;">FACEBOOK</a>` : ''}
                        </div>
                    </div>

                    <div style="border: 3px solid #000; background: #eee; height: 240px; box-shadow: 10px 10px 0px rgba(0,0,0,0.1); overflow:hidden;">
                        <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>

                <div style="margin-top: 40px; border-top: 2px dashed #000; padding-top: 25px; color:#000;">
                    <h3 style="text-transform: uppercase; margin:0 0 10px 0;">About Our Business</h3>
                    <p style="font-size: 1.2rem; line-height: 1.6;">${biz.bio || 'Proudly serving the Clay County community.'}</p>
                </div>

                ${biz.couponTxt ? `
                <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.3); border: 2px solid #fe4f00;">
                    <h4 style="margin:0; color:#fe4f00; text-transform:uppercase;">Community Coupon</h4>
                    <p style="margin:5px 0 0 0; font-weight:bold; color:#000;">${biz.couponTxt}</p>
                </div>` : ''}
            </div>
        `;
    } else {
        // 5. BASIC TIER: Polished Summary View
        body.innerHTML = `
            <div class="modal-inner-padding" style="text-align: center; color: #000;">
                <span class="close-x" onclick="closeModal()">×</span>
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:140px; margin-bottom: 20px; border: 2px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/140'">
                <h2 style="font-size: 2.8rem; text-transform: uppercase; margin: 0 0 10px 0; line-height:1;">${biz.name}</h2>
                <p style="font-size: 1.3rem; font-weight:bold;">📍 ${biz.town} | 📁 ${biz.category}</p>
                <div style="margin-top: 30px; padding: 25px; border: 4px dashed #000; background: rgba(255,255,255,0.2);">
                     <p style="font-weight:900; font-size: 1.5rem; text-transform:uppercase; margin:0;">Visit us in ${biz.town}!</p>
                </div>
            </div>
        `;
    }

    // 6. ACTIVATE MODAL
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
