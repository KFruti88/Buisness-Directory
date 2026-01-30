/**
 * PROJECT: Clay County Master Directory (Default Restore)
 * HANDSHAKE: VOL = Month, NO = Day [cite: 2026-01-30]
 */

const CONFIG = {
    CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDgQs5fH6y8PWw9zJ7_3237SB2lxlsx8Gnw8o8xvTr94vVtWwzs6qqidajKbPepQDS36GNo97bX_4b/pub?gid=0&single=true&output=csv",
    IMAGE_REPO: "https://raw.githubusercontent.com/KFruti88/images/main/",
    TOWN_COLORS: {
        "Flora": { bg: "#0c0b82", text: "#fe4f00" },
        "Louisville": { bg: "#010101", text: "#eb1c24" },
        "Clay City": { bg: "#8a8a88", text: "#0c30f0" },
        "Xenia": { bg: "#000000", text: "#fdb813" },
        "Sailor Springs": { bg: "#000000", text: "#a020f0" },
        "Clay County": { bg: "#333333", text: "#ffffff" }
    },
    MAP: { IMG: 0, NAME: 1, TOWN: 3, PHONE: 5, CAT: 8, TIER: 11, CPN_TXT: 13 }
};

function updateNewspaperMeta() {
    const now = new Date();
    const infoBox = document.getElementById('header-info');
    if (infoBox) {
        // Displays: VOL. 1 — NO. 30 (Month/Day) [cite: 2026-01-30]
        infoBox.innerText = `VOL. ${now.getMonth() + 1} — NO. ${now.getDate()}`;
    }
}

function renderCards(data) {
    const grid = document.getElementById('directory-grid');
    grid.innerHTML = data.map(biz => {
        const colors = CONFIG.TOWN_COLORS[biz.town] || CONFIG.TOWN_COLORS["Clay County"];
        return `
        <div class="card" onclick="openFullModal('${biz.name.replace(/'/g, "\\'")}')">
            <div class="logo-box">
                <img src="${CONFIG.IMAGE_REPO}${biz.id}.jpeg" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <div class="town-bar" style="background-color: ${colors.bg}; color: ${colors.text};">${biz.town}</div>
            <div class="biz-name">${biz.name}</div>
            <div class="bottom-stack">
                <div class="category-locked">📁 ${biz.category}</div>
            </div>
        </div>`;
    }).join('');
}
