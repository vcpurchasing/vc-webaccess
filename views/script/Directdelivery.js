document.getElementById("ku1").onclick = function ku1(){
    document.program.action = '/tyokusou1';
}
document.getElementById("ku3").onclick = function ku3(){
    document.program.action = '/tyokusou2';
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
  document.getElementById("tyokusoucode").addEventListener('keydown',function(){
    if(event.keyCode == '32'){
      event.preventDefault();
      window.open('/tyokusoutable','直送先一覧', 'width=1200px,height=730px');
    } else if(event.keyCode == '13'){
      event.preventDefault();
      document.program.action = '/tyokusousearch'
      document.program.submit();
    }
  })
}