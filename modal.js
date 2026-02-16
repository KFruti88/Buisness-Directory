/**
 * PROJECT: Clay County Index Card v2.0
 * LOCK: Info -> Map -> Bio -> Coupon Flow [cite: 2026-01-30]
 */

function openFullModal(bizName) {
    // Look for the business in the global data
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    const modal = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-content');
    const tierL = (biz.tier || 'basic').toLowerCase();
    
    // Safety check for map encoding [cite: 2026-01-29]
    const mapAddr = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);

    // PREMIUM & PLUS LAYOUT
    if (tierL === 'premium' || tierL === 'plus') {
    // PREMIUM LAYOUT: Full Contact Details
    if (tierL === 'premium') {
        body.innerHTML = `
            <div class="index-card-header">
                <div class="logo-holder">
                    <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" onerror="this.src='https://via.placeholder.com/100'">
                </div>
                <div class="title-holder">
                    <h2 style="margin:0; font-size:1.8rem;">${biz.name}</h2>
                    <p style="margin:0; font-style:italic;">${biz.category} | Est. ${biz.established || 'N/A'}</p>
                </div>
                <span class="close-card" onclick="closeModal()">×</span>
            </div>

            <div class="index-card-grid">
                <div class="info-side">
                    <p><strong>📍 Address:</strong><br>${biz.address}<br>${biz.town}, IL</p>
                    <p><strong>📞 Phone:</strong><br>${biz.phone}</p>
                    <p><strong>🕒 Hours:</strong><br>${biz.hours || 'Call for Hours'}</p>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        ${biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" class="mini-btn">Website</a>` : ''}
                        ${biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" class="mini-btn fb">Facebook</a>` : ''}
                    </div>
                </div>

                <div class="map-side">
                    <iframe width="100%" height="150" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                </div>
            </div>

            <div class="bio-section">
                <h3 class="label">About Us</h3>
                <p>${biz.bio || 'Supporting local businesses in Clay County.'}</p>
            </div>

            ${biz.coupon && biz.coupon !== "N/A" ? `
            <div class="coupon-section">
                <h3 class="label" style="color:#fe4f00;">Community Coupon</h3>
                <img src="${CONFIG.IMAGE_REPO}${biz.coupon}.png" onerror="this.style.display='none'">
            </div>` : ''}
        `;
    } else if (tierL === 'plus') {
        // PLUS TIER: Phone + Coupon
        body.innerHTML = `
            <div style="text-align:center; padding:30px;">
                <h2>${biz.name}</h2>
                <p style="font-size: 1.5rem; font-weight: bold; margin: 15px 0;">📞 ${biz.phone}</p>
                <div style="border:3px dashed #000; padding:20px; background:#fff;">
                    <img src="${CONFIG.IMAGE_REPO}${biz.coupon}.png" style="max-width:100%;" onerror="this.src='https://via.placeholder.com/200?text=Visit+Us!'">
                </div>
                <button onclick="closeModal()" style="margin-top:20px; cursor:pointer;">Close</button>
            </div>
        `;
    } else {
        // BASIC TIER: Simple Coupon Pop
        body.innerHTML = `
            <div style="text-align:center; padding:30px;">
                <h2>${biz.name}</h2>
                <div style="border:3px dashed #000; padding:20px; background:#fff;">
                    <img src="${CONFIG.IMAGE_REPO}${biz.coupon}.png" style="max-width:100%;" onerror="this.src='https://via.placeholder.com/200?text=Visit+Us!'">
                </div>
                <button onclick="closeModal()" style="margin-top:20px; cursor:pointer;">Close</button>
            </div>
        `;
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}
