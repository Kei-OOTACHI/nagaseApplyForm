// ===== デバッグ用フォーム自動入力スクリプト =====
// ブラウザの開発者ツールのコンソールに貼り付けて実行してください

(function() {
  'use strict';

  // デバッグ用テストデータ（デフォルト）
  const debugData = {
    // 基本情報
    name_1: "東進",
    name_2: "太郎",
    name_1_kana: "ﾄｳｼﾝ",
    name_2_kana: "ﾀﾛｳ",
    id_sex: "1", // 1: 男性, 2: 女性
    birthday: "1995-04-15",
    
    // 住所情報
    address_num: "1130033",
    address_str: "東京都文京区本郷",
    address_str_building: "ナガセ本郷ビル７階",
    address_str_kana: "ﾄｳｷｮｳﾄﾁﾖﾀﾞｸﾎﾝｺﾞｳ",
    
    // 連絡先
    tel_home: "03-1234-5678",
    tel_mobile: "090-1234-5678",
    email_address: "toshin.taro@example.com",
    
    // 最終学歴（ラジオボタン）
    education_level: "1", // 1: 大学, 2: 短大・専門, 3: 高校, 4: 中学
    
    // 大学情報
    daigaku: "なし",
    gakubu: "なし",
    gakka: "なし",
    daigaku_nyugaku_bi: "0001/01/01",
    daigakuin: "東京大学大学院",
    kenkyuka: "理学系研究科",
    senkou: "数学専攻",
    
    // 東進在籍歴（複数選択）
    daigaku_juken_toshin_zaisekireki_1: true,  // 東進ハイスクール
    daigaku_juken_toshin_zaisekireki_2: false, // 東進衛星予備校
    daigaku_juken_toshin_zaisekireki_3: false, // 東大特進
    daigaku_juken_toshin_zaisekireki_9: true, // 在籍なし
    
    // 出身高校
    koukou_name: "東京都立〇〇高校",
    
    // 給与受取口座
    bank_code: "0001",
    bank_name: "みずほ銀行",
    branch_code: "001",
    branch_name: "東京支店",
    account_type: "1", // 1: 普通預金, 2: 当座預金
    account_number: "1234567",
    account_holder: "東進太郎",
    account_holder_kana: "ﾄｳｼﾝﾀﾛｳ",
    
    // 合否判定日
    gohi_hantei_bi: "2025-07-20"
  };

  // CSVデータを格納する変数
  let csvTestCases = [];

  /**
   * CSVファイルを読み込む関数
   */
  function loadCsvFile() {
    return new Promise((resolve, reject) => {
      console.log("📁 CSVファイルを選択してください...");
      
      // ファイル選択用のinput要素を作成
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.csv';
      fileInput.style.display = 'none';
      
      fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) {
          reject(new Error('ファイルが選択されませんでした'));
          return;
        }
        
        console.log(`📄 ファイル "${file.name}" を読み込み中...`);
        
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const csvText = e.target.result;
            const parsedData = parseCsv(csvText);
            csvTestCases = parsedData;
            console.log(`✅ CSVファイルの読み込み完了: ${parsedData.length} 件のテストケース`);
            resolve(parsedData);
          } catch (error) {
            console.error('❌ CSVファイルの解析に失敗:', error);
            reject(error);
          }
        };
        
        reader.onerror = function() {
          reject(new Error('ファイルの読み込みに失敗しました'));
        };
        
        reader.readAsText(file, 'UTF-8');
      };
      
      // ファイル選択ダイアログを開く
      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    });
  }

  /**
   * CSVテキストをパースしてオブジェクト配列に変換する関数
   */
  function parseCsv(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const testCases = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',');
        const testCase = {};
        
        for (let j = 0; j < headers.length; j++) {
          testCase[headers[j]] = values[j] || '';
        }
        
        testCases.push(testCase);
      }
    }
    
    return testCases;
  }

  /**
   * CSVデータをフォーム用データに変換する関数
   */
  function convertCsvToFormData(csvRow) {
    // 性別の変換
    const sexMap = { "男性": "1", "女性": "2" };
    
    // 東進在籍歴のマッピング
    const toshiMap = {
      "東進ハイスクール": "daigaku_juken_toshin_zaisekireki_1",
      "東進衛星予備校": "daigaku_juken_toshin_zaisekireki_2", 
      "東大特進": "daigaku_juken_toshin_zaisekireki_3",
      "在籍なし": "daigaku_juken_toshin_zaisekireki_9"
    };
    
    return {
      // 基本情報
      name_1: csvRow["姓"] || "",
      name_2: csvRow["名"] || "",
      name_1_kana: csvRow["姓フリガナ"] || "",
      name_2_kana: csvRow["名フリガナ"] || "",
      id_sex: sexMap[csvRow["性別"]] || "1",
      birthday: csvRow["生年月日"] || "",
      
      // 住所情報
      address_num: csvRow["郵便番号"] || "",
      address_str: csvRow["住所"] || "",
      address_str_building: csvRow["建物名"] || "",
      address_str_kana: csvRow["住所建物名フリガナ"] || "",
      
      // 連絡先
      tel_home: csvRow["電話番号(自宅)"] || "",
      tel_mobile: csvRow["電話番号(携帯)"] || "",
      email_address: csvRow["メールアドレス"] || "",
      
      // 最終学歴（ラジオボタン）
      education_level: csvRow["最終学歴"] || "1",
      
      // 大学情報
      daigaku: csvRow["大学"] || "なし",
      gakubu: csvRow["学部"] || "なし", 
      gakka: csvRow["学科"] || "なし",
      daigaku_nyugaku_bi: csvRow["入学年月日"] || "0001/01/01",
      daigakuin: csvRow["大学院"] || "なし",
      kenkyuka: csvRow["研究科"] || "なし",
      senkou: csvRow["専攻"] || "なし",
      
      // 東進在籍歴
      daigaku_juken_toshin_zaisekireki_1: csvRow["東進ハイスクール"] === "1",
      daigaku_juken_toshin_zaisekireki_2: csvRow["東進衛星予備校"] === "1",
      daigaku_juken_toshin_zaisekireki_3: csvRow["東大特進"] === "1",
      daigaku_juken_toshin_zaisekireki_9: csvRow["在籍なし"] === "1",
      
      // 出身高校
      koukou_name: csvRow["出身高校"] || "",
      
      // 給与受取口座
      bank_code: csvRow["銀行コード"] || "",
      bank_name: csvRow["銀行名"] || "",
      branch_code: csvRow["支店コード"] || "",
      branch_name: csvRow["支店名"] || "",
      account_type: csvRow["口座種別"] || "1",
      account_number: csvRow["口座番号"] || "",
      account_holder: csvRow["口座名義人"] || "",
      account_holder_kana: csvRow["口座名義人フリガナ"] || "",
      
      // 合否判定日
      gohi_hantei_bi: csvRow["合否判定日"] || ""
    };
  }

  /**
   * 利用可能なテストケースID一覧を表示する関数
   */
  function showAvailableTestCases() {
    if (csvTestCases.length === 0) {
      console.log("❌ CSVデータが読み込まれていません");
      return;
    }
    
    console.log("📋 利用可能なテストケースID:");
    csvTestCases.forEach(testCase => {
      console.log(`   ${testCase["テストケースID"]}: ${testCase["テスト項目"]}`);
    });
  }

  /**
   * フォームにデバッグデータを自動入力する関数（改良版）
   */
  function fillFormWithDebugData(testId = null) {
    let dataToUse = debugData; // デフォルトデータ
    
    // テストIDが指定された場合、CSVから該当データを取得
    if (testId && csvTestCases.length > 0) {
      const testCase = csvTestCases.find(tc => tc["テストケースID"] === testId);
      if (testCase) {
        dataToUse = convertCsvToFormData(testCase);
        console.log(`🎯 テストケース "${testId}" のデータを使用します`);
      } else {
        console.error(`❌ テストケースID "${testId}" が見つかりません`);
        showAvailableTestCases();
        return;
      }
    } else if (testId && csvTestCases.length === 0) {
      console.error("❌ CSVデータが読み込まれていません。先にdebugForm.loadCsv()を実行してください");
      return;
    }
    
    console.log("🚀 デバッグデータの自動入力を開始します...");
    
    let filledCount = 0;
    let errorCount = 0;
    
    // 通常の入力フィールドを処理
    for (const [fieldId, value] of Object.entries(dataToUse)) {
      // ラジオボタンの特別処理
      if (fieldId === 'education_level') {
        try {
          const radioButton = document.querySelector(`input[name="education_level"][value="${value}"]`);
          if (radioButton) {
            radioButton.checked = true;
            console.log(`✅ ラジオボタン ${fieldId}: 値 ${value} を選択`);
            filledCount++;
            
            // 変更イベントを発火（バリデーション用）
            radioButton.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            console.warn(`⚠️ ラジオボタン ${fieldId} の値 ${value} が見つかりません`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ ラジオボタン ${fieldId} の選択に失敗:`, error);
          errorCount++;
        }
        continue;
      }
      
      const element = document.getElementById(fieldId);
      
      if (element) {
        try {
          if (element.type === 'checkbox') {
            // チェックボックスの場合
            element.checked = value;
            console.log(`✅ チェックボックス ${fieldId}: ${value ? 'チェック' : '未チェック'}`);
          } else {
            // 通常の入力フィールドの場合
            element.value = value;
            console.log(`✅ 入力フィールド ${fieldId}: ${value}`);
          }
          filledCount++;
          
          // 入力イベントを発火（バリデーション用）
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          
        } catch (error) {
          console.error(`❌ フィールド ${fieldId} の入力に失敗:`, error);
          errorCount++;
        }
      } else {
        console.warn(`⚠️ フィールド ${fieldId} が見つかりません`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 自動入力完了:`);
    console.log(`   ✅ 成功: ${filledCount} フィールド`);
    console.log(`   ❌ エラー: ${errorCount} フィールド`);
    console.log(`\n🎯 次のステップ:`);
    console.log(`   1. 入力内容を確認してください`);
    console.log(`   2. 「入力内容を確認する」ボタンをクリックしてください`);
    console.log(`   3. バリデーションが正常に動作することを確認してください`);
  }

  /**
   * テストケースIDを入力してフォームを入力する関数
   */
  async function fillWithTestCase() {
    if (csvTestCases.length === 0) {
      console.log("📁 CSVファイルを読み込みます...");
      try {
        await loadCsvFile();
      } catch (error) {
        console.error("❌ CSVファイルの読み込みに失敗しました:", error);
        return;
      }
    }
    
    showAvailableTestCases();
    
    const testId = prompt("🔍 使用するテストケースIDを入力してください:");
    if (testId) {
      fillFormWithDebugData(testId);
    } else {
      console.log("❌ テストケースIDが入力されませんでした");
    }
  }

  /**
   * フォームをクリアする関数
   */
  function clearForm() {
    console.log("🧹 フォームをクリアします...");
    
    // 全ての入力フィールドをクリア
    const inputs = document.querySelectorAll('input, select, textarea');
    let clearedCount = 0;
    
    inputs.forEach(input => {
      try {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        } else {
          input.value = '';
        }
        clearedCount++;
        
        // イベントを発火
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
      } catch (error) {
        console.error(`❌ フィールド ${input.id} のクリアに失敗:`, error);
      }
    });
    
    console.log(`✅ フォームクリア完了: ${clearedCount} フィールドをクリアしました`);
  }

  /**
   * 現在のフォームデータをコンソールに出力する関数
   */
  function showCurrentFormData() {
    console.log("📋 現在のフォームデータ:");
    
    const formData = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (input.id) {
        if (input.type === 'checkbox' || input.type === 'radio') {
          formData[input.id] = input.checked;
        } else {
          formData[input.id] = input.value;
        }
      }
    });
    
    console.table(formData);
    return formData;
  }

  /**
   * バリデーションエラーをチェックする関数
   */
  function checkValidationErrors() {
    console.log("🔍 バリデーションエラーをチェックします...");
    
    const errorElements = document.querySelectorAll('.error-message');
    const errorInputs = document.querySelectorAll('.Form-Item-Input.error');
    
    if (errorElements.length > 0 || errorInputs.length > 0) {
      console.warn("⚠️ バリデーションエラーが検出されました:");
      
      errorElements.forEach(error => {
        if (error.style.display !== 'none' && error.textContent.trim()) {
          console.warn(`   - ${error.textContent}`);
        }
      });
      
      errorInputs.forEach(input => {
        console.warn(`   - 入力フィールド ${input.id} にエラーがあります`);
      });
    } else {
      console.log("✅ バリデーションエラーは検出されませんでした");
    }
  }

  /**
   * デバッグ情報を表示する関数
   */
  function showDebugInfo() {
    console.log("🔧 デバッグ情報:");
    console.log(`   フォームID: ${document.getElementById('MainForm') ? 'MainForm' : '見つかりません'}`);
    console.log(`   確認画面要素: ${document.getElementById('confirmationScreen') ? '存在' : '見つかりません'}`);
    console.log(`   確認ボタン: ${document.getElementById('confirm-button') ? '存在' : '見つかりません'}`);
    console.log(`   戻るボタン: ${document.getElementById('back-button') ? '存在' : '見つかりません'}`);
    console.log(`   CSVボタン: ${document.getElementById('csv-button') ? '存在' : '見つかりません'}`);
    
    // 必須フィールドの数をカウント
    const requiredFields = document.querySelectorAll('[required]');
    console.log(`   必須フィールド数: ${requiredFields.length}`);
    
    // エラーメッセージ要素の数をカウント
    const errorElements = document.querySelectorAll('.error-message');
    console.log(`   エラーメッセージ要素数: ${errorElements.length}`);
    
    // CSVデータの状況
    console.log(`   読み込み済みCSVテストケース数: ${csvTestCases.length}`);
  }

  // グローバル関数として公開
  window.debugForm = {
    fill: fillFormWithDebugData,
    fillFromCsv: fillWithTestCase,
    loadCsv: loadCsvFile,
    showTestCases: showAvailableTestCases,
    clear: clearForm,
    showData: showCurrentFormData,
    checkErrors: checkValidationErrors,
    info: showDebugInfo,
    data: debugData,
    csvData: () => csvTestCases
  };

  // 自動実行のオプション
  console.log("🎯 デバッグスクリプトが読み込まれました！");
  console.log("\n📝 使用可能なコマンド:");
  console.log("   debugForm.fill()         - デフォルトデータでフォームを自動入力");
  console.log("   debugForm.fillFromCsv()  - CSVからテストケースを選択して自動入力");
  console.log("   debugForm.loadCsv()      - CSVファイルを読み込み");
  console.log("   debugForm.showTestCases() - 利用可能なテストケースID一覧を表示");
  console.log("   debugForm.clear()        - フォームをクリア");
  console.log("   debugForm.showData()     - 現在のフォームデータを表示");
  console.log("   debugForm.checkErrors()  - バリデーションエラーをチェック");
  console.log("   debugForm.info()         - デバッグ情報を表示");
  console.log("   debugForm.data           - デフォルトデータオブジェクト");
  console.log("   debugForm.csvData()      - 読み込み済みCSVデータ");
  
  console.log("\n🚀 CSVからテストケースを選択して自動入力するには: debugForm.fillFromCsv() を実行してください");
  console.log("💡 デフォルトデータで自動入力するには: debugForm.fill() を実行してください");

})(); 