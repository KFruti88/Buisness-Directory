/**
 * PROJECT: Clay County Premium Modal Engine v1.45
 * FEATURE: 75% Wide Glossy Layout & JSON Integration
 * LOCK: A-P Spreadsheet Mapping [cite: 2026-01-29]
 */

function openFullModal(bizName) {
    // [cite: 2026-01-26] Accessing global data loaded by layout.js
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body');
    const tierL = (biz.tier || 'basic').toLowerCase();
    
    // Safety check for map encoding using built location [cite: 2026-01-29]
    const mapAddr = encodeURIComponent(biz.full_location || `${biz.address} ${biz.town} IL`);

    // [cite: 2026-01-28] PREMIUM & PLUS: The "Deep Dive" Glossy Layout
    if (tierL === 'premium' || tierL === 'plus') {
        body.innerHTML = `
            <div class="modal-inner-gloss">
                <div class="modal-header-section">
                    <div class="modal-logo-frame">
                        <img src="${CONFIG.IMAGE_REPO}${biz.ImageID}.jpeg" class="modal-main-logo" onerror="this.src='https://via.placeholder.com/150'">
                    </div>
                    <div class="header-text">
                        <h2 style="font-family:'Times New Roman', serif; font-size: 2.5rem; margin:0;">${biz.name}</h2>
                        <p style="font-style:italic; color:#444; margin:5px 0 0 0;">${biz.category} | Est. ${biz.established || 'N/A'}</p>
                    </div>
                </div>

                <div class="modal-grid-75">
                    <div class="info-column">
                        <h3 class="glossy-label">Business Details</h3>
                        <div class="details-list" style="font-size: 1.1rem; line-height: 1.8;">
                            <p><strong>📞 Phone:</strong> <a href="tel:${biz.phone}" style="color:#0c30f0; text-decoration:underline;">${biz.phone}</a></p>
                            <p><strong>📍 Address:</strong> ${biz.address}, ${biz.town}</p>
                            <p><strong>🕒 Hours:</strong> ${biz.hours || 'Call for Hours'}</p>
                        </div>
                        
                        <div class="modal-button-row">
                            ${biz.website && biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" class="gloss-btn web-btn">🌐 Website</a>` : ''}
                            ${biz.facebook && biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" class="gloss-btn fb-btn">f Facebook</a>` : ''}
                        </div>
                    </div>

                    <div class="map-column">
                        <h3 class="glossy-label">Location</h3>
                        <div class="map-box-gloss">
                            <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                        </div>
                    </div>
                </div>

                ${biz.bio && biz.bio !== "N/A" ? `
                <div class="modal-story">
                    <h3 class="glossy-label">Our Story</h3>
                    <p style="line-height:1.6; font-size: 1.1rem;">${biz.bio}</p>
                </div>` : ''}

                ${biz.coupon && biz.coupon !== "N/A" ? `
                <div class="modal-coupon-section">
                    <h3 class="glossy-label" style="color:#d4af37; border-color:#d4af37;">Exclusive Community Deal</h3>
                    <div class="coupon-display">
                        <img src="${CONFIG.IMAGE_REPO}${biz.coupon}.png" style="max-width:100%; border:2px dashed #000;" onerror="this.style.display='none'">
                    </div>
                </div>` : ''}
            </div>
        `;
    } 
    // [cite: 2026-01-28] BASIC & GOLD: Simplified Coupon-Only View
    else {
        body.innerHTML = `
            <div class="modal-inner-gloss" style="text-align:center; padding: 40px;">
                <h2 style="font-family:'Times New Roman', serif; font-size: 2.2rem;">${biz.name}</h2>
                <div class="coupon-box-gloss" style="border:4px dashed #000; padding:20px; background:#fff;">
                    <p style="font-weight:bold; text-transform:uppercase; color:#fe4f00;">Community Deal</p>
                    <img src="${CONFIG.IMAGE_REPO}${biz.coupon}.png" style="max-width:100%; height:auto;" onerror="this.src='https://via.placeholder.com/300x150?text=Visit+Us+Today!'">
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

window.onclick = function(event) {
    const modal = document.getElementById('premium-modal');
    if (event.target == modal) {
        closeModal();
    }
}
