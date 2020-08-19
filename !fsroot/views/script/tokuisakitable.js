function dbl(a,b){
    window.opener.document.getElementById("customercode").value = a
    window.opener.document.getElementById("customername").value = document.getElementById(b).nextElementSibling.innerText
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