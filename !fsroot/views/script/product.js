function dbl(a,b){
    window.opener.document.getElementById("productcode").value = a
    window.opener.document.getElementById('productname').value = document.getElementById(b).nextElementSibling.innerText
    if(window.opener.document.getElementsByTagName('title')[0].innerText == '荷送人登録'){
      window.opener.document.getElementById('koumoku3').value = document.getElementById(b).nextElementSibling.nextElementSibling.innerText
      window.opener.document.getElementById('koumoku4').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.innerText
    }
    window.close();
}
window.onload = function(){
    document.getElementById('koumoku').focus()
    document.getElementById('koumoku').addEventListener('keydown',function(){
      if(event.keyCode == '13'){
        event.preventDefault();
        document.program.submit();
      }
    })
  }
document.getElementById('change').onclick = function change(){
    var ku = document.getElementById('koumoku').name
    if(ku == 'koumoku1'){
      document.getElementById('koumoku').setAttribute('name', 'koumoku2');
      document.program.action = '/producttable2'
      document.getElementById('search').innerHTML = "商品コード検索　："
    } else if(ku == 'koumoku2'){
      document.getElementById('koumoku').setAttribute('name', 'koumoku1');
      document.program.action = '/producttable1'
      document.getElementById('search').innerHTML = "商品名検索　　　："
    }
  };