$(function() {
    // 初期化処理
    console.log("Form initialized");
    
    // テーブル要素が存在する場合の処理
    var sel_table = $("table.table-first-test");
    if (sel_table.length > 0) {
        sel_table.find("tbody tr select").each(function() {
            $(this).on("change", function() {
                renewFirstTestItem($(this));
            });
            renewFirstTestItem($(this));
        });
    }

    var sel_table2 = $("table.table-second-test");
    if (sel_table2.length > 0) {
        sel_table2.find("tbody tr select").each(function() {
            $(this).on("change", function() {
                renewSecondTestItem($(this));
                renewSecondTestListDisplay();
            });
            renewSecondTestItem($(this));
            renewSecondTestListDisplay();
        });
    }

    // フォームの初期化処理
    initializeForm();
});

function initializeForm() {
    // フォームバリデーションの初期化
    console.log("Form validation initialized");
    
    // 各種イベントリスナーの設定
    setupEventListeners();
}

function setupEventListeners() {
    // 必須フィールドのチェック
    $('input[required], select[required]').on('blur', function() {
        validateField($(this));
    });
}

function validateField(field) {
    var value = field.val();
    var fieldName = field.attr('name');
    
    if (!value || value === '') {
        field.addClass('error');
        return false;
    } else {
        field.removeClass('error');
        return true;
    }
}

function getApplyControllerUrl() {
    var ret = controller_url || 'apply';
    return ret;
}

function goEntrySheet(){
    var cu = getApplyControllerUrl();
    submitTo(cu + '/entry_sheet');
}

function goEntryMail(){
    var cu = getApplyControllerUrl();
    submitTo(cu + '/entry_mail');
}

function entryMailSend(){
    var cu = getApplyControllerUrl();
    submitWithStatus('set', cu + '/entry_mail');
}

function confirmEntrySheet(){
    // ローカル環境では確認画面の代わりにバリデーションを実行
    console.log("Form validation started");
    
    var isValid = true;
    var errorMessages = [];
    
    // 必須フィールドのチェック
    $('input[required], select[required]').each(function() {
        if (!validateField($(this))) {
            isValid = false;
            var fieldLabel = $(this).closest('.Form-Item').find('.Form-Item-Label').text();
            errorMessages.push(fieldLabel + 'は必須項目です。');
        }
    });
    
    if (!isValid) {
        alert('以下の項目を確認してください：\n' + errorMessages.join('\n'));
        return false;
    }
    
    // ローカル環境では送信の代わりに確認メッセージを表示
    alert('フォームの入力内容が確認されました。\n実際のWebサイトでは、ここで送信処理が行われます。');
    console.log("Form data:", getFormData());
}

function getFormData() {
    var formData = {};
    $('#MainForm').serializeArray().forEach(function(item) {
        formData[item.name] = item.value;
    });
    return formData;
}

function entry(){
    var cu = getApplyControllerUrl();
    submitTo(cu + '/entry');
}

function renewFirstTestItem(_sel_select) {
    var sel_tr = _sel_select.closest("tr");	
    var sel_score = sel_tr.find("input");
    if (_sel_select.val() && _sel_select.val() != "受験なし") {
        sel_score.show();
    } else {
        sel_score.hide();
    }
}

function renewSecondTestListDisplay() {
    var sel_table = $("table.table-second-test");
    if (sel_table.length === 0) return;
    
    var i=0;
    sel_table.find("tbody tr").each(function() {
        var sel_tr = $(this);
        i++;
        if (i < 10) {
            return;
        }

        var sel_subject_main = sel_tr.find("td:nth-of-type(1) select");
        var sel_next = sel_tr.next();
        
        if (sel_subject_main.val()) {
            sel_next.show();
        } else {
            var is_next_value_inputted = false;
            sel_next.find("select,input[type=text]").each(function() {
                if ($(this).val()) {
                    is_next_value_inputted = true;
                }
            });
            if (is_next_value_inputted) {
                sel_next.show();
            } else {
                sel_next.hide();
            }
        }
    });
}

function renewSecondTestItem(_sel_select) {
    var sel_tr = _sel_select.closest("tr");	
    var sel_subject_main = sel_tr.find("td:nth-of-type(1) select");
    var sel_subject_sub = sel_tr.find("td:nth-of-type(2) select");
    var sel_score = sel_tr.find("input");
    
    var subject_main = sel_subject_main.val();
    var subject_sub = sel_subject_sub.val();
    var is_subject_sub_included = false;
    
    if (subject_main && subject_main != "受験なし") {
        sel_subject_sub.show();
        
        sel_subject_sub.find("option").each(function() {
            var option_value = $(this).val();
            var regex = new RegExp("^" + subject_main, 'gi');
            if (option_value.match(regex)) {
                $(this).show();
                if (option_value == subject_sub) {
                    is_subject_sub_included = true;
                }
            } else {
                $(this).hide();
            }
        });

        if (!is_subject_sub_included) {
            sel_subject_sub.val("");
        }

    } else {
        sel_subject_sub.hide();
    }

    if (sel_subject_sub.is(':visible')) {
        sel_score.show();
    } else {
        sel_score.hide();
    }
}

function renewSchoolStatusFormAll(){
    for(var i=0; i<3; i++){
        renewSchoolStatusForm(i);
    }
}

function renewSchoolStatusForm(_index){
    var stage_school_array = N('stage_school_' + _index);
    if (!stage_school_array || stage_school_array.length === 0) return;
    
    var stage_school;
    for(var i=0; i<3; i++){
        if(stage_school_array[i] && stage_school_array[i].checked){
            stage_school = i;	
        }
    }

    var grade_school_display = 'none';
    var date_graduation_display = 'none';
    var date_dropping_out_display = 'none';
    
    switch(stage_school){
        case 0:
            grade_school_display = '';
            date_graduation_display = '';
            break;
        case 1:
            date_graduation_display = '';
            break;
        case 2:
            date_dropping_out_display = '';
            break;
    }

    var gradeElement = E('block_grade_school_'+_index);
    var graduationElement = E('block_date_graduation_'+_index);
    var droppingElement = E('block_date_dropping_out_'+_index);
    
    if (gradeElement) gradeElement.style.display = grade_school_display;
    if (graduationElement) graduationElement.style.display = date_graduation_display;
    if (droppingElement) droppingElement.style.display = date_dropping_out_display;
}

function E(_id){
    return document.getElementById(_id);
}

function N(_name){
    return document.getElementsByName(_name);
}

function checkBlank(value, str){
    if(value==""){
        alert(str + "を入力してください。");
        return false;
    }
    return true;
}

function submitTo(_action){
    // ローカル環境では実際の送信は行わない
    console.log("Form would be submitted to:", _action);
    console.log("Form data:", getFormData());
    alert("ローカル環境のため、実際の送信は行われません。\n送信先: " + _action);
}

function submitWithStatus(_status, _action) {
    // ローカル環境では実際の送信は行わない
    document.getElementById('status').value = _status;
    console.log("Form would be submitted with status:", _status, "to:", _action);
    console.log("Form data:", getFormData());
    alert("ローカル環境のため、実際の送信は行われません。\n送信先: " + _action + "\nステータス: " + _status);
}

function $id(_name) {
    return document.getElementById(_name);
}
    