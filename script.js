/**
 * SCRIPT.JS - Profile Page Data Loader
 * Loads business data from Google Sheets and displays individual business profiles
 */

const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

let directoryData = [];

function loadDirectory() {
    Papa.parse(csvUrl, {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: function(results) {
            directoryData = results.data.slice(1).map(row => {
                const addr = row[6] || "";
                const townFromAddr = addr.split(',').length >= 2 ? addr.split(',')[1].trim() : "Clay County";
                
                return {
                    ImageID: row[0] || "",
                    Name: row[1] || "N/A",
                    Town: row[2] || townFromAddr,
                    Tier: row[3] || "Basic",
                    Category: row[4] || "N/A",
                    Phone: row[5] || "",
                    Address: row[6] || "",
                    Hours: row[7] || "",
                    Website: row[8] || "",
                    Facebook: row[9] || "",
                    Bio: row[10] || "",
                    CouponText: row[11] || "",
                    Established: row[12] || "",
                    CouponLink: row[13] || ""
                };
            }).filter(b => b.Name !== "N/A" && b.Name !== "Name");
            
            renderProfile();
        },
        error: function(error) {
            console.error("Error loading directory data:", error);
            document.getElementById('profile-wrap').innerHTML = `
                <div style="text-align:center; padding:100px;">
                    <h2>Error loading business details</h2>
                    <p>Please try again later.</p>
                    <a href="index.html" class="action-btn">Back to Directory</a>
                </div>
            `;
        }
    });
}

function renderProfile() {
    const params = new URLSearchParams(window.location.search);
    const bizName = params.get('name');
    
    if (!bizName) {
        document.getElementById('profile-wrap').innerHTML = `
            <div style="text-align:center; padding:100px;">
                <h2>No business specified</h2>
                <a href="index.html" class="action-btn">Back to Directory</a>
            </div>
        `;
        return;
    }
    
    const business = directoryData.find(b => b.Name === bizName);
    
    if (!business) {
        document.getElementById('profile-wrap').innerHTML = `
            <div style="text-align:center; padding:100px;">
                <h2>Business not found</h2>
                <a href="index.html" class="action-btn">Back to Directory</a>
            </div>
        `;
        return;
    }
    
    const tierL = business.Tier.toLowerCase();
    const mapAddr = encodeURIComponent(`${business.Address}, ${business.Town}, IL`);
    
    // Get logo
    let fileName = business.ImageID ? business.ImageID.trim() : "";
    if (!fileName && business.Name) {
        fileName = business.Name.toLowerCase().replace(/['\s]/g, "");
    }
    const placeholder = `https://via.placeholder.com/250x250?text=Logo+Pending`;
    const logoSrc = `${imageRepo}${fileName}.jpeg`;
    
    // Build coupon image if exists
    let couponImg = "";
    if (business.CouponLink && business.CouponLink !== "" && business.CouponLink !== "N/A") {
        const link = business.CouponLink.trim();
        if (link.startsWith('data:image') || link.startsWith('http')) {
            couponImg = link;
        } else {
            couponImg = `${imageRepo}${link}.png`;
        }
    }
    
    document.getElementById('profile-wrap').innerHTML = `
        <div class="profile-container">
            <span class="tier-indicator">${business.Tier}</span>
            
            <a href="index.html" class="back-link">← Back to Directory</a>
            
            <div class="profile-header">
                <div class="profile-logo-box">
                    <img src="${logoSrc}" alt="${business.Name}" 
                         onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${placeholder}';};">
                </div>
                <div>
                    <h1 class="biz-title">${business.Name}</h1>
                    <p class="biz-meta">${business.Category} | Est. ${business.Established || 'N/A'}</p>
                    <p class="biz-meta">${business.Town}, Illinois</p>
                </div>
            </div>
            
            <div class="details-grid">
                <div class="info-section">
                    <h3>Contact Information</h3>
                    <div class="info-item"><strong>📞 Phone:</strong> <a href="tel:${business.Phone}">${business.Phone || 'N/A'}</a></div>
                    <div class="info-item"><strong>📍 Address:</strong> ${business.Address || 'N/A'}</div>
                    <div class="info-item"><strong>⏰ Hours:</strong> ${business.Hours || 'Call for hours'}</div>
                    
                    ${business.Website && business.Website !== "N/A" ? `
                        <a href="${business.Website}" target="_blank" class="action-btn">🌐 Visit Website</a>
                    ` : ""}
                    
                    ${business.Facebook && business.Facebook !== "N/A" ? `
                        <a href="${business.Facebook}" target="_blank" class="action-btn" style="background:#3b5998; margin-left:10px;">f Facebook</a>
                    ` : ""}
                </div>
                
                <div class="info-section">
                    <h3>Location</h3>
                    <div class="map-box">
                        <iframe width="100%" height="100%" frameborder="0" style="border:0;" 
                            src="https://maps.google.com/maps?q=${mapAddr}&t=&z=14&ie=UTF8&iwloc=&output=embed">
                        </iframe>
                    </div>
                </div>
            </div>
            
            ${business.Bio && business.Bio !== "N/A" ? `
                <div class="bio-box">
                    <h3 style="margin-top:0;">Our Story</h3>
                    <p>${business.Bio}</p>
                </div>
            ` : ""}
            
            ${couponImg ? `
                <div style="margin-top:30px; border:4px dashed #d4af37; background:#fffbe6; padding:25px; text-align:center;">
                    <h2 style="color:#d4af37; margin:0 0 15px 0;">🎟️ EXCLUSIVE COMMUNITY DEAL</h2>
                    <p style="font-size: 1.2rem; font-weight:bold; margin-bottom: 15px;">${business.CouponText || ''}</p>
                    <img src="${couponImg}" style="max-width:100%; height:auto; max-height:300px; border:1px solid #000;">
                </div>
            ` : ""}
        </div>
    `;
}
