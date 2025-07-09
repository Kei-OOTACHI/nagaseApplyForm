# oop.html エンジニア向けマニュアル

## 概要

`oop.html`は株式会社ナガセの応募者情報提出シート作成用フォームです。オブジェクト指向設計によるバリデーションシステムと学歴による動的表示制御機能を備えたWebアプリケーションです。

## アーキテクチャ設計の特徴

### 単一ファイル構成の設計思想
- **HTML、CSS、JavaScriptを1つのファイルに統合**
- **配布方式**: サーバー運用コストを削減するため、HTMLファイル直接配布方式を採用
- **運用形態**: 記入者が直接HTMLファイルを開いてCSV生成する形式
- **外部依存関係は最小限**（jQueryのCDNのみ）
- **軽量化重視**: 不要なCDNライブラリを削除してパフォーマンス最適化

### オブジェクト指向バリデーションシステムの設計思想
- **可読性向上**: 関数型よりもクラスベースの方が理解しやすいと判断
- **継承活用**: `Validator`基底クラスからの継承により共通処理を整理
- **拡張性**: 新しいバリデーションルールの追加が容易
- **保守性**: クラス単位での責務分離により変更影響範囲を限定

### IME対応入力処理の設計思想
- **UX品質重視**: IME変換途中での自動変換を防止
- **問題解決**: 「あいうえお」→「ｱｱｲｲｳｳｳｴｵｴｵ」のような重複入力問題を回避
- **日本語入力最適化**: `compositionstart`/`compositionend`イベントによる変換完了待ち

## 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: レスポンシブデザイン、Flexboxレイアウト
- **JavaScript ES6+**: クラス構文、モジュール設計
- **jQuery 3.6.0**: DOM操作、イベント処理
- **外部API**: 郵便番号検索API（zipcloud.ibsnet.co.jp）

## 機能一覧

### 1. バリデーション機能

#### 1.1 基本バリデーター

| バリデーター | 対象フィールド | 機能 |
|-------------|---------------|------|
| `RequiredValidator` | 必須項目全般 | 空欄チェック |
| `RegexValidator` | 形式指定項目 | 正規表現による形式チェック |

#### 1.2 専用バリデーター

| バリデーター | 対象フィールド | 詳細 |
|-------------|---------------|------|
| `CheckboxRequiredValidator` | 東進在籍歴 | チェックボックス群のいずれか必須 |
| `RadioRequiredValidator` | 性別、最終学歴、口座種別 | ラジオボタン必須選択 |
| `PhoneEitherRequiredValidator` | 電話番号 | 自宅または携帯のいずれか必須 |
| `AccountHolderMatchValidator` | 口座名義人 | 氏名（漢字）との一致確認 |
| `AccountHolderKanaMatchValidator` | 口座名義人フリガナ | 氏名（カナ）との一致確認 |

#### 1.3 フィールド別バリデーション詳細

| フィールド | バリデーション内容 | 変換処理 |
|-----------|-------------------|----------|
| 氏名（漢字） | 必須チェック | なし |
| 氏名（カナ） | 必須 + 半角カタカナ形式 | ひらがな→半角カタカナ変換 |
| 郵便番号 | 必須 + 7桁数字形式 | 全角→半角数字変換 |
| 住所 | 必須チェック | 半角→全角数字変換 |
| 住所建物名フリガナ | 必須 + 半角カタカナ形式 | ひらがな→半角カタカナ変換 |
| 電話番号（自宅） | いずれか必須 + 固定電話形式 | 全角→半角数字変換 |
| 電話番号（携帯） | いずれか必須 + 携帯電話形式 | 全角→半角数字変換 |
| メールアドレス | 必須 + メール形式 | なし |
| 銀行コード | 必須 + 4桁数字 | 全角→半角数字変換 |
| 支店コード | 必須 + 3桁数字 | 全角→半角数字変換 |
| 口座番号 | 必須 + 1-8桁数字 | 全角→半角数字変換 |
| 口座名義人 | 必須 + 氏名一致確認 | なし |
| 口座名義人フリガナ | 必須 + 氏名カナ一致確認 | ひらがな→半角カタカナ変換 |

