/**
 * MODAL.JS - THE POP-OUT ENGINE
 * Handles the "Deep Dive" view for Premium members and Coupons.
 */

function openFullModal(bizName) {
    // Find business in the masterData loaded by layout.js
    const biz = masterData.find(b => b.Name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const content = document.getElementById('modal-body');
    if (!modal || !content) return;

    const townClass = biz.Town.toLowerCase().replace(/\s+/g, '-');
    const mapAddress = encodeURIComponent(`${biz.Address}, ${biz.Town}, IL`);
    const hasCoupon = (biz.CouponLink && biz.CouponLink.trim() !== "" && biz.CouponLink !== "N/A");

    content.innerHTML = `
        <div style="text-align:center;">
            <div style="height:120px; margin-bottom:10px;">${getSmartImage(biz.ImageID, biz.Name)}</div>
            <h1 style="font-family:'Times New Roman', serif; margin:0;">${biz.Name}</h1>
            <p style="color:#666;">${biz.Category} | ${biz.Town}</p>
        </div>

        <div class="town-bar ${townClass}-bar" style="margin: 15px -30px; border-radius: 0;">${biz.Town}</div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:25px;">
            <div>
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px;">Business Details</h3>
                <p><strong>📞 Phone:</strong> <a href="tel:${biz.Phone}">${biz.Phone}</a></p>
                <p><strong>📍 Address:</strong> ${biz.Address}</p>
                <p><strong>⏰ Hours:</strong> ${biz.Hours || 'N/A'}</p>
                
                <div style="margin-top:20px; display: flex; gap: 10px; flex-wrap: wrap;">
                    ${biz.Website && biz.Website !== "N/A" ? `<a href="${biz.Website}" target="_blank" style="background:#0c30f0; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold;">Website</a>` : ""}
                    ${biz.Facebook && biz.Facebook !== "N/A" ? `<a href="${biz.Facebook}" target="_blank" style="background:#3b5998; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold;">Facebook</a>` : ""}
                </div>

                ${hasCoupon ? `
                <div style="margin-top: 20px; padding: 15px; border: 2px dashed #d4af37; background: #fffbe6; text-align: center;">
                    <h4 style="margin:0 0 10px 0;">🎟️ CURRENT OFFER</h4>
                    <img src="${biz.CouponLink}" style="max-width: 100%; height: auto; border-radius: 4px;">
                </div>` : ''}
            </div>

            <div>
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px;">Map Location</h3>
                <iframe width="100%" height="250" frameborder="0" style="border:1px solid #ddd; border-radius:8px; background: #eee;" 
                    src="https://maps.google.com/maps?q=${mapAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed">
                </iframe>
            </div>
        </div>

        ${biz.Bio && biz.Bio !== "N/A" ? `
        <div style="margin-top:20px; padding-top:20px; border-top:1px solid #eee;">
            <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px;">Our Story</h3>
            <p style="line-height:1.6;">${biz.Bio}</p>
        </div>` : ""}
    `;

    modal.style.display = "flex";
}

function setupModalClose() {
    const modal = document.getElementById('premium-modal');
    const closeBtn = document.querySelector('.close-modal');
    if(closeBtn) closeBtn.onclick = () => { modal.style.display = "none"; };
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
}
