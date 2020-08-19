function dbl(a,b){
  window.opener.document.getElementById("koumoku1").value = a
  window.opener.document.getElementById('koumoku2').value = document.getElementById(b).nextElementSibling.innerText
  window.opener.document.getElementById('koumoku3').value = document.getElementById(b).nextElementSibling.nextElementSibling.innerText
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
