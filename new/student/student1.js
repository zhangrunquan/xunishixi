/*
问题：1.（在线列表）教师重名，应换成更可靠的id
       3.将changelistmood改为changemood
       4.可能可以合并请求来减少请求次数
       6.可以根据新邮件来减少checkhoemworkevaluaion
进度：1.137

*/

//-----------------控制台--------------------
var getEmailInterval=6000;
var onlineuserInterval=5000;
//小组学生数
var groupstunumber=4;

//-----------------设置变量---------------------
//-----------------信息存储---------------------
var info_group=[];
var info_task=[];
var info_report=[];
var info_feedback=[];
var info_user=[];
var info_email=[];
var taskidnow;
//feedback未读数
var uncheckedfeedbacknum=0;
//作业评价状态改变的可能性，每次收到新feedback置1，每次checkhomeworkevaluation()后置0,由于可能离线期间收到feedback，登录时默认为1
var evaluationchange=1;
//当前最新report评价
var evaluation='';

//listMood是下拉栏状态，初始为“主页”
var listMood = "mainmenu";
//记录最后一次点击的发件列表项是否为最后一封,可为'other'和'last'
var lastclick='other';
var sid = getQueryString("sid");
//个人信息  目前存储组员姓名
var groupmemmber=[];
//发件箱正在显示的是不是最后一封report
var lastonshow=false;
//当前获取邮件的最大时间戳
var maxEmailTimeStamp='1000-01-01 00:00:00';
//存储taskname,url相关信息的数组,索引对应taskid
var taskname_url_arr;
//存储用户信息的数组
var user_info_arr;
//存储教师和系统邮件的数组
var receive_data=[];
//存储作业信息的数组
var homework_data=[];
//存储草稿
//var draft='';
//生成上传按钮部分
var attachname ="attach";
var attachnum=1;
//-----------------执行部分----------------------------------------------
/*
getGroupInfo();
//取得用户信息
getUserInfo();
taskname_url();
getEmailData();
updateGetOnlineuser();
setInterval("getEmailDataConstantly()", getEmailInterval);
setInterval("updateGetOnlineuser()", onlineuserInterval);
*/
initialize();
prepareAllTable();
setInterval("getNewEmail()",getEmailInterval);

//-----------------设置点击事件------------------

//-----------------函数定义部分----------------------------------------------
//-----------------获取要维持的信息----------------------------------------------
function initialize() {
    $.ajax({ url: "info.php",
        data:{sid:sid},
        success: function (data) {
            var info=JSON.parse(data);
            info_group=info['group'];
            info_report=info['report'];
            info_user=info['user'];

            //减去checked项
            taskidnow=objectLength(info['task'])-1;
            sortEmailarr(info['task'],info['feedback'],0);

            console.log('initialize info');
            console.log(info);
            console.log('info_email');
            console.log(info_email);
            console.log('taskidnow '+taskidnow);

            //feedback从零索引，所以从taskidnow-1开始检查
            countUncheckedFeedback(info['feedback'],taskidnow-1);

            console.log('uncheckedfeedbacknum '+uncheckedfeedbacknum);

            createUI();
        }
    });
}
function sortEmailarr(task,feedback,taskindex) {
    if(typeof (task[taskindex])==='undefined') {
        console.log('sort end');
        return 0;
    }
    info_email.push(task[taskindex]);



    testFeedback(feedback,taskindex,taskindex+1);
    sortEmailarr(task,feedback,taskindex+1);
}
function testFeedback(feedback,index,taskid){
    if(typeof (feedback[index])==='undefined'){
        return 0;
    }
    if(feedback[index]['taskid']<taskid){
        testFeedback(feedback,index+1,taskid);
        return 0;
    }
    if(feedback[index]['taskid']==taskid){
        info_email.push(feedback[index]);
        testFeedback(feedback,index+1,taskid);
        return 0;
    }
    if(feedback[index]['taskid']>taskid){
        return 0;
    }
}
function createUI() {
    createEmailTable('emailtable',info_email,'emailtbody');
    createHomeworkTable(info_report,'homeworktbody');
    //填写抄送
    var str=info_group[0]['username'];
    for(var j=1;j<groupstunumber;j++){
        str+=';'+info_group[j]['username'];
    }
    document.getElementById("r_copy").innerHTML='抄送:'+str;
}
function countUncheckedFeedback(feedback,startindex) {
    for(var i=startindex;i<feedback.length;i++){
        if(feedback[i]['checked']==0){
            uncheckedfeedbacknum+=1;
        }
    }
}
function objectLength(obj) {
    var arr=Object.keys(obj);
    return arr.length;
}

