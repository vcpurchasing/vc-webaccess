document.getElementById("ku1").onclick = function ku1(){
    document.program.action = '/productitem1';
}
document.getElementById("ku3").onclick = function ku3(){
    document.program.action = '/productitem2';
}
document.getElementById("itiran").onclick = function itiran(){
    window.open('/productitemtable','商品アイテム一覧', 'width=800px,height=730px');
  }
document.getElementById("sub").onclick = function sub(){
      var result = confirm("送信しますか？")
      if(result){
        document.program.submit();
      }
  }
window.onload=function(){
    document.getElementById("koumoku1").addEventListener('keydown',function(){
        if(event.keyCode == '32'){
          event.preventDefault();
          window.open('/productitemtable','商品アイテム一覧', 'width=800px,height=730px');
        } else if(event.keyCode == '13'){
          event.preventDefault();
          document.program.action = '/productitemsearch'
          document.program.submit();
        }
      }) 
}