document.getElementById("ku1").onclick = function ku1(){
  document.program.action = '/quantity1';
}
document.getElementById("ku3").onclick = function ku3(){
  document.program.action = '/quantity2';
}
document.getElementById("itiran").onclick = function itiran(){
  window.open('/quantitytable','一覧', 'width=900px,height=810px');
}
document.getElementById("sub").onclick = function sub(){
    var result = confirm("送信しますか？")
    if(result){
      document.program.submit();
    }
}
window.onload=function(){
  document.getElementById("productcode").addEventListener('keydown',function(){
      if(event.keyCode == '32'){
        event.preventDefault();
        window.open('/producttable','一覧', 'width=800px,height=730px');
      } else if(event.keyCode == '13'){
        event.preventDefault();
        document.program.action = '/masuta9-pro'
        document.program.submit();
      }
    }) 
}
document.getElementsByName("koumoku[]")[document.getElementById('jun').value].focus()
document.getElementsByName("koumoku[]")[document.getElementById('jun').value].select()