function getNewEmail() {
    maxEmailTimeStamp=info_email[info_email.length-1]['timeStamp'];
    $.ajax({ url: "new_email.php",
        data:{sid:sid,maxtimestamp:maxEmailTimeStamp},
        success: function (data) {
            var info=JSON.parse(data);

            console.log('getNewEmail');
            console.log(info);

            var getdata=0;
            if(typeof (info['feedback'][0]['content'])!='undefined'){
                info_email.push(info['feedback'][0]);
                getdata=1;
                evaluationchange=1;
            }
            var lasttaskemail=getLastTaskEmail(info_email.length-1);
            var lasttimestamp=lasttaskemail['timeStamp'];
            if(info['task'][0]['timeStamp']!=lasttimestamp){
                taskidnow+=1;
                info['task'][0]['taskid']=taskidnow;
                info_email.push(info['task'][0]);
                getdata=1;
            }
            if(getdata){
                createEmailTable('emailtable',info_email,'emailtbody');
            }
            console.log('info_email');
            console.log(info_email);
        }
    });
}
function getLastTaskEmail(index) {
    if(typeof(info_email[index]['content'])=='undefined'){
        return info_email[index];
    }
    else {
        return getLastTaskEmail(index-1);
    }
}

/*
//获取taskname，url
function taskname_url() {
    $.ajax({ url: "taskname_resurl.php",
        async:false,
        success: function (data) {
            taskname_url_arr=JSON.parse(data);
        }
    });
}
//从session中取得用户信息到js
function getUserInfo() {
    $.get("../all/get_user_info.php", {sid:sid}, function (data) {
        //返回的json数据解码，数据存进user_info_array
        user_info_arr= eval(data);
        document.getElementById('r_receiver').innerHTML='收件人：'+user_info_arr['username'];
    })
}
//获得教师名和小组成员名
function getGroupInfo() {
    $.get("get_group_info.php", {sid: sid}, function (data) {
        //返回的json数据解码，数据存进data_array
        var data_array = eval(data);
        groupmemmber['stuname']=[];
        var len=data_array.length;
        //循环减一次是去掉教师
        for(var i=0;i<len-1;i++){
            groupmemmber['stuname'][i+1]=data_array[i];
        }
        groupmemmber['tutorname']=data_array[len-1];
        //alert(groupmemmber['stuname'][4]+groupmemmber['tutorname'])
    });
}

*/
//更新在线用户列表;
/*
function updateGetOnlineuser() {
    getGroupInfo();
    $.get("update_get_onlineuser.php", {sid: sid}, function (data) {
        //返回的json数据解码，数据存进data_array
        var data_array = eval(data);
        var onlineuserlist_str = "";
        for (var k = 1; k <= groupstunumber; k++) {
            if (jQuery.inArray(groupmemmber['stuname'][k], data_array['onlineuser_name']) != -1) {
                onlineuserlist_str += groupmemmber['stuname'][k] + '(在线）<br/>';
            } else {
                onlineuserlist_str += groupmemmber['stuname'][k] + '<br/>';
            }
        }
        if (jQuery.inArray(groupmemmber['tutorname'], data_array['onlineuser_name']) != -1) {
            onlineuserlist_str += '导师&nbsp' + '张华' + '(在线）';
        } else {
            onlineuserlist_str += '导师&nbsp' + '张华';
        }
        document.getElementById("在线列表").innerHTML = onlineuserlist_str;
    })
}*/

//-----------------功能小函数----------------------------------------------
function saveDraftLocal() {
    info_report[info_report.length-1]['content']=$.trim(document.getElementById("sendemail").value);
    console.log('saveDraftLocal');
    console.log('info_report');
    console.log(info_report);
}
//获取get传值的方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
//隐藏按钮
function hideButton(id) {
    document.getElementById(id).style.display='none';
}
//隐藏所有按钮
function hideAllButton() {
    hideButton('提交作业');
    hideButton('addfile');
    hideButton('deletefile');
    hideButton('save');
}
//显示按钮
function showButton(id) {
    document.getElementById(id).style.display='block';
}
//显示所有按钮
function showAllButton(){
    showButton('提交作业');
    showButton('addfile');
    showButton('deletefile');
    showButton('save');
}

