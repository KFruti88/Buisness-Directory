/**
 * MODAL.JS - THE POP-OUT ENGINE
 * VERSION: 1.20
 * UPDATES: Forced centering for Business Name, fixed Story/Coupon flow.
 */

function openFullModal(bizName) {
    const biz = masterData.find(b => b.Name === bizName);
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body');
    const tierL = (biz.Tier || 'basic').toLowerCase();
    
    const rawRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

    let couponImg = "";
    if (biz.CouponLink && biz.CouponLink !== "" && biz.CouponLink !== "N/A") {
        const link = biz.CouponLink.trim();
        if (link.startsWith('data:image') || link.startsWith('http')) {
            couponImg = link;
        } else {
            couponImg = `${rawRepo}${link}.png`;
        }
    }

    if (tierL === 'premium' || tierL === 'plus') {
        const mapAddr = encodeURIComponent(`${biz.Address}, ${biz.Town}, IL`);

        body.innerHTML = `
            <div style="text-align:center; width:100%; padding-bottom: 20px; border-bottom: 2px solid #000; margin-bottom: 25px;">
                <div style="height:150px; width:100%; margin-bottom:15px; display:flex; justify-content:center; align-items:center; overflow:hidden;">
                    <div style="max-width:90%; height:100%; display:flex; align-items:center; justify-content:center;">
                        ${getSmartLogo(biz.ImageID, biz.Name)}
                    </div>
                </div>
                <h1 style="font-family:'Times New Roman', serif; margin:0 auto; font-size: 2.8rem; display:block; width:100%;">
                    ${biz.Name}
                </h1>
                <p style="color:#666; font-style:italic; font-size: 1.2rem; margin: 5px 0 0 0; width:100%;">
                    ${biz.Category} | Est. ${biz.Established || 'N/A'}
                </p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:30px;">
                <div style="padding: 10px;">
                    <h3 style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-top:0; text-transform: uppercase;">Business Details</h3>
                    <div style="font-size: 1.15rem; line-height: 1.8;">
                        <p><strong>📞 Phone:</strong> <a href="tel:${biz.Phone}" style="color:#0c30f0; text-decoration:underline; font-weight:bold;">${biz.Phone}</a></p>
                        <p><strong>📍 Address:</strong> ${biz.Address}</p>
                        <p><strong>⏰ Hours:</strong> ${biz.Hours || 'N/A'}</p>
                    </div>
                    
                    <div style="margin-top:25px; display:flex; gap:12px; flex-wrap: wrap; justify-content: flex-start;">
                        ${biz.Website && biz.Website !== "N/A" ? `<a href="${biz.Website}" target="_blank" style="background:#0c30f0; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold; display:inline-block; border:1px solid #000;">🌐 Website</a>` : ""}
                        ${biz.Facebook && biz.Facebook !== "N/A" ? `<a href="${biz.Facebook}" target="_blank" style="background:#3b5998; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold; display:inline-block; border:1px solid #000;">f Facebook</a>` : ""}
                    </div>
                </div>

                <div style="padding: 10px;">
                    <h3 style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-top:0; text-transform: uppercase;">Location</h3>
                    <div style="border: 2px solid #000; height: 280px; background:#eee; box-shadow: 4px 4px 0px rgba(0,0,0,0.1); overflow:hidden;">
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
                    <p style="font-size: 1.2rem; font-weight:bold; margin-bottom: 15px;">${biz.CouponText || ''}</p>
                    <div style="max-width:100%; display:flex; justify-content:center;">
                        <img src="${couponImg}" style="max-width:100%; height:auto; max-height:300px; border:1px solid #000; box-shadow: 4px 4px 0px rgba(0,0,0,0.1); object-fit:contain;">
                    </div>
                </div>` : ""}
        `;
    } else {
        // BASIC VIEW
        body.innerHTML = `
            <div style="text-align:center; padding:10px;">
                <h2 style="font-family:'Times New Roman', serif; font-size: 2.2rem; margin-bottom: 10px;">${biz.Name}</h2>
                <div style="border:5px dashed #000; padding:30px; background:#fff; margin-top:15px; box-shadow: 8px 8px 0px rgba(0,0,0,0.1);">
                    <p style="font-size:1.4rem; font-weight:bold; margin-bottom:20px;">${biz.CouponText || ''}</p>
                    <img src="${couponImg}" style="max-width:100%; height:auto; max-height:400px; object-fit:contain;">
                </div>
            </div>
        `;
    }

    modal.style.display = "flex";
}

// UNIVERSAL CLOSING LOGIC
window.onclick = function(event) {
    const modal = document.getElementById('premium-modal');
    if (event.target == modal || event.target.classList.contains('close-btn') || event.target.innerHTML === '×') {
        modal.style.display = "none";
    }
}

function closeModal() {
    document.getElementById('premium-modal').style.display = "none";
}
