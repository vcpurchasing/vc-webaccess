const express = require('express');
const app = express();
const mysql = require('mysql');
var bodyParser = require('body-parser');
const { query } = require('express');
const { resolve } = require('path');
const { timeout } = require('async');
const { table } = require('console');
app.use(bodyParser.urlencoded({ extended: true }));

//* データベース接続 *//
const connection = mysql.createConnection({
  host     : 'vcdb-01.cceqpngzrpyo.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'vcjp5555',
  database : 'vc'
});
connection.connect();
app.set('view engine', 'pug');
app.use(express.static('views'));

app.get('/', function (req, res) {
  res.render('form',{alert: ''});
});
var coded = 0

//* 本日の日付 *//
var hiduke = 'YYYY/MM/DD';
var today = new Date();
hiduke = hiduke.replace(/YYYY/g,today.getFullYear())
hiduke = hiduke.replace(/MM/g,('0' + (today.getMonth()+1)).slice(-2));
hiduke = hiduke.replace(/DD/g,('0' + today.getDate()).slice(-2));

//* 汎用データ変数初期化 *//
var jimus = ""
var shos = ""
var purchaseslips = ""
var workers = ""
var pursums = ""
var sales = ""
var locs = ""
//* ログインフォーム *//
app.post('/login', function(req, res) {
  var employee={id:req.body.email}
  connection.query('SELECT * FROM LOGIN WHERE ?',employee,(err,result) => {
    if(err){
      throw err;
    } else if(result == ""){
      res.render('form',{alert: ''});
    } else {
      if(result[0].password == req.body.password){
        if(err){
          throw err;
        } else {
          //* 汎用データ取り込み *//
          connection.query('SELECT * FROM jimu',function(err,jimustr){
            connection.query('SELECT * FROM PURCHASETABLE',function(err3,purchaseslipstr){
                connection.query('SELECT DISTINCT * FROM WORKER',function(err6,workerstr){
                  connection.query('SELECT * FROM SALES',function(err8,salestr){
                    connection.query('SELECT * FROM PURCHASESUMMARY',function(err9,pursumstr){  
                      connection.query('SELECT * FROM LOCATION',(err7,locstr) => {
                        locs = locstr                          
                        sales = salestr
                        pursums = pursumstr
                        purchaseslips = purchaseslipstr
                        jimus = jimustr
                        workers = workerstr
                      })
                    })
                  })
                })
              })
            })
            res.render('list',{title: 'プログラム一覧',authority: result[0].authority});
          }
      } else {
        res.render('form',{alert: 'メールアドレスまたはパスワードが間違っています'});
      }
    }
  })
});

//* プログラム一覧 *//
app.post('/list', (req,res) => {
  res.render('list',{title: 'プログラム一覧'});
});


//* 得意先表 *//
app.get('/tokuisakitable', (req, res) => {
  connection.query('SELECT * FROM tokuisaki',(err,cuss)=>{
    if(err) throw err
    res.render('tokuisakitable',{title: '得意先一覧',koumoku1:'',midasi1:'得意先コード',midasi2:'得意先名',midasi3:'郵便番号',midasi4:'住所',midasi5:'TEL',list: cuss});
  })
});
//* 得意先名検索 *//
app.post('/tokuisakitable1', (req, res) => {
  connection.query("SELECT * FROM tokuisaki WHERE 得意先コード = '" + req.body.koumoku1 + "'",function(err,result){
    if(err) throw err
    if(result == ''){
      connection.query("SELECT * FROM tokuisaki WHERE 得意先名1 LIKE '%" + req.body.koumoku1 +"%'",function(err1,result1){
        if(err1) throw err1
        res.render('tokuisakitable',{title: '得意先一覧',midasi1:'得意先コード',midasi2:'得意先名',midasi3:'郵便番号',midasi4:'住所',midasi5:'TEL',list: result1});
      })
    } else {
      res.render('tokuisakitable',{title: '得意先一覧',midasi1:'得意先コード',midasi2:'得意先名',midasi3:'郵便番号',midasi4:'住所',midasi5:'TEL',list: result});
    }
  })
});
//* フォーム内得意先検索 *//
app.post('/tokuisakisearch',(req, res) => {
  var meisai = []
  for(var i = 0; i < 8;i++){
    re4 = ['','','']
    meisai.push(re4)
  }
  var employee = {得意先コード:req.body.koumoku3}
  connection.query('SELECT * FROM tokuisaki WHERE ?', employee, function(err, result){
    if(err){
      throw err;
    } else if(result != ""){
      res.render('purchase-3',{title: '出荷伝票',list: jimus,list2: shos,koumoku1:req.body.koumoku1,koumoku2:req.body.koumoku2,koumoku3:req.body.koumoku3,koumoku4:req.body.koumoku4,koumoku5:req.body.koumoku5,koumoku6:result[0].得意先名1,list3:meisai})
    } else {
      res.render('purchase-3',{title: '出荷伝票',list: jimus,list2: shos,koumoku1:req.body.koumoku1,koumoku2:req.body.koumoku2,koumoku3:req.body.koumoku3,koumoku4:req.body.koumoku4,koumoku5:req.body.koumoku5,koumoku6:"",list3:meisai})
    }
  })
});




//-----------　　　管理商品分類　　　-----------//

