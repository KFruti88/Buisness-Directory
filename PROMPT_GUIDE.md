<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Business Directory | Our Flora & Clay County</title>
    <style>
        /* CSS Standards: % based widths & Color Lock Mapping */
        body {
            font-family: Arial, sans-serif;
            background-color: #1a1a1a;
            color: #ffffff;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #directory-container {
            width: 90%; /* Standard width for all devices */
            max-width: 1200px;
            margin: 20px auto;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }

        .business-card {
            background: #333; /* Default Clay County Charcoal */
            border-radius: 8px;
            overflow: hidden;
            width: 100%; /* Stacks vertically on mobile */
            max-width: 350px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            border: 2px solid transparent;
        }

        /* Color Lock: Flora (Blue/Orange) */
        .card-flora {
            background-color: #0c0b82 !important;
            color: #fe4f00 !important;
            border-color: #fe4f00;
        }

        /* Color Lock: Louisville / North Clay (Black/Red) */
        .card-louisville, .card-north-clay {
            background-color: #010101 !important;
            color: #eb1c24 !important;
            border-color: #eb1c24;
        }

        .card-img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: #000;
        }

        .card-content {
            padding: 15px;
            flex-grow: 1;
        }

        .biz-name { font-size: 1.5rem; font-weight: bold; margin-bottom: 5px; }
        .biz-tier { font-size: 0.9rem; text-transform: uppercase; opacity: 0.8; }
        .biz-address { margin: 10px 0; font-style: italic; font-size: 0.95rem; }
        .biz-bio { font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4; }
        
        .coupon-box {
            background: rgba(255,255,255,0.1);
            border: 1px dashed #fff;
            padding: 10px;
            margin-top: 10px;
            font-weight: bold;
            text-align: center;
        }

        .btn-container {
            display: flex;
            gap: 10px;
            padding: 15px;
            background: rgba(0,0,0,0.2);
        }

        .btn {
            flex: 1;
            padding: 10px;
            text-align: center;
            text-decoration: none;
            color: inherit;
            border: 1px solid currentColor;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
        }

        /* Mobile Stacking Logic */
        @media (max-width: 600px) {
            #directory-container { width: 95%; }
            .business-card { max-width: 100%; }
        }
    </style>
</head>
<body>

    <h1>Local Business Directory</h1>
    <div id="directory-container">
        </div>

    <script>
        // Column Mapping established 2026-01-29
        // 0:ImageID, 1:Name, 3:Tier, 4:Category, 5:Phone, 6:Street, 7:Town, 8:StateZip, 10:Web, 11:FB, 12:Bio, 13:Est, 14:Coupon
        
        async function fetchDirectory() {
            // Replace with your actual Published Google Sheet CSV URL
            const sheetURL = 'YOUR_GOOGLE_SHEET_CSV_URL_HERE';
            
            try {
                const response = await fetch(sheetURL);
                const data = await response.text();
                const rows = data.split('\n').slice(1); // Skip header row

                const container = document.getElementById('directory-container');
                container.innerHTML = '';

                rows.forEach(row => {
                    const col = row.split(','); // Simplified for CSV parsing
                    if (col.length < 10) return; // Skip empty rows

                    // Data Extraction with N/A Fallback
                    const name = col[1] || 'N/A';
                    const town = col[7] ? col[7].trim() : 'Unknown';
                    const street = col[6] || '';
                    const stateZip = col[8] || '';
                    const phone = col[5] || 'N/A';
                    const bio = col[12] || 'N/A';
                    const tier = col[3] || 'Standard';
                    const est = col[13] || 'N/A';
                    const coupon = col[14] || '';
                    
                    // Address Fusion Logic
                    const fullAddress = `${street} ${town}, ${stateZip}`.trim();

                    // Create Card
                    const card = document.createElement('div');
                    card.className = 'business-card';

                    // Apply Color Lock based on Index 7 (Town)
                    if (town === 'Flora') card.classList.add('card-flora');
                    if (town === 'Louisville' || town === 'North Clay') card.classList.add('card-louisville');

                    card.innerHTML = `
                        <img src="${col[0] || col[16] || 'placeholder.jpg'}" class="card-img" alt="${name}">
                        <div class="card-content">
                            <div class="biz-tier">${tier} | Since ${est}</div>
                            <div class="biz-name">${name}</div>
                            <div class="biz-address">${fullAddress}</div>
                            <div class="biz-bio">${bio}</div>
                            ${coupon ? `<div class="coupon-box">DEAL: ${coupon}</div>` : ''}
                        </div>
                        <div class="btn-container">
                            <a href="tel:${phone.replace(/\D/g,'')}" class="btn">📞 Call</a>
                            ${col[10] ? `<a href="${col[10]}" target="_blank" class="btn">🌐 Web</a>` : ''}
                            ${col[11] ? `<a href="${col[11]}" target="_blank" class="btn">FB</a>` : ''}
                        </div>
                    `;
                    container.appendChild(card);
                });
            } catch (error) {
                console.error('Error loading directory:', error);
            }
        }

        fetchDirectory();
    </script>
</body>
</html>
