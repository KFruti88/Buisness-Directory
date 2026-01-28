import csv
import json
import requests
from io import StringIO

# 🛠️ Configuration
# Using your verified Yellow (Business Cards) CSV link
SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?output=csv"

def update_directory():
    print("🚀 Starting Directory Update (A-M Columns)...")
    
    try:
        response = requests.get(SHEET_CSV_URL)
        response.raise_for_status()
        f = StringIO(response.text)
        reader = csv.reader(f)
        
        # Skip the Header Row
        next(reader)
        
        business_list = []

        for row in reader:
            # Skip empty rows or rows without a Business Name (Column B / Index 1)
            if not row or len(row) < 2 or not row[1].strip():
                continue

            # Mapping based on A-M Structure (Index 0-12)
            # Ensuring everything is accurate, correct, and true
            business_data = {
                "image_id": row[0].strip() or "N/A",            # Col A (0)
                "name": row[1].strip(),                         # Col B (1)
                "tier": row[2].strip().lower() or "basic",      # Col C (2)
                "category": row[3].strip() or "N/A",            # Col D (3)
                "phone": row[4].strip().replace("-", "").replace("(", "").replace(")", "").replace(" ", ""), # Col E (4) - 10 digits
                "address": row[5].strip() or "N/A",             # Col F (5)
                "town": row[6].strip() or "N/A",                # Col G (6)
                "state_zip": row[7].strip() or "N/A",           # Col H (7)
                "hours": row[8].strip() or "N/A",               # Col I (8)
                "website": row[9].strip() or "N/A",             # Col J (9)
                "facebook": row[10].strip() or "N/A",           # Col K (10)
                "bio": row[11].strip() or "N/A",                # Col L (11)
                "established": row[12].strip() or "N/A",        # Col M (12)
                "amazon_tag": "werewolf3788-20"                 # Affiliate Standard
            }

            # Build Full Location for Google Maps style formatting
            # Combining Address (F), Town (G), and State Zip (H)
            business_data["full_location"] = f"{business_data['address']}, {business_data['town']}, {business_data['state_zip']}"

            business_list.append(business_data)

        # Output the data to JSON for GitHub Pages integration
        with open('directory.json', 'w', encoding='utf-8') as f:
            json.dump(business_list, f, indent=4)
            
        print(f"✅ Success! {len(business_list)} businesses processed using A-M mapping.")

    except Exception as e:
        print(f"❌ Error during update: {e}")

if __name__ == "__main__":
    update_directory()
