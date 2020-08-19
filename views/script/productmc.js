document.getElementById("ku1").onclick = function ku1(){
    document.program.action = '/productmc1';
}
document.getElementById("ku3").onclick = function ku3(){
    document.program.action = '/productmc2';
}
document.getElementById("itiran").onclick = function itiran(){
    window.open('/productmctable','一覧', 'width=1550px,height=910px');
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
          document.program.action = '/masuta6-pro'
          document.program.submit();
        }
      }) 
 document.getElementById("customercode").addEventListener('keydown',function(){
    if(event.keyCode == '32'){
      event.preventDefault();
      window.open('/tokuisakitable','得意先一覧', 'width=1290px,height=760px');
    } else if(event.keyCode == '13'){
      event.preventDefault();
      document.program.action = '/masuta6-cus'
      document.program.submit();
    }
  }) 
}
document.getElementsByName("koumoku[]")[document.getElementById('jun').value].focus()
document.getElementsByName("koumoku[]")[document.getElementById('jun').value].select()