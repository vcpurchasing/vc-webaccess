document.getElementById("top").onclick = function top(){
    document.program.action = '/list';
    document.program.submit();
}
document.getElementById("masuta1").onclick = function masuta1(){
    document.program.action = '/masuta1';
    document.program.submit();
};
document.getElementById("masuta6").onclick = function masuta1(){
  document.program.action = '/masuta6';
  document.program.submit();
};
document.getElementById("masuta7").onclick = function masuta1(){
  document.program.action = '/masuta7';
  document.program.submit();
};
document.getElementById("masuta8").onclick = function masuta1(){
  document.program.action = '/masuta8';
  document.program.submit();
};
document.getElementById("masuta9").onclick = function masuta1(){
  document.program.action = '/masuta9';
  document.program.submit();
};
document.getElementById("masuta10").onclick = function masuta1(){
  document.program.action = '/masuta10';
  document.program.submit();
};
document.getElementById("masuta11").onclick = function masuta11(){
    document.program.action = '/masuta11';
    document.program.submit();
};
document.getElementById("masuta15").onclick = function masuta15(){
    document.program.action = '/masuta15';
    document.program.submit();
};
document.getElementById("masuta16").onclick = function masuta11(){
    document.program.action = '/masuta16';
    document.program.submit();
};
document.getElementById("masuta19").onclick = function masuta11(){
  document.program.action = '/masuta19';
  document.program.submit();
};
document.getElementById("masuta20").onclick = function masuta11(){
  document.program.action = '/masuta20';
  document.program.submit();
};
document.getElementById("Purchase1").onclick = function purchase1(){
    document.program.action = '/purchase1';
    document.program.submit();
}
document.getElementById("Purchase2").onclick = function purchase2(){
  document.program.action = '/purchase2';
  document.program.submit();
}
document.getElementById("Purchase3").onclick = function purchase3(){
    document.program.action = '/purchase3';
    document.program.submit();
}
document.getElementById("Purchase4").onclick = function purchase3(){
    document.program.action = '/purchase4';
    document.program.submit();
}
//setTimeout(Timeout, 1000 * 60,'GET');
function pluscol(e,col,firstrow,lastrow){
  var k = 0;
  for(var j = 1;j < col; j++){
    if(document.getElementsByClassName('tr')[j].getElementsByTagName('td')[lastrow].getElementsByTagName('input')[0].value != ''){
      k = j
    }
  }
  if(e >= k+1){
  } else {
    for(var h = k; h >= e;h--){
      for(var i = firstrow;i < lastrow + 1;i++){
        document.getElementsByClassName('tr')[h+1].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = document.getElementsByClassName('tr')[h].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value;
        document.getElementsByClassName('tr')[h].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = ''
      }
    }
  }
}
function copycol(e,col,firstrow,lastrow){
  var k = 0;
  for(var j = 1;j < col; j++){
    if(document.getElementsByClassName('tr')[j].getElementsByTagName('td')[lastrow].getElementsByTagName('input')[0].value != ''){
      k = j
    }
  }
  if(e >= k+1){
  } else {
    for(var h = k; h >= e;h--){
      for(var i = firstrow;i < lastrow + 1;i++){
        document.getElementsByClassName('tr')[h+1].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = document.getElementsByClassName('tr')[h].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value;
      }
    }
  }
}
function copycol(e,col,firstrow,lastrow,sumid,sumcol){
  var k = 0;
  for(var j = 1;j < col; j++){
    if(document.getElementsByClassName('tr')[j].getElementsByTagName('td')[lastrow].getElementsByTagName('input')[0].value != ''){
      k = j
    }
  }
  if(e >= k+1){
  } else {
    document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) + Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    for(var h = k; h >= e;h--){
      for(var i = firstrow;i < lastrow + 1;i++){
        document.getElementsByClassName('tr')[h+1].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = document.getElementsByClassName('tr')[h].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value;
      }
    }
  }
}
function deletecol(e,col,firstrow,lastrow){
  var k = 0;
  for(var j = 1;j < col; j++){
    if(document.getElementsByClassName('tr')[j].getElementsByTagName('td')[lastrow].getElementsByTagName('input')[0].value != ''){
      k = j
    }
  }
  if(e >= k+1){
  } else {
    for(var h = e; h <= k;h++){
      for(var i = firstrow;i < lastrow + 1;i++){
        document.getElementsByClassName('tr')[h].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = document.getElementsByClassName('tr')[h+1].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value;
        document.getElementsByClassName('tr')[h+1].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = ''
      }
    }
  }
}
function deletecol(e,col,firstrow,lastrow,sumid,sumcol){
  var k = 0;
  for(var j = 1;j < col; j++){
    if(document.getElementsByClassName('tr')[j].getElementsByTagName('td')[lastrow].getElementsByTagName('input')[0].value != ''){
      k = j
    }
  }
  if(e >= k+1){
  } else {
    document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) - Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    for(var h = e; h <= k;h++){
      for(var i = firstrow;i < lastrow + 1;i++){
        document.getElementsByClassName('tr')[h].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = document.getElementsByClassName('tr')[h+1].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value;
        document.getElementsByClassName('tr')[h+1].getElementsByTagName('td')[i].getElementsByTagName('input')[0].value = ''
      }
    }
  }
}
function numts(num,id){
  document.getElementById(id).value = String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
}
function sums(e,quancol,pricecol,sumcol,sumid){
  var totalmae = Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))
  var sum = String(Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[quancol].getElementsByTagName('input')[0].value.replace(/,/g, '')) * Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[pricecol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  document.getElementsByClassName('tr')[e].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value = sum
  if(document.getElementById(sumid).value == ''){
    document.getElementById(sumid).value = '0'
  } else if(document.getElementById(sumid).value == '0'){
    if(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, '') == '0'){
      document.getElementById(sumid).value = '0'
    } else {
      document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) + Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    }
  } else {
    document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) - totalmae).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) + Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  }
}
function sums2(e,quancol,pricecol,sumcol,sumid,thiss){
  if(thiss.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/)){
    var totalmae = Number(document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))
    var sum = String(Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[quancol].getElementsByTagName('input')[0].value.replace(/,/g, '')) * Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[pricecol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value = sum
    if(document.getElementById(sumid).value == ''){
      document.getElementById(sumid).value = '0'
    } else if(document.getElementById(sumid).value == '0'){
      if(document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, '') == '0'){
        document.getElementById(sumid).value = '0'
      } else {
        document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) + Number(document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
      }
    } else {
      document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) - totalmae).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
      document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) + Number(document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    }  
  } else {
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[quancol].getElementsByTagName('input')[0].value=""
  }
}
function sums3(e,quancol,pricecol,sumcol,sumid,thiss){
  if(thiss.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/)){
    var totalmae = Number(document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))
    var sum = String(Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[quancol].getElementsByTagName('input')[0].value.replace(/,/g, '')) * Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[pricecol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value = sum
    if(document.getElementById(sumid).value == '' || document.getElementById(sumid).value == 'NaN'){
      document.getElementById(sumid).value = '0'
    } else if(document.getElementById(sumid).value == '0'){
      if(document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, '') == '0'){
        document.getElementById(sumid).value = '0'
      } else {
        document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) + Number(document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
      }
    } else {
      document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) - totalmae).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
      document.getElementById(sumid).value = String(Number(document.getElementById(sumid).value.replace(/,/g, '')) + Number(document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[sumcol].getElementsByTagName('input')[0].value.replace(/,/g, ''))).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    }
    var purprice = String(Math.round(Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[pricecol].getElementsByTagName('input')[0].value.replace(/,/g, '')) / 1000 * Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[pricecol+3].getElementsByTagName('input')[0].value.replace(/,/g, '')) * Number(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[pricecol+4].getElementsByTagName('input')[0].value.replace(/,/g, '')) * 100)/100).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[quancol+4].getElementsByTagName('input')[0].value = purprice  
  } else {
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[pricecol].getElementsByTagName('input')[0].value=""
  }
}
function productsearch(event,code,e,namecol){
  if(event.keyCode == '13'){
    event.preventDefault();
    for(let i = 1;document.getElementById("shocode"+ i) != null;i++){
      if(code == document.getElementById("shocode"+ i).innerText){
        document.getElementsByClassName('tr')[e].getElementsByTagName('td')[namecol].getElementsByTagName('input')[0].value = document.getElementById("shoname"+i).innerText
        document.getElementsByClassName('tr')[e].getElementsByTagName('td')[namecol+1].getElementsByTagName('input')[0].focus();
        document.getElementsByClassName('tr')[e].getElementsByTagName('td')[namecol+1].getElementsByTagName('input')[0].select();
        break
      } else if(document.getElementById("shocode"+ i) != null){
        document.getElementsByClassName('tr')[e].getElementsByTagName('td')[namecol].getElementsByTagName('input')[0].value = ""
      }
    }
  }
}
function kubunauto(e,kubuncol){
  if(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[kubuncol].getElementsByTagName('input')[0].value == ''){
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[kubuncol].getElementsByTagName('input')[0].value = '0'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[kubuncol+3].getElementsByTagName('input')[0].value = '0'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[kubuncol+4].getElementsByTagName('input')[0].value = '0'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[kubuncol+5].getElementsByTagName('input')[0].value = '0'
  }
}
function kubunonlyauto(e,kubuncol){
  if(document.getElementsByClassName('tr')[e].getElementsByTagName('td')[kubuncol].getElementsByTagName('input')[0].value == ''){
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[kubuncol].getElementsByTagName('input')[0].value = '0'
    document.getElementsByClassName('tr')[e].getElementsByTagName('td')[kubuncol+10].getElementsByTagName('input')[0].value = '20'
    document.getElementsByClassName('tr')[e+1].getElementsByTagName('td')[kubuncol+6].getElementsByTagName('input')[0].value = '0'
  }
}