### 2. 住所検索機能
- **郵便番号API連携**: zipcloud.ibsnet.co.jpを使用
- **自動住所入力**: 7桁郵便番号から住所を自動取得
- **エラーハンドリング**: API失敗時の適切なメッセージ表示

### 3. 学歴による動的表示制御

| 学歴選択 | 大学情報セクション | 出身高校フィールド | 自動入力値 |
|---------|-------------------|-------------------|------------|
| 大学・大学院 | 表示（入力必須） | 表示（入力必須） | なし |
| 短大・専門学校 | 非表示 | 表示（入力必須） | 大学関連：「なし」、入学日：「0001-01-01」 |
| 高校 | 非表示 | 表示（入力必須） | 大学関連：「なし」、入学日：「0001-01-01」 |
| 中学校 | 非表示 | 非表示 | 大学関連・出身高校：「なし」 |

### 4. 確認画面・CSV出力機能
- **入力内容確認**: 学歴に応じた項目表示
- **CSVダウンロード**: BOM付きUTF-8形式
- **ファイル名自動生成**: `{合否判定日}合判_{氏名}_応募者情報提出シート.csv`

## コード構造

### クラス階層

```
Validator (基底クラス)
├── RequiredValidator
├── RegexValidator
├── CheckboxRequiredValidator
├── RadioRequiredValidator
├── PhoneEitherRequiredValidator
├── AccountHolderMatchValidator
└── AccountHolderKanaMatchValidator

FormField (基本フィールド)
├── PostalCodeField (郵便番号専用)
├── RadioField (ラジオボタン群)
└── CheckboxField (チェックボックス群)

FormManager (フォーム全体管理)
└── ValidationResult (バリデーション結果)
```

### 関数コールグラフ

#### 初期化フロー
```
DOMContentLoaded
└── FormManager初期化
    ├── フィールド作成・設定
    │   ├── FormField.constructor
    │   │   └── setupEventListeners
    │   ├── PostalCodeField.constructor
    │   │   └── setupPostalCodeFeatures
    │   ├── RadioField.constructor
    │   └── CheckboxField.constructor
    ├── イベントリスナー設定
    └── updateFormVisibility (初期表示制御)
```

#### バリデーションフロー
```
confirmButtonClick
└── FormManager.validateAll
    ├── FormField.validate
    │   └── Validator.validate
    ├── RadioField.validate
    └── CheckboxField.validate
    └── showValidationErrors / hideValidationErrors
```

#### 表示制御フロー
```
educationLevelChange
└── updateFormVisibility
    ├── fillUniversityFields
    ├── clearUniversityFields
    ├── fillHighSchoolField
    └── clearHighSchoolField
```

#### 住所検索フロー
```
searchAddressButton / EnterKey
└── PostalCodeField.searchAddress
    ├── フォーマットチェック
    ├── fetch (郵便番号API)
    └── 住所フィールド更新
```

#### CSV出力フロー
```
csvButtonClick
└── downloadCSV
    ├── collectFormData
    ├── generateConfirmationHTML
    ├── CSVコンテンツ生成
    ├── Blobダウンロード
    └── showDownloadNotification
```

#### リアルタイムバリデーションフロー
```
input/compositionend イベント
├── isComposing フラグ制御
├── applyTransformers (入力変換)
└── validateRealtime
    ├── Validator.validate
    └── showError / hideError
```

## 設計上の特徴

### 1. IME対応の入力処理
- `compositionstart`/`compositionend`イベントでIME変換状態を管理
- 変換確定後にバリデーションと変換処理を実行
- 日本語入力特有の問題に対応

