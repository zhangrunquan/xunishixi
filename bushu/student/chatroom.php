<?php
/*
功能：1.获取之前未获取的聊天信息
接口：1.$_GET['maxId']
        2.$_SESSION['groupid']
        3.sid
*/
//-----------------测试用----------------------------------------------



//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$groupid = $_SESSION['groupid'];
$classid=$_SESSION['classid'];
$maxtimeStamp=$_GET['maxtimeStamp'];

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
// 防止获取重复数据，本次请求的记录结果id要大于上次获得的timeStamp
$query="SELECT timeStamp,username,content FROM chat WHERE classid='$classid' AND groupid='$groupid' AND timeStamp>'$maxtimeStamp';";
$qry = mysqli_query($link, $query);
mysqli_close($link);
$info = array();
while ($rst = mysqli_fetch_assoc($qry)) {
    $info[] = $rst;
}

// 通过json格式给客户端提供数据
echo json_encode($info);