app.post('/masuta6', (req, res) => {
  var koumoku = ['','','','','','']
  res.render('masuta-6',{title:'管理商品分類',koumoku:koumoku,jun:0})
});
//* 入力・修正 *//
app.post('/productmc1', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('SELECT * FROM PRODUCTCLASS WHERE ?',employee,(err,result) => {
    if(result == ''){
      var employee2 = {productcode:req.body.koumoku[0],customercode:req.body.koumoku[4],division:req.body.koumoku[2],note:req.body.koumoku[3]}
      connection.query('INSERT INTO PRODUCTCLASS SET ?, registertime = NOW()',employee2,(err1) => {
      })
    } else {
      var employee2 = {productcode:req.body.koumoku[0],customercode:req.body.koumoku[4],division:req.body.koumoku[2],note:req.body.koumoku[3]}
      connection.query('UPDATE PRODUCTCLASS SET ?, updatetime = NOW() WHERE productcode = "' + req.body.koumoku[0] + '"',employee2,(err1) => {
      })
    }
    var koumoku = ['','','','','','']
    res.render('masuta-6',{title:'管理商品分類',koumoku:koumoku,jun:0})
    })
})
//* 削除 *//
app.post('/productmc2', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('DELETE FROM PRODUCTCLASS WHERE ?',employee,(err) => {
  })
  var koumoku = ['','','','','','']
  res.render('masuta-6',{title:'管理商品分類',koumoku:koumoku,jun:0})
})
//* 管理商品分類一覧 *//
app.get('/productmctable', (req,res) => {
  connection.query('SELECT * FROM PRODUCTCLASS LEFT OUTER JOIN tokuisaki on tokuisaki.得意先コード = PRODUCTCLASS.customercode LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = PRODUCTCLASS.productcode ORDER BY productcode', (err, result) => {
    if(err) throw err
    res.render('productmctable',{title:'管理商品分類一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'区分',midasi4:'備考',midasi5:'得意先コード',midasi6:'得意先名',list:result})
  })
})
//* 管理商品分類一覧内検索 *//
app.post('/productmctable1', (req,res) => {
  connection.query('SELECT * FROM PRODUCTCLASS LEFT OUTER JOIN tokuisaki on tokuisaki.得意先コード = PRODUCTCLASS.customercode LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = PRODUCTCLASS.productcode WHERE productcode = "' + req.body.koumoku1 + '" ORDER BY productcode', (err, result) => {
    if(err) throw err
    if(result == ''){
      connection.query('SELECT * FROM PRODUCTCLASS LEFT OUTER JOIN tokuisaki on tokuisaki.得意先コード = PRODUCTCLASS.customercode LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = PRODUCTCLASS.productcode WHERE shohinname LIKE "%' + req.body.koumoku1 + '%" ORDER BY productcode', (err1, result1) => {
        if(err1) throw err1
        res.render('productmctable',{title:'管理商品分類一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'区分',midasi4:'備考',midasi5:'得意先コード',midasi6:'得意先名',list:result1})
      })
    } else {
      res.render('productmctable',{title:'管理商品分類一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'区分',midasi4:'備考',midasi5:'得意先コード',midasi6:'得意先名',list:result})
    }
  })
})
//* 管理商品分類内商品名検索 *//
app.post('/masuta6-pro',(req,res) => {
  connection.query('SELECT * FROM SHOHIN WHERE shohincode = "' + req.body.koumoku[0] + '"',(err,pro) => {
    if(pro == ""){
      res.render('masuta-6',{title:'管理商品分類',koumoku:req.body.koumoku,jun:0})
    } else {
      connection.query('SELECT * FROM PRODUCTCLASS LEFT OUTER JOIN tokuisaki on tokuisaki.得意先コード = customercode WHERE productcode = "' + req.body.koumoku[0] + '"',(err,pros) => {
        if(pros == ""){
          var koumoku = req.body.koumoku
          koumoku[1] = pro[0].shohinname
          res.render('masuta-6',{title:'管理商品分類',koumoku:koumoku,jun:2})
        } else {
          var koumoku = req.body.koumoku
          koumoku[0] = pros[0].productcode
          koumoku[1] = pro[0].shohinname
          koumoku[2] = pros[0].division
          koumoku[3] = pros[0].note
          koumoku[4] = pros[0].得意先コード
          koumoku[5] = pros[0].得意先名1
          res.render('masuta-6',{title:'管理商品分類',koumoku:koumoku,jun:2})
        }
      })
    }
  })
})
//* 管理商品分類内得意先検索 *//
app.post('/masuta6-cus',(req,res) => {
  connection.query('SELECT * FROM tokuisaki WHERE　得意先コード = "' + req.body.koumoku[4] + '"',(err,cus) => {
    if(cus == ""){
      res.render('masuta-6',{title:'管理商品分類',koumoku:req.body.koumoku,jun:4})
    } else {
      var koumoku = req.body.koumoku
      koumoku[5] = cus[0].得意先名1
      res.render('masuta-6',{title:'管理商品分類',koumoku:req.body.koumoku,jun:4})
    }
  })
})

//-----------　　　管理商品担当　　　-----------//

app.post('/masuta7', (req, res) => {
  var koumoku = ['','','','','','','','']
  res.render('masuta-7',{title:'管理商品担当',koumoku:koumoku,list:jimus,list2:workers,jun:0})
});

//-----------　　　商品縦横　　　-----------//

app.post('/masuta8', (req, res) => {
  var koumoku = ['','','','','','','']
  res.render('masuta-8',{title:'商品縦横',koumoku:koumoku,jun:0})
});
//* 入力・修正 *//
app.post('/VaH1', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('SELECT * FROM BOXCAPACITY WHERE ?',employee,(err,result) => {
    if(result == ''){
      var employee2 = {productcode:req.body.koumoku[0],side:req.body.koumoku[2],vertical:req.body.koumoku[3],height:req.body.koumoku[4],G_weight:req.body.koumoku[5],N_weight:req.body.koumoku[6]}
      connection.query('INSERT INTO BOXCAPACITY SET ?, additionaltime = NOW()',employee2,(err1) => {
      })
    } else {
      var employee2 = {productcode:req.body.koumoku[0],side:req.body.koumoku[2],vertical:req.body.koumoku[3],height:req.body.koumoku[4],G_weight:req.body.koumoku[5],N_weight:req.body.koumoku[6]}
      connection.query('UPDATE BOXCAPACITY SET ?, updatetime = NOW() WHERE productcode = "' + req.body.koumoku[0] + '"',employee2,(err1) => {
      })
    }
    var koumoku = ['','','','','','','']
    res.render('masuta-8',{title:'商品縦横',koumoku:koumoku,jun:0})
    })
})
//* 削除 *//
app.post('/VaH2', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('DELETE FROM BOXCAPACITY WHERE ?',employee,(err1) => {
    if(err1) throw err1
  })
  var koumoku = ['','','','','','','']
  res.render('masuta-8',{title:'商品縦横',koumoku:koumoku,jun:0})
})
//* 商品縦横一覧 *//
app.get('/VaHtable', (req,res) => {
  connection.query('SELECT * FROM BOXCAPACITY LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = BOXCAPACITY.productcode ORDER BY productcode', (err, result) => {
    if(err) throw err
    res.render('VaHtable',{title:'商品縦横一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'横',midasi4:'縦',midasi5:'高さ',midasi6:'G_weight',midasi7:'N_weight',list:result})
  })
})
//* 商品縦横一覧内検索 *//
app.post('/VaHtable1', (req,res) => {
  connection.query('SELECT * FROM BOXCAPACITY LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = BOXCAPACITY.productcode WHERE productcode = "' + req.body.koumoku1 + '" ORDER BY productcode', (err, result) => {
    if(err) throw err
    if(result == ''){
      connection.query('SELECT * FROM BOXCAPACITY LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = BOXCAPACITY.productcode WHERE shohinname LIKE "%' + req.body.koumoku1 + '%" ORDER BY productcode', (err, result1) => {
        if(err) throw err
        res.render('VaHtable',{title:'商品縦横一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'横',midasi4:'縦',midasi5:'高さ',midasi6:'G_weight',midasi7:'N_weight',list:result1})
      })
    } else {
      res.render('VaHtable',{title:'商品縦横一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'横',midasi4:'縦',midasi5:'高さ',midasi6:'G_weight',midasi7:'N_weight',list:result})
    }
  })
})
//* 商品縦横内商品名検索 *//
app.post('/masuta8-pro',(req,res) => {
  connection.query('SELECT * FROM SHOHIN WHERE shohincode = "' + req.body.koumoku[0] + '"',(err,pro) => {
    if(pro == ""){
      res.render('masuta-8',{title:'商品縦横',koumoku:req.body.koumoku,jun:0})
    } else {
      connection.query('SELECT * FROM BOXCAPACITY WHERE productcode = "' + req.body.koumoku[0] + '"',(err,pros) => {
        if(pros == ""){
          var koumoku = req.body.koumoku
          koumoku[1] = pro[0].shohinname
          res.render('masuta-8',{title:'商品縦横',koumoku:koumoku,jun:0})
        } else {
          var koumoku = req.body.koumoku
          koumoku[0] = pros[0].productcode
          koumoku[1] = pro[0].shohinname
          koumoku[2] = pros[0].side
          koumoku[3] = pros[0].vertical
          koumoku[4] = pros[0].height
          koumoku[5] = pros[0].G_weight
          koumoku[6] = pros[0].N_weight
          res.render('masuta-8',{title:'商品縦横',koumoku:koumoku,jun:0})
        }
      })
    }
  })
})

//-----------　　　商品入り数登録　　　-----------//

app.post('/masuta9', (req, res) => {
  var koumoku = ['','','','','','','','','','']
  res.render('masuta-9',{title:'商品入り数登録',koumoku:koumoku,jun:0})
});
//* 入力・修正 *//
app.post('/quantity1', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('SELECT * FROM QUANTITY WHERE ?',employee,(err,result) => {
    if(result == ''){
      var employee2 = {productcode:req.body.koumoku[0],quantity:req.body.koumoku[2]}
      connection.query('INSERT INTO QUANTITY SET ?, additionaltime = NOW()',employee2,(err1) => {
      })
    } else {
      var employee2 = {productcode:req.body.koumoku[0],quantity:req.body.koumoku[2]}
      connection.query('UPDATE QUANTITY SET ?, updatetime = NOW() WHERE productcode = "' + req.body.koumoku[0] + '"',employee2,(err1) => {
      })
    }
    var koumoku = ['','','','','','','','','','']
    res.render('masuta-9',{title:'商品入り数登録',koumoku:koumoku,jun:0})
      })
})
//* 削除 *//
app.post('/quantity2', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('DELETE FROM QUANTITY WHERE ?',employee,(err1) => {
    if(err1) throw err1
  })
  var koumoku = ['','','','','','','','','','']
  res.render('masuta-9',{title:'商品入り数登録',koumoku:koumoku,jun:0})
})
//* 商品入り数一覧 *//
app.get('/quantitytable', (req,res) => {
  connection.query('SELECT * FROM QUANTITY LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = QUANTITY.productcode ORDER BY productcode', (err, result) => {
    if(err) throw err
    res.render('quantitytable',{title:'商品入り数一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'入り数',list:result})
  })
})
//* 商品入り数一覧内検索 *//
app.post('/quantitytable1', (req,res) => {
  connection.query('SELECT * FROM QUANTITY LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = QUANTITY.productcode WHERE productcode = "' + req.body.koumoku1 + '" ORDER BY productcode', (err, result) => {
    if(err) throw err
    if(result == ''){
      connection.query('SELECT * FROM QUANTITY LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = QUANTITY.productcode WHERE shohinname LIKE "%' + req.body.koumoku1 + '%" ORDER BY productcode', (err, result1) => {
        if(err) throw err
        res.render('quantitytable',{title:'商品入り数一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'入り数',list:result1})
      })
    } else {
      res.render('quantitytable',{title:'商品入り数一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'入り数',list:result})
    }
  })
})
//* 商品縦横内商品名検索 *//
app.post('/masuta9-pro',(req,res) => {
  connection.query('SELECT * FROM SHOHIN WHERE shohincode = "' + req.body.koumoku[0] + '"',(err,pro) => {
    if(pro == ""){
      res.render('masuta-9',{title:'商品入り数登録',koumoku:req.body.koumoku,jun:0})
    } else {
      connection.query('SELECT * FROM QUANTITY WHERE productcode = "' + req.body.koumoku[0] + '"',(err,pros) => {
        if(pros == ""){
          var koumoku = req.body.koumoku
          koumoku[1] = pro[0].shohinname
          res.render('masuta-9',{title:'商品入り数登録',koumoku:koumoku,jun:0})
        } else {
          var koumoku = req.body.koumoku
          koumoku[0] = pros[0].productcode
          koumoku[1] = pro[0].shohinname
          koumoku[2] = pros[0].quantity
          res.render('masuta-9',{title:'商品入り数登録',koumoku:koumoku,jun:0})
        }
      })
    }
  })
})

//-----------　　　Description　　　-----------//

app.post('/masuta10', (req, res) => {
  var koumoku = ['','','']
  res.render('masuta-10',{title:'Description',koumoku:koumoku,jun:0})
});
//* 入力・修正 *//
app.post('/description1', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('SELECT * FROM DESCRIPTION WHERE ?',employee,(err,result) => {
    if(result == ''){
      var employee2 = {productcode:req.body.koumoku[0],description:req.body.koumoku[2]}
      connection.query('INSERT INTO DESCRIPTION SET ?',employee2,(err1) => {
      })
    } else {
      var employee2 = {productcode:req.body.koumoku[0],description:req.body.koumoku[2]}
      connection.query('UPDATE DESCRIPTION SET ? WHERE productcode = "' + req.body.koumoku[0] + '"',employee2,(err1) => {
      })
    }
    var koumoku = ['','','']
    res.render('masuta-10',{title:'Description',koumoku:koumoku,jun:0})
  })
})
//* 削除 *//
app.post('/description2', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('DELETE FROM DESCRIPTION WHERE ?',employee,(err1) => {
    if(err1) throw err1
  })
  var koumoku = ['','','']
  res.render('masuta-10',{title:'Description',koumoku:koumoku,jun:0})
})
//* DESCRIPTION一覧 *//
app.get('/descriptiontable', (req,res) => {
  connection.query('SELECT * FROM DESCRIPTION LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = DESCRIPTION.productcode',(err,result) => {
    res.render('descriptiontable',{title:'DESCRIPTION一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'DESCRIPTION',list:result})
  })
})
//* DESCRIPTION一覧内検索 *//
app.post('/descriptiontable1', (req,res) => {
  connection.query('SELECT DISTINCT * FROM DESCRIPTION LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = DESCRIPTION.productcode WHERE productcode = "' + req.body.koumoku1 + '" ORDER BY productcode', (err, result) => {
    if(err) throw err
    if(result == ''){
      connection.query('SELECT DISTINCT * FROM DESCRIPTION LEFT OUTER JOIN SHOHIN on SHOHIN.shohincode = DESCRIPTION.productcode WHERE shohinname LIKE "%' + req.body.koumoku1 + '%" ORDER BY productcode', (err, result1) => {
        if(err) throw err
        res.render('descriptiontable',{title:'DESCRIPTION一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'DESCRIPTION',list:result1})
      })
    } else {
      res.render('descriptiontable',{title:'DESCRIPTION一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'DESCRIPTION',list:result})
    }
  })
})
//* DESCRIPTION内商品名検索 *//
app.post('/masuta10-pro',(req,res) => {
  connection.query('SELECT DISTINCT * FROM SHOHIN WHERE shohincode = "' + req.body.koumoku[0] + '"',(err,pro) => {
    if(pro == ""){
      res.render('masuta-10',{title:'Description',koumoku:req.body.koumoku,jun:0})
    } else {
      connection.query('SELECT DISTINCT * FROM DESCRIPTION WHERE productcode = "' + req.body.koumoku[0] + '"',(err,pros) => {
        if(pros == ""){
          var koumoku = req.body.koumoku
          koumoku[1] = pro[0].shohinname
          res.render('masuta-10',{title:'Description',koumoku:koumoku,jun:2})
        } else {
          var koumoku = req.body.koumoku
          koumoku[0] = pros[0].productcode
          koumoku[1] = pro[0].shohinname
          koumoku[2] = pros[0].description
          res.render('masuta-10',{title:'Description',koumoku:koumoku,jun:2})
        }
      })
    }
  })
})

//-----------　　　直送先登録　　　-----------//

app.post('/masuta15', (req, res) => {
  var koumoku = ['','','','','','','','','','']
  res.render('masuta-15',{title:'直送先登録',koumoku:koumoku})
});
//* 直送先入力・修正 *//
app.post('/tyokusou1', (req,res) => {
  var code = {directdeliverycode:req.body.koumoku1}
  connection.query('SELECT * FROM DIRECTDELIVERY WHERE ?',code,(err,resu) => {
    if(err) throw err
      if(resu == ""){
        var employee = {directdeliverycode:req.body.koumoku1,directdeliveryname:req.body.koumoku2,directdeliveryname2:req.body.koumoku3,postnumber:req.body.koumoku4,directdeliveryfrom1:req.body.koumoku5,directdeliveryfrom2:req.body.koumoku6,tel:req.body.koumoku7,fax:req.body.koumoku8,directdeliveryfuri:req.body.koumoku9,note:req.body.koumoku10}
        connection.query('INSERT INTO DIRECTDELIVERY SET ? , additionaltime = NOW()', employee, (err1) => {
          if(err1) throw err1
        })
      } else {
        var employee = {directdeliverycode:req.body.koumoku1,directdeliveryname:req.body.koumoku2,directdeliveryname2:req.body.koumoku3,postnumber:req.body.koumoku4,directdeliveryfrom1:req.body.koumoku5,directdeliveryfrom2:req.body.koumoku6,tel:req.body.koumoku7,fax:req.body.koumoku8,directdeliveryfuri:req.body.koumoku9,note:req.body.koumoku10}
        connection.query('UPDATE DIRECTDELIVERY SET ? , updatetime = NOW() WHERE directdeliverycode = "' + req.body.koumoku1 + '"', employee, (err2) => {
          if(err2) throw err2
        })
      }
  })
  var koumoku = ['','','','','','','','','','']
  res.render('masuta-15',{title:'直送先登録',koumoku:koumoku})
})
//* 直送先削除 *//
app.post('/tyokusou2', (req,res) => {
  var employee = {directdeliverycode:req.body.koumoku1}
  connection.query('DELETE FROM DIRECTDELIVERY WHERE ?',employee,(err) => {
    if(err) throw err
  })
  var koumoku = ['','','','','','','','','','']
  res.render('masuta-15',{title:'直送先登録',koumoku:koumoku})
})
//* 直送先一覧 *//
app.get('/tyokusoutable', (req,res) => {
  tablecnt = 1
  var employee = 250
  connection.query('SELECT COUNT(*) AS cnt FROM DIRECTDELIVERY',(err,cnt)=>{
    connection.query('SELECT * FROM DIRECTDELIVERY ORDER BY directdeliverycode LIMIT 250 OFFSET ' + (employee - 250),(err,delis)=>{
      var last = Math.floor((cnt[0].cnt+250)/250)
      res.render('tyokusoutable',{title:'直送先一覧',midasi1:'直送先コード',midasi2:'直送先名',midasi3:'郵便番号',midasi4:'直送先住所',midasi5:'TEL',list:delis,tablecnt:tablecnt,last:last})
    })
  })
})
//* 直送先一覧ページ移動 *//
app.post('/tyokusoutable', (req,res) => {
  var num = Number(req.body.tablecnt)
  var employee = 250 * num
  tablecnt = num
  connection.query('SELECT COUNT(*) AS cnt FROM DIRECTDELIVERY',(err,cnt)=>{
    connection.query('SELECT * FROM DIRECTDELIVERY ORDER BY directdeliverycode LIMIT 250 OFFSET ' + (employee - 250),(err,delis)=>{
      var last = Math.floor((cnt[0].cnt+250)/250)
      res.render('tyokusoutable',{title:'直送先一覧',midasi1:'直送先コード',midasi2:'直送先名',midasi3:'郵便番号',midasi4:'直送先住所',midasi5:'TEL',list:delis,tablecnt:tablecnt,last:last})
    })
  })
})
//* 直送先一覧内直送名検索 *//
app.post('/tyokusoutable1', (req,res) => {
  connection.query('SELECT * FROM DIRECTDELIVERY WHERE directdeliverycode = "' + req.body.koumoku1 + '"', (err, result) => {
    if(err) throw err
    if(result == ""){
      connection.query('SELECT * FROM DIRECTDELIVERY WHERE directdeliveryname LIKE "%' + req.body.koumoku1 + '%"', (err1, result1) => {
        if(err1) throw err1
        res.render('tyokusoutable',{title:'直送先一覧',midasi1:'直送先コード',midasi2:'直送先名',midasi3:'郵便番号',midasi4:'直送先住所',midasi5:'TEL',list:result1,tablecnt:'none'})
      })
    } else {
      res.render('tyokusoutable',{title:'直送先一覧',midasi1:'直送先コード',midasi2:'直送先名',midasi3:'郵便番号',midasi4:'直送先住所',midasi5:'TEL',list:result,tablecnt:'none'})
    }
  })
})
//* フォーム内直送先検索 *//
app.post('/tyokusousearch',(req, res) => {
  connection.query('SELECT * FROM DIRECTDELIVERY WHERE directdeliverycode = "' + req.body.koumoku1 + '"', (err,result) => {
    if(err) throw err
    var re = result[0]
    var koumoku = [re.directdeliverycode,re.directdeliveryname,re.directdeliveryname2,re.directdeliveryfuri,re.postnumber,re.directdeliveryfrom1,re.directdeliveryfrom2,re.tel,re.fax,re.note]
    res.render('masuta-15',{title:'直送先登録',koumoku:koumoku})
  }) 
})




//-----------　　　荷送人登録　　　-----------//

app.post('/masuta16', (req, res) => {
  var koumoku = ['','','','']
  res.render('masuta-16',{title:'荷送人登録',koumoku:koumoku})
});
//* 荷送人入力・修正 *//
app.post('/shipper1', (req,res) => {
  var code = {shippercode:req.body.koumoku1}
  connection.query('SELECT * FROM SHIPPER WHERE ?',code,(err,resu) => {
    if(err) throw err
      if(resu == ""){
        var employee = {shippercode:req.body.koumoku1,shippername:req.body.koumoku2,postnumber:req.body.koumoku3,shipperfrom:req.body.koumoku4}
        connection.query('INSERT INTO SHIPPER SET ? , additionaltime = NOW()', employee, (err1) => {
          if(err1) throw err1
        })
      } else {
        var employee = {shippercode:req.body.koumoku1,shippername:req.body.koumoku2,postnumber:req.body.koumoku3,shipperfrom:req.body.koumoku4}
        connection.query('UPDATE SHIPPER SET ? , updatetime = NOW() WHERE shippercode = "' + req.body.koumoku1 + '"', employee, (err2) => {
          if(err2) throw err2
        })
      }
  })
  var koumoku = ['','','','']
  res.render('masuta-16',{title:'荷送人登録',koumoku:koumoku})
})
//* 荷送人削除 *//
app.post('/shipper2', (req,res) => {
  var employee = {shippercode:req.body.koumoku1}
  connection.query('DELETE FROM SHIPPER WHERE ?',employee,(err) => {
    if(err) throw err
  })
  var koumoku = ['','','','']
  res.render('masuta-16',{title:'荷送人登録',koumoku:koumoku})
})
//* 荷送人一覧 *//
app.get('/shippertable', (req,res) => {
  connection.query('SELECT * FROM SHIPPER ORDER BY shippercode', (err, result) => {
    if(err) throw err
    res.render('shippertable',{title:'荷送人一覧',midasi1:'荷送人コード',midasi2:'荷送人名',midasi3:'郵便番号',midasi4:'荷送人住所',list:result})
  })
})
//* 荷送人一覧内荷送人検索 *//
app.post('/shippertable1', (req,res) => {
  connection.query('SELECT * FROM SHIPPER WHERE shippercode = "' + req.body.koumoku1 + '"', (err, result) => {
    if(err) throw err
    if(result == ''){
      connection.query('SELECT * FROM SHIPPER WHERE shippername LIKE "%' + req.body.koumoku1 + '%"', (err1, result1) => {
        if(err1) throw err1
        res.render('shippertable',{title:'荷送人一覧',midasi1:'荷送人コード',midasi2:'荷送人名',midasi3:'郵便番号',midasi4:'荷送人住所',list:result1})
      })
    } else {
      res.render('shippertable',{title:'荷送人一覧',midasi1:'荷送人コード',midasi2:'荷送人名',midasi3:'郵便番号',midasi4:'荷送人住所',list:result})
    }
  })
})
//* フォーム内荷送人検索 *//
app.post('/shippersearch',(req, res) => {
  connection.query('SELECT * FROM SHIPPER WHERE shippercode = "' + req.body.koumoku1 + '"', (err,result) => {
    if(err) throw err
    var re = result[0]
    var koumoku = [re.shippercode,re.shippername,re.postnumber,re.shipperfrom]
    res.render('masuta-16',{title:'荷送人登録',koumoku:koumoku})
  }) 
})



//-----------　　　商品アイテム　　　-----------//

app.post('/masuta11', (req, res) => {
  var koumoku = ['','','']
  res.render('masuta-11',{title:'商品アイテム',koumoku:koumoku, authority:req.body.authority})
});
//* 商品アイテム入力・修正 *//
app.post('/productitem1', (req,res) => {
  var code = {productcode:req.body.koumoku1}
  connection.query('SELECT * FROM PRODUCTITEM WHERE ?',code,(err,resu) => {
    if(err) throw err
      if(resu == ""){
        var employee = {productcode:req.body.koumoku1,itemNo:req.body.koumoku3}
        connection.query('INSERT INTO PRODUCTITEM SET ?', employee, (err1) => {
          if(err1) throw err1
        })
      } else {
        var employee = {productcode:req.body.koumoku1,itemNo:req.body.koumoku3}
        connection.query('UPDATE PRODUCTITEM  SET ? WHERE productcode = "' + req.body.koumoku1 + '"', employee, (err2) => {
          if(err2) throw err2
        })
      }
  })
  var koumoku = ['','','']
  res.render('masuta-11',{title:'商品アイテム',koumoku:koumoku})
})
//* 商品アイテム削除 *//
app.post('/productitem2', (req,res) => {
  var employee = {productcode:req.body.koumoku1}
  connection.query('DELETE FROM PRODUCTITEM WHERE ?',employee,(err) => {
    if(err) throw err
  })
  var koumoku = ['','','']
  res.render('masuta-11',{title:'荷送人登録',koumoku:koumoku})
})
//* 商品アイテム一覧 *//
app.get('/productitemtable', (req,res) => {
  connection.query('SELECT * FROM SHOHIN LEFT OUTER JOIN PRODUCTITEM on SHOHIN.shohincode = PRODUCTITEM.productcode ORDER BY shohincode', (err, result) => {
    if(err) throw err
    res.render('productitemtable',{title:'商品アイテム一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'アイテムＮＯ',list:result})
  })
})
//* 商品アイテム一覧内商品名検索 *//
app.post('/productitemtable1', (req,res) => {
  connection.query('SELECT * FROM (SELECT * FROM SHOHIN WHERE shohincode = "' + req.body.koumoku1 + '") AS SHOHIN LEFT OUTER JOIN PRODUCTITEM on SHOHIN.shohincode = PRODUCTITEM.productcode', (err, result) => {
    if(err) throw err
    if(result == ''){
      connection.query('SELECT * FROM (SELECT * FROM SHOHIN WHERE shohinname LIKE "%' + req.body.koumoku1 + '%") AS SHOHIN LEFT OUTER JOIN PRODUCTITEM on SHOHIN.shohincode = PRODUCTITEM.productcode', (err1, result1) => {
        if(err1) throw err1
        res.render('productitemtable',{title:'商品アイテム一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'アイテムＮＯ',list:result1})
      })
    } else {
      res.render('productitemtable',{title:'商品アイテム一覧',midasi1:'商品コード',midasi2:'商品名',midasi3:'アイテムＮＯ',list:result})
    }
  })
})
//* フォーム内商品名検索 *//
app.post('/productitemsearch',(req, res) => {
  connection.query('SELECT * FROM (SELECT * FROM SHOHIN WHERE shohincode = "' + req.body.koumoku1 + '") AS SHOHIN LEFT OUTER JOIN PRODUCTITEM on SHOHIN.shohincode = PRODUCTITEM.productcode', (err, result) => {
    if(err) throw err
    var re = result[0]
    var koumoku = [re.shohincode,re.shohinname,re.itemNo]
    res.render('masuta-11',{title:'商品アイテム',koumoku:koumoku})
  }) 
})



//-----------　　　仕入先一覧　　　-----------//

app.get('/purchasetable', (req,res) => {
  connection.query('SELECT * FROM PURCHASE ORDER BY purchasecode', (err, result) => {
    if(err) throw err
    res.render('purchasetable',{title:'仕入先一覧',midasi1:'仕入先コード',midasi2:'仕入先名',midasi3:'郵便番号',midasi4:'仕入先住所',midasi5:'担当者名',list:result})
  })
})
//* 仕入先一覧仕入先名検索 *//
app.post('/purchasetable1', (req,res) => {
  connection.query('SELECT * FROM PURCHASE WHERE purchasecode = "' + req.body.koumoku1 + '"', (err, result) => {
    if(err) throw err
    if(result == ''){
      connection.query('SELECT * FROM PURCHASE WHERE purchasename1 LIKE "%' + req.body.koumoku1 + '%"', (err1, result1) => {
        if(err1) throw err1
        res.render('purchasetable',{title:'仕入先一覧',midasi1:'仕入先コード',midasi2:'仕入先名',midasi3:'郵便番号',midasi4:'仕入先住所',midasi5:'担当者名',list:result1})
      })
    } else {
      res.render('purchasetable',{title:'仕入先一覧',midasi1:'仕入先コード',midasi2:'仕入先名',midasi3:'郵便番号',midasi4:'仕入先住所',midasi5:'担当者名',list:result})
    }
  })
})

//-----------　　　商品一覧　　　-----------//

app.get('/producttable', (req,res) => {
  tablecnt = 1
  var employee = 250
  connection.query('SELECT COUNT(*) AS cnt FROM SHOHIN',(err,cnt)=>{
    connection.query('SELECT * FROM SHOHIN LIMIT 250 OFFSET ' + (employee - 250),(err,shos)=>{
      var last = Math.floor((cnt[0].cnt+250)/250)
      res.render('producttable',{title:'商品一覧',midasi1:'商品コード',midasi2:'商品名',list:shos,tablecnt:tablecnt,last:last})
    })
  })
})
//* 商品一覧ページ移動 *//
app.post('/producttable', (req,res) => {
  var num = Number(req.body.tablecnt)
  var employee = 250 * num
  tablecnt = num
  connection.query('SELECT COUNT(*) AS cnt FROM SHOHIN',(err,cnt)=>{
    connection.query('SELECT * FROM SHOHIN LIMIT 250 OFFSET ' + (employee - 250),(err,shos)=>{
      var last = Math.floor((cnt[0].cnt+250)/250)
      res.render('producttable',{title:'商品一覧',midasi1:'商品コード',midasi2:'商品名',list:shos,tablecnt:tablecnt,last:last})
    })
  })
})
//* 商品一覧商品名・コード検索 *//
app.post('/producttable1', (req,res) => {
  connection.query('SELECT * FROM SHOHIN WHERE shohincode = "' + req.body.koumoku1 + '"', (err, result) => {
    if(err) throw err
    if(result == ''){
      connection.query('SELECT * FROM SHOHIN WHERE shohinname LIKE "%' + req.body.koumoku1 + '%"', (err1, result1) => {
        if(err1) throw err
        res.render('producttable',{title:'商品一覧',midasi1:'商品コード',midasi2:'商品名',list:result1,tablecnt:'none'})
      })
    } else {
      res.render('producttable',{title:'商品一覧',midasi1:'商品コード',midasi2:'商品名',list:result,tablecnt:'none'})
    }
  })
})



//-----------　　　仕入原価　　　-----------//

app.post('/masuta19', (req, res) => {
  var koumoku = ['','','','','','','','','','','','','']
  res.render('masuta-19',{title:'仕入原価',koumoku:koumoku, authority:req.body.authority, jun:0})
});
//* 入力・修正 *//
app.post('/purchasingcost1', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('SELECT * FROM PURCHASEPRICE WHERE ?',employee,(err,result) => {
    if(result == ''){
      var employee2 = {productcode:req.body.koumoku[0],evaluationrate:req.body.koumoku[11],producingarea:req.body.koumoku[10],constitution:req.body.koumoku[9],logisticscostsrate:req.body.koumoku[6],purchasecode:req.body.koumoku[2],foreignpurchasecode:req.body.koumoku[4],foreigncost1:req.body.koumoku[7],salescost1:req.body.koumoku[8],remark:req.body.koumoku[12]}
      connection.query('INSERT INTO PURCHASEPRICE SET ?, additionaltime = NOW()',employee2,(err1) => {
      })
    } else {
      var employee2 = {evaluationrate:req.body.koumoku[11],producingarea:req.body.koumoku[10],constitution:req.body.koumoku[9],logisticscostsrate:req.body.koumoku[6],purchasecode:req.body.koumoku[2],foreignpurchasecode:req.body.koumoku[4],foreigncost1:req.body.koumoku[7],salescost1:req.body.koumoku[8],remark:req.body.koumoku[12]}
      connection.query('UPDATE PURCHASEPRICE SET ?, updatetime = NOW() WHERE productcode = "' + req.body.koumoku[0] + '"',employee2,(err1) => {
      })
    }
    var koumoku = ['','','','','','','','','','','','','']
    res.render('masuta-19',{title:'仕入原価',koumoku:koumoku, authority:req.body.authority, jun:0})
  })
})
//* 削除 *//
app.post('/purchasingcost2', (req, res) => {
  var employee = {productcode:req.body.koumoku[0]}
  connection.query('DELETE FROM PURCHASEPRICE WHERE ?',employee,(err) => {
  })
  var koumoku = ['','','','','','','','','','','','','']
  res.render('masuta-19',{title:'仕入原価',koumoku:koumoku, authority:req.body.authority, jun:0})
})
//* 仕入原価内商品名検索 *//
app.post('/masuta19-pro',(req,res) => {
  connection.query('SELECT * FROM SHOHIN WHERE shohincode = "' + req.body.koumoku[0] + '"',(err,pro) => {
    if(pro == ""){
      res.render('masuta-19',{title:'仕入原価',koumoku:req.body.koumoku, authority:req.body.authority, jun:0})
    } else {
      connection.query('SELECT * FROM PURCHASEPRICE LEFT OUTER JOIN PURCHASE on PURCHASEPRICE.purchasecode = PURCHASE.purchasecode WHERE productcode = "' + req.body.koumoku[0] + '"',(err,pros) => {
        if(pros == ""){
          var koumoku = req.body.koumoku
          koumoku[1] = pro[0].shohinname
          res.render('masuta-19',{title:'仕入原価',koumoku:koumoku, authority:req.body.authority, jun:2})
        } else {
          var koumoku = req.body.koumoku
          koumoku[1] = pro[0].shohinname
          koumoku[2] = pros[0].purchasecode
          koumoku[3] = pros[0].purchasename1
          koumoku[4] = pros[0].foreignpurchasecode
          koumoku[6] = pros[0].logisticscostsrate
          koumoku[7] = pros[0].foreigncost1
          koumoku[8] = pros[0].salescost1
          koumoku[9] = pros[0].constitution
          koumoku[10] = pros[0].producingarea
          koumoku[11] = pros[0].evaluationrate
          koumoku[12] = pros[0].remark
          res.render('masuta-19',{title:'仕入原価',koumoku:koumoku, authority:req.body.authority, jun:2})
        }
      })
    }
  })
})
//* 仕入原価内仕入先検索 *//
app.post('/masuta19-pur',(req,res) => {
  connection.query('SELECT * FROM PURCHASE WHERE purchasecode = "' + req.body.koumoku[2] + '"',(err,pur) => {
    if(pur == ""){
      res.render('masuta-19',{title:'仕入原価',koumoku:req.body.koumoku, authority:req.body.authority, jun:2})
    } else {
      var koumoku = req.body.koumoku
      koumoku[3] = pur[0].purchasename1
      res.render('masuta-19',{title:'仕入原価',koumoku:koumoku, authority:req.body.authority, jun:4})
    }
  })
})




//-----------　　　為替登録　　　-----------//

app.post('/masuta20', (req, res) => {
  var koumoku = ['']
  res.render('masuta-20',{title:'為替登録',koumoku:koumoku, authority:req.body.authority, jun:0})
});
app.post('/rate1', (req, res) => {
  var employee = {companyrate:req.body.koumoku[0]}
  connection.query('INSERT INTO RATE SET ?,registerdate = NOW()',employee,(err) => {
    if(err) throw err;
  })
  var koumoku = ['']
  res.render('masuta-20',{title:'為替登録',koumoku:koumoku, authority:req.body.authority, jun:0})
});


//-----------　　　仕入伝票　　　-----------//

app.post('/purchase1', (req, res) => {
  var koumoku = [hiduke,'','','',hiduke,hiduke,'','','','','','']
  var table =[];
  for(var i = 0;i < 16; i++){
    table.push(i+1,'','','','','','')
  }
  coded = 0
  res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:table,list:jimus,list2:shos})
})
//* 仕入伝票入力・修正 *//
app.post('/purchaseslip1', (req, res) => {
  var code = {purchaseslipcode:req.body.koumoku[2]}
  connection.query('SELECT * FROM PURCHASETABLE WHERE ?',code,function(err,result){
    if(err){
      throw err;
    } else if(result == ""){
      var time = req.body.koumoku[0]
      var year = time.substr(3, 1);
      if(0 == time.substr(5,1)){
        var month = time.substr(6,1);
      } else {
        var month = time.substr(5,2);
        switch (month){
          case '10': 
            month = 'X';
            break;
          case '11':
            month = 'Y';
            break;
          case '12':
            month = 'Z';
            break;
          default:
            break;
        }
      }
      var saiban = 'S' + year + month;
      connection.query('SELECT * FROM SAIBAN WHERE saibancode = ?',saiban,function(err1,result1){
        if(err1){
          throw err1;
        } else if(result1 == ""){
          connection.query('INSERT INTO SAIBAN SET saibancode = ? ,count = 1',saiban,function(err2){
            if(err2){
              throw err2;
            }
          })
        } else if(result1[0].saibancode == saiban){
          connection.query('UPDATE SAIBAN SET count = count + 1 WHERE saibancode = ?',saiban,function(err2){
            if(err2){
              throw err2;
            }
          })
        }
        connection.query('SELECT count FROM SAIBAN WHERE saibancode = ?',saiban,function(err3,result3){
          if(err3){
            throw err3;
          } else {
            var purchaseslipcode = saiban + '-' + ('00000' + result3[0].count).slice(-5);
            var employee = {purchaseslipcode:purchaseslipcode,purchasedate:req.body.koumoku[0],payoffdate:req.body.koumoku[4],purchasecode:req.body.koumoku[6],staffcode:'',summaryname:'',orderslipcode:req.body.koumoku[1],ofcode:req.body.koumoku[9],remark:req.body.koumoku[10],wadate:req.body.koumoku[5]}
            connection.query('INSERT INTO PURCHASETABLE SET ? , additionaltime = NOW(), flg = "20"',employee,(err4) => {
              if(err4) throw err4;
              if(req.body.table[6] == ''){
              } else if(req.body.table[13] == ''){
                var employee2 = {purchaseslipcode:purchaseslipcode,number:req.body.table[0],division:req.body.table[1],productcode:req.body.table[2],quantity:String(req.body.table[4].replace(/,/g, '')),price:String(req.body.table[5].replace(/,/g, '')),productname:req.body.table[3],amount:String(req.body.table[6].replace(/,/g, '')),arrivalquantity:0}
                connection.query('INSERT INTO PURCHASEDETAIL SET ?',employee2,(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[20] == ''){
                var i = 7;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[27] == ''){
                var i = 7;
                var j = 14;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[34] == ''){
                var i = 7;
                var j = 14;
                var k = 21
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[41] == ''){
                var i = 7;
                var j = 14;
                var k = 21;
                var l = 28;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[48] == ''){
                var i = 7;
                var j = 14;
                var k = 21;
                var l = 28;
                var m = 35;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[55] == ''){
                var i = 7;
                var j = 14;
                var k = 21;
                var l = 28;
                var m = 35;
                var n = 42;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[62] == ''){
                var i = 7;
                var j = 14;
                var k = 21;
                var l = 28;
                var m = 35;
                var n = 42;
                var o = 49;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[69] == ''){
                var i = 7;
                var j = 14;
                var k = 21;
                var l = 28;
                var m = 35;
                var n = 42;
                var o = 49;
                var p = 56;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+p] + '","' + req.body.table[1+p] + '","' + req.body.table[2+p] + '",' + String(req.body.table[4+p].replace(/,/g, '')) + ',' + String(req.body.table[5+p].replace(/,/g, '')) + ',"' + req.body.table[3+p] + '",' + String(req.body.table[6+p].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[76] == ''){
                var i = 7;var j = 14;var k = 21;var l = 28;var m = 35;var n = 42;var o = 49;var p = 56;var q = 63;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+p] + '","' + req.body.table[1+p] + '","' + req.body.table[2+p] + '",' + String(req.body.table[4+p].replace(/,/g, '')) + ',' + String(req.body.table[5+p].replace(/,/g, '')) + ',"' + req.body.table[3+p] + '",' + String(req.body.table[6+p].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+q] + '","' + req.body.table[1+q] + '","' + req.body.table[2+q] + '",' + String(req.body.table[4+q].replace(/,/g, '')) + ',' + String(req.body.table[5+q].replace(/,/g, '')) + ',"' + req.body.table[3+q] + '",' + String(req.body.table[6+q].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[83] == ''){
                var i = 7;var j = 14;var k = 21;var l = 28;var m = 35;var n = 42;var o = 49;var p = 56;var q = 63;var r = 70;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+p] + '","' + req.body.table[1+p] + '","' + req.body.table[2+p] + '",' + String(req.body.table[4+p].replace(/,/g, '')) + ',' + String(req.body.table[5+p].replace(/,/g, '')) + ',"' + req.body.table[3+p] + '",' + String(req.body.table[6+p].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+q] + '","' + req.body.table[1+q] + '","' + req.body.table[2+q] + '",' + String(req.body.table[4+q].replace(/,/g, '')) + ',' + String(req.body.table[5+q].replace(/,/g, '')) + ',"' + req.body.table[3+q] + '",' + String(req.body.table[6+q].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+r] + '","' + req.body.table[1+r] + '","' + req.body.table[2+r] + '",' + String(req.body.table[4+r].replace(/,/g, '')) + ',' + String(req.body.table[5+r].replace(/,/g, '')) + ',"' + req.body.table[3+r] + '",' + String(req.body.table[6+r].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[90] == ''){
                var i = 7;var j = 14;var k = 21;var l = 28;var m = 35;var n = 42;var o = 49;var p = 56;var q = 63;var r = 70;var s = 77;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+p] + '","' + req.body.table[1+p] + '","' + req.body.table[2+p] + '",' + String(req.body.table[4+p].replace(/,/g, '')) + ',' + String(req.body.table[5+p].replace(/,/g, '')) + ',"' + req.body.table[3+p] + '",' + String(req.body.table[6+p].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+q] + '","' + req.body.table[1+q] + '","' + req.body.table[2+q] + '",' + String(req.body.table[4+q].replace(/,/g, '')) + ',' + String(req.body.table[5+q].replace(/,/g, '')) + ',"' + req.body.table[3+q] + '",' + String(req.body.table[6+q].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+r] + '","' + req.body.table[1+r] + '","' + req.body.table[2+r] + '",' + String(req.body.table[4+r].replace(/,/g, '')) + ',' + String(req.body.table[5+r].replace(/,/g, '')) + ',"' + req.body.table[3+r] + '",' + String(req.body.table[6+r].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+s] + '","' + req.body.table[1+s] + '","' + req.body.table[2+s] + '",' + String(req.body.table[4+s].replace(/,/g, '')) + ',' + String(req.body.table[5+s].replace(/,/g, '')) + ',"' + req.body.table[3+s] + '",' + String(req.body.table[6+s].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[97] == ''){
                var i = 7;var j = 14;var k = 21;var l = 28;var m = 35;var n = 42;var o = 49;var p = 56;var q = 63;var r = 70;var s = 77;var t = 84;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+p] + '","' + req.body.table[1+p] + '","' + req.body.table[2+p] + '",' + String(req.body.table[4+p].replace(/,/g, '')) + ',' + String(req.body.table[5+p].replace(/,/g, '')) + ',"' + req.body.table[3+p] + '",' + String(req.body.table[6+p].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+q] + '","' + req.body.table[1+q] + '","' + req.body.table[2+q] + '",' + String(req.body.table[4+q].replace(/,/g, '')) + ',' + String(req.body.table[5+q].replace(/,/g, '')) + ',"' + req.body.table[3+q] + '",' + String(req.body.table[6+q].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+r] + '","' + req.body.table[1+r] + '","' + req.body.table[2+r] + '",' + String(req.body.table[4+r].replace(/,/g, '')) + ',' + String(req.body.table[5+r].replace(/,/g, '')) + ',"' + req.body.table[3+r] + '",' + String(req.body.table[6+r].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+s] + '","' + req.body.table[1+s] + '","' + req.body.table[2+s] + '",' + String(req.body.table[4+s].replace(/,/g, '')) + ',' + String(req.body.table[5+s].replace(/,/g, '')) + ',"' + req.body.table[3+s] + '",' + String(req.body.table[6+s].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+t] + '","' + req.body.table[1+t] + '","' + req.body.table[2+t] + '",' + String(req.body.table[4+t].replace(/,/g, '')) + ',' + String(req.body.table[5+t].replace(/,/g, '')) + ',"' + req.body.table[3+t] + '",' + String(req.body.table[6+t].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[104] == ''){
                var i = 7;var j = 14;var k = 21;var l = 28;var m = 35;var n = 42;var o = 49;var p = 56;var q = 63;var r = 70;var s = 77;var t = 84;var u = 91;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+p] + '","' + req.body.table[1+p] + '","' + req.body.table[2+p] + '",' + String(req.body.table[4+p].replace(/,/g, '')) + ',' + String(req.body.table[5+p].replace(/,/g, '')) + ',"' + req.body.table[3+p] + '",' + String(req.body.table[6+p].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+q] + '","' + req.body.table[1+q] + '","' + req.body.table[2+q] + '",' + String(req.body.table[4+q].replace(/,/g, '')) + ',' + String(req.body.table[5+q].replace(/,/g, '')) + ',"' + req.body.table[3+q] + '",' + String(req.body.table[6+q].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+r] + '","' + req.body.table[1+r] + '","' + req.body.table[2+r] + '",' + String(req.body.table[4+r].replace(/,/g, '')) + ',' + String(req.body.table[5+r].replace(/,/g, '')) + ',"' + req.body.table[3+r] + '",' + String(req.body.table[6+r].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+s] + '","' + req.body.table[1+s] + '","' + req.body.table[2+s] + '",' + String(req.body.table[4+s].replace(/,/g, '')) + ',' + String(req.body.table[5+s].replace(/,/g, '')) + ',"' + req.body.table[3+s] + '",' + String(req.body.table[6+s].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+t] + '","' + req.body.table[1+t] + '","' + req.body.table[2+t] + '",' + String(req.body.table[4+t].replace(/,/g, '')) + ',' + String(req.body.table[5+t].replace(/,/g, '')) + ',"' + req.body.table[3+t] + '",' + String(req.body.table[6+t].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+u] + '","' + req.body.table[1+u] + '","' + req.body.table[2+u] + '",' + String(req.body.table[4+u].replace(/,/g, '')) + ',' + String(req.body.table[5+u].replace(/,/g, '')) + ',"' + req.body.table[3+u] + '",' + String(req.body.table[6+u].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[111] == ''){
                var i = 7;var j = 14;var k = 21;var l = 28;var m = 35;var n = 42;var o = 49;var p = 56;var q = 63;var r = 70;var s = 77;var t = 84;var u = 91;var v = 98;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+p] + '","' + req.body.table[1+p] + '","' + req.body.table[2+p] + '",' + String(req.body.table[4+p].replace(/,/g, '')) + ',' + String(req.body.table[5+p].replace(/,/g, '')) + ',"' + req.body.table[3+p] + '",' + String(req.body.table[6+p].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+q] + '","' + req.body.table[1+q] + '","' + req.body.table[2+q] + '",' + String(req.body.table[4+q].replace(/,/g, '')) + ',' + String(req.body.table[5+q].replace(/,/g, '')) + ',"' + req.body.table[3+q] + '",' + String(req.body.table[6+q].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+r] + '","' + req.body.table[1+r] + '","' + req.body.table[2+r] + '",' + String(req.body.table[4+r].replace(/,/g, '')) + ',' + String(req.body.table[5+r].replace(/,/g, '')) + ',"' + req.body.table[3+r] + '",' + String(req.body.table[6+r].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+s] + '","' + req.body.table[1+s] + '","' + req.body.table[2+s] + '",' + String(req.body.table[4+s].replace(/,/g, '')) + ',' + String(req.body.table[5+s].replace(/,/g, '')) + ',"' + req.body.table[3+s] + '",' + String(req.body.table[6+s].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+t] + '","' + req.body.table[1+t] + '","' + req.body.table[2+t] + '",' + String(req.body.table[4+t].replace(/,/g, '')) + ',' + String(req.body.table[5+t].replace(/,/g, '')) + ',"' + req.body.table[3+t] + '",' + String(req.body.table[6+t].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+u] + '","' + req.body.table[1+u] + '","' + req.body.table[2+u] + '",' + String(req.body.table[4+u].replace(/,/g, '')) + ',' + String(req.body.table[5+u].replace(/,/g, '')) + ',"' + req.body.table[3+u] + '",' + String(req.body.table[6+u].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+v] + '","' + req.body.table[1+v] + '","' + req.body.table[2+v] + '",' + String(req.body.table[4+v].replace(/,/g, '')) + ',' + String(req.body.table[5+v].replace(/,/g, '')) + ',"' + req.body.table[3+v] + '",' + String(req.body.table[6+v].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[118] == ''){
                var i = 7;var j = 14;var k = 21;var l = 28;var m = 35;var n = 42;var o = 49;var p = 56;var q = 63;var r = 70;var s = 77;var t = 84;var u = 91;var v = 98;var w = 105;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+p] + '","' + req.body.table[1+p] + '","' + req.body.table[2+p] + '",' + String(req.body.table[4+p].replace(/,/g, '')) + ',' + String(req.body.table[5+p].replace(/,/g, '')) + ',"' + req.body.table[3+p] + '",' + String(req.body.table[6+p].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+q] + '","' + req.body.table[1+q] + '","' + req.body.table[2+q] + '",' + String(req.body.table[4+q].replace(/,/g, '')) + ',' + String(req.body.table[5+q].replace(/,/g, '')) + ',"' + req.body.table[3+q] + '",' + String(req.body.table[6+q].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+r] + '","' + req.body.table[1+r] + '","' + req.body.table[2+r] + '",' + String(req.body.table[4+r].replace(/,/g, '')) + ',' + String(req.body.table[5+r].replace(/,/g, '')) + ',"' + req.body.table[3+r] + '",' + String(req.body.table[6+r].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+s] + '","' + req.body.table[1+s] + '","' + req.body.table[2+s] + '",' + String(req.body.table[4+s].replace(/,/g, '')) + ',' + String(req.body.table[5+s].replace(/,/g, '')) + ',"' + req.body.table[3+s] + '",' + String(req.body.table[6+s].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+t] + '","' + req.body.table[1+t] + '","' + req.body.table[2+t] + '",' + String(req.body.table[4+t].replace(/,/g, '')) + ',' + String(req.body.table[5+t].replace(/,/g, '')) + ',"' + req.body.table[3+t] + '",' + String(req.body.table[6+t].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+u] + '","' + req.body.table[1+u] + '","' + req.body.table[2+u] + '",' + String(req.body.table[4+u].replace(/,/g, '')) + ',' + String(req.body.table[5+u].replace(/,/g, '')) + ',"' + req.body.table[3+u] + '",' + String(req.body.table[6+u].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+v] + '","' + req.body.table[1+v] + '","' + req.body.table[2+v] + '",' + String(req.body.table[4+v].replace(/,/g, '')) + ',' + String(req.body.table[5+v].replace(/,/g, '')) + ',"' + req.body.table[3+v] + '",' + String(req.body.table[6+v].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+w] + '","' + req.body.table[1+w] + '","' + req.body.table[2+w] + '",' + String(req.body.table[4+w].replace(/,/g, '')) + ',' + String(req.body.table[5+w].replace(/,/g, '')) + ',"' + req.body.table[3+w] + '",' + String(req.body.table[6+w].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })
              } else if(req.body.table[125] == ''){
                var i = 7;var j = 14;var k = 21;var l = 28;var m = 35;var n = 42;var o = 49;var p = 56;var q = 63;var r = 70;var s = 77;var t = 84;var u = 91;var v = 98;var w = 105;var x = 112;
                connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES("' + purchaseslipcode + '","' + req.body.table[0] + '","' + req.body.table[1] + '","' + req.body.table[2] + '",' + String(req.body.table[4].replace(/,/g, '')) + ',' + String(req.body.table[5].replace(/,/g, '')) + ',"' + req.body.table[3] + '",' + String(req.body.table[6].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+i] + '","' + req.body.table[1+i] + '","' + req.body.table[2+i] + '",' + String(req.body.table[4+i].replace(/,/g, '')) + ',' + String(req.body.table[5+i].replace(/,/g, '')) + ',"' + req.body.table[3+i] + '",' + String(req.body.table[6+i].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+j] + '","' + req.body.table[1+j] + '","' + req.body.table[2+j] + '",' + String(req.body.table[4+j].replace(/,/g, '')) + ',' + String(req.body.table[5+j].replace(/,/g, '')) + ',"' + req.body.table[3+j] + '",' + String(req.body.table[6+j].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+k] + '","' + req.body.table[1+k] + '","' + req.body.table[2+k] + '",' + String(req.body.table[4+k].replace(/,/g, '')) + ',' + String(req.body.table[5+k].replace(/,/g, '')) + ',"' + req.body.table[3+k] + '",' + String(req.body.table[6+k].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+l] + '","' + req.body.table[1+l] + '","' + req.body.table[2+l] + '",' + String(req.body.table[4+l].replace(/,/g, '')) + ',' + String(req.body.table[5+l].replace(/,/g, '')) + ',"' + req.body.table[3+l] + '",' + String(req.body.table[6+l].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+m] + '","' + req.body.table[1+m] + '","' + req.body.table[2+m] + '",' + String(req.body.table[4+m].replace(/,/g, '')) + ',' + String(req.body.table[5+m].replace(/,/g, '')) + ',"' + req.body.table[3+m] + '",' + String(req.body.table[6+m].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+n] + '","' + req.body.table[1+n] + '","' + req.body.table[2+n] + '",' + String(req.body.table[4+n].replace(/,/g, '')) + ',' + String(req.body.table[5+n].replace(/,/g, '')) + ',"' + req.body.table[3+n] + '",' + String(req.body.table[6+n].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+o] + '","' + req.body.table[1+o] + '","' + req.body.table[2+o] + '",' + String(req.body.table[4+o].replace(/,/g, '')) + ',' + String(req.body.table[5+o].replace(/,/g, '')) + ',"' + req.body.table[3+o] + '",' + String(req.body.table[6+o].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+p] + '","' + req.body.table[1+p] + '","' + req.body.table[2+p] + '",' + String(req.body.table[4+p].replace(/,/g, '')) + ',' + String(req.body.table[5+p].replace(/,/g, '')) + ',"' + req.body.table[3+p] + '",' + String(req.body.table[6+p].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+q] + '","' + req.body.table[1+q] + '","' + req.body.table[2+q] + '",' + String(req.body.table[4+q].replace(/,/g, '')) + ',' + String(req.body.table[5+q].replace(/,/g, '')) + ',"' + req.body.table[3+q] + '",' + String(req.body.table[6+q].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+r] + '","' + req.body.table[1+r] + '","' + req.body.table[2+r] + '",' + String(req.body.table[4+r].replace(/,/g, '')) + ',' + String(req.body.table[5+r].replace(/,/g, '')) + ',"' + req.body.table[3+r] + '",' + String(req.body.table[6+r].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+s] + '","' + req.body.table[1+s] + '","' + req.body.table[2+s] + '",' + String(req.body.table[4+s].replace(/,/g, '')) + ',' + String(req.body.table[5+s].replace(/,/g, '')) + ',"' + req.body.table[3+s] + '",' + String(req.body.table[6+s].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+t] + '","' + req.body.table[1+t] + '","' + req.body.table[2+t] + '",' + String(req.body.table[4+t].replace(/,/g, '')) + ',' + String(req.body.table[5+t].replace(/,/g, '')) + ',"' + req.body.table[3+t] + '",' + String(req.body.table[6+t].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+u] + '","' + req.body.table[1+u] + '","' + req.body.table[2+u] + '",' + String(req.body.table[4+u].replace(/,/g, '')) + ',' + String(req.body.table[5+u].replace(/,/g, '')) + ',"' + req.body.table[3+u] + '",' + String(req.body.table[6+u].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+v] + '","' + req.body.table[1+v] + '","' + req.body.table[2+v] + '",' + String(req.body.table[4+v].replace(/,/g, '')) + ',' + String(req.body.table[5+v].replace(/,/g, '')) + ',"' + req.body.table[3+v] + '",' + String(req.body.table[6+v].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+w] + '","' + req.body.table[1+w] + '","' + req.body.table[2+w] + '",' + String(req.body.table[4+w].replace(/,/g, '')) + ',' + String(req.body.table[5+w].replace(/,/g, '')) + ',"' + req.body.table[3+w] + '",' + String(req.body.table[6+w].replace(/,/g, '')) + ',' + 0 +'),("' + purchaseslipcode + '","' + req.body.table[0+x] + '","' + req.body.table[1+x] + '","' + req.body.table[2+x] + '",' + String(req.body.table[4+x].replace(/,/g, '')) + ',' + String(req.body.table[5+x].replace(/,/g, '')) + ',"' + req.body.table[3+x] + '",' + String(req.body.table[6+x].replace(/,/g, '')) + ',' + 0 +')',(err5) => {
                  if(err5) throw err5
                })

              }
            }) 
          }
        })
      })
    } else if(result[0].purchaseslipcode == req.body.koumoku[2]){
      var employee2 = {purchasedate:req.body.koumoku[0],payoffdate:req.body.koumoku[4],purchasecode:req.body.koumoku[6],staffcode:'',summaryname:'',orderslipcode:req.body.koumoku[1],ofcode:req.body.koumoku[9],remark:req.body.koumoku[10],wadate:req.body.koumoku[5]}
      connection.query('UPDATE PURCHASETABLE SET ? , updatetime = NOW() WHERE purchaseslipcode = "' + result[0].purchaseslipcode + '"',employee2,(err4) => {
        connection.query('SELECT COUNT(*) AS cnt FROM PURCHASEDETAIL WHERE purchaseslipcode = "' + result[0].purchaseslipcode + '"',(err5,result5) => {
          var cnt = 0;
          var flg = 0;
          for(var i = 6; i <= 7 * 16 && flg == 0; i+=7){
            if(req.body.table[i] != ""){
              cnt++
            } else {
              flg = 1
            }
          }
          if(result5[0].cnt == cnt){
            var pur1 = "division = CASE number "
            var pur2 = "productcode = CASE number "
            var pur3 = "productname = CASE number "
            var pur4 = "quantity = CASE number "
            var pur5 = "price = CASE number "
            var pur6 = "amount = CASE number "
            for(var i = 0;cnt-1 >= i;i++){
              pur1 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[((i+1)*7)-6] + '" '
              pur2 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[((i+1)*7)-5] + '" '
              pur3 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[((i+1)*7)-4] + '" '
              pur4 += 'WHEN ' + (i+1) + ' THEN "' + String(req.body.table[((i+1)*7)-3].replace(/,/g, '')) + '" '
              pur5 += 'WHEN ' + (i+1) + ' THEN "' + String(req.body.table[((i+1)*7)-2].replace(/,/g, '')) + '" '
              pur6 += 'WHEN ' + (i+1) + ' THEN "' + String(req.body.table[((i+1)*7)-1].replace(/,/g, '')) + '" '
            }
              pur1 += 'END'
              pur2 += 'END'
              pur3 += 'END'
              pur4 += 'END'
              pur5 += 'END'
              pur6 += 'END'
              connection.query('UPDATE PURCHASEDETAIL SET ' + pur1 + ', ' + pur2 + ', ' + pur3 + ', ' + pur4 + ', ' + pur5 + ', ' + pur6 + ' WHERE purchaseslipcode = "' + result[0].purchaseslipcode + '"',(err6) => {
              })
          } else if(result5[0].cnt < cnt || result5[0].cnt > cnt){
            connection.query('DELETE FROM PURCHASEDETAIL WHERE purchaseslipcode = "' + req.body.koumoku[2] + '"', (err6) => {
              var sql = ""
              for(var i = 0; i < cnt; i++){
                  sql += '("' + req.body.koumoku[2] + '","' + req.body.table[(i*7)] + '","' + req.body.table[(i*7)+1] + '","' + req.body.table[(i*7)+2] + '","' + String(req.body.table[(i*7)+4].replace(/,/g, '')) + '","' + String(req.body.table[(i*7)+5].replace(/,/g, '')) + '","' + req.body.table[(i*7)+3] + '","' + String(req.body.table[(i*7)+6].replace(/,/g, '')) + '",' + 0 +'),'
              }
              connection.query('INSERT INTO PURCHASEDETAIL(purchaseslipcode, number, division, productcode, quantity, price, productname, amount, arrivalquantity) VALUES' + sql.slice(0,-1) ,(err7) => {
              })
            })
          } else {
            console.log('none')
          }
          if(err5) throw err5
        })
        
      })
    }
    var koumoku = [hiduke,'','','',hiduke,hiduke,'','','','','','','']
    var table =[];
    for(var i = 0;i < 16; i++){
      table.push(i+1,'','','','','','')
    }
    res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:table,list:jimus,list2:shos})
  })
})
//* 仕入伝票削除 *//
app.post('/purchaseslip2', (req, res) => {
  connection.query('DELETE FROM PURCHASETABLE WHERE purchaseslipcode = "' + req.body.koumoku[2] + '"', (err1) => {
    if(err1) throw err1
    connection.query('DELETE FROM PURCHASEDETAIL WHERE purchaseslipcode = "' + req.body.koumoku[2] + '"', (err2) => {
      if(err2) throw err2
    })
  })
  var koumoku = [hiduke,'','','',hiduke,hiduke,'','','','','','','']
  var table =[];
  for(var i = 0;i < 16; i++){
  table.push(i+1,'','','','','','')
  }
  res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:table,list:jimus,list2:shos})
}) 
//* 仕入伝票一覧 *//
app.get('/purchasesliptable', (req, res) => {
  connection.query('SELECT * ,DATE_FORMAT(purchasedate,"%Y/%m/%d") AS "purchasedate",DATE_FORMAT(payoffdate,"%Y/%m/%d") AS "payoffdate",DATE_FORMAT(wadate,"%Y/%m/%d") AS "wadate" FROM PURCHASETABLE LEFT OUTER JOIN PURCHASEDETAIL ON PURCHASETABLE.purchaseslipcode = PURCHASEDETAIL.purchaseslipcode LEFT OUTER JOIN PURCHASE ON PURCHASETABLE.purchasecode = PURCHASE.purchasecode ORDER BY PURCHASETABLE.payoffdate DESC, PURCHASETABLE.purchaseslipcode DESC, PURCHASEDETAIL.number',function(err,result1){
    if(err){
      throw err;
    } else {
      res.render('purchasesliptable',{title: '入荷伝票一覧',koumoku1:'',midasi1:'入荷伝票NO',midasi2:'精算日',midasi3:'仕入先コード',midasi4:'仕入先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'入荷数量',list: result1});
    }
  })
})
//* 仕入伝票一覧内検索　*//
app.post('/purchasesliptable1', (req,res) => {
  if(req.body.kikan1 != "" && req.body.kikan2 != ""){
    if(req.body.purchasecode != ""){
      connection.query('SELECT * ,DATE_FORMAT(payoffdate,"%Y/%m/%d") AS "payoffdate" FROM (SELECT * FROM PURCHASETABLE WHERE payoffdate BETWEEN "' + req.body.kikan1 + '" AND "' + req.body.kikan2 + '" AND purchasecode = "' + req.body.purchasecode + '") AS PURCHASETABLE LEFT OUTER JOIN PURCHASEDETAIL ON PURCHASETABLE.purchaseslipcode = PURCHASEDETAIL.purchaseslipcode LEFT OUTER JOIN PURCHASE ON PURCHASETABLE.purchasecode = PURCHASE.purchasecode ORDER BY PURCHASETABLE.purchaseslipcode, PURCHASEDETAIL.number',function(err,result1){
        if(err){
          throw err;
        } else {
          res.render('purchasesliptable',{title: '入荷伝票一覧',koumoku1:'',midasi1:'入荷伝票NO',midasi2:'精算日',midasi3:'仕入先コード',midasi4:'仕入先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'入荷数量',list: result1});
        }
      })
    } else if(req.body.shocode != ""){
      connection.query('SELECT * ,DATE_FORMAT(payoffdate,"%Y/%m/%d") AS "payoffdate" FROM (SELECT * FROM PURCHASEDETAIL WHERE productcode = "' + req.body.shocode + '") AS PURCHASEDETAIL LEFT OUTER JOIN (SELECT * FROM PURCHASETABLE WHERE payoffdate BETWEEN "' + req.body.kikan1 + '" AND "' + req.body.kikan2 + '") AS PURCHASETABLE ON PURCHASETABLE.purchaseslipcode = PURCHASEDETAIL.purchaseslipcode LEFT OUTER JOIN PURCHASE ON PURCHASETABLE.purchasecode = PURCHASE.purchasecode ORDER BY PURCHASETABLE.purchaseslipcode, PURCHASEDETAIL.number',function(err,result1){
        if(err){
          throw err;
        } else {
          res.render('purchasesliptable',{title: '入荷伝票一覧',koumoku1:'',midasi1:'入荷伝票NO',midasi2:'精算日',midasi3:'仕入先コード',midasi4:'仕入先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'入荷数量',list: result1});
        }
      })
    } else {
      connection.query('SELECT * ,DATE_FORMAT(payoffdate,"%Y/%m/%d") AS "payoffdate" FROM (SELECT * FROM PURCHASETABLE WHERE payoffdate BETWEEN "' + req.body.kikan1 + '" AND "' + req.body.kikan2 + '") AS PURCHASETABLE LEFT OUTER JOIN PURCHASEDETAIL ON PURCHASETABLE.purchaseslipcode = PURCHASEDETAIL.purchaseslipcode LEFT OUTER JOIN PURCHASE ON PURCHASETABLE.purchasecode = PURCHASE.purchasecode ORDER BY PURCHASETABLE.purchaseslipcode, PURCHASEDETAIL.number',function(err,result1){
        if(err){
          throw err;
        } else {
          res.render('purchasesliptable',{title: '入荷伝票一覧',koumoku1:'',midasi1:'入荷伝票NO',midasi2:'精算日',midasi3:'仕入先コード',midasi4:'仕入先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'入荷数量',list: result1});
        }
      })
    }
  }
})
//* 仕入伝票検索入力 *//
app.post('/purchaseslipsearch', (req, res) => {
  var employee = {purchaseslipcode:req.body.koumoku[2]}
  connection.query('SELECT *,DATE_FORMAT(purchasedate,"%Y/%m/%d") AS "purchasedate",DATE_FORMAT(payoffdate,"%Y/%m/%d") AS "payoffdate",DATE_FORMAT(wadate,"%Y/%m/%d") AS "wadate" FROM PURCHASETABLE LEFT OUTER JOIN jimu ON jimu.jimucode = PURCHASETABLE.ofcode LEFT OUTER JOIN PURCHASE ON PURCHASE.purchasecode = PURCHASETABLE.purchasecode WHERE ?',employee,function(err,result2){
    if(result2[0] == null){
      var koumoku = [hiduke,'','','',hiduke,hiduke,'','','','','','']
      var table =[];
      for(var i = 0;i < 16; i++){
        table.push(i+1,'','','','','','')
      }
      res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:table,list:jimus,list2:shos})
    } else {
      connection.query('SELECT * FROM PURCHASEDETAIL WHERE ?',employee,function(err,result3){ 
        connection.query('SELECT COUNT(*) AS cnt,SUM(amount) AS total FROM PURCHASEDETAIL WHERE ?',employee,function(err,result4){ 
          var koumoku = [result2[0].purchasedate,result2[0].orderslipcode,result2[0].purchaseslipcode,result2[0].flg,result2[0].payoffdate,result2[0].wadate,result2[0].purchasecode,result2[0].purchasename1,'',result2[0].ofcode,result2[0].remark,String(result4[0].total).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')]
          var table =[];
          for(var i = 0;i < result4[0].cnt; i++){
            table.push(i+1,result3[i].division,result3[i].productcode,result3[i].productname,String(result3[i].quantity).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'),String(result3[i].price).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'),String(result3[i].amount).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'))
          }
          var j = i
          for(var i = 0;i < 16-result4[0].cnt; i++){
            table.push(j + i + 1,'','','','','','')
          }
          res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:table,list:jimus,list2:shos,tantou:result2[0].jimuname})
        })
      })
    }
  })
})
//* 仕入伝票検索入力 *//
app.post('/purchasesearch', (req, res) => {
  var employee = {purchasecode:req.body.koumoku[6]}
  connection.query('SELECT * FROM PURCHASE WHERE ?',employee,function(err,result2){
    if(result2[0] == null){
      res.render('purchase-1',{title:'仕入伝票',koumoku:req.body.koumoku,table:req.body.table,list:jimus,list2:shos})
    } else {
      var koumoku = req.body.koumoku
      koumoku[7] = result2[0].purchasename1
      res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:req.body.table,list:jimus,list2:shos})
    }
  })
})
//* 前伝票 *//
app.post('/maepurchase', (req, res) => {
  coded += 1;
  if(purchaseslips.length-coded != "-1"){
    var employee = {purchaseslipcode:purchaseslips[purchaseslips.length-coded].purchaseslipcode}
    connection.query('SELECT *,DATE_FORMAT(purchasedate,"%Y/%m/%d") AS "purchasedate",DATE_FORMAT(payoffdate,"%Y/%m/%d") AS "payoffdate",DATE_FORMAT(wadate,"%Y/%m/%d") AS "wadate" FROM PURCHASETABLE LEFT OUTER JOIN jimu ON jimu.jimucode = PURCHASETABLE.ofcode LEFT OUTER JOIN PURCHASE ON PURCHASE.purchasecode = PURCHASETABLE.purchasecode WHERE ?',employee,function(err,result2){
      connection.query('SELECT * FROM PURCHASEDETAIL WHERE ?',employee,function(err,result3){ 
        connection.query('SELECT COUNT(*) AS cnt,SUM(amount) AS total FROM PURCHASEDETAIL WHERE ?',employee,function(err,result4){ 
          var koumoku = [result2[0].purchasedate,result2[0].orderslipcode,result2[0].purchaseslipcode,result2[0].flg,result2[0].payoffdate,result2[0].wadate,result2[0].purchasecode,result2[0].purchasename1,'',result2[0].ofcode,result2[0].remark,String(result4[0].total).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')]
          var table =[];
          for(var i = 0;i < result4[0].cnt; i++){
            table.push(i+1,result3[i].division,result3[i].productcode,result3[i].productname,String(result3[i].quantity).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'),String(result3[i].price).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'),String(result3[i].amount).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'))
          }
          var j = i
          for(var i = 0;i < 16-result4[0].cnt; i++){
             table.push(j + i + 1,'','','','','','')
          }
          res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:table,list:jimus,list2:shos,tantou:result2[0].jimuname})
        })  
      })
    }) 
  } else {
    var koumoku = [hiduke,'','','',hiduke,hiduke,'','','','','','']
    var table =[];
    for(var i = 0;i < 16; i++){
      table.push(i+1,'','','','','','')
    }
    res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:table,list:jimus,list2:shos})
    coded = 0;
  }
})
//* 後伝票 *//
app.post('/atopurchase', (req, res) => {
  coded -= 1
    if(purchaseslips.length-coded < purchaseslips.length){
      var employee = {purchaseslipcode:purchaseslips[purchaseslips.length-coded].purchaseslipcode}
      connection.query('SELECT *,DATE_FORMAT(purchasedate,"%Y/%m/%d") AS "purchasedate",DATE_FORMAT(payoffdate,"%Y/%m/%d") AS "payoffdate",DATE_FORMAT(wadate,"%Y/%m/%d") AS "wadate" FROM PURCHASETABLE LEFT OUTER JOIN jimu ON jimu.jimucode = PURCHASETABLE.ofcode LEFT OUTER JOIN PURCHASE ON PURCHASE.purchasecode = PURCHASETABLE.purchasecode WHERE ?',employee,function(err,result2){
        connection.query('SELECT * FROM PURCHASEDETAIL WHERE ?',employee,function(err,result3){ 
          connection.query('SELECT COUNT(*) AS cnt,SUM(amount) AS total FROM PURCHASEDETAIL WHERE ?',employee,function(err,result4){ 
            var koumoku = [result2[0].purchasedate,result2[0].orderslipcode,result2[0].purchaseslipcode,result2[0].flg,result2[0].payoffdate,result2[0].wadate,result2[0].purchasecode,result2[0].purchasename1,'',result2[0].ofcode,result2[0].remark,String(result4[0].total).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')]
            var table =[];
            for(var i = 0;i < result4[0].cnt; i++){
              table.push(i+1,result3[i].division,result3[i].productcode,result3[i].productname,String(result3[i].quantity).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'),String(result3[i].price).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'),String(result3[i].amount).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'))
            }
            var j = i
            for(var i = 0;i < 16-result4[0].cnt; i++){
              table.push(j + i + 1,'','','','','','')
            }
            res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:table,list:jimus,list2:shos,tantou:result2[0].jimuname})
            coded = 0;
          })
        })
      }) 
    } else {
      var koumoku = [hiduke,'','','',hiduke,hiduke,'','','','','','']
      var table =[];
      for(var i = 0;i < 16; i++){
        table.push(i+1,'','','','','','')
      }
      res.render('purchase-1',{title:'仕入伝票',koumoku:koumoku,table:table,list:jimus,list2:shos})
      coded = 0;
    }
  })
//-----------　　　仕入外国伝票　　　-----------//

app.post('/purchase2', (req, res) => {
  var koumoku = [hiduke,'','','',hiduke,hiduke,'','','','','','','','']
  res.render('purchase-2',{title:'仕入外国伝票',koumoku:koumoku,list:jimus})
})



//-----------　　　出荷伝票　　　-----------//

app.post('/purchase3', (req, res) => {
  var meisai = []
  for(var i = 0; i < 8;i++){
    re4 = ['','','']
    meisai.push(re4)
  }
  coded = 0
  res.render('purchase-3',{title: '出荷伝票', koumoku1:hiduke,koumoku2:'',koumoku3:'',koumoku4:'',koumoku5:'',koumoku6:'',list:jimus,list2:shos,list3: meisai})
})
//* 前伝票 *//
app.post('/maesyukka', (req, res) => {
  coded += 1;
  connection.query('SELECT * FROM SYUKKA',(err,syukkas) => {
    if(err) throw err
    connection.query('SELECT * FROM SHOHIN',(err4,shos) => {
      if(err4) throw err4
      if(syukkas.length-coded != "-1"){
        var re3 = syukkas[syukkas.length-coded]
        var syukka = 'YYYY/MM/DD';
        syukka = syukka.replace(/YYYY/g,re3.syukkabi.getFullYear())
        syukka = syukka.replace(/MM/g,('0' + (re3.syukkabi.getMonth()+1)).slice(-2));
        syukka = syukka.replace(/DD/g,('0' + re3.syukkabi.getDate()).slice(-2));
        connection.query('SELECT * FROM tokuisaki WHERE 得意先コード = "' + re3.tokuisakicode + '"',function(err1,tokuisakimei){
          if(err1) throw err1
          connection.query('SELECT * FROM jimu WHERE jimucode = "' + re3.tantoucode + '"',function(err2,tantoumei){
            if(err2) throw err2
            connection.query('SELECT * FROM SYUKKAMEISAI WHERE syukkacode = "' + re3.syukkacode + '"',function(err3,result4){ 
              if(err3) throw err3
              var meisai = []
              var sho = []
              for(var i = 0; i < 8; i++){
                if(result4[i] != null){
                  sho.push(result4[i].shohincode)
                } else {
                  sho.push('')
                }
              }
              var head = shos.length
              var meisaindex
              var flg = 0;
              for(var j = 0;j < 8; j++){
                flg = 0;
                if(sho[j] != ''){
                  for(var i = 0;flg == 0,i < head; i++){
                    meisaindex = shos[i].shohincode.indexOf(sho[j])
                    if(meisaindex == 0){
                      flg = 1;
                      meisai.push([sho[j],shos[i].shohinname,result4[j].quantity])
                    }
                  }
                } 
                if(flg == 0){
                  meisai.push(['','',''])
                }
              }
              res.render('purchase-3',{title: '出荷伝票', koumoku1:syukka,koumoku2:re3.syukkacode,koumoku3:re3.tokuisakicode,koumoku4:re3.tantoucode,koumoku5:re3.bikou,koumoku6:tokuisakimei[0].得意先名1,koumoku7:tantoumei[0].jimuname,list:jimus,list2:shos,list3: meisai})
            })
          })
        })
      } else {
        var meisai = []
        for(var i = 0; i < 8;i++){
            re4 = ['','','']
            meisai.push(re4)
        }
        res.render('purchase-3',{title: '出荷伝票', koumoku1:hiduke,koumoku2:'',koumoku3:'',koumoku4:'',koumoku5:'',koumoku6:'',koumoku7:'',list:jimus,list2:shos,list3: meisai})
        coded = 0
      } 
    })
  })
})
//* 後伝票 *//
app.post('/atosyukka', (req, res) => {
  coded -= 1;
  if(syukkas.length-coded < syukkas.length){
    var re3 = syukkas[syukkas.length-coded]
    var syukka = 'YYYY/MM/DD';
    syukka = syukka.replace(/YYYY/g,re3.syukkabi.getFullYear())
    syukka = syukka.replace(/MM/g,('0' + (re3.syukkabi.getMonth()+1)).slice(-2));
    syukka = syukka.replace(/DD/g,('0' + re3.syukkabi.getDate()).slice(-2));
    connection.query('SELECT * FROM tokuisaki WHERE tokuisakicode = "' + re3.tokuisakicode + '"',function(err,tokuisakimei){
      connection.query('SELECT * FROM jimu WHERE jimucode = "' + re3.tantoucode + '"',function(err,tantoumei){
        connection.query('SELECT * FROM SYUKKAMEISAI WHERE syukkacode = "' + re3.syukkacode + '"',function(err,result4){ 
          var meisai = []
          var sho = []
          for(var i = 0; i < 8; i++){
            if(result4[i] != null){
              sho.push(result4[i].shohincode)
            } else {
              sho.push('')
            }
          }
          var head = shos.length
          var meisaindex
          var flg = 0;
          for(var j = 0;j < 8; j++){
            flg = 0;
            if(sho[j] != ''){
              for(var i = 0;flg == 0,i < head; i++){
                meisaindex = shos[i].shohincode.indexOf(sho[j])
                if(meisaindex == 0){
                  flg = 1;
                  meisai.push([sho[j],shos[i].shohinname,result4[j].quantity])
                }
              }
            } 
            if(flg == 0){
              meisai.push(['','',''])
            }
          }
          res.render('purchase-3',{title: '出荷伝票', koumoku1:syukka,koumoku2:re3.syukkacode,koumoku3:re3.tokuisakicode,koumoku4:re3.tantoucode,koumoku5:re3.bikou,koumoku6:tokuisakimei[0].tokuisakiname,koumoku7:tantoumei[0].jimuname,list:jimus,list2:shos,list3: meisai})
        })
      })
    })
  } else {
    var meisai = []
    for(var i = 0; i < 8;i++){
        re4 = ['','','']
        meisai.push(re4)
    }
    res.render('purchase-3',{title: '出荷伝票', koumoku1:hiduke,koumoku2:'',koumoku3:'',koumoku4:'',koumoku5:'',koumoku6:'',koumoku7:'',list:jimus,list2:shos,list3: meisai})
    coded = 0
  } 
})
//* 出荷伝票入力・修正 *//
app.post('/syukka1', (req, res) => {
  var code = {syukkacode:req.body.koumoku2}
  connection.query('SELECT syukkacode FROM SYUKKA WHERE ?',code,function(err,result){
    if(err){
      throw err;
    } else if(result == ""){
      var time = req.body.koumoku1
      var year = time.substr(3, 1);
      if(0 == time.substr(5,1)){
        var month = time.substr(6,1);
      } else {
        var month = time.substr(5,2);
        switch (month){
          case '10': 
            month = 'X';
            break;
          case '11':
            month = 'Y';
            break;
          case '12':
            month = 'Z';
            break;
          default:
            break;
        }
      }
      var saiban = 'G' + year + month;
      connection.query('SELECT * FROM SAIBAN WHERE saibancode = ?',saiban,function(err1,result1){
        if(err1){
          throw err1;
        } else if(result1 == ""){
          connection.query('INSERT INTO SAIBAN SET saibancode = ? ,count = 1',saiban,function(err2){
            if(err2){
              throw err2;
            }
          })
        } else if(result1[0].saibancode == saiban){
          connection.query('UPDATE SAIBAN SET count = count + 1 WHERE saibancode = ?',saiban,function(err2){
            if(err2){
              throw err2;
            }
          })
        }
        connection.query('SELECT count FROM SAIBAN WHERE saibancode = ?',saiban,function(err3,result3){
          if(err3){
            throw err3;
          } else {
            var syukkacode = saiban + '-' + ('00000' + result3[0].count).slice(-5);
            var employee ={syukkacode:syukkacode, syukkabi:req.body.koumoku1, tokuisakicode:req.body.koumoku3, flg:'20', tantoucode:req.body.koumoku4, bikou:req.body.koumoku5}
            connection.query('INSERT INTO SYUKKA SET ? ,additional = NOW()',employee,function(err4){
              if(err4){
                throw err4;
              } else {
                if(req.body.table4 != ""){
                  var employee1 ={syukkacode:syukkacode, number:req.body.table1, shohincode:req.body.table2,quantity:req.body.table4}
                  connection.query('INSERT INTO SYUKKAMEISAI SET ?',employee1,function(err5){
                    if(err5){
                      throw err5;
                    } else if(req.body.table8 != ""){
                      var employee2 ={syukkacode:syukkacode, number:req.body.table5, shohincode:req.body.table6,quantity:req.body.table8}
                      connection.query('INSERT INTO SYUKKAMEISAI SET ?',employee2,function(err5){
                        if(err5){
                          throw err5;
                        } else if(req.body.table12 != ""){
                          var employee2 ={syukkacode:syukkacode, number:req.body.table9, shohincode:req.body.table10,quantity:req.body.table12}
                          connection.query('INSERT INTO SYUKKAMEISAI SET ?',employee2,function(err5){
                            if(err5){
                              throw err5;
                            } else if(req.body.table16 != ""){
                              var employee2 ={syukkacode:syukkacode, number:req.body.table13, shohincode:req.body.table14,quantity:req.body.table16}
                              connection.query('INSERT INTO SYUKKAMEISAI SET ?',employee2,function(err5){
                                if(err5){
                                  throw err5;
                                } else if(req.body.table20 != ""){
                                  var employee2 ={syukkacode:syukkacode, number:req.body.table17, shohincode:req.body.table18,quantity:req.body.table20}
                                  connection.query('INSERT INTO SYUKKAMEISAI SET ?',employee2,function(err5){
                                    if(err5){
                                      throw err5;
                                    } else if(req.body.table24 != ""){
                                      var employee2 ={syukkacode:syukkacode, number:req.body.table21, shohincode:req.body.table22,quantity:req.body.table24}
                                      connection.query('INSERT INTO SYUKKAMEISAI SET ?',employee2,function(err5){
                                        if(err5){
                                          throw err5;
                                        } else if(req.body.table28 != ""){
                                          var employee2 ={syukkacode:syukkacode, number:req.body.table25, shohincode:req.body.table26,quantity:req.body.table28}
                                          connection.query('INSERT INTO SYUKKAMEISAI SET ?',employee2,function(err5){
                                            if(err5){
                                              throw err5;
                                            } else if(req.body.table32 != ""){
                                              var employee2 ={syukkacode:syukkacode, number:req.body.table29, shohincode:req.body.table30,quantity:req.body.table32}
                                              connection.query('INSERT INTO SYUKKAMEISAI SET ?',employee2,function(err5){
                                                if(err5){
                                                  throw err5;
                }})}})}})}})}})}})}})}})}
                console.log('入力しました');
              }
            })
          }
        })
      })
    } else {
      if(result[0].syukkacode == req.body.koumoku2){
        var employee2 ={syukkacode:req.body.koumoku2, syukkabi:req.body.koumoku1, tokuisakicode:req.body.koumoku3, flg:'20', tantoucode:req.body.koumoku4, bikou:req.body.koumoku5}
        connection.query('UPDATE SYUKKA SET ? ,updated = NOW() WHERE syukkacode = "' + result[0].syukkacode + '"',employee2,function(err1){
          if(err1){
            throw err1;
          } else {
            if(req.body.table4 != ""){
              var employee3 ={syukkacode:req.body.koumoku2, shohincode:req.body.table2, quantity:req.body.table4}
              connection.query('UPDATE SYUKKAMEISAI SET ? WHERE syukkacode = "' + result[0].syukkacode + '" AND number = "' + req.body.table1 + '"',employee3,function(er1){
                if(req.body.table8 != ""){
                var employee4 ={syukkacode:req.body.koumoku2, shohincode:req.body.table6, quantity:req.body.table8}
                connection.query('UPDATE SYUKKAMEISAI SET ? WHERE syukkacode = "' + result[0].syukkacode + '" AND number = "' + req.body.table5 + '"',employee4,function(er2){
                  if(req.body.table12 != ""){
                    var employee5 ={syukkacode:req.body.koumoku2, shohincode:req.body.table10, quantity:req.body.table12}
                    connection.query('UPDATE SYUKKAMEISAI SET ? WHERE syukkacode = "' + result[0].syukkacode + '" AND number = "' + req.body.table9 + '"',employee5,function(er3){
                      if(req.body.table16 != ""){
                      var employee6 ={syukkacode:req.body.koumoku2, shohincode:req.body.table14, quantity:req.body.table16}
                      connection.query('UPDATE SYUKKAMEISAI SET ? WHERE syukkacode = "' + result[0].syukkacode + '" AND number = "' + req.body.table13 + '"',employee6,function(er4){
                        if(req.body.table20 != ""){
                          var employee7 ={syukkacode:req.body.koumoku2, shohincode:req.body.table18, quantity:req.body.table20}
                          connection.query('UPDATE SYUKKAMEISAI SET ? WHERE syukkacode = "' + result[0].syukkacode + '" AND number = "' + req.body.table17 + '"',employee7,function(er5){
                            if(req.body.table24 != ""){
                              var employee8 ={syukkacode:req.body.koumoku2, shohincode:req.body.table22, quantity:req.body.table24}
                              connection.query('UPDATE SYUKKAMEISAI SET ? WHERE syukkacode = "' + result[0].syukkacode + '" AND number = "' + req.body.table21 + '"',employee8,function(er6){
                                if(req.body.table28 != ""){
                                  var employee9 ={syukkacode:req.body.koumoku2, shohincode:req.body.table26, quantity:req.body.table28}
                                  connection.query('UPDATE SYUKKAMEISAI SET ? WHERE syukkacode = "' + result[0].syukkacode + '" AND number = "' + req.body.table25 + '"',employee9,function(er7){
                                    if(req.body.table32 != ""){
                                      var employee10 ={syukkacode:req.body.koumoku2, shohincode:req.body.table30, quantity:req.body.table32}
                                      connection.query('UPDATE SYUKKAMEISAI SET ? WHERE syukkacode = "' + result[0].syukkacode + '" AND number = "' + req.body.table29 + '"',employee10,function(er8){
            })}})}})}})}})}})}})}})}
          console.log('修正しました');
          }
        })
      }
    }
    var meisai = []
    for(var i = 0; i < 8;i++){
      meisai.push(['','',''])
    }
    var syukka = 'YYYY/MM/DD';
    var today = new Date();
    syukka = syukka.replace(/YYYY/g,today.getFullYear())
    syukka = syukka.replace(/MM/g,('0' + (today.getMonth()+1)).slice(-2));
    syukka = syukka.replace(/DD/g,('0' + today.getDate()).slice(-2));
    res.render('purchase-3',{title: '出荷伝票',koumoku1:syukka,koumoku2:'',koumoku3:'',koumoku4:'',koumoku5:'',koumoku6:'',koumoku7:'',list:jimus,list2:shos,list3: meisai});
  })
});
//* 出荷伝票削除 *//
app.post('/syukka3', (req,res) => {
  var employee = {syukkacode:req.body.koumoku2}
  connection.query('DELETE FROM SYUKKA WHERE ?',employee,function(err){
    if(err) throw err
      connection.query('DELETE FROM SYUKKAMEISAI WHERE ?',employee,function(err1){
        if(err1) throw err1
          console.log('削除しました')
      })
  })
  var meisai = []
  for(var i = 0; i < 8;i++){
    meisai.push(['','',''])
  }
  res.render('purchase-3',{title: '出荷伝票',koumoku1:hiduke,koumoku2:'',koumoku3:'',koumoku4:'',koumoku5:'',koumoku6:'',koumoku7:'',list:jimus,list2:shos,list3: meisai});
})
//* 出荷伝票一覧 *//
app.get('/syukkatable', (req, res) => {
  connection.query('SELECT * ,DATE_FORMAT(syukkabi,"%Y/%m/%d") AS "syukkadate" FROM SYUKKA LEFT OUTER JOIN SYUKKAMEISAI ON SYUKKA.syukkacode = SYUKKAMEISAI.syukkacode LEFT OUTER JOIN SHOHIN ON SYUKKAMEISAI.shohincode = SHOHIN.shohincode LEFT OUTER JOIN tokuisaki ON SYUKKA.tokuisakicode = tokuisaki.得意先コード LEFT OUTER JOIN jimu ON SYUKKA.tantoucode = jimu.jimucode ORDER BY SYUKKAMEISAI.syukkacode ,SYUKKAMEISAI.shohincode',function(err,result1){
    if(err){
      throw err;
    } else {
      res.render('syukkatable',{title: '出荷伝票一覧',koumoku1:'',midasi1:'出荷伝票コード',midasi2:'出荷日',midasi3:'得意先コード',midasi4:'得意先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'数量',midasi8:'事務コード',midasi9:'事務名',midasi10:'フラグ',list: result1});
    }
  })
});
//* 出荷伝票一覧内検索 *//
app.post('/syukkatable1', (req,res) => {
  if(req.body.kikan1 != "" && req.body.kikan2 != ""){
    if(req.body.tokucode != ""){
      connection.query('SELECT * ,DATE_FORMAT(syukkabi,"%Y/%m/%d") AS "syukkadate" FROM (SELECT * FROM SYUKKA WHERE SYUKKA.syukkabi BETWEEN "' + req.body.kikan1 + '" AND "' + req.body.kikan2 + '" AND SYUKKA.tokuisakicode = "' + req.body.tokucode + '") AS SYUKKA LEFT OUTER JOIN SYUKKAMEISAI ON SYUKKA.syukkacode = SYUKKAMEISAI.syukkacode LEFT OUTER JOIN SHOHIN ON SYUKKAMEISAI.shohincode = SHOHIN.shohincode LEFT OUTER JOIN tokuisaki ON SYUKKA.tokuisakicode = tokuisaki.tokuisakicode LEFT OUTER JOIN jimu ON SYUKKA.tantoucode = jimu.jimucode ORDER BY SYUKKAMEISAI.syukkacode ,SYUKKAMEISAI.shohincode',function(err,result1){
        if(err){
          throw err;
        } else {
          res.render('syukkatable',{title: '出荷伝票一覧',koumoku1:'',midasi1:'出荷伝票コード',midasi2:'出荷日',midasi3:'得意先コード',midasi4:'得意先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'数量',midasi8:'事務コード',midasi9:'事務名',midasi10:'フラグ',list: result1});
        }
      })
    } else if(req.body.shocode != ""){
      connection.query('SELECT * ,DATE_FORMAT(syukkabi,"%Y/%m/%d") AS "syukkadate" FROM (SELECT * FROM SYUKKAMEISAI WHERE SYUKKAMEISAI.shohincode = "' + req.body.shocode + '") AS SYUKKAMEISAI LEFT OUTER JOIN (SELECT * FROM SYUKKA WHERE SYUKKA.syukkabi BETWEEN "' + req.body.kikan1 + '" AND "' + req.body.kikan2 + '") AS SYUKKA ON SYUKKA.syukkacode = SYUKKAMEISAI.syukkacode LEFT OUTER JOIN SHOHIN ON SYUKKAMEISAI.shohincode = SHOHIN.shohincode LEFT OUTER JOIN tokuisaki ON SYUKKA.tokuisakicode = tokuisaki.tokuisakicode LEFT OUTER JOIN jimu ON SYUKKA.tantoucode = jimu.jimucode ORDER BY SYUKKAMEISAI.syukkacode ,SYUKKAMEISAI.shohincode',function(err,result1){
        if(err){
          throw err;
        } else {
          res.render('syukkatable',{title: '出荷伝票一覧',koumoku1:'',midasi1:'出荷伝票コード',midasi2:'出荷日',midasi3:'得意先コード',midasi4:'得意先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'数量',midasi8:'事務コード',midasi9:'事務名',midasi10:'フラグ',list: result1});
        }
      })
    } else {
      connection.query('SELECT * ,DATE_FORMAT(syukkabi,"%Y/%m/%d") AS "syukkadate" FROM (SELECT * FROM SYUKKA WHERE SYUKKA.syukkabi BETWEEN "' + req.body.kikan1 + '" AND "' + req.body.kikan2 + '") AS SYUKKA LEFT OUTER JOIN SYUKKAMEISAI ON SYUKKA.syukkacode = SYUKKAMEISAI.syukkacode LEFT OUTER JOIN SHOHIN ON SYUKKAMEISAI.shohincode = SHOHIN.shohincode LEFT OUTER JOIN tokuisaki ON SYUKKA.tokuisakicode = tokuisaki.tokuisakicode LEFT OUTER JOIN jimu ON SYUKKA.tantoucode = jimu.jimucode ORDER BY SYUKKAMEISAI.syukkacode ,SYUKKAMEISAI.shohincode',function(err,result1){
        if(err){
          throw err;
        } else {
          res.render('syukkatable',{title: '出荷伝票一覧',koumoku1:'',midasi1:'出荷伝票コード',midasi2:'出荷日',midasi3:'得意先コード',midasi4:'得意先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'数量',midasi8:'事務コード',midasi9:'事務名',midasi10:'フラグ',list: result1});
        }
      })
    }
  //* 商品コードのみ検索　*//
  } else if(req.body.shocode != ""){
    connection.query('SELECT * ,DATE_FORMAT(syukkabi,"%Y/%m/%d") AS "syukkadate" FROM (SELECT * FROM SYUKKAMEISAI WHERE SYUKKAMEISAI.shohincode = "' + req.body.shocode + '") AS SYUKKAMEISAI LEFT OUTER JOIN SYUKKA ON SYUKKA.syukkacode = SYUKKAMEISAI.syukkacode LEFT OUTER JOIN SHOHIN ON SYUKKAMEISAI.shohincode = SHOHIN.shohincode LEFT OUTER JOIN tokuisaki ON SYUKKA.tokuisakicode = tokuisaki.tokuisakicode LEFT OUTER JOIN jimu ON SYUKKA.tantoucode = jimu.jimucode ORDER BY SYUKKAMEISAI.syukkacode ,SYUKKAMEISAI.shohincode',function(err,result1){
      if(err){
        throw err;
      } else {
        res.render('syukkatable',{title: '出荷伝票一覧',koumoku1:'',midasi1:'出荷伝票コード',midasi2:'出荷日',midasi3:'得意先コード',midasi4:'得意先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'数量',midasi8:'事務コード',midasi9:'事務名',midasi10:'フラグ',list: result1});
      }
    })
  //* 得意先コードのみ検索 *//
  } else { 
    connection.query('SELECT * ,DATE_FORMAT(syukkabi,"%Y/%m/%d") AS "syukkadate" FROM (SELECT * FROM SYUKKA WHERE SYUKKA.tokuisakicode = "' + req.body.tokucode + '") AS SYUKKA LEFT OUTER JOIN SYUKKAMEISAI ON SYUKKA.syukkacode = SYUKKAMEISAI.syukkacode LEFT OUTER JOIN SHOHIN ON SYUKKAMEISAI.shohincode = SHOHIN.shohincode LEFT OUTER JOIN tokuisaki ON SYUKKA.tokuisakicode = tokuisaki.tokuisakicode LEFT OUTER JOIN jimu ON SYUKKA.tantoucode = jimu.jimucode ORDER BY SYUKKAMEISAI.syukkacode ,SYUKKAMEISAI.shohincode',function(err,result1){
      if(err){
        throw err;
      } else {
        res.render('syukkatable',{title: '出荷伝票一覧',koumoku1:'',midasi1:'出荷伝票コード',midasi2:'出荷日',midasi3:'得意先コード',midasi4:'得意先名',midasi5:'商品コード',midasi6:'商品名',midasi7:'数量',midasi8:'事務コード',midasi9:'事務名',midasi10:'フラグ',list: result1});
      }
    })
  }

})
//* 出荷伝票検索入力 *//
app.post('/syukkatable2', (req,res) => {
      var employee = {syukkacode:req.body.koumoku2}
      connection.query('SELECT * FROM SYUKKA WHERE ?',employee,function(err,result3){
        if(result3[0] == null){
          var meisai = []
          for(var i = 0; i < 8;i++){
            re4 = ['','','']
            meisai.push(re4)
          }
          res.render('purchase-3',{title: '出荷伝票', koumoku1:hiduke,koumoku2:'',koumoku3:'',koumoku4:'',koumoku5:'',koumoku6:'',list2: shos,list: jimus,list3: meisai})
        } else {
          connection.query('SELECT * FROM SYUKKAMEISAI WHERE ?',employee,function(err,result4){ 
            var syukka = 'YYYY/MM/DD';
            syukka = syukka.replace(/YYYY/g,result3[0].syukkabi.getFullYear())
            syukka = syukka.replace(/MM/g,('0' + (result3[0].syukkabi.getMonth()+1)).slice(-2));
            syukka = syukka.replace(/DD/g,('0' + result3[0].syukkabi.getDate()).slice(-2));
            connection.query('SELECT * FROM tokuisaki WHERE tokuisakicode = "' + result3[0].tokuisakicode + '"',function(err,tokuisakimei){
              connection.query('SELECT * FROM jimu WHERE jimucode = "' + result3[0].tantoucode + '"',function(err,tantoumei){
                var meisai = []
                var sho = []
                for(var i = 0; i < 8; i++){
                  if(result4[i] != null){
                    sho.push(result4[i].shohincode)
                  } else {
                    sho.push('')
                  }
                }
                var head = shos.length
                var meisaindex
                var flg = 0;
                for(var j = 0;j < 8; j++){
                  flg = 0;
                  if(sho[j] != ''){
                    for(var i = 0;flg == 0,i < head; i++){
                      meisaindex = shos[i].shohincode.indexOf(sho[j])
                      if(meisaindex == 0){
                        flg = 1;
                        meisai.push([sho[j],shos[i].shohinname,result4[j].quantity])
                      }
                    }
                  } 
                  if(flg == 0){
                    meisai.push(['','',''])
                  }
                }
                res.render('purchase-3',{title: '出荷伝票', koumoku1:syukka,koumoku2:req.body.koumoku2,koumoku3:result3[0].tokuisakicode,koumoku4:result3[0].tantoucode,koumoku5:result3[0].bikou,koumoku6:tokuisakimei[0].tokuisakiname,koumoku7:tantoumei[0].jimuname,list:jimus,list2:shos,list3: meisai})
              })
            })
          })
        }
      })
    })

//-----------　　　発注伝票　　　-----------//

app.post('/purchase4',(req,res) => {
    var koumoku = [hiduke,'','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']
    var table =[]
    for(var i = 0;i < 8; i++){
      table.push(i+1,'','','','','','','','','','','','','','','','','','')
    }
    coded = 0
  res.render('purchase-4',{title: '発注伝票',koumoku:koumoku,table:table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:1})
})
//* 発注伝票入力・修正 *//
app.post('/orderslip1', (req, res) => {
  var code = {orderslipcode:req.body.koumoku[1]}
  connection.query('SELECT * FROM ORDERTABLE WHERE ?',code,function(err,result){
    if(err){
      throw err;
    } else if(result == ""){
      var time = req.body.koumoku[0]
      var year = time.substr(3, 1);
      if(0 == time.substr(5,1)){
        var month = time.substr(6,1);
      } else {
        var month = time.substr(5,2);
        switch (month){
          case '10': 
            month = 'X';
            break;
          case '11':
            month = 'Y';
            break;
          case '12':
            month = 'Z';
            break;
          default:
            break;
        }
      }
      var saiban = 'B' + year + month;
      connection.query('SELECT * FROM SAIBAN WHERE saibancode = ?',saiban,function(err1,result1){
        if(err1){
          throw err1;
        } else if(result1 == ""){
          connection.query('INSERT INTO SAIBAN SET saibancode = ? ,count = 1',saiban,function(err2){
            if(err2){
              throw err2;
            }
          })
        } else if(result1[0].saibancode == saiban){
          connection.query('UPDATE SAIBAN SET count = count + 1 WHERE saibancode = ?',saiban,function(err2){
            if(err2){
              throw err2;
            }
          })
        }
        connection.query('SELECT count FROM SAIBAN WHERE saibancode = ?',saiban,function(err3,result3){
          if(err3){
            throw err3;
          } else {
            var orderslipcode = saiban + '-' + ('00000' + result3[0].count).slice(-5);
            var employee = {
              orderslipcode:orderslipcode,
              orderdate:req.body.koumoku[0],
              suppliercode:req.body.koumoku[6],
              remark:req.body.koumoku[9],
              deliverycode:req.body.koumoku[8],
              customercode:req.body.koumoku[3],
              sippercode:req.body.koumoku[10],
              jimucode:req.body.koumoku[13],
              staffcode:req.body.koumoku[14],
              summarycode:req.body.koumoku[15],
              flg:'20',
              staff:req.body.koumoku[12],
              contact:req.body.koumoku[16],
              ordercode:'20',
              estimatesNo:''
            }
            connection.query('INSERT INTO ORDERTABLE SET ? , additionaltime = NOW()',employee,(err4) => {
              if(err4) throw err4;
              var insertstr = ''
              for(var i = 0;req.body.table[i*19+12] != "";i++){
                if(i != 0){
                  insertstr += ','
                }
                insertstr +='("' + orderslipcode + 
                            '","' + req.body.table[i*19] +
                            '","' + req.body.table[i*19+1] +
                            '","' + req.body.table[i*19+2] +
                            '","' + String(req.body.table[i*19+5].replace(/,/g, '')) +
                            '","' + String(req.body.table[i*19+4].replace(/,/g, '')) +
                            '","' + String(req.body.table[i*19+6].replace(/,/g, '')) +
                            '","' + req.body.table[i*19+12] +
                            '","' + String(req.body.table[i*19+13].replace(/,/g, '')) +
                            '","' + req.body.table[i*19+14] +
                            '","' + req.body.table[i*19+3] +
                            '","' + req.body.table[i*19+15] +
                            '","' + req.body.table[i*19+16] +
                            '","' + req.body.table[i*19+18] +
                            '","' + req.body.table[i*19+10] +
                            '","' + 20 + 
                            '","' + String(req.body.table[i*19+7].replace(/,/g, '')) +
                            '","' + String(req.body.table[i*19+8].replace(/,/g, '')) +
                            '","' + req.body.table[i*19+17] +
                            '")'
              }
              connection.query('INSERT INTO ORDERDETAIL(orderslipcode, number, division, productcode, quantity, purchaseprice, saleprice, productname, amount, deliverydateplans, itemname, departuredate, arrivaldate, arrivalquantity, placecode, flg, rate, logistics, deliverydate) VALUES' + insertstr,(err5) => {
                if(err5) throw err5
              })
            }) 
          }
        })
      })
    } else if(result[0].orderslipcode == req.body.koumoku[1]){
      console.log
      var employee = {
        orderdate:req.body.koumoku[0],
        suppliercode:req.body.koumoku[6],
        remark:req.body.koumoku[9],
        deliverycode:req.body.koumoku[8],
        customercode:req.body.koumoku[3],
        sippercode:req.body.koumoku[10],
        jimucode:req.body.koumoku[13],
        staffcode:req.body.koumoku[14],
        summarycode:req.body.koumoku[15],
        flg:req.body.koumoku[5],
        staff:req.body.koumoku[12],
        contact:req.body.koumoku[16],
        ordercode:req.body.koumoku[5],
        estimatesNo:''
      }
      connection.query('UPDATE ORDERTABLE SET ? , updatetime = NOW() WHERE orderslipcode = "' + result[0].orderslipcode + '"',employee,(err4) => {
        if(err4) throw err4
        connection.query('SELECT COUNT(*) AS cnt FROM ORDERDETAIL WHERE orderslipcode = "' + result[0].orderslipcode + '"',(err5,result5) => {
          if(err5) throw err5
          var cnt = 0;
          for(var i = 0; req.body.table[i*19+12] != ""; i++){
              cnt++
          }
          if(result5[0].cnt == cnt){
            var pur1 = "division = CASE number "
            var pur2 = "productcode = CASE number "
            var pur3 = "productname = CASE number "
            var pur4 = "quantity = CASE number "
            var pur5 = "purchaseprice = CASE number "
            var pur6 = "amount = CASE number "
            var pur7 = "saleprice = CASE number "
            var pur8 = "deliverydateplans = CASE number "
            var pur9 = "itemname = CASE number "
            var pur10 = "departuredate = CASE number "
            var pur11 = "arrivaldate = CASE number "
            var pur12 = "arrivalquantity = CASE number "
            var pur13 = "placecode = CASE number "
            var pur14 = "flg = CASE number "
            var pur15 = "rate = CASE number "
            var pur16 = "logistics = CASE number "
            var pur17 = "deliverydate = CASE number "
            for(var i = 0;cnt-1 >= i;i++){
              pur1 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+1] + '" '
              pur2 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+2] + '" '
              pur3 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+12] + '" '
              pur4 += 'WHEN ' + (i+1) + ' THEN "' + String(req.body.table[i*19+5].replace(/,/g, '')) + '" '
              pur5 += 'WHEN ' + (i+1) + ' THEN "' + String(req.body.table[i*19+4].replace(/,/g, '')) + '" '
              pur6 += 'WHEN ' + (i+1) + ' THEN "' + String(req.body.table[i*19+13].replace(/,/g, '')) + '" '
              pur7 += 'WHEN ' + (i+1) + ' THEN "' + String(req.body.table[i*19+6].replace(/,/g, '')) + '" '
              pur8 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+14] + '" '
              pur9 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+3] + '" '
              pur10 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+15] + '" '
              pur11 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+16] + '" '
              pur12 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+18] + '" '
              pur13 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+10] + '" '
              pur14 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+11] + '" '
              pur15 += 'WHEN ' + (i+1) + ' THEN "' + String(req.body.table[i*19+7].replace(/,/g, '')) + '" '
              pur16 += 'WHEN ' + (i+1) + ' THEN "' + String(req.body.table[i*19+8].replace(/,/g, '')) + '" '
              pur17 += 'WHEN ' + (i+1) + ' THEN "' + req.body.table[i*19+17] + '" '
            }
              pur1 += 'END'
              pur2 += 'END'
              pur3 += 'END'
              pur4 += 'END'
              pur5 += 'END'
              pur6 += 'END'
              pur7 += 'END'
              pur8 += 'END'
              pur9 += 'END'
              pur10 += 'END'
              pur11 += 'END'
              pur12 += 'END'
              pur13 += 'END'
              pur14 += 'END'
              pur15 += 'END'
              pur16 += 'END'
              pur17 += 'END'
              connection.query('UPDATE ORDERDETAIL SET ' + pur1 + ', ' + pur2 + ', ' + pur3 + ', ' + pur4 + ', ' + pur5 + ', ' + pur6 + ', ' + pur7 + ', ' + pur8 + ', ' + pur9 + ', ' + pur10 + ', ' + pur11 + ', ' + pur12 + ', ' + pur13 + ', ' + pur14 + ', ' + pur15 + ', ' + pur16 + ', ' + pur17 +  ' WHERE orderslipcode = "' + result[0].orderslipcode + '"',(err6) => {
                if(err6) throw err6
              })
          } else if(result5[0].cnt < cnt || result5[0].cnt > cnt){
            var insertstr = ""
            connection.query('DELETE FROM ORDERDETAIL WHERE orderslipcode = "' + req.body.koumoku[1] + '"', (err6) => {
              if(err6) throw err6
              for(var i = 0;req.body.table[i*19+12] != "";i++){
                if(i != 0){
                  insertstr += ','
                }
                insertstr +='("' + req.body.koumoku[1] + 
                            '","' + req.body.table[i*19] +
                            '","' + req.body.table[i*19+1] +
                            '","' + req.body.table[i*19+2] +
                            '","' + String(req.body.table[i*19+5].replace(/,/g, '')) +
                            '","' + String(req.body.table[i*19+4].replace(/,/g, '')) +
                            '","' + String(req.body.table[i*19+6].replace(/,/g, '')) +
                            '","' + req.body.table[i*19+12] +
                            '","' + String(req.body.table[i*19+13].replace(/,/g, '')) +
                            '","' + req.body.table[i*19+14] +
                            '","' + req.body.table[i*19+3] +
                            '","' + req.body.table[i*19+15] +
                            '","' + req.body.table[i*19+16] +
                            '","' + req.body.table[i*19+18] +
                            '","' + req.body.table[i*19+10] +
                            '","' + 20 + 
                            '","' + String(req.body.table[i*19+7].replace(/,/g, '')) +
                            '","' + String(req.body.table[i*19+8].replace(/,/g, '')) +
                            '","' + req.body.table[i*19+17] +
                            '")'
              }
              connection.query('INSERT INTO ORDERDETAIL(orderslipcode, number, division, productcode, quantity, purchaseprice, saleprice, productname, amount, deliverydateplans, itemname, departuredate, arrivaldate, arrivalquantity, placecode, flg, rate, logistics, deliverydate) VALUES' + insertstr,(err7) => {
                if(err7) throw err7
              })
            })
          } else {
            console.log('none')
          }
          if(err5) throw err5
        })
        
      })
    }
    var koumoku = [hiduke,'','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']
    var table =[]
    for(var i = 0;i < 8; i++){
      table.push(i+1,'','','','','','','','','','','','','','','','','','')
    }
    coded = 0
  res.render('purchase-4',{title: '発注伝票',koumoku:koumoku,table:table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:1})
  })
})
//* 発注伝票削除 *//
app.post('/orderslip2', (req, res) => {
  connection.query('DELETE FROM ORDERTABLE WHERE orderslipcode = "' + req.body.koumoku[1] + '"', (err1) => {
    if(err1) throw err1
    connection.query('DELETE FROM ORDERDETAIL WHERE orderslipcode = "' + req.body.koumoku[1] + '"', (err2) => {
      if(err2) throw err2
    })
  })
  var koumoku = [hiduke,'','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']
  var table =[]
  for(var i = 0;i < 8; i++){
    table.push(i+1,'','','','','','','','','','','','','','','','','','')
  }
  coded = 0
  res.render('purchase-4',{title: '発注伝票',koumoku:koumoku,table:table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:1})
})
//* 発注伝票一覧 *//

//* 前伝票 *//


//* 発注伝票内得意先検索 *//
app.post('/purchase4-toku',(req,res) => {
  connection.query('SELECT * FROM tokuisaki WHERE 得意先コード = "' + req.body.koumoku[3] + '"',(err,toku) => {
    if(toku == ""){
      res.render('purchase-4',{title: '発注伝票',koumoku:req.body.koumoku,table:req.body.table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:3})
    } else {
      var koumoku = req.body.koumoku
      koumoku[4] = toku[0].得意先名1
      res.render('purchase-4',{title: '発注伝票',koumoku:koumoku,table:req.body.table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:6})
    }
  })
})
//* 発注伝票内仕入先検索 *//
app.post('/purchase4-pur',(req,res) => {
  connection.query('SELECT * FROM PURCHASE WHERE purchasecode = "' + req.body.koumoku[6] + '"',(err,pur) => {
    if(pur == ""){
      res.render('purchase-4',{title: '発注伝票',koumoku:req.body.koumoku,table:req.body.table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:6})
    } else {
      connection.query('SELECT * FROM FPURCHASE WHERE purchasecode = "' + req.body.koumoku[6] + '"',(err1,fpur) => {
        if(fpur == ""){
          var koumoku = req.body.koumoku
          koumoku[7] = pur[0].purchasename1
          koumoku[19] = ''
          koumoku[23] = ''
          var table = req.body.table
          table[6] = ''
          table[7] = ''
          table[8] = ''
          table[9] = ''
          table[10] = ''
          table[15] = ''
          table[16] = ''
          table[17] = ''
          table[18] = ''
          res.render('purchase-4',{title: '発注伝票',koumoku:koumoku,table:req.body.table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:8})
        } else {
          var koumoku = req.body.koumoku
          koumoku[7] = fpur[0].purchasename1
          koumoku[19] = '1'
          koumoku[23] = fpur[0].citycode
          res.render('purchase-4',{title: '発注伝票',koumoku:koumoku,table:req.body.table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:8})
        }
      })
      
    }
  })
})
//* 発注伝票内直送先検索 *//
app.post('/purchase4-dir',(req,res) => {
  connection.query('SELECT * FROM DIRECTDELIVERY WHERE directdeliverycode = "' + req.body.koumoku[8] + '"',(err,dir) => {
    if(dir == ""){
      res.render('purchase-4',{title: '発注伝票',koumoku:req.body.koumoku,table:req.body.table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:8})
    } else {
      var koumoku = req.body.koumoku
      koumoku[9] = dir[0].directdeliveryname
      res.render('purchase-4',{title: '発注伝票',koumoku:koumoku,table:req.body.table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:10})
    }
  })
})
//* 発注伝票内荷送人検索 *//
app.post('/purchase4-ship',(req,res) => {
  connection.query('SELECT * FROM SHIPPER WHERE shippercode = "' + req.body.koumoku[10] + '"',(err,ship) => {
    if(ship == ""){
      res.render('purchase-4',{title: '発注伝票',koumoku:req.body.koumoku,table:req.body.table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:10})
    } else {
      var koumoku = req.body.koumoku
      koumoku[11] = ship[0].shippername
      res.render('purchase-4',{title: '発注伝票',koumoku:koumoku,table:req.body.table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:12})
    }
  })
})
//* 発注伝票内商品名検索 *//
app.post('/pur4-product',(req,res) => {
  var x = 0
  var flg = 0
  for(var i = 0;i < 8 && flg == 0;i++){
    if(req.body.table[2+x] != ''){
      x += 19
    } else {
      flg = 1
      var y = 2 + (i - 1) * 19
    }
  }
  var table = req.body.table
  connection.query('SELECT * FROM SHOHIN WHERE shohincode = "' + req.body.table[y] + '"',(err,result) => {
    if(err) throw err
    if(result != ''){
      connection.query('SELECT * FROM PRODUCTITEM WHERE productcode = "' + req.body.table[y] + '"',(err1,result1) => {
        if(err1) throw err1
        table[y+10] = result[0].shohinname
        table[y+1] = result1[0].itemNo
      })
    } else {
      table[y+10] = ''
      table[y+1] = ''
    }
  if(req.body.koumoku[19] == '1'){
    connection.query('SELECT * FROM RATE ORDER BY registerdate DESC',(err2,result2) => {
      if(err2) throw err2
      if(result2 != ''){
        table[y+5] = result2[0].companyrate
      } else {
        table[y+5] = ''
      }
      connection.query('SELECT * FROM PURCHASEPRICE WHERE productcode = "' + req.body.table[y] + '"',(err3,result3) => {
        if(err3) throw err3
        if(result3 != ''){
          table[y+6] = result3[0].logisticscostsrate
        } else {
          table[y+6] = ''
        }
        if(req.body.koumoku[6] == '2430009'){
          table[y+2] = result3[0].foreigncost1
          table[y+7] = result3[0].salescost1
        } else {
          table[y+2] = '.00'
          table[y+7] = '.00'
        }
        res.render('purchase-4',{title: '発注伝票',koumoku:req.body.koumoku,table:table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:y+12})
      })
    })
  } else {
    connection.query('SELECT * FROM PURCHASEPRICE WHERE productcode = "' + req.body.table[y] + '"',(err4,pris) => {
      if(err4) throw err4
      if(pris != ''){
        table[y+2] = pris[0].salescost1
      } else {
        table[y+2] = ''
      }
      res.render('purchase-4',{title: '発注伝票',koumoku:req.body.koumoku,table:table,list:jimus,list3:sales,list4:pursums,list5:locs,jun:y+13})
    })
  }
})
})

app.listen(8080);