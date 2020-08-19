function dbl(a,b){
    window.opener.document.getElementById("koumoku3").value = a
    window.opener.document.program.action = '/purchaseslipsearch'
    window.opener.document.program.submit()
    window.close();
  }
document.getElementById("sub").onclick = function sub(){
  document.program.submit();
}

window.onload=function(){
  var purchase = 'YYYY/MM/DD';
  var today = new Date();
  purchase = purchase.replace(/YYYY/g,today.getFullYear())
  purchase = purchase.replace(/MM/g,('0' + (today.getMonth()+1)).slice(-2));
  purchase = purchase.replace(/DD/g,('0' + today.getDate()).slice(-2));
  document.getElementById("koumoku1").value = purchase;
  document.getElementById("koumoku2").value = purchase;
  document.getElementById("koumoku3").addEventListener('keydown',function(){
    if(event.keyCode == '32' || event.keyCode == '229'){
      event.preventDefault();
      window.open('/tokuisakitable','得意先一覧', 'width=1290px,height=760px');
    }
  })
}