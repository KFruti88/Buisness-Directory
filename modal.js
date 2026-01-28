/**
 * MODAL.JS - THE POP-OUT ENGINE
 * VERSION: 1.12
 * UPDATES: Removed Town Bar and redundant Town text for a cleaner look.
 */

function openFullModal(bizName) {
    const biz = masterData.find(b => b.Name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body');
    const tierL = biz.Tier.toLowerCase();
    
    // Coupon Image (.png) logic
    let couponImg = "";
    if (biz.CouponLink && biz.CouponLink !== "" && biz.CouponLink !== "N/A") {
        const fileName = biz.CouponLink.trim();
        couponImg = fileName.startsWith('http') ? fileName : `${imageRepo}${fileName}.png`;
    }

    if (tierL === 'premium') {
        const mapAddr = encodeURIComponent(`${biz.Address}, ${biz.Town}, IL`);

        body.innerHTML = `
            <div style="text-align:center; padding-bottom: 20px; border-bottom: 2px solid #000; margin-bottom: 25px;">
                <div style="height:150px; margin-bottom:15px; display:flex; justify-content:center; align-items:center;">
                    ${getSmartLogo(biz.ImageID, biz.Name)}
                </div>
                <h1 style="font-family:'Times New Roman', serif; margin:0; font-size: 2.8rem;">${biz.Name}</h1>
                <p style="color:#666; font-style:italic; font-size: 1.2rem;">${biz.Category} | Est. ${biz.Established || 'N/A'}</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:30px;">
                
                <div style="padding: 10px;">
                    <h3 style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-top:0; text-transform: uppercase;">Business Details</h3>
                    <div style="font-size: 1.15rem; line-height: 1.8;">
                        <p><strong>📞 Phone:</strong> <a href="tel:${biz.Phone}" style="color:#000; text-decoration:none;">${biz.Phone}</a></p>
                        <p><strong>📍 Address:</strong> ${biz.Address}</p>
                        <p><strong>⏰ Hours:</strong> ${biz.Hours || 'N/A'}</p>
                    </div>
                    
                    <div style="margin-top:25px; display:flex; gap:12px; flex-wrap: wrap;">
                        ${biz.Website && biz.Website !== "N/A" ? `<a href="${biz.Website}" target="_blank" class="action-btn" style="background:#0c30f0;">🌐 Website</a>` : ""}
                        ${biz.Facebook && biz.Facebook !== "N/A" ? `<a href="${biz.Facebook}" target="_blank" class="action-btn" style="background:#3b5998;">f Facebook</a>` : ""}
                    </div>
                </div>

                <div style="padding: 10px;">
                    <h3 style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-top:0; text-transform: uppercase;">Location</h3>
                    <div style="border: 2px solid #000; height: 280px; background:#eee; box-shadow: 4px 4px 0px rgba(0,0,0,0.1);">
                        <iframe width="100%" height="100%" frameborder="0" style="border:0;" 
                            src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed">
                        </iframe>
                    </div>
                </div>
            </div>

            ${biz.Bio && biz.Bio !== "N/A" ? `
            <div style="margin-top:30px; padding-top:20px; border-top:2.5px double #000;">
                <h3 style="text-transform:uppercase; margin-top:0;">Our Story</h3>
                <p style="line-height:1.7; font-size: 1.15rem; color:#222;">${biz.Bio}</p>
            </div>` : ""}
            
            ${couponImg ? `
                <div style="margin-top:30px; border:4px dashed #d4af37; background:#fffbe6; padding:25px; text-align:center;">
                    <h2 style="color:#d4af37; margin:0 0 15px 0; font-size: 1.8rem;">🎟️ EXCLUSIVE COMMUNITY DEAL</h2>
                    <p style="font-size: 1.2rem; font-weight:bold; margin-bottom: 15px;">${biz.CouponText}</p>
                    <img src="${couponImg}" style="max-width:300px; border:1px solid #000; box-shadow: 4px 4px 0px rgba(0,0,0,0.1);">
                </div>` : ""}
        `;
    } else {
        // Simple Coupon View for Basic/Plus
        body.innerHTML = `
            <div style="text-align:center; padding:10px;">
                <h2 style="font-family:'Times New Roman', serif; font-size: 2.2rem; margin-bottom: 10px;">${biz.Name}</h2>
                <div style="border:5px dashed #000; padding:30px; background:#fff; margin-top:15px; box-shadow: 8px 8px 0px rgba(0,0,0,0.1);">
                    <p style="font-size:1.4rem; font-weight:bold; margin-bottom:20px;">${biz.CouponText}</p>
                    <img src="${couponImg}" style="max-width:100%; height:auto;">
                    <p style="margin-top:20px; font-style:italic; color:#555;">Scan or show this image at the register.</p>
                </div>
            </div>
        `;
    }

    modal.style.display = "flex";
}
