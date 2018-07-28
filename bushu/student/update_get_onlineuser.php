<?php
/*
功能：1.更新并返回在线用户表
接口：1.$_SESSION,见下方源代码‘获取接口变量'部分
提示：1.在线用户表只记录用户id和访问本文件的时间戳，每次本文件被访问会将最近一次访问据当前时间超过一段时间的用户从表中删除，然后返回
表中的所有用户id。
*/
header("Content-Type:application/json");

//-----------------常量设置----------------------------------------------
$offlinetime=60;

//-----------------获取接口变量----------------------------------------------

$sid=$_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];
$username=$_SESSION['username'];
$groupid=$_SESSION['groupid'];
$classid=$_SESSION['classid'];
//设置时区保证时间戳正确
date_default_timezone_set('PRC');
$time=date('Y-m-d H:i:s',time());

/*
$userid=1;
$username='af';
$groupid=1;
$classid=1;
$time='2018-05-11 16:36:35';
*/
//-----------------mysql参数----------------------------------------------
$servername = "47.96.146.26";
$usern = "root";
$passw = "B4F393c91945";
$dbname = "mysql";
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect($servername,$usern ,$passw);;
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use '.$dbname);
//删除离线用户
$query="delete from onlineuser where TIMESTAMPDIFF(SECOND,time,'$time') >'$offlinetime'";
mysqli_query($link,$query);

//将请求这个文件的用户写入记录
//先删除这个用户的旧记录
$query="delete from onlineuser where userid='$userid'";
mysqli_query($link,$query);
//写入新记录
$query="insert into onlineuser(userid,username,groupid,time,classid) values('$userid','$username','$groupid','$time','$classid')";
mysqli_query($link,$query);

//获取更新过的在线用户表
$query="select userid from onlineuser WHERE groupid='$groupid' AND classid='$classid'";
$result=mysqli_query($link,$query);

//从结果中获得数据
$onlineuser_name=array();
while ($onlineuser=mysqli_fetch_assoc($result)){
    $onlineuser_name[]=$onlineuser['userid'];
}

//获取小组的教师
/*
$query="SELECT username FROM account WHERE classid='$classid' AND role='tutor' LIMIT 1";
$ret=mysqli_query($link,$query);
$tutor_name_array=mysqli_fetch_assoc($ret);
$tutor_name=$tutor_name_array['username'];
*/
/*
//获取小组全部学生成员
$query="SELECT username FROM account WHERE classid='$classid' AND groupid='$groupid' AND role='student'";
$ret=mysqli_query($link,$query);
mysqli_close($link);
*/
//整理所有信息存入$info_array
$info_array=array();
/*
$info_array['student_name']=array();
while($stu_name=mysqli_fetch_assoc($ret)){
    $info_array['student_name'][]=$stu_name['username'];
}
*/
//$info_array['tutor_name']=$tutor_name;
$info_array['userid']=$onlineuser_name;
//回显json格式的结果
if(!empty($info_array)) {
    echo json_encode($info_array);
}



