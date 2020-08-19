function dbl(a,b){
    window.opener.document.getElementById("koumoku2").value = a
    window.opener.document.program.action = '/syukkatable2'
    window.opener.document.program.submit()
    window.close();
  }
document.getElementById("sub").onclick = function sub(){
  document.program.submit();
}

window.onload=function(){
  var syukka = 'YYYY/MM/DD';
  var today = new Date();
  syukka = syukka.replace(/YYYY/g,today.getFullYear())
  syukka = syukka.replace(/MM/g,('0' + (today.getMonth()+1)).slice(-2));
  syukka = syukka.replace(/DD/g,('0' + today.getDate()).slice(-2));
  document.getElementById("koumoku1").value = syukka;
  document.getElementById("koumoku2").value = syukka;
  document.getElementById("koumoku3").addEventListener('keydown',function(){
    if(event.keyCode == '32' || event.keyCode == '229'){
      event.preventDefault();
      window.open('/tokuisakitable','得意先一覧', 'width=1290px,height=760px');
    }
  })
}