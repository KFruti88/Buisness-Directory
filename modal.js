/**
 * PROJECT: Clay County Index Card Engine v1.70
 * LOCK: No-Scroll Mandate & 75% Wide Layout [cite: 2026-01-28]
 * FEATURE: Fixed Grid logic to prevent element overlap [cite: 2026-01-26]
 */

function openFullModal(bizName) {
    // [cite: 2026-01-26] Global Data Handshake
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body');
    const tierL = (biz.tier || 'basic').toLowerCase();
    
    // Safety check for map encoding [cite: 2026-01-29]
    const mapAddr = encodeURIComponent(biz.full_location || `${biz.address} ${biz.town} IL`);

    // [cite: 2026-01-28] PREMIUM/PLUS: THE NO-SCROLL INDEX CARD
    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div class="modal-index-card-wrapper">
                <div class="modal-header-section">
                    <div class="modal-logo-frame">
                        <img src="${CONFIG.IMAGE_REPO}${biz.ImageID}.jpeg" class="modal-main-logo" onerror="this.src='https://via.placeholder.com/150'">
                    </div>
                    <div class="header-text-lock">
                        <h2 style="margin:0; font-size: 1.85rem; line-height:1.2;">${biz.name}</h2>
                        <p style="margin:2px 0 0 0; font-style:italic; font-size:0.9rem; color:#444;">${biz.category} | Est. ${biz.established || 'N/A'}</p>
                    </div>
                    <span class="close-modal-x" onclick="closeModal()">×</span>
                </div>

                <div class="modal-grid-75">
                    <div class="info-column-lock">
                        <h3 class="glossy-label">Business Details</h3>
                        <div class="details-text" style="font-size: 1.05rem; line-height: 1.6;">
                            <p style="margin:8px 0;"><strong>📞 Phone:</strong> ${biz.phone}</p>
                            <p style="margin:8px 0;"><strong>📍 Address:</strong> ${biz.address}</p>
                            <p style="margin:8px 0;"><strong>🕒 Hours:</strong> ${biz.hours || 'N/A'}</p>
                        </div>
                        
                        <div class="modal-button-row">
                            ${biz.website && biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" class="gloss-btn web-btn">🌐 Website</a>` : ''}
                            ${biz.facebook && biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" class="gloss-btn fb-btn">f Facebook</a>` : ''}
                        </div>

                        <div class="coupon-area-lock">
                            <span style="font-size:0.7rem; font-weight:bold; color:#fe4f00; display:block; margin-bottom:5px;">COMMUNITY DEAL</span>
                            <img src="${CONFIG.IMAGE_REPO}${biz.coupon}.png" class="coupon-img-fixed" onerror="this.style.display='none'">
                        </div>
                    </div>

                    <div class="map-column-lock">
                        <h3 class="glossy-label">Location</h3>
                        <div class="map-box-fixed">
                            <iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                        </div>
                    </div>
                </div>

                <div class="modal-story-lock">
                    <h3 class="glossy-label" style="border:none; margin:0 0 5px 0;">Our Story</h3>
                    <p style="margin:0; font-size: 0.95rem; line-height: 1.4;">
                        ${biz.bio ? biz.bio.substring(0, 250) + (biz.bio.length > 250 ? '...' : '') : 'Thank you for supporting our community business in ' + biz.town + '!'}
                    </p>
                </div>
            </div>
        `;
    } 
    // [cite: 2026-01-28] BASIC TIER: Simplified Deal View
    else {
        body.innerHTML = `
            <div style="text-align:center; padding: 50px; background:#fffdf5; border-radius:4px;">
                <h2 style="font-family:'Times New Roman', serif; font-size: 2.2rem; margin-bottom:20px;">${biz.name}</h2>
                <div style="border:4px dashed #000; padding:30px; background:#fff; display:inline-block;">
                    ${biz.coupon && biz.coupon !== "N/A" ? `<img src="${CONFIG.IMAGE_REPO}${biz.coupon}.png" style="max-height:300px;">` : `<p>Visit us in ${biz.town} for our current specials!</p>`}
                </div>
                <div style="margin-top:30px;">
                    <button onclick="closeModal()" style="padding:10px 25px; font-weight:bold; cursor:pointer; background:#222; color:#fff; border:none; border-radius:4px;">CLOSE CARD</button>
                </div>
            </div>
        `;
    }

    modal.style.display = 'flex';
}

/**
 * 🛠️ MODAL CLOSE LOGIC [cite: 2026-01-26]
 */
function closeModal() {
    document.getElementById('premium-modal').style.display = 'none';
}

// Global click-out logic
window.onclick = function(event) {
    const modal = document.getElementById('premium-modal');
    if (event.target == modal) {
        closeModal();
    }
}
