/**
 * CONFIG.JS - Global Settings & Data
 * This file feeds layout.js with the data source and category rules.
 */

// 1. The Google Sheet Data URL (Publish to Web -> CSV)
// PASTE YOUR GOOGLE SHEET CSV LINK HERE inside the quotes:
const baseCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv"; 

// 2. Placeholder Image for Basic entries or missing images
const placeholderImg = "https://raw.githubusercontent.com/KFruti88/images/main/placeholder.png";

// 3. Category Emojis for the UI
const catEmojis = {
    "Bars": "🍺", 
    "Emergency": "🚨", 
    "Church": "⛪", 
    "Post Office": "📬", 
    "Restaurants": "🍴", 
    "Retail": "🛒", 
    "Shopping": "🛍️", 
    "Manufacturing": "🏗️", 
    "Industry": "🏭", 
    "Financial Services": "💰", 
    "Healthcare": "🏥", 
    "Gas Station": "⛽", 
    "Internet": "🌐", 
    "Support Services": "🛠️", 
    "Professional Services": "💼", 
    "Agriculture": "🚜",
    "Other": "📁"
};

// 4. Helper to map raw CSV categories to our Emoji keys
function mapCategory(cat) {
    if (!cat) return "Other";
    const clean = cat.trim();
    // Return the category if it exists in our map, otherwise 'Other'
    return catEmojis[clean] ? clean : "Other";
}
