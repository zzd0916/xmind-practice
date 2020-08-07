window.showMessage = showMessage;

if(localStorage.getItem('bill') && localStorage.getItem('categories')) {
    createTable(JSON.parse(localStorage.getItem('bill')))
}

function createTable(data) {
    let table = document.createElement('table');
    table.setAttribute('class', 'table')
    table.setAttribute('border', '1')
    table.setAttribute('cellspacing', '0')
    table.setAttribute('cellpadding', '0')

    let headerKey =[]
    for(let k in data[0]) {
        headerKey.push(k)
    }

    let headerStr = '';
    headerKey.forEach( (k) => {
        headerStr += `<th>${k}</th>`
    })

    let bodyStr =  '';
    data.forEach( (i) => {
        bodyStr += `<tr><td>${getTypeName(i.type)}</td><td>${formatDate(i.time)}</td><td>${getCategoriesName(i.category)}</td><td>${i.amount}</td></tr>`
    })

    table.innerHTML = `<tr>${headerStr}</tr>${bodyStr}`

    document.body.appendChild(table)
}   


// 通过id获取dom
function $(id) {
    return document.getElementById(id)
}

// 全局提示信息
function showMessage( text='', type='success', time = 2000 ) {
    const msgDom =  $('message')
    msgDom.setAttribute('class', `message ${type} show `)
    msgDom.innerText = text
    setTimeout( () => {
        $('message').setAttribute('class', `message hide`)
    },time)
}

// csv转object
function csvToObject(csvString){
    var csvarry = csvString.split("\r\n");
    var datas = [];
    var headers = csvarry[0].split(",");
    for(var i = 1;i<csvarry.length;i++){
        var data = {};
        var temp = csvarry[i].split(",");
            for(var j = 0;j<temp.length;j++){
                data[headers[j]] = temp[j];
            }
        datas.push(data);
    }
    return datas;
}

// 处理导入按钮点击事件
function FuncCSVInport() {
    let csvFileInput =  $('csvFileInput')
    csvFileInput.value=''
    csvFileInput.click();
}

// 读取CSV文件并存入本地的localStorage中
function readCSVFile(obj) {
    var reader = new FileReader();
    reader.readAsText(obj.files[0]);
    reader.onload = function () {
        let fileName = obj.files[0].name;
        let data = csvToObject(this.result);
        if(data && typeof data === 'object' && data.length) {
            if(fileName === 'bill.csv') {
                localStorage.setItem('bill', JSON.stringify(data));
                if(localStorage.getItem('categories')){
                    showMessage(`导入文件 '${fileName}' 成功`, 'success', 1500);
                    createTable(data)
                } else {
                    showMessage('请先导入categories.csv文件后再导入bill.csv文件', 'warning', 3000)
                }
            } 
            if(fileName === 'categories.csv') {
                showMessage(`导入文件 '${fileName}' 成功`, 'success', 1500);
                localStorage.setItem('categories', JSON.stringify(data));   
            }
        } else {
            showMessage(`导入文件 '${fileName}' 失败`, 'error');
        }
    }
}

// 格式化时间
function formatDate( date ){
    var date = new Date(+date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD +" "+hh + mm + ss;
}

function getCategoriesName(id) {
    let categoriesList = []
    try {
        categoriesList = JSON.parse(localStorage.getItem('categories'))
    } catch {
        categoriesList = []
    }
    if(categoriesList && categoriesList.length) {
        let item = categoriesList.filter( i => i.id === id)
        return item[0].name
    } 
    return ''
}

function getTypeName(type) {
    return type === '1' ?  '收入' : '支出';
}