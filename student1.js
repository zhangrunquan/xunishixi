var student_id=1;           //1111 需要获取学生id的方法
getData();





function getData(){

    $.get("student_get_email.php",{id:student_id},function(data){
        //alert(1);
        //返回的json数据解码
        var data_array=eval(data);
        //创建一个二维数组
        var time_classid_array=[];
        for(var j=0;j<data_array.length;j++){
            time_classid_array[j]=[];
        }

        //将time,classid存入该二维数组
        for (var i = 0; i < data_array.length; i++){
            for(var k in data_array[i]){
                if( k!="emailcontent"){
                    time_classid_array[i][k]=data_array[i][k];
                }
            }
        }
        email=document.getElementById("email");
        //根据该二维数组创建表格
        //creatTable(document.body,headers,time_classid_array);
        //creatTable(email,headers,time_classid_array);
        creatTable(email,headers,data_array);

        //创建按钮
        /*for (i=0;i<data_array.length;i++){
            addInput(i,data_array)
        }*/
    })
}
//var headers = ["时间", "班级", "删除"];
var headers = ["时间", "班级",'操作'];


//将动态生成列表的部分封装成函数，可以重复调用，也方便统一修改
function creatTable(parent, headers, datas) {

    var table = document.createElement("table");
    table.id = "tb";
    parent.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    for (var i = 0; i < headers.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = headers[i];
        tr.appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (var i = 0; i < datas.length; i++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);

        /*for (var k in datas[i]) {
            var td = document.createElement("td");
            td.innerHTML = datas[i][k];
            tr.appendChild(td);
        }*/
        for (var k in datas[i]) {
            if(k!='emailcontent'){
                var td = document.createElement("td");
                td.innerHTML = datas[i][k];
                tr.appendChild(td);
            }
        }
        /*var td = document.createElement("td");
        td.innerHTML = "<a href='javascript:'>显示</a>";
        tr.appendChild(td);
        td.children[0].onclick = function () {

            var content=datas[i]['emailcontent'];
            alert(content);
            document.getElementById("emailcontent").value=content;
        }*/
        //生成表格中的显示项
        var display= document.createElement("td");
        display.innerHTML = "<a href='javascript:'>显示</a>";
        tr.appendChild(display);
        var content=datas[i]['emailcontent'];
        display.setAttribute('id','display'+i)
        var disp=document.getElementById('display'+i);
        disp.onclick = function () {
            //var content=datas[i]['emailcontent'];
            //alert(content);
            document.getElementById("emailcontent").value=content;
        }
        /*dispaly.firstChild.onclick = function () {
            //var content=datas[i]['emailcontent'];
            alert(content);
            document.getElementById("emailcontent").value=content;
        }*/


        /*var td = document.createElement("td");
        td.innerHTML = "<a href='javascript:'>删除</a>";
        tr.appendChild(td);

        td.children[0].onclick = function () {
            var lines = tbody.children.length;
            if (lines <= 1) {
                alert("最后一条！请留一点数据吧！");
                return;
            }
            var tip = confirm("确认删除？");
            if (tip) {
                tbody.removeChild(this.parentNode.parentNode);
            }

        }*/

        /*var td = document.createElement("td");
        td.innerHTML = "<a href='javascript:'>删除</a>";
        tr.appendChild(td);

        td.children[0].onclick = function () {
            var lines = tbody.children.length;
            if (lines <= 1) {
                alert("最后一条！请留一点数据吧！");
                return;
            }
            var tip = confirm("确认删除？");
            if (tip) {
                tbody.removeChild(this.parentNode.parentNode);
            }

        }*/
    }
}

function addInput(i,data_array){

    var o = document.createElement('input');
    o.type = 'button';
    //1111唯一对应处理
    var button_name=data_array[i]['classid']+i;
    o.value =button_name;
    //1111 应使id唯一
    o.id=button_name;           //1111
    var content=data_array[i]['emailcontent'];


    //1111
    document.body.appendChild(o);

    $("#"+button_name).click(function () {          //1111
        document.getElementById("emailcontent").value=content;
    });
    var button=document.getElementById(button_name);
    if(data_array[i]["emailcontent"]){
        //将按钮设为蓝色
        $("#" + button_name).css("background-color", "blue");
    }else {
        //禁用按钮
        button.setAttribute("disabled","disabled");
    }
    o = null;
}