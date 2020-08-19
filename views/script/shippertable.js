function dbl(a,b){
    window.opener.document.getElementById("shippercode").value = a
    window.opener.document.getElementById('shippername').value = document.getElementById(b).nextElementSibling.innerText
    if(window.opener.document.getElementsByTagName('title')[0].innerText == '荷送人登録'){
      window.opener.document.getElementById('koumoku3').value = document.getElementById(b).nextElementSibling.nextElementSibling.innerText
      window.opener.document.getElementById('koumoku4').value = document.getElementById(b).nextElementSibling.nextElementSibling.nextElementSibling.innerText
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