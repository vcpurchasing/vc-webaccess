function dbl(a,b){
    window.opener.document.getElementById("productcode").value = a
    if(window.opener.document.getElementsByTagName('title')[0].innerText == '管理商品分類'){
        window.opener.document.program.action = '/masuta6-pro'
        window.opener.document.program.submit();
    } else if(window.opener.document.getElementsByTagName('title')[0].innerText == '商品縦横'){
      window.opener.document.program.action = '/masuta8-pro'
      window.opener.document.program.submit();
    } else if(window.opener.document.getElementsByTagName('title')[0].innerText == '商品入り数登録'){
      window.opener.document.program.action = '/masuta9-pro'
      window.opener.document.program.submit();
    } else if(window.opener.document.getElementsByTagName('title')[0].innerText == 'Description'){
      window.opener.document.program.action = '/masuta10-pro'
      window.opener.document.program.submit();
    } else if(window.opener.document.getElementsByTagName('title')[0].innerText == '荷送人登録'){
      window.opener.document.getElementById('koumoku3').value = document.getElementById(b).nextElementSibling.nextElementSibling.innerText
      window.opener.document.getElementById('koumoku4').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.innerText
    } else {
        window.opener.document.getElementById('productname').value = document.getElementById(b).nextElementSibling.innerText
    }
    window.close();
  }
function plus(e){
  document.getElementById('tablecnt').value = e.target.value;
  document.program.action = '/producttable'
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