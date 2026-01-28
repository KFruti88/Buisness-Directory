/**
 * PROJECT: Clay County Directory Engine
 * VERSION: 1.52 (Phone, Tier, and Coupon Alignment)
 */

function renderDirectoryGrid(data) {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    grid.innerHTML = data.map(biz => {
        const tierL = biz.Tier.toLowerCase();
        const style = townStyles[biz.Town.trim()] || townStyles["Clay County"];
        
        // 1. Logic for Coupon Visibility [cite: 2026-01-28]
        const hasCoupon = (biz.CouponLink && biz.CouponLink.toLowerCase() !== "n/a" && biz.CouponLink !== "");
        const couponBadge = hasCoupon ? `<img src="${couponIcon}" style="position:absolute; top:8px; right:8px; width:32px; height:auto; z-index:20;" alt="Coupon">` : "";

        // 2. Tier Badge in Top-Left Corner [cite: 2026-01-26]
        const tierTag = `<div style="position:absolute; top:10px; left:10px; font-size: 0.65rem; font-weight: bold; text-transform: uppercase; border: 1px solid #000; padding: 2px 6px; background: #fff; z-index: 20;">${biz.Tier}</div>`;

        const clickAction = (tierL === 'premium' || biz.CouponLink) ? `onclick="openFullModal('${biz.Name.replace(/'/g, "\\'")}')"` : "";

        return `
        <div class="card ${tierL}" ${clickAction} style="cursor: ${clickAction ? 'pointer' : 'default'}; height: 450px; display: flex; flex-direction: column; overflow: hidden; border: 2px solid #000; background: #fff; position: relative;">
            
            ${tierTag}
            ${couponBadge}

            <div class="logo-box" style="height: 120px; display: flex; align-items: center; justify-content: center; padding: 15px;">
                ${getSmartLogo(biz.ImageID, biz.Name)}
            </div>

            <div class="town-bar ${townStyles[biz.Town.trim()]?.bar || ''}" style="background-color: ${style.bg || ''}; color: ${style.text || ''};">
                ${biz.Town}
            </div> 

            <div class="biz-name" style="height: 90px; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: 800; padding: 10px; font-family: 'Times New Roman', serif;">
                ${biz.Name}
            </div> 
            
            <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; text-align: center;">
                
                ${(tierL === 'premium' || tierL === 'plus') ? 
                    `<div class="biz-phone" style="font-weight:bold; font-size: 1.2rem; color: #0c30f0; margin-bottom: 5px;">📞 ${biz.Phone}</div>` : ''}
                
                <div class="cat-text" style="font-size: 1rem; color: #444; font-weight: bold;">
                    ${catEmojis[biz.Category] || "📁"} ${biz.Category}
                </div> 
            </div>
        </div>`;
    }).join('');
}
