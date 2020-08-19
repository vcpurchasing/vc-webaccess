document.getElementById("ku1").onclick = function ku1(){
  document.program.action = '/orderslip1';
}
document.getElementById("ku3").onclick = function ku3(){
  document.program.action = '/orderslip2';
}
document.getElementById("sub").onclick = function sub(){
  var result = confirm("送信しますか？")
  if(result){
    document.program.submit();
  }
}
window.onload=function(){
  for(var i = 0; i < document.getElementById("jimulist").options.length;i++){
    if(document.getElementById("jimu").value == document.getElementById("jimulist").options[i].innerText){
      document.getElementById('jimulist').options[i].selected = true;
      break;
    }
  } 
  for(var i = 0; i < document.getElementById("salelist").options.length;i++){
    if(document.getElementById("sale").value == document.getElementById("salelist").options[i].innerText){
      document.getElementById('salelist').options[i].selected = true;
      break;
    }
  } 
  for(var i = 0; i < document.getElementById("pursumlist").options.length;i++){
    if(document.getElementById("pursum").value == document.getElementById("pursumlist").options[i].innerText){
      document.getElementById('pursumlist').options[i].selected = true;
      break;
    }
  } 
  for(var i = 0; i < document.getElementById("orderlist").options.length;i++){
    if(document.getElementById("order").value == document.getElementById("orderlist").options[i].innerText){
      document.getElementById('orderlist').options[i].selected = true;
      break;
    }
  } 
  for(var j = 1; j < 9;j++){
    for(var i = 0; i < document.getElementById("loclist"+j).options.length;i++){
      if(document.getElementById("loc"+j).value == document.getElementById("loclist"+j).options[i].innerText){
        document.getElementById("loclist"+j).options[i].selected = true;
        break;
      }
    } 
  }
  if(document.getElementById("foreign").value == '1'){
    for(var i = 0; i < document.getElementsByClassName('td2').length; i++){  
      if(document.getElementsByClassName("td2")[i].getElementsByTagName('select')[i] = 'undifined'){
        document.getElementsByClassName("td2")[i].getElementsByTagName('input')[0].tabIndex = '';
      } else {
        document.getElementsByClassName("td2")[i].getElementsByTagName('select')[i].tabIndex = '';
      }
      document.getElementsByClassName("td2")[i].style = 'background-color:white'
      document.getElementsByClassName("td2")[i].getElementsByTagName('input')[0].readOnly = false;
    }
    for(var i = 0;i < document.getElementsByTagName('table')[0].getElementsByTagName('select').length;i++){
      document.getElementsByTagName('table')[0].getElementsByTagName('select')[i].style = 'height:20px'
    }
  }
  document.getElementById("customercode").addEventListener('keydown',function(){
      if(event.keyCode == '32'){
        event.preventDefault();
        document.getElementsByName(event.target.name)[6].focus()
        window.open('/tokuisakitable','得意先一覧', 'width=1290px,height=730px');
      } else if(event.keyCode == '13'){
        event.preventDefault();
        document.program.action = '/purchase4-toku'
        document.program.submit();
      }
  }) 
  document.getElementById("purchasecode").addEventListener('keydown',function(){
      if(event.keyCode == '32'){
        event.preventDefault();
        document.getElementsByName(event.target.name)[8].focus()
        window.open('/purchasetable','仕入先一覧', 'width=1280px,height=830px');
      } else if(event.keyCode == '13'){
        event.preventDefault();
        document.program.action = '/purchase4-pur'
        document.program.submit();
      }
  }) 
  document.getElementById("tyokusoucode").addEventListener('keydown',function(){
    if(event.keyCode == '32'){
      event.preventDefault();
      document.getElementsByName(event.target.name)[10].focus()
      window.open('/tyokusoutable','直送先一覧', 'width=1350px,height=975px');
    } else if(event.keyCode == '13'){
      event.preventDefault();
        document.program.action = '/purchase4-dir'
        document.program.submit();
      }
  }) 
  document.getElementById("shippercode").addEventListener('keydown',function(){
      if(event.keyCode == '32'){
        event.preventDefault();
        document.getElementsByName(event.target.name)[12].focus()
        window.open('/shippertable','荷送人一覧', 'width=1300px,height=730px');
      } else if(event.keyCode == '13'){
        event.preventDefault();
        document.program.action = '/purchase4-ship'
        document.program.submit();
      }
  })
  if(document.getElementById('jun').value > 12){
    document.getElementsByName("table[]")[document.getElementById('jun').value-10].focus()
  } else {
    document.getElementsByName("koumoku[]")[document.getElementById('jun').value].focus()
  }
}
function products(event){ //* 商品名・アイテム名探索 *//
  if(event.keyCode == '13'){
    event.preventDefault();
    document.program.action = '/pur4-product'
    document.program.submit();
  }
} 
function DAY(e){  //*　仕入先ごとの日付処理 *//
  var hiduke = new Date(e)
  var day = hiduke.getDay();
  //* 香港 *//
  if(document.getElementById('citycode').value == '10'){
    if(day != 1){
      alert('ピック日は月曜日です')
    }
  //* 上海 *//
  } else if(document.getElementById('citycode').value == '20'){
    if(day != 3){
      alert('ピック日は水曜日です')
    }
  //* その他 *//
  } else if(document.getElementById('citycode').value == '40' || document.getElementById('citycode').value == '30' || document.getElementById('citycode').value == '50'){
    if(day != 4){
      alert('ピック日は木曜日です')
    }
  }
}
function DAY2(e){ 
  if(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value == ""){
    var day = document.getElementById('citycode').value
    var pick = new Date(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[2].getElementsByTagName('input')[0].value)
    //* 香港　*//
    if(day == '10'){
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate()))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 15))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 16))
    //* 上海 *//
    } else if(day == '20'){
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 3))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 8))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 9))
    //* 威海 *//
    } else if(day == '30'){
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 2))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 6))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 7))
    //* アモイ *//
    } else if(day == '40'){
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 1))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 8))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 9))
    //* 大連 *//
    } else if(day == '50'){
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 2))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 9))
      document.getElementsByClassName('tr')[e].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value = datetr(pick.setDate(pick.getDate() + 10))
    }
  } else {
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[3].getElementsByTagName('input')[0].value = ''
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[4].getElementsByTagName('input')[0].value = ''
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value = ''
  }
}
function datetr(x){ //* 日付型変換 *//
  var hiduke = 'YYYY/MM/DD'
  var today = new Date(x)
  hiduke = hiduke.replace(/YYYY/g,today.getFullYear())
  hiduke = hiduke.replace(/MM/g,('0' + (today.getMonth()+1)).slice(-2))
  hiduke = hiduke.replace(/DD/g,('0' + today.getDate()).slice(-2))
  return hiduke
}