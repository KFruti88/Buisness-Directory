/**
 * PROJECT: Clay County Index Card v9.3
 * LOCK: Info -> Map -> Bio -> Coupon Flow [cite: 2026-01-30]
 * STRUCTURE: Isolated Fixed Layer (No Layout Shifting)
 */

function openFullModal(bizName) {
    // 1. Find the business in the global window.allData
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    // 2. Identify the target containers
    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body-content');
    const tierL = (biz.tier || 'basic').toLowerCase();
    
    // 3. Safety check for map encoding [cite: 2026-01-29]
    const mapAddr = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);

    // 4. PREMIUM & PLUS LAYOUT (Full Index Card Detail)
    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div style="padding: 40px; color: #000;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:80px; height:80px; border:1px solid #000;" onerror="this.src='https://via.placeholder.com/80'">
                        <div>
                            <h2 style="margin:0; font-size: 2.2rem; text-transform: uppercase;">${biz.name}</h2>
                            <p style="margin:0; font-weight: bold; color: #555;">📁 ${biz.category} | Est. ${biz.established || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                    <div>
                        <p style="margin: 0 0 15px 0;"><strong>📍 Address:</strong><br>${biz.address}<br>${biz.town}, IL</p>
                        <p style="margin: 0 0 15px 0;"><strong>📞 Phone:</strong><br>${biz.phone}</p>
                        <p style="margin: 0 0 15px 0;"><strong>🕒 Hours:</strong><br>${biz.hours || 'Call for Hours'}</p>
                        <div style="margin-top: 20px; display: flex; gap: 10px;">
                            ${biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="padding:10px 15px; background:#000; color:#fff; text-decoration:none; font-weight:bold; font-size:0.8rem;">WEBSITE</a>` : ''}
                            ${biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="padding:10px 15px; background:#0c0b82; color:#fff; text-decoration:none; font-weight:bold; font-size:0.8rem;">FACEBOOK</a>` : ''}
                        </div>
                    </div>
                    <div style="border: 2px solid #000; background: #eee; height: 220px;">
                        <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>

                <div style="margin-top: 30px; border-top: 2px dashed #000; padding-top: 20px;">
                    <h3 style="text-transform: uppercase; margin-top:0;">About Us</h3>
                    <p style="font-size: 1.1rem; line-height: 1.5; margin-bottom: 0;">${biz.bio || 'Supporting local businesses in Clay County.'}</p>
                </div>
                
                ${biz.couponTxt ? `
                <div style="margin-top: 20px; padding: 15px; background: #fff5ba; border: 2px solid #fe4f00;">
                    <h4 style="margin:0; color:#fe4f00; text-transform:uppercase;">Community Coupon</h4>
                    <p style="margin:5px 0 0 0; font-weight:bold;">${biz.couponTxt}</p>
                </div>` : ''}
            </div>
        `;
    } else {
        // 5. BASIC TIER: Simplified Pop-up
        body.innerHTML = `
            <div style="padding: 60px; text-align: center; color: #000;">
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" style="width:120px; margin-bottom: 20px; border: 1px solid #000;" onerror="this.src='https://via.placeholder.com/120'">
                <h2 style="font-size: 2.5rem; text-transform: uppercase; margin-bottom: 10px;">${biz.name}</h2>
                <p style="font-size: 1.2rem;">📍 ${biz.town} | 📁 ${biz.category}</p>
                <div style="margin-top: 30px; padding: 20px; border: 3px dashed #000;">
                     <p style="font-weight:bold; font-size: 1.3rem;">Visit us in ${biz.town}!</p>
                </div>
            </div>
        `;
    }

    // Show the modal
    modal.style.display = 'flex';
}

/**
 * Close Functionality
 */
function closeModal() {
    const modal = document.getElementById('premium-modal');
    if (modal) modal.style.display = 'none';
}

// Global click-off listener (Close when clicking the dark background)
window.onclick = function(event) {
    const modal = document.getElementById('premium-modal');
    if (event.target == modal) closeModal();
}
