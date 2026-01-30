/**
 * PROJECT: Clay County Master Directory v9.7
 * LOCK: 96vh Height | 75% Width | Zero-Scroll Scaling
 * THEME: High-Gloss Taller Index Card [cite: 2026-01-30]
 */

function openFullModal(bizName) {
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body-content');
    const tierL = (biz.tier || 'basic').toLowerCase();
    const mapAddr = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);

    // PREMIUM & PLUS: Taller Vertical Layout
    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div class="modal-inner-padding">
                <span class="close-x" onclick="closeModal()">×</span>
                
                <div style="border-bottom: 4px solid #000; padding-bottom: 20px; margin-bottom: 20px;">
                    <div style="display: flex; gap: 30px; align-items: center;">
                        <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:110px; height:110px; border:3px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/110'">
                        <div>
                            <h2 style="margin:0; font-size: 2.8rem; text-transform: uppercase; line-height:1;">${biz.name}</h2>
                            <p style="margin:8px 0 0 0; font-weight: 900; font-size: 1.2rem;">📁 ${biz.category} | Est. ${biz.established || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 40px; flex-grow: 1; min-height: 0;">
                    <div style="font-size: 1.2rem; line-height: 1.8; overflow: hidden;">
                        <p style="margin: 0 0 15px 0;"><strong>📍 ADDRESS:</strong><br>${biz.address}<br>${biz.town}, IL</p>
                        <p style="margin: 0 0 15px 0;"><strong>📞 PHONE:</strong><br>${biz.phone}</p>
                        <p style="margin: 0 0 15px 0;"><strong>🕒 HOURS:</strong><br>${biz.hours || 'Call for Details'}</p>
                        
                        <div style="margin-top: 30px; display: flex; gap: 15px;">
                            ${biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="padding:15px 25px; background:#000; color:#fff; text-decoration:none; font-weight:bold; font-size:0.9rem; border:1px solid #fff;">WEBSITE</a>` : ''}
                            ${biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="padding:15px 25px; background:#0c0b82; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff; font-size:0.9rem;">FACEBOOK</a>` : ''}
                        </div>
                    </div>

                    <div class="map-side-container">
                        <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>

                <div style="margin-top: 30px; border-top: 3px dashed #000; padding-top: 20px;">
                    <h3 style="text-transform: uppercase; margin:0; font-size: 1.3rem;">About Our Business</h3>
                    <p style="font-size: 1.15rem; margin: 10px 0 0 0; line-height: 1.6;">${biz.bio || 'Proudly serving the Clay County community.'}</p>
                    
                    ${biz.couponTxt ? `
                    <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.3); border: 2px solid #fe4f00;">
                        <p style="margin:0; font-weight:900; font-size:1.1rem; color:#fe4f00; text-transform:uppercase;">Community Coupon: ${biz.couponTxt}</p>
                    </div>` : ''}
                </div>
            </div>
        `;
    } else {
        // BASIC: Taller Center-Aligned Content
        body.innerHTML = `
            <div class="modal-inner-padding" style="text-align: center; justify-content: center;">
                <span class="close-x" onclick="closeModal()">×</span>
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:140px; margin-bottom: 25px; border: 3px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/140'">
                <h2 style="font-size: 3rem; text-transform: uppercase; margin: 0;">${biz.name}</h2>
                <p style="font-size: 1.5rem; font-weight:bold; margin: 20px 0;">📍 ${biz.town} | 📁 ${biz.category}</p>
                <div style="margin-top: 40px; padding: 30px; border: 5px dashed #000; background: rgba(255,255,255,0.2);">
                     <p style="font-weight:900; font-size: 1.8rem; text-transform:uppercase; margin:0;">Visit us in ${biz.town}!</p>
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
