/**
 * MODAL.JS - THE POP-OUT ENGINE
 */

function openFullModal(bizName) {
    const biz = masterData.find(b => b.Name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body');
    const tierL = biz.Tier.toLowerCase();
    const hasCoupon = (biz.CouponLink && biz.CouponLink !== "N/A");

    if (tierL === 'premium') {
        const mapAddr = encodeURIComponent(`${biz.Address}, ${biz.Town}, IL`);
        body.innerHTML = `
            <div style="text-align:center;">
                <div style="height:120px;">${getSmartImage(biz.ImageID, biz.Name)}</div>
                <h2 style="margin:10px 0;">${biz.Name}</h2>
                <p>${biz.Category} | ${biz.Town} | Est. ${biz.Established || 'N/A'}</p>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px; border-top:2px solid #000; padding-top:20px;">
                <div>
                    <h3>Details</h3>
                    <p><strong>📞 Phone:</strong> ${biz.Phone}</p>
                    <p><strong>📍 Address:</strong> ${biz.Address}</p>
                    <p><strong>⏰ Hours:</strong> ${biz.Hours}</p>
                    <div style="margin-top:10px;">
                        ${biz.Website !== "N/A" ? `<a href="${biz.Website}" target="_blank" style="background:#0c30f0; color:white; padding:8px 15px; text-decoration:none; border-radius:5px; margin-right:5px;">Website</a>` : ""}
                        ${biz.Facebook !== "N/A" ? `<a href="${biz.Facebook}" target="_blank" style="background:#3b5998; color:white; padding:8px 15px; text-decoration:none; border-radius:5px;">Facebook</a>` : ""}
                    </div>
                </div>
                <div>
                    <h3>Location</h3>
                    <iframe width="100%" height="200" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
                </div>
            </div>
            ${biz.Bio !== "N/A" ? `<div style="margin-top:20px; border-top:1px solid #000; padding-top:10px;"><h3>Our Story</h3><p>${biz.Bio}</p></div>` : ""}
            ${hasCoupon ? `<div style="margin-top:20px; border:2px dashed #000; padding:15px; text-align:center;"><h3>🎟️ SPECIAL OFFER</h3><img src="${biz.CouponLink}" style="max-width:200px;"></div>` : ""}
        `;
    } else {
        // Coupon Only View for non-premium
        body.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h2>${biz.Name} Special Offer</h2>
                <img src="${biz.CouponLink}" style="max-width:100%; border:2px dashed #000;">
                <p>Present this at location to redeem.</p>
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
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
