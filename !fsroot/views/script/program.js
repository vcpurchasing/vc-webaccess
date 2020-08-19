new Vue({
    el:'#app',
    data() {
        return {
            is_readonly : false,
            syukkacode : false,
            kubun : '入力/修正',
            text : '',
            is__select1 : false,
            is__select2 : false,
            is__select3 : false,
            is__select4 : false,
            is__select5 : false,
            is__select6 : false,
            is__select7 : false,
            is__focus1 : false,
            lists : [
                {id: 'program1', method: 'is_select1', value: 'マスターデータ'},
                {id: 'program2', method: 'is_select2', value: '売上管理'},
                {id: 'program3', method: 'is_select3', value: '仕入管理'},
                {id: 'program4', method: 'is_select4', value: '在庫管理'},
                {id: 'program5', method: 'is_select5', value: '生産管理'},
                {id: 'program6', method: 'is_select6', value: '転送データ作成'},
                {id: 'program6', method: 'is_select7', value: '一覧'},
            ],
            masuta : [
                {id: 'masuta1', value: '得意先登録'},
                {id: 'masuta2', value: '得意先データ移動'},
                {id: 'masuta3', value: '内職者銀行支店登録'},
                {id: 'masuta4', value: '取引銀行登録'},
                {id: 'masuta5', value: '内職者口座登録'},
                {id: 'masuta6', value: '管理商品分類'},
                {id: 'masuta7', value: '管理商品担当'},
                {id: 'masuta8', value: '商品縦横'},
                {id: 'masuta9', value: '商品入り数登録'},
                {id: 'masuta10', value: 'Description'},
                {id: 'masuta11', value: '商品アイテム'},
                {id: 'masuta12', value: '分離売上登録'},
                {id: 'masuta13', value: '値上げ単価'},
                {id: 'masuta14', value: 'ダンボール'},
                {id: 'masuta15', value: '直送先登録'},
                {id: 'masuta16', value: '荷送人登録'},
                {id: 'masuta17', value: '外国仕入先登録'},
                {id: 'masuta18', value: '集約コード'},
                {id: 'masuta19', value: '仕入原価'},
                {id: 'masuta20', value: '為替登録'},
            ],
            Sales : [
                {}
            ],
            Purchase : [
                {id: 'Purchase1', value: '仕入'},
                {id: 'Purchase2', value: '仕入外国'},
                {id: 'Purchase3', value: '出荷'},
                {id: 'Purchase4', value: '発注'},
            ],
            Stock : [
                {}
            ],
            Production : [
                {}
            ],
            Transfer : [
                {}
            ],
            Syukka : [
            ],
            Itiran : [
                {id: 'itiran1', value: '直送先'}
            ]
        };
    },
    methods:{
        selected(){
            this.is__select1 = false;
            this.is__select2 = false;
            this.is__select3 = false;
            this.is__select4 = false;
            this.is__select5 = false;
            this.is__select6 = false;
            this.is__select7 = false;
        },
        loadlist(method){
            this.method = method;
            if(this.method == 'is_select1'){
                this.selected();
                this.is__select1 = true;
            } else if(this.method == 'is_select2'){
                this.selected();
                this.is__select2 = true;
            } else if(this.method == 'is_select3'){
                this.selected();
                this.is__select3 = true;
            } else if(this.method == 'is_select4'){
                this.selected();
                this.is__select4 = true;
            } else if(this.method == 'is_select5'){
                this.selected();
                this.is__select5 = true;
            } else if(this.method == 'is_select6'){
                this.selected();
                this.is__select6 = true;
            } else if(this.method == 'is_select7'){
                this.selected();
                this.is__select7 = true;
            }
        },
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
        kubun4(){
            this.is_readonly = true;
            this.kubun = "削除";
            this.resettext();
        },
        kubun5(){
            this.is_readonly = true;
            this.kubun = "削除";
            this.resettext();
        },
        kubun6(){
            this.is_readonly = true;
            this.kubun = "削除";
            this.resettext();
        },
    },
});

