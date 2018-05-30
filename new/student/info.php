<?php
//header("Content-Type:application/json");

$sid=$_GET['sid'];
session_id($sid);
session_start();
$groupid=$_SESSION['groupid'];
$classid=$_SESSION['classid'];
$userid = $_SESSION['userid'];

/*
$userid=1;
$classid=1;
$groupid=1;
*/

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//选择数据库
mysqli_query($link,'use database1');

//取得当前taskid，为防止taskid变动，不保存在session中，每次现查
$query="SELECT taskidnow FROM group_attr WHERE classid='$classid' AND groupid='$groupid' limit 1";
$ret=mysqli_query($link,$query);
$taskid_arr=mysqli_fetch_assoc($ret);
$taskidnow=$taskid_arr['taskidnow'];

//查询feedback
$query="SELECT * FROM feedback WHERE userid='$userid'";
$ret_feedback=mysqli_query($link,$query);

//查询report
$query="SELECT content FROM report WHERE userid='$userid' limit {$taskidnow}";
$ret_report=mysqli_query($link,$query);

//查询task的时间
$query="SELECT timeStamp,checked FROM task WHERE userid='$userid' limit 1";
$ret_task=mysqli_query($link,$query);

//查询小组成员姓名
$query="SELECT username FROM account WHERE classid='$classid' AND groupid='$groupid' AND role='student'";
$ret_group=mysqli_query($link,$query);


mysqli_close($link);

//查询xml信息

//把信息存储到一个数组
$info=[];
$info['feedback']=[];
while ($rst = mysqli_fetch_assoc($ret_feedback)) {
    $info['feedback'][] = $rst;
}
$info['report']=[];
while ($rst = mysqli_fetch_assoc($ret_report)) {
    $info['report'][] = $rst;
}
$info['task']=[];
while ($rst = mysqli_fetch_assoc($ret_task)) {
    $info['task'][] = $rst;
}
$info['group']=[];
while ($rst = mysqli_fetch_assoc($ret_group)) {
    $info['group'][] = $rst;
}
//存储用户信息
$info['user']=[];
$info['user']=$_SESSION;

echo (json_encode($info));

