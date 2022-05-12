// アフィリエイトID
const AF_ID = "dummy_id";

// 出力先スプレッドシートのID
const SHEET_ID = "dummy_id";

// メイン実行結果出力先のシート名
const SHEET_NAIN = 'main';

// ツイートする内容を一時的に記載しておくシート名
const SHEET_TWEET = 'tweet';

// 取得元ページのURL
const PAGE_URL = "https://www.dlsite.com/home/fsr/=/language/jp/ana_flg/off/age_category%5B0%5D/general/genre_and_or/or/genre%5B0%5D/158/genre_name%5B0%5D/%E7%99%BE%E5%90%88/options_and_or/or/per_page/30/show_type/1/without_order/1/page/1/order/release_d";


// 前回の実行結果を読み込む
function readSpreadSheet() {
  var sht = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAIN);
  var result = [];
  // シートの最大行数
  var lastRow = sht.getLastRow();
  for(var i=0;i<lastRow;i++){
    var rangeUrl = sht.getRange(i+1,1);
    var affUrl = rangeUrl.getValue();
    var rangeTitle = sht.getRange(i+1,2);
    var workTitle = rangeTitle.getValue();    
    result[i] = affUrl + ',' + workTitle;
  }
  return result;
}


// ページから商品情報を取得してシートに書き込む
function scraping() {
  // 結果保持用の配列
  var result = [];
  
  //ページ取得
  var response = UrlFetchApp.fetch(PAGE_URL);
  
  // スクレイピングする箇所を指定
  var fromText = '<dt class="work_name">';
  var toText = '</dt>';

  // 上記条件に合致する箇所を取得し配列として保持
  var itemList = Parser
  .data(response.getContentText())
  .from(fromText)
  .to(toText)
  .iterate();
  
  var regUrl = 'https.*html'
  var regIcon = /<div class=\"icon_wrap\">.*?<\/div>/;
  var regWork = /<.*?>/g;

  var sht = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAIN)
  for(var i=0;i<itemList.length;i++){
    // URLにマッチする部分だけ抜粋    
    var workUrl = itemList[i].match(regUrl);
    var workId = workUrl[0].replace(/^.*\//, '');
    
    // アフィリエイトURLの組立
    var affUrl = "https://www.dlsite.com/maniax/dlaf/=/t/s/link/work/aid/" + AF_ID + "/id/" + workId

    // 改行をすべて削除
    var workTitle = itemList[i].replace(/\n/g, '')
    
    // アイコン（DLsite専売/無料/割引などの文字列が並ぶ）を削除
    workTitle= workTitle.replace(regIcon, '')

    // タグをすべて削除
    workTitle = workTitle.replace(regWork, '')
    
    result[i] = affUrl + ',' + workTitle;
      
    // 結果を書き込み（上書き）
    sht.getRange(i+1,1).setValue(affUrl);
    sht.getRange(i+1,2).setValue(workTitle);
    

  }
  return result;

}


// 集合演算を使って前回結果と今回結果の差分を取り、リストにして返す
function makeDiff(resultOld, resultNew) {

  setOld = new Set(resultOld);
  setNew = new Set(resultNew);
  
  var _diff = new Set(setNew);
  for (var elem of setOld) {
    _diff.delete(elem)
  }
  return Array.from(_diff);
}


// ツイートする内容を別のシートにストックしておく
function stockTweet(url, title) {
  var sht = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_TWEET);
  var lastRow = sht.getLastRow();
  // 結果を書き込み（追記）
  sht.getRange(lastRow+1,1).setValue(url);
  sht.getRange(lastRow+1,2).setValue(title);  
}


// 上記手続きをすべて行うメイン関数（これを定時実行する）
function main(){
  var resultNew = readSpreadSheet();
  var resultOld = scraping();
  var diff = makeDiff(resultNew, resultOld);
  
  // 差分の数だけツイートする
  for (var elem of diff){
    Logger.log(elem);
    var elem = elem.split(','); 
    var url = elem[0];
    var title = elem[1];
    stockTweet(url, title);
    
  }
}