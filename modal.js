/**
 * MODAL.JS - THE POP-OUT ENGINE
 * Handles scenario: Premium = Full Info | Basic/Plus with Coupon = Coupon Only.
 */

function openFullModal(bizName) {
    const biz = masterData.find(b => b.Name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body');
    const tierL = biz.Tier.toLowerCase();
    
    // Coupons are .png specifically per your requirement
    let couponImg = "";
    if (biz.CouponLink && biz.CouponLink !== "") {
        const fileName = biz.CouponLink.trim();
        // If it's just a file name, add path and .png. If it's a URL, use it.
        couponImg = fileName.startsWith('http') ? fileName : `${imageRepo}${fileName}.png`;
    }

    if (tierL === 'premium') {
        const mapAddr = encodeURIComponent(`${biz.Address}, ${biz.Town}, IL`);
        body.innerHTML = `
            <div style="text-align:center;">
                <div style="height:120px; margin-bottom:10px;">${getSmartLogo(biz.ImageID, biz.Name)}</div>
                <h1 style="font-family:'Times New Roman', serif; margin:0;">${biz.Name}</h1>
                <p style="color:#666;">${biz.Category} | ${biz.Town} | Est. ${biz.Established || 'N/A'}</p>
            </div>

            <div class="town-bar ${biz.Town.toLowerCase().replace(/\s+/g, '-')}-bar" style="margin: 15px -30px; border-radius:0;">${biz.Town}</div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:25px;">
                <div>
                    <h3 style="border-bottom: 2px solid #000; padding-bottom: 5px;">Contact Details</h3>
                    <p><strong>📞 Phone:</strong> <a href="tel:${biz.Phone}">${biz.Phone}</a></p>
                    <p><strong>📍 Address:</strong> ${biz.Address}</p>
                    <p><strong>⏰ Hours:</strong> ${biz.Hours || 'N/A'}</p>
                    <div style="margin-top:20px; display:flex; gap:10px;">
                        ${biz.Website && biz.Website !== "N/A" ? `<a href="${biz.Website}" target="_blank" style="background:#0c30f0; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold;">Website</a>` : ""}
                        ${biz.Facebook && biz.Facebook !== "N/A" ? `<a href="${biz.Facebook}" target="_blank" style="background:#3b5998; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold;">Facebook</a>` : ""}
                    </div>
                </div>
                <div>
                    <h3 style="border-bottom: 2px solid #000; padding-bottom: 5px;">Location</h3>
                    <iframe width="100%" height="250" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                </div>
            </div>

            ${biz.Bio ? `<div style="margin-top:20px; padding-top:10px; border-top:1px solid #000;"><h3>Our Story</h3><p>${biz.Bio}</p></div>` : ""}
            
            ${couponImg ? `
                <div style="margin-top:20px; border:3px dashed #d4af37; background:#fffbe6; padding:20px; text-align:center;">
                    <h2 style="color:#d4af37; margin:0 0 10px 0;">🎟️ EXCLUSIVE DEAL</h2>
                    <p>${biz.CouponText}</p>
                    <img src="${couponImg}" style="max-width:250px; border:1px solid #000;">
                </div>` : ""}
        `;
    } else {
        // Coupon Only View for non-premium members
        body.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h2 style="font-family:'Times New Roman', serif;">${biz.Name} Special Offer</h2>
                <div style="border:4px dashed #000; padding:20px; background:#fff;">
                    <p style="font-size:1.2rem; font-weight:bold;">${biz.CouponText}</p>
                    <img src="${couponImg}" style="max-width:100%; height:auto;">
                    <p style="margin-top:15px; font-style:italic;">Scan or show this image at checkout.</p>
                </div>
            </div>
        `;
    }

    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById('premium-modal').style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('premium-modal');
    if (event.target == modal) closeModal();
};