### 2. 入力変換システム
- **toHalfWidthKana**: ひらがな・全角カタカナ → 半角カタカナ
- **toHalfWidthNumber**: 全角数字・ハイフン → 半角
- **toFullWidth**: 半角数字 → 全角（住所用）

### 3. エラーハンドリング
- フィールドレベルのリアルタイムエラー表示
- フォームレベルの集約エラー表示
- API通信エラーの適切な処理

## 保守・拡張のポイント

### 1. バリデーター追加方法
```javascript
// 新しいバリデーター作成
class CustomValidator extends Validator {
    constructor() {
        super("カスタムエラーメッセージ");
    }
    
    validate(value) {
        // バリデーションロジック
        return value.includes("条件") 
            ? ValidationResult.success() 
            : ValidationResult.error(this.errorMessage);
    }
}

// フィールドに適用
formManager.addField(
    new FormField("fieldId", "ラベル")
        .addValidator(new CustomValidator())
);
```

### 2. 新しいフィールドタイプ追加
```javascript
class NewFieldType extends FormField {
    constructor(elementId, label) {
        super(elementId, label);
        this.setupCustomFeatures();
    }
    
    setupCustomFeatures() {
        // カスタム機能の実装
    }
}
```

### 3. 設定値の変更箇所
- **バリデーションパターン**: `VALIDATION_PATTERNS`定数
- **フォームバージョン**: `FORM_VERSION`定数
- **API URL**: `PostalCodeField.searchAddress`メソッド内

## パフォーマンス考慮事項

### 1. リアルタイムバリデーション
- `compositionend`イベントによるIME変換完了待ち
- `setTimeout`による描画更新の最適化

### 2. メモリ管理
- `URL.createObjectURL`の適切な解放
- イベントリスナーの重複登録防止

### 3. ネットワーク最適化
- 郵便番号APIの結果キャッシュなし（仕様上リアルタイム検索重視）
- CDN利用によるライブラリ読み込み最適化

## セキュリティ考慮事項

### 1. XSS対策
- `textContent`使用によるHTMLエスケープ
- CSV生成時のダブルクォートエスケープ

### 2. データ検証
- クライアントサイドバリデーションのみ（サーバーサイド検証は別途必要）
- 外部API依存の最小化

## ブラウザ互換性

### 対応ブラウザ
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 制限事項
- JavaScript必須（無効時は動作不可）
- ダウンロード機能はモダンブラウザのみ対応
- 郵便番号検索はネットワーク接続必須 

## CDN使用状況と最適化検討

### 現在のCDN使用状況
- **jQuery 3.6.0**: DOM操作、イベント処理に使用
- **削除済みCDN**: 初期リファクタリングで不要なライブラリを除去

### 追加可能なCDN検討
現在のコード実装では、以下の理由により追加CDNは**不要**と判断されます：

| ライブラリ種別 | 検討結果 | 理由 |
|---------------|----------|------|
| HTTPライブラリ（axios等） | ❌ 不要 | fetch APIで郵便番号検索を実装済み |
| バリデーションライブラリ | ❌ 不要 | 自前のオブジェクト指向バリデーションシステム |
| CSS Framework（Bootstrap等） | ❌ 不要 | カスタムCSSで十分な機能とデザインを実現 |
| 日付ライブラリ（moment.js等） | ❌ 不要 | 基本的な日付操作のみ、ネイティブAPIで対応 |
| Polyfillライブラリ | △ 条件付き | 対象ブラウザが古い場合のみ検討 |

### jQuery削除の可能性
現在のjQuery使用箇所は限定的で、vanilla JavaScriptで代替可能：

```javascript
// 現在のjQuery使用例
$(document).ready(function() { ... });

// vanilla JS代替案
document.addEventListener('DOMContentLoaded', function() { ... });
```

**削除のメリット**:
- さらなる軽量化（~30KB削減）
- 外部依存完全排除
- より高速な動作

**削除のデメリット**:
- 開発効率の若干の低下
- ブラウザ互換性の個別対応が必要 