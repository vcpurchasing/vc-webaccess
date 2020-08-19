document.getElementById("ku1").onclick = function ku1(){
    document.program.action = '/shipper1';
}
document.getElementById("ku3").onclick = function ku3(){
    document.program.action = '/shipper2';
}
document.getElementById("itiran").onclick = function itiran(){
    window.open('/shippertable','荷送人一覧', 'width=1300px,height=730px');
  }
document.getElementById("sub").onclick = function sub(){
      var result = confirm("送信しますか？")
      if(result){
        document.program.submit();
      }
  }
window.onload=function(){
    document.getElementById("shippercode").addEventListener('keydown',function(){
        if(event.keyCode == '32'){
          event.preventDefault();
          window.open('/shippertable','荷送人一覧', 'width=1300px,height=730px');
        } else if(event.keyCode == '13'){
          event.preventDefault();
          document.program.action = '/shippersearch'
          document.program.submit();
        }
      }) 
}