// Webhookのkey
const WEBHOOK_KEY = "dummy_key";

// IFTTTで指定したevent name
const EVENT = 'item_added'


function post() {
  // シートを読み込む
  var sht = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_TWEET);

  // 最上段の列の値を取得する
  var rangeUrl = sht.getRange(1,1);
  var url = rangeUrl.getValue();
  var rangeTitle = sht.getRange(1,2);
  var title = rangeTitle.getValue();      
  
  // webhook
  var endpoint = `https://maker.ifttt.com/trigger/${EVENT}/with/key/${WEBHOOK_KEY}`;
  var payload = {
    value1: title,
    value2: url,
  };
  var options = {
    "method" : "post",
    "payload" : payload
  };
  
  // ツイートする
  if(title && url){
    UrlFetchApp.fetch(endpoint, options);
  }
  
  // スプレッドシートの最上段の値を削除して上に詰める
  sht.deleteRow(1);
}