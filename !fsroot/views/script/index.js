new Vue({
    el:'#app',
    data() {
        return {
            is_readonly : false,
            kubun : '入力/修正',
            text : '',
        };
    },
    methods:{
        resettext(){
            this.text = '';
        },
        kubun1(){
            this.is_readonly = false;
            this.kubun = "入力/修正";
            this.resettext();
        },
        kubun2(){
            this.is_readonly = true;
            this.kubun = "読込";
            this.resettext();
        },
        kubun3(){
            this.is_readonly = true;
            this.kubun = "削除";
            this.resettext();
        },
    }
});

document.getElementById("reset").onclick = function reset(){
    for (let i = 1; i < 19; i++){
        var textForm = document.getElementById('koumoku' + i)
        textForm.value = '';  
    } 
};
document.getElementById("list").onclick = function list(){
    document.program.action = '/kousin';
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