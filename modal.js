/**
 * 🛠️ MODAL.JS - THE JSON POP-OUT BRAIN
 * VERSION: 1.35 (LOCKED A-P JSON MAPPING)
 * [cite: 2026-01-28, 2026-01-29]
 */

function openFullModal(bizName) {
    // 1. Target the JSON array 'allData' (Loaded by your Python/JS bridge)
    const biz = allData.find(b => b.name === bizName); 
    if (!biz) return;

    const modal = document.getElementById('premium-modal');
    const body = document.getElementById('modal-body');
    const tierL = (biz.tier || 'basic').toLowerCase();
    const rawRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";

    // 2. [cite: 2026-01-28] Coupon/Deal Logic
    let couponImg = "";
    if (biz.coupon && biz.coupon !== "" && biz.coupon !== "N/A") {
        const link = biz.coupon.trim();
        // Check if link is a full URL or just a filename in your repo
        couponImg = (link.startsWith('data:image') || link.startsWith('http')) ? link : `${rawRepo}${link}.png`;
    }

    // 3. [cite: 2026-01-29] PREMIUM & PLUS: Full Deep Dive Layout
    if (tierL === 'premium' || tierL === 'plus') {
        const mapAddr = encodeURIComponent(biz.full_location || `${biz.address} ${biz.town} IL`);
        
        body.innerHTML = `
            <div style="text-align:center; width:100%; padding-bottom: 20px; border-bottom: 2px solid #000; margin-bottom: 25px;">
                <h1 style="font-family:'Times New Roman', serif; margin:0 auto; font-size: 2.8rem; display:block; width:100%;">${biz.name}</h1>
                <p style="color:#666; font-style:italic; font-size: 1.2rem; margin: 5px 0 0 0;">${biz.category} | Est. ${biz.established || 'N/A'}</p>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:30px;">
                <div style="padding: 10px;">
                    <h3 style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-top:0; text-transform: uppercase;">Business Details</h3>
                    <div style="font-size: 1.15rem; line-height: 1.8;">
                        <p><strong>📞 Phone:</strong> <a href="tel:${biz.phone}" style="color:#0c30f0; text-decoration:underline; font-weight:bold;">${biz.phone}</a></p>
                        <p><strong>📍 Address:</strong> ${biz.full_location || biz.address}</p>
                        <p><strong>⏰ Hours:</strong> ${biz.hours || 'N/A'}</p>
                    </div>
                    <div style="margin-top:25px; display:flex; gap:12px; flex-wrap: wrap;">
                        ${biz.website && biz.website !== "N/A" ? `<a href="${biz.website}" target="_blank" style="background:#0c30f0; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold; border:1px solid #000;">🌐 Website</a>` : ""}
                        ${biz.facebook && biz.facebook !== "N/A" ? `<a href="${biz.facebook}" target="_blank" style="background:#3b5998; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold; border:1px solid #000;">f Facebook</a>` : ""}
                    </div>
                </div>
                
                <div style="padding: 10px;">
                    <h3 style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-top:0; text-transform: uppercase;">Location</h3>
                    <div style="border: 2px solid #000; height: 280px; background:#eee; box-shadow: 4px 4px 0px rgba(0,0,0,0.1); overflow:hidden;">
                        <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe>
                    </div>
                </div>
            </div>
            
            ${biz.bio && biz.bio !== "N/A" ? `<div style="margin-top:30px; padding-top:20px; border-top:2.5px double #000;"><h3 style="text-transform:uppercase; margin-top:0;">Our Story</h3><p style="line-height:1.7; font-size: 1.15rem; color:#222;">${biz.bio}</p></div>` : ""}
            
            ${couponImg ? `<div style="margin-top:30px; border:4px dashed #d4af37; background:#fffbe6; padding:25px; text-align:center;"><h2 style="color:#d4af37; margin:0 0 15px 0; font-size: 1.8rem;">🎟️ EXCLUSIVE COMMUNITY DEAL</h2><img src="${couponImg}" style="max-width:100%; height:auto; max-height:300px; border:1px solid #000;"></div>` : ""}
        `;
    } 
    // 4. [cite: 2026-01-28] BASIC & GOLD: Coupon-Only Layout
    else {
        body.innerHTML = `
            <div style="text-align:center; padding:10px;">
                <h2 style="font-family:'Times New Roman', serif; font-size: 2.2rem;">${biz.name}</h2>
                <div style="border:5px dashed #000; padding:30px; background:#fff;">
                    ${couponImg ? `<img src="${couponImg}" style="max-width:100%; height:auto; max-height:400px; object-fit:contain;">` : `<p>No coupon available. Visit us in person!</p>`}
                </div>
            </div>`;
    }

    modal.style.display = "flex";
}

/**
 * 🛠️ CLOSE LOGIC [cite: 2026-01-26]
 */
function closeModal() { document.getElementById('premium-modal').style.display = "none"; }

window.onclick = function(event) {
    const modal = document.getElementById('premium-modal');
    if (event.target == modal || (event.target.classList && event.target.classList.contains('close-btn')) || event.target.innerHTML === '×') { 
        closeModal(); 
    }
}
