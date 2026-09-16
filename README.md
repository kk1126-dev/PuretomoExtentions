# Puretomo Extensions

<div align="center">
  <img src="icons/icon128.png" alt="Puretomo Extensions Icon" width="128"/>

  **ハンゲ Puretomo をもっと便利に使うための Chrome 拡張機能**

  ![Manifest Version](https://img.shields.io/badge/Manifest-v3-blue)
  ![License](https://img.shields.io/badge/License-MIT-green)
  ![Version](https://img.shields.io/badge/Version-1.0.0-orange)
</div>

---

## 概要

[ハンゲ Puretomo](https://puretomo.hange.jp/) 向けに追加機能を提供する Chrome 拡張機能です。  
プロフィールのキャプチャ保存や、アイテム交換所へのクイックアクセスなど、日常の操作をワンクリックで行えます。

---

## 機能

### 📸 みんなのコーデの画像保存機能

- 他ユーザーのみんなのコーデを **PNG 画像としてワンクリック保存**
- ファイル名はメンバー ID + タイムスタンプで自動生成  
  例: `MEMBER123_20260915_211220.png`

### 🛒 交換所クイックアクセス

- アイテム一覧の各アイテムに **「交換所へ」ボタン**を自動追加
- ボタンを押すだけで該当アイテムの交換所ページに直接移動

---

## 対応ブラウザ

| ブラウザ | 対応 |
|---------|------|
| Google Chrome | ✅ |
| Microsoft Edge | ✅ |

---

## インストール方法

### 方法 1: リリースからインストール（推奨）

1. [Releases](../../releases) ページから最新の `.zip` ファイルをダウンロードする
2. 解凍する
3. Chrome で `chrome://extensions/` を開く
4. 右上の **「デベロッパーモード」** を有効にする
5. **「パッケージ化されていない拡張機能を読み込む」** をクリック
6. 解凍したフォルダを選択する

---

## 開発

### 必要環境

- Node.js 18 以上
- npm

### セットアップ

```bash
npm install
```

### ウォッチモード（開発時）

```bash
npm run dev
```

ファイル変更を検知して自動的にビルドします。

### プロダクションビルド

```bash
npm run build
```

`dist/` フォルダに成果物が生成されます。

### 技術スタック

| 用途 | ライブラリ |
|------|-----------|
| ビルドツール | [Vite](https://vite.dev/) |
| Chrome 拡張ビルドプラグイン | [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin) |
| DOM キャプチャ | [html2canvas](https://html2canvas.hertzen.com/) |
| スクリーンショット | [modern-screenshot](https://github.com/qq15725/modern-screenshot) |

---

## ファイル構成

```
PuretomoExtentions/
├── manifest.json       # Chrome 拡張マニフェスト (Manifest v3)
├── vite.config.mjs     # Vite ビルド設定
├── package.json
├── src/
│   ├── content.js      # コンテンツスクリプト（機能本体）
│   ├── background.js   # サービスワーカー
│   └── style.css       # スタイル
├── icons/              # 拡張機能アイコン
└── dist/               # ビルド成果物（自動生成）
```

---

## 対象サイト

- `https://puretomo.hange.jp/*`
- `https://puretomo-image.hange.jp/*`

---

## ライセンス

[MIT License](LICENSE)

---

## 注意事項

> [!NOTE]
> 本拡張機能はハンゲ・ジャパン株式会社の公式サービスではありません。  
> サービスのアップデートにより動作しなくなる場合があります。
