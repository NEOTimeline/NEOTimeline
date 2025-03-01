async function fetchData() {
  try {
    const response = await fetch('https://script.googleusercontent.com/a/macros/giga.otacity-hs.ed.jp/echo?user_content_key=t0Erzm2i3ZcYDRso1UZMvSfjv2cjBV0y91F-m3nIE8bzTyZC-ihN5d71s2glHnCoia5QxdPf_pAsTZlPuMNVABGdIBE_t2tYOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMi80zadyHLKDhypfmkuhIQN5RUJC-y9DC0w8A5YSzQQBLhyHCd5hHaz37ZJt7E3h1E9N8skZ1GZBBWUphHV_slOHU9WL16tMHcRJ9haICz7M_4x3ABBf6iUq4i4IEScJx8cpeMPsSQ6dqIqxTbmWu_A&lib=M29jyfO_hAJxwBrs9wjfcE8Y0iY9POXwW');
    const data = await response.json();  // JSONとしてパース
    return data;  // 取得したデータを返す
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    return [];  // エラーが発生した場合、空の配列を返す
  }
}

function CreateBasicHTML(month, day, title, description, video, yearHeader) {
    let videoHTML = video ? `<p><a href='${video}' target='_blank'>ニュース動画を見る</a></p>` : "";

    return `
        ${yearHeader}
        <div class='timeline-item'>
            <div class='timeline-item-date'><h4>${month}月${day}日</h4></div>
            <div class='timeline-item-content'>
                <h3 class='timeline-item-title'>${title}</h3>
                <p class='timeline-item-detail'>${description}</p>
                ${videoHTML}
            </div>
        </div>
    `;
}

async function write() {
    const timeline = document.getElementById('timeline');
    const Database = await fetchData();  // 非同期でデータを取得

    if (!Database.length) {
        timeline.innerHTML = "<p>データが取得できませんでした。</p>";
        return;
    }

    let lastYear = null;
    let htmlContent = [];

    Database.forEach(item => {
        let currentYear = item.year;
        let yearHeader = "";

        // 年が変わったら新しい年の見出しを作成
        if (currentYear !== lastYear) {
            if (lastYear !== null) {
                // 直前の年のセクションを閉じる
                htmlContent.push(`</div></div>`);
            }
            yearHeader = `<div class='timeline-year-block'>
                            <div class='timeline-year-header'>
                                <h2>${currentYear}年</h2>
                            </div>
                            <div class='timeline-year-item'>`;
        }

        htmlContent.push(CreateBasicHTML(item.month, item.day, item.title, item.description, item.video, yearHeader));
        lastYear = currentYear;
    });

    // 最後の年のセクションを閉じる
    if (lastYear !== null) {
        htmlContent.push(`</div></div>`);
    }

    // HTMLをtimeline要素に挿入
    timeline.innerHTML = htmlContent.join('');
}

// DOMContentLoadedを待ってから実行
document.addEventListener("DOMContentLoaded", async () => {
    await write();  // ここで非同期処理を待つ
});
