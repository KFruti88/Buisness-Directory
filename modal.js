/**
 * PROJECT: Clay County Definitive Modal v9.9.9
 * LOCKS: Logo = Col A | Coupon Filename = Col O | Coupon Text = Col P
 * FEATURE: Auto-Collapse (Kills dead space if no coupon exists)
 * [cite: 2026-01-30]
 */

function openFullModal(bizName) {
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body-content');
    const tierL = (biz.tier || 'basic').toLowerCase();
    
    // Safety check for map encoding
    const mapAddr = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);

    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div class="modal-inner-padding" style="display: flex; flex-direction: column; height: 100%; justify-content: flex-start;">
                <span class="close-x" onclick="closeModal()">×</span>
                
                <div style="border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 15px;">
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" 
                             style="width:85px; height:85px; border:2px solid #000; background:#fff; object-fit: contain;" 
                             onerror="this.src='https://via.placeholder.com/85?text=LOGO';">
                        <div>
                            <h2 style="margin:0; font-size: 2.4rem; text-transform: uppercase; line-height:1; color:#000;">${biz.name}</h2>
                            <p style="margin:8px 0 0 0; font-weight: 900; font-size: 1.1rem; color:#444;">📁 ${biz.category} | Est. ${biz.established || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; margin-bottom: 15px;">
                    <div style="font-size: 1.1rem; line-height: 1.6; color:#000;">
                        <p style="margin: 0 0 15px 0;"><strong>📍 ADDRESS:</strong><br>${biz.address}<br>${biz.town}, IL</p>
                        <p style="margin: 0 0 15px 0;"><strong>📞 PHONE:</strong><br>${biz.phone}</p>
                        <div style="margin-top: 15px; display: flex; gap: 12px;">
                            ${biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="padding:12px 20px; background:#000; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff; font-size:0.9rem;">WEBSITE</a>` : ''}
                            ${biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="padding:12px 20px; background:#0c0b82; color:#fff; text-decoration:none; font-weight:bold; border:1px solid #fff;">FACEBOOK</a>` : ''}
                        </div>
                    </div>
                    <div style="border: 3px solid #000; height: 180px; box-shadow: 10px 10px 0px rgba(0,0,0,0.1); overflow:hidden;">
                        <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>

                <div style="border-top: 2px dashed #000; padding-top: 15px; margin-bottom: 15px;">
                    <h3 style="text-transform: uppercase; margin:0 0 8px 0; font-size: 1.2rem; color:#000;">About Our Business</h3>
                    <p style="font-size: 1.1rem; margin: 0; line-height: 1.5; color:#000;">${biz.bio || 'Proudly serving the community.'}</p>
                </div>

                ${biz.couponMedia && biz.couponMedia !== "N/A" && biz.couponMedia !== "" ? `
                <div id="coupon-area" style="border-top: 3px solid #fe4f00; padding-top: 15px; text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                    <p style="margin:0 0 10px 0; font-weight:900; color:#fe4f00; text-transform:uppercase; letter-spacing: 1px;">🎫 Special Community Offer</p>
                    <img src="${CONFIG.COUPON_REPO}${biz.couponMedia}" 
                         style="max-height: 120px; width: auto; margin: 0 auto; border: 2px solid #fe4f00; box-shadow: 5px 5px 0px rgba(254,79,0,0.2);" 
                         onerror="this.parentElement.style.display='none';">
                    ${biz.preview && biz.preview !== "N/A" ? `<p style="margin-top:10px; font-weight:bold; font-size:1.1rem; color:#000;">${biz.preview}</p>` : ''}
                </div>` : ''}
            </div>
        `;
    } else {
        // BASIC TIER
        body.innerHTML = `
            <div class="modal-inner-padding" style="display: flex; flex-direction: column; height: 100%; justify-content: center; text-align: center; color:#000;">
                <span class="close-x" onclick="closeModal()">×</span>
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:100px; margin: 0 auto 20px auto; border: 2px solid #000; background:#fff;" onerror="this.src='https://via.placeholder.com/100';">
                <h2 style="font-size: 2.4rem; text-transform: uppercase; margin: 0;">${biz.name}</h2>
                <p style="font-weight:900; font-size: 1.4rem; margin-top:20px;">Visit us in ${biz.town}!</p>
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
