document.getElementById("sub").onclick = function sub(){
    var result = confirm("送信しますか？")
    if(result){
      document.program.submit();
    }
}

document.getElementsByName("koumoku[]")[document.getElementById('jun').value].focus()