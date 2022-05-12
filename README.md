# gas-ifttt-twitter-bot
GAS + IFTTT でつくる無料のTwitter 収益化Botのサンプル  
claspを使って管理する

# 環境設定  
```
npm i
 ```  

## Google アカウントの認証
```
clasp login --no-localhost
```  
ターミナルに認証画面へのリンクが表示される  
認証コードを取得して張り付ける

## Google Apps Script APIの有効化  
https://script.google.com/home/usersettings で Google Apps Script API のチェックをオンにする

## scriptの作成
```
clasp create  
> standalone

```

## デプロイ
```
clasp push
```
