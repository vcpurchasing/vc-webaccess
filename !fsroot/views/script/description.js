document.getElementById("ku1").onclick = function ku1(){
  document.program.action = '/description1';
}
document.getElementById("ku3").onclick = function ku3(){
  document.program.action = '/description2';
}
document.getElementById("itiran").onclick = function itiran(){
  window.open('/descriptiontable','一覧', 'width=900px,height=1000px');
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
        window.open('/producttable','一覧', 'width=800px,height=970px');
      } else if(event.keyCode == '13'){
        event.preventDefault();
        document.program.action = '/masuta10-pro'
        document.program.submit();
      }
    }) 
}
document.getElementsByName("koumoku[]")[document.getElementById('jun').value].focus()
document.getElementsByName("koumoku[]")[document.getElementById('jun').value].select()