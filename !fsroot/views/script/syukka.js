document.getElementById("ku1").onclick = function ku1(){
    document.program.action = '/syukka1';
}
document.getElementById("ku3").onclick = function ku3(){
    document.program.action = '/syukka3';
}
document.getElementById("mae").onclick = function mae(){
  document.program.action = '/maesyukka';
  document.program.submit();
}
document.getElementById("ato").onclick = function mae(){
  document.program.action = '/atosyukka';
  document.program.submit();
}
document.getElementById("itiran").onclick = function mae(){
  window.open('/syukkatable','出荷伝票一覧', 'width=1600px,height=930px');
}
document.getElementById("sub").onclick = function sub(){
  var result = confirm("送信しますか？")
  if(result){
    document.program.submit();
  }
}
window.onload=function(){
  for(var i = 0; i < document.getElementById("koumoku7").options.length;i++){
    if(document.getElementById("tantou").value == document.getElementById("koumoku7").options[i].innerText){
      document.getElementById('koumoku7').options[i].selected = true;
      break;
    }
  } 
  document.getElementById("koumoku2").addEventListener('keydown',function(){
    if(event.keyCode == '32'){
      event.preventDefault();
      window.open('/syukkatable','出荷伝票一覧', 'width=1600px,height=930px');
    } else if(event.keyCode == '13'){
      event.preventDefault();
      document.program.action = '/syukkatable2'
      document.program.submit();
    }
  }) 
  document.getElementById("customercode").addEventListener('keydown',function(){
    if(event.keyCode == '32'){
      event.preventDefault();
      window.open('/tokuisakitable','得意先一覧', 'width=1290px,height=760px');
    } else if(event.keyCode == '13'){
      event.preventDefault();
      document.program.action = '/tokuisakisearch'
      document.program.submit();
    }
  }) 
  document.getElementById("table2").addEventListener('keydown',function(){
    if(event.keyCode == '13'){
      var ta = document.getElementById("table2").value
      for(let i = 1;document.getElementById("shocode"+ i) != null;i++){
        if(ta == document.getElementById("shocode"+ i).innerText){
          document.getElementById("table3").value = document.getElementById("shoname"+i).innerText
          document.getElementById("table4").focus();
          break
        } else if(document.getElementById("shocode"+ i) != null){
          document.getElementById("table3").value = ""
        }
      }
    }
  })
  document.getElementById("table6").addEventListener('keydown',function(){
    if(event.keyCode == '13'){
      var ta = document.getElementById("table6").value
      for(let i = 1;document.getElementById("shocode"+ i) != null;i++){
        if(ta == document.getElementById("shocode"+ i).innerText){
          document.getElementById("table7").value = document.getElementById("shoname"+i).innerText
          document.getElementById("table8").focus();
          break
        } else if(document.getElementById("shocode"+ i) != null){
          document.getElementById("table7").value = ""
        }
      }
    }
  })
  document.getElementById("table10").addEventListener('keydown',function(){
    if(event.keyCode == '13'){
      var ta = document.getElementById("table10").value
      for(let i = 1;document.getElementById("shocode"+ i) != null;i++){
        if(ta == document.getElementById("shocode"+ i).innerText){
          document.getElementById("table11").value = document.getElementById("shoname"+i).innerText
          document.getElementById("table12").focus();
          break
        } else if(document.getElementById("shocode"+ i) != null){
          document.getElementById("table11").value = ""
        }
      }
    }
  })
  document.getElementById("table14").addEventListener('keydown',function(){
    if(event.keyCode == '13'){
      var ta = document.getElementById("table14").value
      for(let i = 1;document.getElementById("shocode"+ i) != null;i++){
        if(ta == document.getElementById("shocode"+ i).innerText){
          document.getElementById("table15").value = document.getElementById("shoname"+i).innerText
          document.getElementById("table16").focus();
          break
        } else if(document.getElementById("shocode"+ i) != null){
          document.getElementById("table15").value = ""
        }
      }
    }
  })
  document.getElementById("table18").addEventListener('keydown',function(){
    if(event.keyCode == '13'){
      var ta = document.getElementById("table18").value
      for(let i = 1;document.getElementById("shocode"+ i) != null;i++){
        if(ta == document.getElementById("shocode"+ i).innerText){
          document.getElementById("table19").value = document.getElementById("shoname"+i).innerText
          document.getElementById("table20").focus();
          break
        } else if(document.getElementById("shocode"+ i) != null){
          document.getElementById("table19").value = ""
        }
      }
    }
  })
  document.getElementById("table22").addEventListener('keydown',function(){
    if(event.keyCode == '13'){
      var ta = document.getElementById("table22").value
      for(let i = 1;document.getElementById("shocode"+ i) != null;i++){
        if(ta == document.getElementById("shocode"+ i).innerText){
          document.getElementById("table23").value = document.getElementById("shoname"+i).innerText
          document.getElementById("table24").focus();
          break
        } else if(document.getElementById("shocode"+ i) != null){
          document.getElementById("table23").value = ""
        }
      }
    }
  })
  document.getElementById("table26").addEventListener('keydown',function(){
    if(event.keyCode == '13'){
      var ta = document.getElementById("table26").value
      for(let i = 1;document.getElementById("shocode"+ i) != null;i++){
        if(ta == document.getElementById("shocode"+ i).innerText){
          document.getElementById("table27").value = document.getElementById("shoname"+i).innerText
          document.getElementById("table28").focus();
          break
        } else if(document.getElementById("shocode"+ i) != null){
          document.getElementById("table27").value = ""
        }
      }
    }
  })
  document.getElementById("table30").addEventListener('keydown',function(){
    if(event.keyCode == '13'){
      var ta = document.getElementById("table30").value
      for(let i = 1;document.getElementById("shocode"+ i) != null;i++){
        if(ta == document.getElementById("shocode"+ i).innerText){
          document.getElementById("table31").value = document.getElementById("shoname"+i).innerText
          document.getElementById("table32").focus();
          break
        } else if(document.getElementById("shocode"+ i) != null){
          document.getElementById("table31").value = ""
        }
      }
    }
  })

}
