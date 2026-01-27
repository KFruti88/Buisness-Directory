/** * CONFIG.JS - SHARED ASSETS & RULES */
const rawRepo = "https://raw.githubusercontent.com/KFruti88/images/main/";
const placeholderImg = "https://raw.githubusercontent.com/KFruti88/images/main/default.png";
const couponImg = "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png";
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv";

const catEmojis = {
    "Agriculture": "🚜", "Airport": "🚁", "Automotive / Auto Sales": "🚗",
    "Auto Parts": "⚙️", "Auto Repair": "🔧", "Bars/Saloon": "🍺",
    "Beauty Salon / Barber": "💈💇", "Carwash": "🧼", "Church": "⛪",
    "Community": "👥", "Delivery": "🚚", "Education & Health": "📚",
    "Executive & Administrative": "🏛️", "Financial Services": "💰",
    "Flower Shop": "💐", "Freight Trucking": "🚛", "Gambling Industries": "🎰",
    "Gas Station": "⛽", "Government": "🏛️", "Handmade Ceramics & Pottery": "🏺",
    "Healthcare": "🏥", "Insurance": "📄", "Internet": "🌐", "Legal Services": "⚖️",
    "Libraries and Archives": "📚", "Manufacturing": "🏗️", "Medical": "🏥",
    "Non-Profit": "📝", "Professional Services": "💼", "Utility/Gas": "🔥",
    "Public Safety & Justice": "⚖️", "Public Works & Infrastructure": "🏗️",
    "Restaurants": "🍴", "Storage": "📦", "Stores": "🛍️", "USPS/Post Office": "📬"
};

function mapCategory(raw) {
    if (!raw || raw === "Searching..." || raw === "N/A") return "Professional Services";
    const val = raw.toLowerCase().trim();
    if (val.includes("airport")) return "Airport";
    if (val.includes("car sales") || val.includes("automotive")) return "Automotive / Auto Sales";
    if (val.includes("barber") || val.includes("haircut") || val.includes("salon")) return "Beauty Salon / Barber";
    if (val.includes("city hall") || val.includes("government")) return "Government";
    if (val.includes("restaurant") || val.includes("bar")) return "Restaurants";
    if (val.includes("utility") || val.includes("gas")) return "Utility/Gas";
    return raw; 
}
