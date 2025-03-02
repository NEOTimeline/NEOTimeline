async function fetchData() {
    try {
        const response = await fetch('https://script.googleusercontent.com/a/macros/giga.otacity-hs.ed.jp/echo?user_content_key=t0Erzm2i3ZcYDRso1UZMvSfjv2cjBV0y91F-m3nIE8bzTyZC-ihN5d71s2glHnCoia5QxdPf_pAsTZlPuMNVABGdIBE_t2tYOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMi80zadyHLKDhypfmkuhIQN5RUJC-y9DC0w8A5YSzQQBLhyHCd5hHaz37ZJt7E3h1E9N8skZ1GZBBWUphHV_slOHU9WL16tMHcRJ9haICz7M_4x3ABBf6iUq4i4IEScJx8cpeMPsSQ6dqIqxTbmWu_A&lib=M29jyfO_hAJxwBrs9wjfcE8Y0iY9POXwW');

        if (!response.ok) {
            throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : []; // 応答が配列でない場合は空配列を返す
    } catch (error) {
        console.error('データの取得に失敗しました:', error);
        return [];
    }
}

function CreateBasicHTML(id, month, day, title, description, video, yearHeader, year) {
    let videoHTML = video ? `<p><a href='${video}' target='_blank'>ニュース動画を見る</a></p>` : "";

    return `
        ${yearHeader}
        <div class='timeline-item'>
            <div class='timeline-item-date'><h4>${month}月${day}日</h4></div>
            <div class='timeline-item-content'>
                <h3 class='timeline-item-title'>
                    <a href="javascript:display_details(${id}, '${month}', '${day}', '${title}', '${description}', '${video}');">${title}</a>
                </h3>
                <p class='timeline-item-detail'>${description}</p>
                ${videoHTML}
            </div>
        </div>
    `;
}

async function write() {
    const timeline = document.getElementById('timeline');
    const Database = await fetchData();

    if (!Array.isArray(Database) || Database.length === 0) {
        timeline.innerHTML = "<p>データが取得できませんでした。</p>";
        return;
    }

    let lastYear = null;
    let htmlContent = [];

    Database.forEach(item => {
        let currentYear = item.year;
        let yearHeader = "";

        if (currentYear !== lastYear) {
            if (lastYear !== null) {
                htmlContent.push(`</div></div>`); // 直前の年のセクションを閉じる
            }
            yearHeader = `
                <div class='timeline-year-block'>
                    <div class='timeline-year-header'>
                        <h2>${currentYear}年</h2>
                    </div>
                    <div class='timeline-year-item'>
            `;
        }

        htmlContent.push(CreateBasicHTML(item.id, item.month, item.day, item.title, item.description, item.video, yearHeader, item.year));
        lastYear = currentYear;
    });

    if (lastYear !== null) {
        htmlContent.push(`</div></div>`); // 最後の年のセクションを閉じる
    }

    timeline.innerHTML = htmlContent.join('');
}

document.addEventListener("DOMContentLoaded", async () => {
    await write();
});

function display_details(id, month, day, title, description, video) {
    const detailHTML = `
        <h3>${title}</h3>
        <p>${month}月${day}日</p>
        <p>${description}</p>
        ${video ? `<iframe width="100%" height="200" src="${video}"></iframe>` : ""}
    `;

    const detail = document.getElementById('details');
    detail.innerHTML = detailHTML;
}