//返回当前最大taskid，思路：最后一封收到的邮件的taskid一定是当前的taskid
function getTaskidNow(data) {
    return(receive_data[receive_data.length-1]['taskid']);
}
//切换笔记本和主页的函数,参数为代表状态的字符串
function changeListMood(mood) {
    listMood = mood;
}
//改变记录状态的变量
function changemood(target,mood) {
    target=mood;
}

//获取所有信息
function getInfo() {
    $.ajax({ url: "info.php",
        data:{sid:sid},
        success: function (data) {
            taskname_url_arr=JSON.parse(data);
        }
    });
}

//-----------------提交和浏览作业部分----------------------------------------------
//提交作业到后台写入数据库的函数
function submitHomework() {
    //先禁用按钮，防止重复提交
    //document.getElementById('提交作业').setAttribute('disabled', 'disabled');
    hideAllButton();
    saveDraftLocal();
    var text = document.getElementById("sendemail").value;
    //
    var fileform = document.getElementById('upload');
    //将取得的表单数据转换为formdata形式，在php中以$_POST['name']形式引用
    var formdata = new FormData(fileform);
    formdata.append('sid', sid);
    formdata.append('text', text);
    formdata.append('evaluation', evaluation);
    //ajax请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            //提示区会提示success表示发送成功
            //document.getElementById("result").innerHTML = xhr.responseText;
            alert(xhr.responseText)

        }
    };
    xhr.open('post', './student_submit_homework.php');
    xhr.send(formdata);
}
//保存草稿
function saveReport() {
    //先禁用按钮，防止重复提交
    var text = $.trim(document.getElementById("sendemail").value);

    if(text!=''&&text!='未提交'&&text!='待修改'&&text!='请输入作业内容'){
        $.get("save_report.php", {sid:sid,text:text}, function (data) {
            var info = eval(data);
            alert(info)
        })
    }
    homework_data[homework_data.length-1]['content']=text;
}
//检查作业是不是可修改状态，并显示提示语，如果可修改返回true,不可修改返回false
function checkHomeworkEvaluation() {
    if(evaluationchange==0){
        console.log('evaluation check escaped');

        var submitbutton = document.getElementById('提交作业');
        var textarea = document.getElementById('sendemail');
        if (evaluation == '未提交' || evaluation == '待修改') {
            var content=info_report[info_report.length-1]['content'];
            if(content!=''){
                textarea.value = content;
            }
            else{
                textarea.value = "请输入作业内容";
            }
            textarea.removeAttribute('readonly');
            submitbutton.removeAttribute('disabled');
            return true;
        }
        else if (evaluation == '批改中') {
            //document.getElementById("sendemail").value="作业待教师批改";
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = "作业待教师批改";
            submitbutton.setAttribute('disabled', 'disabled');
        }
        else if (evaluation == '通过') {
            //document.getElementById("sendemail").value="您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.value = "您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.setAttribute('readonly', 'readonly');
            submitbutton.setAttribute('disabled', 'disabled');

        }
        return;
    }
    $.get("get_homework_evaluation.php", {sid:sid}, function (data) {
        console.log('check homework evaluation');
        evaluationchange=0;
        evaluation = eval(data);
        var submitbutton = document.getElementById('提交作业');
        var textarea = document.getElementById('sendemail');
        if (evaluation == '未提交' || evaluation == '待修改') {
            var content=info_report[info_report.length-1]['content'];
            if(content!=''){
                textarea.value = content;
            }
            else{
                textarea.value = "请输入作业内容";
            }
            textarea.removeAttribute('readonly');
            submitbutton.removeAttribute('disabled');
            return true;
        }
        else if (evaluation == '批改中') {
            //document.getElementById("sendemail").value="作业待教师批改";
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = "作业待教师批改";
            submitbutton.setAttribute('disabled', 'disabled');
        }
        else if (evaluation == '通过') {
            //document.getElementById("sendemail").value="您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.value = "您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.setAttribute('readonly', 'readonly');
            submitbutton.setAttribute('disabled', 'disabled');
        }
        return false;
    })
}

