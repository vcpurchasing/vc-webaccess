document.getElementById("tokulist").onclick = function list(){
    document.program.action = '/masuta1';
};
document.getElementById("ku1").onclick = function ku1(){
    document.program.action = '/tokuisaki1';
}
document.getElementById("ku2").onclick = function ku2(){
    document.program.action = '/tokuisaki2';
}
document.getElementById("ku3").onclick = function ku3(){
    document.program.action = '/tokuisaki3';
}
document.getElementById("sub1").onclick = function sub1(){
    if(document.program.action == 'http://localhost:3000/tokuisaki1' || document.program.action == 'http://localhost:3000/tokuisaki3'){
        var result = confirm('データを送信しますか？');
        if(result == true){
            return
        } else {
            document.program.action = '/tokuisaki2';
        }
    } else {
        document.program.action = '/tokuisaki2';
    }
}
document.getElementById("reset").onclick = function reset(){
    for (let i = 1; i < 19; i++){
        var textForm = document.getElementById('koumoku' + i)
        textForm.value = '';  
    } 
};