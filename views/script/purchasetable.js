function dbl(a,b){
  window.opener.document.getElementById('purchasecode').value = a
  if(window.opener.document.getElementsByTagName('title')[0].innerText == '発注伝票'){
    window.opener.document.program.action = '/purchase4-pur'
    window.opener.document.program.submit();
  } else {
    window.opener.document.getElementById('purchasename').value = document.getElementById(b).nextElementSibling.innerText
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
