"use strict";
import html2canvas from 'html2canvas';

// ============================================================
// 設定
// ============================================================

const TARGET_SELECTOR = ".otherDetailAreaWrap";
const BUTTON_AREA_SELECTOR = ".visitFollowBtnArea";
const MEMBER_ID_SELECTOR = ".memberId";

// 画像キャプチャ時にCSSが適用されないので平打ち
const CUPTURE_BUTTON_STYLE = `
    width: 114px;
    height: 26px;
    text-align: center;
    margin-left: 12px;
    font-size: 14px;
    font-weight: 700;
    box-sizing: border-box;
    border-radius: 5px;
    padding-bottom: 2px;
    color: #f0a0b1;
    background-color: #fff;
    border: 2px solid #f0a0b1;`;

const CUPTURE_BUTTON_HOVER_STYLE = function () {
    this.style.color = '#fff';
    this.style.backgroundColor = '#bee562';
    this.style.border = '2px solid #bee562';
};

const CUPTURE_BUTTON_NORMAL_STYLE = function () {
    this.style.color = '#f0a0b1';
    this.style.backgroundColor = '#fff';
    this.style.border = '2px solid #f0a0b1';
};

// ============================================================
// ボタン注入
// ============================================================

function injectCaptureButton() {
    const target = document.querySelector(BUTTON_AREA_SELECTOR);

    if (!target) return;
    if (target.querySelector(".captureBtn")) return;

    const button = document.createElement("button");

    button.className = "captureBtn";
    button.style.cssText = CUPTURE_BUTTON_STYLE;
    button.onmouseover = CUPTURE_BUTTON_HOVER_STYLE;
    button.onmouseout = CUPTURE_BUTTON_NORMAL_STYLE;
    button.textContent = "画像で保存";

    button.addEventListener("click", captureOtherDetailArea);
    target.appendChild(button);

    console.log("[Detail Area Capture] ボタンを追加しました。");


}

// ============================================================
// ファイル名生成
// ============================================================

function createFilename() {
    const memberElement = document.querySelector(MEMBER_ID_SELECTOR);


    const memberId = memberElement
        ? memberElement.textContent.trim()
        : "unknown";

    const now = new Date();

    const pad = (value) => String(value).padStart(2, "0");

    const timestamp =
        `${now.getFullYear()}` +
        `${pad(now.getMonth() + 1)}` +
        `${pad(now.getDate())}_` +
        `${pad(now.getHours())}` +
        `${pad(now.getMinutes())}` +
        `${pad(now.getSeconds())}`;

    return `${memberId}_${timestamp}.png`;


}

// ============================================================
// キャプチャ対象内の画像を確認
// ============================================================

function inspectImages(target) {
    const images = target.querySelectorAll("img");


    console.log(
        `[Detail Area Capture] 画像を${images.length}個検出しました。`
    );

    images.forEach((img, index) => {
        console.log(
            `[Detail Area Capture] image[${index}]`,
            {
                src: img.currentSrc || img.src,
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                crossOrigin: img.crossOrigin
            }
        );
    });


}

// ============================================================
// ノードキャプチャ
// ============================================================

async function captureOtherDetailArea() {
    const target = document.querySelector(TARGET_SELECTOR);


    if (!target) {
        console.error(
            "[Detail Area Capture] キャプチャ対象が見つかりません。",
        );

        return;
    }

    const filename = createFilename();

    console.log(
        `[Detail Area Capture] キャプチャ開始: ${filename}`,
    );

    // --------------------------------------------------------
    // 既にブラウザが取得済みの画像を確認
    // --------------------------------------------------------

    inspectImages(target);

    try {
        const canvas = await html2canvas(target, {
            useCORS: true
        });

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error(
                    "[Detail Area Capture] PNGの生成に失敗しました。",
                );

                return;
            }

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = filename;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            console.log(
                `[Detail Area Capture] 保存しました: ${filename}`,
            );
        }, "image/png");

    } catch (error) {
        console.error(
            "[Detail Area Capture] キャプチャに失敗しました。",
            error,
        );
    }


}

// ============================================================
// 交換所ボタン注入
// ============================================================

/**
 * img src から アイテムID を抽出する
 * src 形式: /disp/{アイテムID}{拡張子}  例: /disp/a311zj.gif
 * @param {HTMLImageElement} img
 * @returns {string|null}
 */
function extractItemId(img) {
    const match = img.src.match(/\/disp\/([^/.]+)\.[^/.]+$/);
    return match ? match[1] : null;
}

/**
 * itemListAreaWrap 内の全 dispArea に「交換所へ」ボタンを注入する
 */
function injectBazarButtons() {
    const itemListAreaWrap = document.querySelector(".itemListAreaWrap");
    if (!itemListAreaWrap) return;

    const dispAreas = itemListAreaWrap.querySelectorAll(".itemList .dispArea");
    if (dispAreas.length === 0) return;

    dispAreas.forEach((dispArea) => {
        const img = dispArea.querySelector("img");
        if (!img) return;

        const rawId = extractItemId(img);
        if (!rawId) return;

        const itemId = rawId.toUpperCase();
        const expectedLink = `/bazaar/itemInfo/?itemCode=${itemId}`;
        const existing = dispArea.querySelector(".searchBazar");

        if (existing) {
            // 既存ボタンのlinkが現在のアイテムIDと異なる場合のみ更新
            if (existing.getAttribute("link") !== expectedLink) {
                existing.setAttribute("link", expectedLink);
                console.log(`[Bazar Button] linkを更新しました: ${expectedLink}`);
            }
            return;
        }

        const button = document.createElement("button");
        button.className = "searchBazar";
        button.setAttribute("link", expectedLink);
        button.textContent = "交換所へ";

        button.addEventListener("click", () => {
            const href = button.getAttribute("link");
            window.location.href = href;
        });

        dispArea.appendChild(button);
    });

    console.log("[Bazar Button] 交換所ボタンを注入しました。");
}

// ============================================================
// MutationObserver
// ============================================================

function startObserver() {
    const observer = new MutationObserver(() => {
        injectCaptureButton();
        injectBazarButtons();
    });


    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 既に存在している場合にも対応
    injectCaptureButton();
    injectBazarButtons();

    console.log(
        "[Detail Area Capture] MutationObserverを開始しました。",
    );


}

// ============================================================
// 初期化
// ============================================================

startObserver();
