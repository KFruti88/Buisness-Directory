/**
 * PROJECT: Clay County Index Card v2.5
 * LOCK: Info -> Map -> Bio -> Coupon Flow [cite: 2026-01-30]
 */

function openFullModal(bizName) {
    // Look for the business in the global window.allData
    const biz = window.allData.find(b => b.name === bizName);
    if (!biz) return;

    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    const tierL = (biz.tier || 'basic').toLowerCase();
    
    // Safety check for map encoding [cite: 2026-01-29]
    const mapAddr = encodeURIComponent(`${biz.address}, ${biz.town}, IL`);

    // PREMIUM & PLUS LAYOUT (Full Index Card)
    if (tierL === 'premium' || tierL === 'plus') {
        content.innerHTML = `
            <div class="index-card">
                <div class="index-card-header">
                    <div class="logo-holder">
                        <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" onerror="this.src='https://via.placeholder.com/100'">
                    </div>
                    <div class="title-holder">
                        <h2>${biz.name}</h2>
                        <p>${biz.category} | Est. ${biz.established || 'N/A'}</p>
                    </div>
                    <span class="close-card" onclick="closeModal()">×</span>
                </div>

                <div class="index-card-grid">
                    <div class="info-side">
                        <p><strong>📍 Address:</strong><br>${biz.address}<br>${biz.town}, IL</p>
                        <p><strong>📞 Phone:</strong><br>${biz.phone}</p>
                        <p><strong>🕒 Hours:</strong><br>${biz.hours || 'Call for Hours'}</p>
                        <div class="modal-links">
                            ${biz.website && biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" class="mini-btn">Website</a>` : ''}
                            ${biz.facebook && biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" class="mini-btn fb">Facebook</a>` : ''}
                        </div>
                    </div>

                    <div class="map-side">
                        <iframe width="100%" height="180" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>

                <div class="bio-section">
                    <h3 class="label">About Us</h3>
                    <p>${biz.bio || 'Supporting local businesses in Clay County.'}</p>
                </div>

                ${biz.couponTxt ? `
                <div class="coupon-section">
                    <h3 class="label" style="color:#fe4f00;">Community Coupon</h3>
                    <div class="coupon-box">
                         <p class="coupon-text">${biz.couponTxt}</p>
                    </div>
                </div>` : ''}
            </div>
        `;
    } else {
        // BASIC TIER: Simple Centered Card
        content.innerHTML = `
            <div class="index-card basic-view">
                <span class="close-card" onclick="closeModal()">×</span>
                <h2>${biz.name}</h2>
                <div class="basic-logo-box">
                    <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <p><strong>Town:</strong> ${biz.town}</p>
                <p>📁 ${biz.category}</p>
                <button class="close-mini-btn" onclick="closeModal()">Close</button>
            </div>
        `;
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

// Global click-off listener
window.onclick = function(event) {
    const modal = document.getElementById('modal-overlay');
    if (event.target == modal) closeModal();
}
