<?php
/*
 * 功能：1.将分享的文件添加到小组共享
 *      2.将附件分享状态置为1
 */
date_default_timezone_set('PRC');
$sid=$_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];
$groupid=$_SESSION['groupid'];
$classid=$_SESSION['classid'];
$filename=$_GET['filename'];
$url=$_GET['url'];
$taskid=$_GET['taskid'];
$number=$_GET['number'];
$time = date('Y-m-d H:i:s', time());

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


//将附件分享状态置为1
$qurey="SELECT shared FROM report WHERE userid='$userid' AND taskid='$taskid' limit 1";
$ret=mysqli_query($link,$qurey);
while($res=mysqli_fetch_assoc($ret)){
    $shared_arr=explode(',',$res['shared']);
    $shared_arr=array_filter($shared_arr,"shared");
    $shared_arr[$number]=1;
}
$shared_str='';
foreach ($shared_arr as $value){
    $shared_str.=$value.',';
}
$qurey="UPDATE report SET shared='$shared_str' WHERE userid='$userid' AND taskid='$taskid' limit 1";
mysqli_query($link,$qurey);

//将分享的文件添加到小组共享
$query="UPDATE group_attr SET filename=CONCAT(IFNULL(filename,''),'$filename','@!'),sharefile=CONCAT(IFNULL(sharefile,''),'$url',','),sharetime=CONCAT(IFNULL(sharetime,''),'$time',',') WHERE classid='$classid' AND groupid='$groupid' limit 1";
mysqli_query($link,$query);
echo('share attachment success!');

function shared($var){
    if($var!=''){
        return true;
    }
    else{
        return false;
    }
}