//-----------------生成列表部分----------------------------------------------
//生成表格的tbody
function prepareTable(parent,tablename,tbodyid) {
    var child=document.getElementById(tablename);
    if(child){
        parent.removeChild(child);
    }

    var table = document.createElement("table");
    table.id = tablename;
    parent.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    tbody.id=tbodyid;
    return(tbody);
}
//准备所有表格的tbody
function prepareAllTable() {
    var email = document.getElementById("emaillist");
    prepareTable(email,'emailtable','emailtbody');
    var urldiv = document.getElementById("urllist");
    prepareTable(urldiv,'urltable','urltbody');
    var homeworkdiv = document.getElementById("homeworklist");
    prepareTable(homeworkdiv,'homeworktable','homeworktbody');
}
//在表格中添加一行
function addLine(parentid) {
    var tr = document.createElement("tr");
    var parent=document.getElementById(parentid);
    parent.appendChild(tr);
    var display = document.createElement("td");
    tr.appendChild(display);
    return display;
}

function addSendLine(taskid) {
    homework_data[taskid-1]=[];
    homework_data[taskid-1]['content']='';
    var td=addLine('homeworktbody');
    td.id='homework'+taskid;
    processLastSend(taskid,td);
    //变更前一封邮件的onclick事件
    var oldtaskid=taskid-1;
    var old=document.getElementById('homework'+oldtaskid);
    //可重构函数
    old.onclick=function () {
        //可优化
        var text=homework_data[oldtaskid-1]['content'];
        if(lastclick=='other'){
            document.getElementById("sendemail").value = text;
            document.getElementById("s_title").innerHTML=taskname_url_arr[oldtaskid]['taskname'];
        }
        else if(lastclick=='last'){
            saveDraftLocal();
            document.getElementById("sendemail").value = text;
            document.getElementById("s_title").innerHTML=taskname_url_arr[oldtaskid]['taskname'];
        }
        lastclick='other';
    }


}
//对最后一封发件(撰写中)的处理
function processLastSend(taskid,td){
    td.innerHTML='report'+taskid;
    td.onclick=function () {
        if(lastclick='other'){
            document.getElementById("s_title").innerHTML=taskname_url_arr[taskid]['taskname'];
            checkHomeworkEvaluation();
        }
        lastclick='last';
    }
}

function createAndJump() {
    createReport();
}
function createReport() {
    if(info_report.length<taskidnow){
        var report=[];
        report['content']='';
        info_report.push(report);
        console.log('report created');
        console.log(info_report);
        createHomeworkTable(info_report,'homeworktbody');
        $.ajax({ url: "create_report.php",
            data:{sid:sid,taskidnow:taskidnow},
            success: function (data) {
                console.log('report created in database')
            }
        });
    }
}

