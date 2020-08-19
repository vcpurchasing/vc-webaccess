document.getElementById("ku1").onclick = function ku1(){
    document.program.action = '/purchasingcost1';
}
document.getElementById("ku3").onclick = function ku3(){
    document.program.action = '/purchasingcost2';
}
document.getElementById("itiran").onclick = function itiran(){
  window.open('/tyokusoutable','直送先一覧', 'width=1200px,height=730px');
}
document.getElementById("sub").onclick = function sub(){
    var result = confirm("送信しますか？")
    if(result){
      document.program.submit();
    }
}
window.onload=function(){
    for(var i = 0; i < document.getElementById("constitution").options.length;i++){
      if(document.getElementById("constitutions").value == document.getElementById("constitution").options[i].innerText){
        document.getElementById('constitution').options[i].selected = true;
        break;
      }
    } 
    for(var i = 0; i < document.getElementById("producingarea").options.length;i++){
        if(document.getElementById("producingareas").value == document.getElementById("producingarea").options[i].innerText){
          document.getElementById('producingarea').options[i].selected = true;
          break;
        }
      } 
    document.getElementById("productcode").addEventListener('keydown',function(){
        if(event.keyCode == '32'){
          event.preventDefault();
          window.open('/producttable','商品先一覧', 'width=800px,height=750px');
        } else if(event.keyCode == '13'){
          event.preventDefault();
          document.program.action = '/masuta19-pro'
          document.program.submit();
        }
      })
  document.getElementById("purchasecode").addEventListener('keydown',function(){
    if(event.keyCode == '32'){
      event.preventDefault();
      window.open('/purchasetable','仕入先一覧', 'width=1280px,height=830px');
    } else if(event.keyCode == '13'){
      event.preventDefault();
      document.program.action = '/masuta19-pur'
      document.program.submit();
    }
  })
}

document.getElementsByName("koumoku[]")[document.getElementById('jun').value].focus()