document.getElementById("ku1").onclick = function ku1(){
    document.program.action = '/VaH1';
}
document.getElementById("ku3").onclick = function ku3(){
    document.program.action = '/VaH2';
}
document.getElementById("itiran").onclick = function itiran(){
    window.open('/VaHtable','一覧', 'width=1150px,height=780px');
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
          document.program.action = '/masuta8-pro'
          document.program.submit();
        }
      }) 
}
document.getElementsByName("koumoku[]")[document.getElementById('jun').value].focus()