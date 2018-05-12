<?php
/*
 * 只需要获取userid
 * */

//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$classid=$_SESSION['classid'];
$groupid=$_GET['groupid'];
$taskid=$_GET['taskid'];
$numberingroup=$_GET['numberingroup'];

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');
//查询userid
$query="SELECT userid FROM account WHERE classid='$classid' AND groupid='$groupid' AND numberingroup='$numberingroup'";
$ret=mysqli_query($link,$query);
$stu_info=mysqli_fetch_assoc($ret);
$userid=$stu_info['userid'];
//查询评价状态
$query="SELECT evaluation FROM homework_mood WHERE userid='$userid' AND taskid='$taskid'";
$ret=mysqli_query($link,$query);
mysqli_close($link);
$evaluaion_array=mysqli_fetch_assoc($ret);
$evaluaion=$evaluaion_array['evaluation'];
if($evaluaion=='通过'){
    echo(json_encode('作业已通过！'));
    exit();
}
else if ($evaluaion=='待修改') {
    echo(json_encode('作业待学生修改！'));
}