//生成发件列表
function createHomeworkTable(datas,tbodyid) {
    var tbody=document.getElementById(tbodyid);
    tbody.innerHTML='';
    var len=datas.length;
    if(len==0){
        return;
    }
    //处理最后一项以外的项
    for (var i = 0; i < len-1; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var td = document.createElement("td");

            var taskid=i+1;
            var content=datas[i]['content'];
            td.innerHTML = 'report'+taskid;
            tr.appendChild(td);
            //设置点击展示邮件内容的功能
            td.onclick = function () {
                if(lastclick=='other'){
                    document.getElementById("sendemail").value = content;
                    //document.getElementById("s_title").innerHTML=taskname_url_arr[taskid]['taskname'];
                    document.getElementById("s_title").innerHTML=taskid;

                }
                else if(lastclick=='last'){
                    saveDraftLocal();
                    document.getElementById("sendemail").value = content ;
                    //document.getElementById("s_title").innerHTML=taskname_url_arr[taskid]['taskname'];
                    document.getElementById("s_title").innerHTML=taskid;
                }
                hideAllButton();
                lastclick='other';
                console.log('lastclick changed to :'+lastclick);
            }
        })(i);
    }
    //处理最后一项
    i=len-1;
    var tr = document.createElement("tr");
    tbody.appendChild(tr);
    var td = document.createElement("td");
    var taskid=i+1;
    var content=datas[i]['content'];
    td.innerHTML = 'report'+taskid;
    tr.appendChild(td);
    //设置点击展示邮件内容的功能
    td.onclick = function () {
        if (lastclick =='other') {
            //document.getElementById("s_title").innerHTML = taskname_url_arr[len]['taskname'];
            document.getElementById("s_title").innerHTML = 'last report';
            checkHomeworkEvaluation();
            showAllButton();
        }
        lastclick = 'last';
        console.log('lastclick changed to :'+lastclick);
    };

    lastclick='other';
    console.log('homeworktable created');
}
//取得资源列表所需数据
function urlList(starttaskid) {
    var taskidnow = getTaskidNow();
    var url_arr = [];
    url_arr['intro'] = [];
    url_arr['url'] = [];

    for (var i = starttaskid; i <= taskidnow; i++) {
        var resource_arr = taskname_url_arr[i]['resource'];
        for (var k = 0; k < resource_arr.length; k++) {
            url_arr['intro'].push(resource_arr[k]['intro']);
            url_arr['url'].push(resource_arr[k]['url'])
        }
    }

    createUrlTable(url_arr, 'urltbody');


}
//生成系统和教师邮件列表的函数
function createEmailTable(parent,datas,tbodyid) {
    console.log('info_email');
    console.log(info_email);
    var tbody=document.getElementById(tbodyid);
    tbody.innerHTML='';

    for (var i = 0; i < datas.length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var td= document.createElement("td");

            var taskid=datas[i]['taskid'];
            var timeStamp=datas[i]['timeStamp'];
            //taskemail
            if(typeof(info_email[i]['content'])=='undefined'){
                //title=taskname_url_arr[taskid]['taskname']+'\n'+timeStamp;
                title='taskemail'+taskid+'<br>'+timeStamp;
                var content='renwu';
                td.id='taskemail'+taskid
            }
            //feedback
            else
            {
                var title='RE:Report'+taskid+'<br>'+timeStamp;
                content = datas[i]['content'];

            }
            td.innerHTML = title;
            tr.appendChild(td);

            td.onclick = function () {
                document.getElementById("receiveemail").value = content;
                $.get("read_task_log.php", {sid:sid,taskid:taskid}, function (data) {
                    alert(data);
                });

                //document.getElementById("r_title").innerHTML=taskname_url_arr[taskid]['taskname'];
                document.getElementById("r_title").innerHTML='taskname';

                document.getElementById('r_time').innerHTML='时间:'+timeStamp;

            }
        })(i)
    }
}
//生成资源列表
function createUrlTable(datas, tbodyid) {
    var tbody = document.getElementById(tbodyid);
    //创建‘邮件n'的单元列
    for (var i = 0; i < datas['url'].length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            /*在新创建的行内创建'邮件n'的单元格，附加点击展示邮件内容的功能*/
            //设置新建的td元素
            var display = document.createElement("td");

            //处理显示的邮件主题
            var href = datas['url'][i];
            var hreftag = document.createElement('a');
            var node = document.createTextNode(datas['intro'][i]);
            hreftag.appendChild(node);
            //hreftag.setAttribute('href',datas[i]['url']);
            //display.innerHTML = datas[i]['url'];
            display.appendChild(hreftag);
            hreftag.onclick = function (ev) {
                PDFObject.embed(href, "#pdf")
            };

            tr.appendChild(display);

        })(i)
    }
}
//-----------------上传附件部分----------------------------------------------
function addInput() {
    if (attachnum > 0) {
        var attach = attachname + attachnum;
        if (createInput(attach))
            attachnum = attachnum + 1;
    }
}
function deleteInput() {
    if (attachnum > 1) {
        attachnum = attachnum - 1;
        if (!removeInput())
            attachnum = attachnum + 1;
    }
}
function createInput(nm) {
    var aElement = document.createElement("input");
    aElement.name = nm;
    aElement.id = nm;
    aElement.type = "file";
    aElement.size = "50";
//aElement.value="thanks";
//aElement.onclick=Function("asdf()");
    if (document.getElementById("upload").appendChild(aElement) == null)
        return false;
    return true;
}
function removeInput(nm) {
    var aElement = document.getElementById("upload");
    if (aElement.removeChild(aElement.lastChild) == null)
        return false;
    return true;
}


