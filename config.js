/**
 * 🛠️ DIRECTORY CONTROL CENTER (CONFIG.JS)
 * Centralized settings for Kevin & Scott
 */

const CONFIG = {
    // 1. DATA SOURCE
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    COUPON_ICON: "https://raw.githubusercontent.com/KFruti88/images/main/Coupon.png",

    // 2. A–N COLUMN INDICES
    COLUMN_MAP: {
        IMAGE_ID: 0,   // A
        NAME: 1,       // B
        TIER: 2,       // C
        CATEGORY: 3,   // D
        PHONE: 4,      // E
        ADDRESS: 5,    // F
        TOWN: 6,       // G
        STATE_ZIP: 7,  // H
        ESTABLISHED: 12, // M
        COUPON_LINK: 13  // N
    },

    // 3. COLOR LOCK BRANDING [cite: 2026-01-28]
    TOWN_COLORS: {
        "Flora": { bg: "#0c0b82", text: "#fe4f00", class: "flora-bar" },
        "Louisville": { bg: "#010101", text: "#eb1c24", class: "louisville-bar" },
        "North Clay": { bg: "#010101", text: "#eb1c24", class: "louisville-bar" },
        "Clay City": { bg: "#0c30f0", text: "#8a8a88", class: "clay-city-bar" },
        "Xenia": { bg: "#000000", text: "#fdb813", class: "xenia-bar" },
        "Sailor Springs": { bg: "#000000", text: "#a020f0", class: "sailor-springs-bar" },
        "Clay County": { bg: "#333333", text: "#ffffff", class: "" }
    },

    // 4. AFFILIATE SETTINGS [cite: 2026-01-27]
    AMAZON_TAG: "werewolf3788-20",
    VERSION: "1.60"
};

// Export for Universal Browser Support [cite: 2026-01-26]
export default CONFIG;
