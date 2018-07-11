/*
1.numberingroup的计算可能出现问题
2.在使用中分组可能出现问题
 */
//-----------------全局变量----------------------------------------------
//存储学生信息的数组（未分组默认为0班0组）
var info_stu=[];

//-----------------执行部分----------------------------------------------
getStuInfo();

/*数组结构：info_arr[0][userid]=>1
                        [username]=>name1
                        [classid]=>null
                        [groupid]=>null
                    [1][userid]=>2
                        [username]=>name2
                        [classid]=>3
                        [groupid]=>1
*/
/*
//给出如上信息数组
function getStuInfo() {
    var info_arr=[];
    for(var i=0;i<=4;i++){
        info_arr[i]=[];
        info_arr[i]['userid']='userid'+i;
        info_arr[i]['username']='username'+i;
        info_arr[i]['classid']=null;
        info_arr[i]['groupid']=null;
    }
    for(i=5;i<=10;i++){
        info_arr[i]=[];
        info_arr[i]['userid']='userid'+i;
        info_arr[i]['username']='username'+i;
        info_arr[i]['classid']=i;
        info_arr[i]['groupid']=i;
    }
    console.log(info_arr);
    return info_arr;
}
*/


//-----------------获取信息----------------------------------------------
//得到有所有学生的信息，存入全局数组info_stu
function getStuInfo() {
    $.ajax({
        url:'get_stu_info.php',
        success:function (data) {
            var info=JSON.parse(data);
            //将信息处理后存入info_stu
            divide(info);
            console.log('getStuinfo(): ');
            console.log(info_stu);
        }
    })
}
//将服务器返回的学生信息数组整理成新结构
function divide(info) {
    for(var i=0;i<info.length;i++){
        var classid=info[i]['classid'];
        var groupid=info[i]['groupid'];
        if(typeof (info_stu[classid])=='undefined'){
            info_stu[classid]=[];

        }
        if(typeof (info_stu[classid][groupid])=='undefined'){
            info_stu[classid][groupid]=[];
        }
        info_stu[classid][groupid].push(info[i]);
    }
    console.log('divide():');
    console.log(info_stu);
}
//生成依赖数据的界面
function makeUI(){

}
//接受给定参数后将所给id的学生定的班和组
function assignStu(userid,classid,groupid,oldclassid,oldgroupid) {
    //数据库处理
    $.ajax({
        url:'assign_stu.php',
        data:{userid:userid,classid:classid,groupid:groupid},
        success:function (data) {
            console.log('assignGroup() '+data);
        }
    });
    //前端数组处理
    var oldgroup=info_stu[oldclassid][oldgroupid];
    for(var i=0;i<oldgroup.length;i++){
        if(oldgroup[i]['userid']==userid){
            //向被分入的小组添加数据
            info_stu[classid][groupid].push(oldgroup[i]);
            //计算numberingroup                                               //1111依赖索引的彻底清除
            var num=info_stu[classid][groupid].length;
            //修改numberingroup
            var index=info_stu[classid][groupid].length-1;
            info_stu[classid][groupid][index]['numberingroup']=num;
            //删除旧数据
            info_stu[oldclassid][oldgroupid].splice(i,1);
            break;
        }
    }
    console.log('assignStu():');
    console.log(info_stu)
}

//将指定id的学生变回未分组状态
function resetStu(userid,oldclassid,oldgroupid) {
    //数据库处理
    $.ajax({
        url:'reset_stu.php',
        data:{userid:userid},
        success:function (data) {
            console.log('resetStu() '+data)
        }
    });
    //前端数组处理
    var oldgroup=info_stu[oldclassid][oldgroupid];
    var newgroup=info_stu[0][0];
    for(var i=0;i<oldgroup.length;i++){
        if(oldgroup[i]['userid']==userid){
            //向未分组添加数据
            newgroup.push(oldgroup[i]);
            //修改classid和groupid
            var index=newgroup.length-1;
            var target=newgroup[index];
            target['classid']=0;
            target['groupid']=0;
            //删除旧数据
            oldgroup.splice(i,1);
            console.log('resetStu():');
            console.log(info_stu);
            break;
        }
    }
}
//新建班级（添加该班级下所有小组信息）
function createClass() {

}
//删除班级(删除所有小组信息）
function deleteClass(){

}
function test() {
    console.log(info_stu)
}

