function dbl(a,b){
    window.opener.document.getElementById("tyokusoucode").value = a
    window.opener.document.getElementById('tyokusouname').value = document.getElementById(b).nextElementSibling.innerText
    if(window.opener.document.getElementsByTagName('title')[0].innerText == '直送先登録'){
      window.opener.document.getElementById('koumoku9').value = document.getElementById(b).nextElementSibling.nextElementSibling.innerText
      window.opener.document.getElementById('koumoku4').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.innerText
      window.opener.document.getElementById('koumoku5').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText
      window.opener.document.getElementById('koumoku6').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText
      window.opener.document.getElementById('koumoku7').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText
      window.opener.document.getElementById('koumoku8').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText
      window.opener.document.getElementById('koumoku10').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText
    }
    window.close();
}
function plus(e){
  document.getElementById('tablecnt').value = e.target.value;
  document.program.action = '/tyokusoutable'
  document.program.submit();
}
window.onload = function(){
  document.getElementById('koumoku').addEventListener('keydown',function(){
    if(event.keyCode == '13'){
      event.preventDefault();
      document.program.submit();
    }
  })
  if(document.getElementById('last').value == document.getElementById('t3').value){
    document.getElementById('t3').style = 'display:none'
    document.getElementById('t4').style = 'display:none'
    document.getElementById('t5').style = 'display:none'
  } else if(1 == document.getElementById('t3').value){
    document.getElementById('t1').style = 'display:none'
    document.getElementById('t2').style = 'display:none'
    document.getElementById('t3').style = 'display:none'
    document.getElementById('t4').style = 'margin-left:50px;width:30px'
  } else if(2 == document.getElementById('t3').value){
    document.getElementById('t1').style = 'display:none'
    document.getElementById('t2').style = 'display:none'
    document.getElementById('t3').style = 'margin-left:50px;width:30px'
  } else if(3 == document.getElementById('t3').value){
    document.getElementById('t1').style = 'display:none'
    document.getElementById('t2').style = 'margin-left:50px;width:30px'
  } else if((Number(document.getElementById('last').value)-1) == document.getElementById('t3').value){
    document.getElementById('t4').style = 'display:none'
    document.getElementById('t5').style = 'display:none'
  } else if((Number(document.getElementById('last').value)-2) == document.getElementById('t3').value){
    document.getElementById('t5').style = 'display:none'
  } else if(document.getElementById('tablecnt').value == 'none'){
    document.getElementById('last').style = 'display:none'
    document.getElementById('top').style = 'display:none'
    document.getElementById('t1').style = 'display:none'
    document.getElementById('t2').style = 'display:none'
    document.getElementById('t3').style = 'display:none'
    document.getElementById('t4').style = 'display:none'
    document.getElementById('t5').style = 'display:none'
  }
}