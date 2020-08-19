document.getElementById("ku1").onclick = function ku1(){
  document.program.action = '/purchaseslip1';
}
document.getElementById("ku3").onclick = function ku3(){
  document.program.action = '/purchaseslip2';
}
document.getElementById("sub").onclick = function sub(){
  var result = confirm("送信しますか？")
  if(result){
    document.program.submit();
  }
}
document.getElementById("mae").onclick = function mae(){
  document.program.action = '/maepurchase';
  document.program.submit();
}
document.getElementById("ato").onclick = function mae(){
  document.program.action = '/atopurchase';
  document.program.submit();
}
document.getElementById("copy").onclick = function copy(){
  document.getElementById("koumoku3").value = ""
  document.getElementById("koumoku4").value = ""
}
function kubun(a,e){
  if(a == '6'){
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[2].getElementsByTagName('input')[0].value = '1000020'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = 'No.'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].focus()
  } else if(a == '7'){
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[2].getElementsByTagName('input')[0].value = '1000003'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = '消費税'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = '0'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value = '0'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[6].getElementsByTagName('input')[0].value = String(Number(document.getElementById("koumoku11").value.replace(/,/g, '')) * 0.1).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    document.getElementById("koumoku11").value = String(Number(document.getElementById("koumoku11").value.replace(/,/g, '')) * 0.1 + Number(document.getElementById("koumoku11").value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[0].getElementsByTagName('input')[0].focus()
  } else if(a == ''){
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[2].getElementsByTagName('input')[0].value = ''
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = ''
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = ''
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value = ''
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[6].getElementsByTagName('input')[0].value = ''
  } else {
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[2].getElementsByTagName('input')[0].focus();
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = '0'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value = '0'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[6].getElementsByTagName('input')[0].value = '0'
  }
}
window.onload=function(){
  for(var i = 0; i < document.getElementById("jimulist").options.length;i++){
    if(document.getElementById("tantou").value == document.getElementById("jimulist").options[i].innerText){
      document.getElementById('jimulist').options[i].selected = true;
      break;
    }
  } 
  document.getElementById("koumoku3").addEventListener('keydown',function(){
    if(event.keyCode == '32'){
      event.preventDefault();
      window.open('/purchasesliptable','仕入伝票一覧', 'width=1410px,height=980px');
    } else if(event.keyCode == '13'){
      event.preventDefault();
      document.program.action = '/purchaseslipsearch'
      document.program.submit();
    }
  }) 
  document.getElementById("purchasecode").addEventListener('keydown',function(){
    if(event.keyCode == '32'){
      event.preventDefault();
      window.open('/purchasetable','仕入先一覧', 'width=1280px,height=830px');
    } else if(event.keyCode == '13'){
      event.preventDefault();
      document.program.action = '/purchasesearch'
      document.program.submit();
    }
  }) 
  document.program.addEventListener('keydown',function(){
    if(event.keyCode == '9'){
      var id = event.target.id
      document.getElementById(id).select();
    }
  })
}