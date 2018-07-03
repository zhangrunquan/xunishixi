<?php

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
mysqli_query($link, 'use database1');

$query="SELECT url,urlname,timeStamp FROM report WHERE userid='$userid' limit 1";
$ret=mysqli_query($link,$query);
mysqli_close($link);
$info=[];
$info['urlname']=[];
$info['url']=[];
$info['time']=[];
$url_arr=[];
$urlname_arr=[];
while($res=mysqli_fetch_assoc($ret)){
    $url_arr=explode(',',$res['url']);
    $url_arr=array_filter($url_arr);
    foreach ($url_arr as $value){
        $info['url'][]=$value;
    }
    $urlname_arr=explode('@!',$res['urlname']);
    $urlname_arr=array_filter($urlname_arr);
    foreach ($urlname_arr as $value){
        $info['urlname'][]=$value;
        $info['time'][]=$res['timeStamp'];
    }

}



echo(json_encode($info));