//------------   テンプレート   -------------//

//* 入力/修正 *//
app.post('/ポスト名', (req, res) => {
  var code = {}
  connection.query('SELECT * FROM テーブル名 WHERE ?',code,function(err,result){
    if(err) {
      throw err;
    } else if(result == ""){ 
      //* 既存コードがなかった場合の処理 *//
      var employee = {}
      connection.query('INSERT INTO テーブル名 SET ?',employee,function(err2){
        if(err2){
          throw err2;
        }
      })
     } else {
      //* 既存コードが見つかった場合の処理 *//
      connection.query('UPDATE テーブル名 SET ? WHERE code = "' + req.body.コード項目 + '"', employee, function(err1){
        if(err1){
          throw err1;
        }
      })
    }
    res.render('PUGファイル',{title: 'タイトル',});
  })
});
//*　削除　*//
app.post('/ポスト名', (req, res) => {
  var employee = {コード名:req.body.コード項目}
  connection.query('DELETE FROM テーブル名 WHERE ?',employee,function(err){
      if(err){
        throw err;
      }
  })
  res.render('PUGファイル',{title: ''});
});
//* 一覧 *//
app.get('/ゲット名', (req, res) => {
  //* 表示するテーブルの取得 *//
  connection.query('SELECT * FROM テーブル名',function(err,result){
    if(err){
      throw err;
    } else {
      res.render('PUGファイル',{title: '一覧',midasi1:'',midasi2:'',midasi3:'',midasi4:'',midasi5:'',list: result});
    }
  })
});
//* 一覧内名前検索 *//
app.post('/ポスト名', (req, res) => {
  connection.query("SELECT * FROM テーブル名 WHERE カラム名 LIKE '%" + req.body.名前項目 +"%'",function(err,result){
    if(err){
       throw err;
    } else {
      res.render('PUGファイル',{title: '一覧',midasi1:'',midasi2:'',midasi3:'',midasi4:'',midasi5:'',list: result});
    }
  })
});
//* 一覧内コード検索 *//
app.post('/ポスト名', (req, res) => {
  connection.query("SELECT * FROM テーブル名 WHERE コード = " + req.body.コード項目,function(err,result){
    if(err){
      throw err;
    } else {
      res.render('PUGファイル',{title: '一覧',midasi1:'',midasi2:'',midasi3:'',midasi4:'',midasi5:'',list: result});
    }
  })
});
//* フォーム内コード検索 *//
app.post('/ポスト名',(req, res) => {
  var employee = {コード名:req.body.コード項目}
  connection.query('SELECT * FROM テーブル名 WHERE ?', employee, function(err, result){
    if(err){
      throw err;
    } else if(result != ""){
      //* 一致コードがなかった場合の処理 *//
      res.render('PUGファイル',{title: '',list: result2})
    } else {
      //* 一致コードがあった場合の処理 *//
      res.render('PUGファイル',{title: '',list: result2})
    }
  })
});