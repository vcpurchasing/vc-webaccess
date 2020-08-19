function dbl(a,b){
    window.opener.document.getElementById("productcode").value = a
    window.opener.document.getElementById('productname').value = document.getElementById(b).nextElementSibling.innerText
    window.opener.document.getElementById('koumoku3').value = document.getElementById(b).nextElementSibling.nextElementSibling.innerText
    window.opener.document.getElementById('koumoku4').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.innerText
    window.opener.document.getElementById('koumoku5').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText
    window.opener.document.getElementById('koumoku6').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText
    window.opener.document.getElementById('koumoku7').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText
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