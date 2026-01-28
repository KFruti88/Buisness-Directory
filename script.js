/**
 * SCRIPT.JS - Profile Page Data Loader
 * Loads business data from Google Sheets and displays individual business profiles
 */

const imageRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

let directoryData = [];

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text safe for HTML insertion
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validates that a URL uses safe protocols (http or https)
 * @param {string} url - The URL to validate
 * @returns {string} - The URL if safe, empty string otherwise
 */
function validateUrl(url) {
    if (!url || url === "N/A") return "";
    try {
        const parsed = new URL(url);
        return (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? url : "";
    } catch {
        return "";
    }
}

/**
 * Loads business directory data from Google Sheets CSV
 * Parses the CSV using PapaParse and renders the profile
 */
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

/**
 * Renders the business profile page based on URL parameter
 * Reads the 'name' parameter from URL and displays the matching business
 */
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
    
    // Validate and escape all user-controlled data
    const safeName = escapeHtml(business.Name);
    const safeCategory = escapeHtml(business.Category);
    const safeEstablished = escapeHtml(business.Established || 'N/A');
    const safeTown = escapeHtml(business.Town);
    const safePhone = escapeHtml(business.Phone || 'N/A');
    const safeAddress = escapeHtml(business.Address || 'N/A');
    const safeHours = escapeHtml(business.Hours || 'Call for hours');
    const safeBio = escapeHtml(business.Bio);
    const safeCouponText = escapeHtml(business.CouponText);
    const safeWebsite = validateUrl(business.Website);
    const safeFacebook = validateUrl(business.Facebook);
    
    document.getElementById('profile-wrap').innerHTML = `
        <div class="profile-container">
            <span class="tier-indicator">${escapeHtml(business.Tier)}</span>
            
            <a href="index.html" class="back-link">← Back to Directory</a>
            
            <div class="profile-header">
                <div class="profile-logo-box">
                    <img src="${logoSrc}" alt="${safeName}" 
                         onerror="this.onerror=null; this.src='${imageRepo}${fileName}.png'; this.onerror=function(){this.src='${placeholder}';};">
                </div>
                <div>
                    <h1 class="biz-title">${safeName}</h1>
                    <p class="biz-meta">${safeCategory} | Est. ${safeEstablished}</p>
                    <p class="biz-meta">${safeTown}, Illinois</p>
                </div>
            </div>
            
            <div class="details-grid">
                <div class="info-section">
                    <h3>Contact Information</h3>
                    <div class="info-item"><strong>📞 Phone:</strong> <a href="tel:${business.Phone}">${safePhone}</a></div>
                    <div class="info-item"><strong>📍 Address:</strong> ${safeAddress}</div>
                    <div class="info-item"><strong>⏰ Hours:</strong> ${safeHours}</div>
                    
                    ${safeWebsite ? `
                        <a href="${safeWebsite}" target="_blank" rel="noopener noreferrer" class="action-btn">🌐 Visit Website</a>
                    ` : ""}
                    
                    ${safeFacebook ? `
                        <a href="${safeFacebook}" target="_blank" rel="noopener noreferrer" class="action-btn" style="background:#3b5998; margin-left:10px;">f Facebook</a>
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
            
            ${safeBio && safeBio !== "N/A" ? `
                <div class="bio-box">
                    <h3 style="margin-top:0;">Our Story</h3>
                    <p>${safeBio}</p>
                </div>
            ` : ""}
            
            ${couponImg ? `
                <div style="margin-top:30px; border:4px dashed #d4af37; background:#fffbe6; padding:25px; text-align:center;">
                    <h2 style="color:#d4af37; margin:0 0 15px 0;">🎟️ EXCLUSIVE COMMUNITY DEAL</h2>
                    <p style="font-size: 1.2rem; font-weight:bold; margin-bottom: 15px;">${safeCouponText}</p>
                    <img src="${couponImg}" alt="Coupon" style="max-width:100%; height:auto; max-height:300px; border:1px solid #000;">
                </div>
            ` : ""}
        </div>
    `;
}
