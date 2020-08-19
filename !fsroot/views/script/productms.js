document.getElementById("ku1").onclick = function ku1(){
    document.program.action = '/productms1';
}
document.getElementById("ku3").onclick = function ku3(){
    document.program.action = '/productms2';
}
document.getElementById("itiran").onclick = function itiran(){
    window.open('/','一覧', 'width=800px,height=730px');
  }
document.getElementById("sub").onclick = function sub(){
      var result = confirm("送信しますか？")
      if(result){
        document.program.submit();
      }
  }
window.onload=function(){
  for(var i = 0; i < document.getElementById("jimulist").options.length;i++){
    if(document.getElementById("tantou").value == document.getElementById("jimulist").options[i].innerText){
      document.getElementById('jimulist').options[i].selected = true;
      break;
    }
  } 
  document.getElementById("productcode").addEventListener('keydown',function(){
    if(event.keyCode == '32'){
      event.preventDefault();
      window.open('/productmstable','一覧', 'width=800px,height=730px');
    } else if(event.keyCode == '13'){
      event.preventDefault();
      document.program.action = '/masuta7-pro'
      document.program.submit();
    }
  }) 
}
document.getElementsByName("koumoku[]")[document.getElementById('jun').value].focus()