<?php

//-----------------获取接口变量----------------------------------------------
$sid = $_GET['sid'];
session_id($sid);
session_start();
$userid=$_SESSION['userid'];

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


$query="SELECT url,urlname,timeStamp,shared,taskid FROM report WHERE userid='$userid'";
$ret=mysqli_query($link,$query);
mysqli_close($link);
$info=[];
$info['urlname']=[];
$info['url']=[];
$info['time']=[];
$info['shared']=[];
//记录对应文件是同一个report的第几个附件,第一个为0
$info['number']=[];
$info['taskid']=[];
$url_arr=[];
$urlname_arr=[];
$shared_arr=[];
while($res=mysqli_fetch_assoc($ret)){
    $url_arr=explode(',',$res['url']);
    //echo ($res['url']);
    $url_arr=array_filter($url_arr);
    foreach ($url_arr as $value){
        $info['url'][]=$value;
    }
    $shared_arr=explode(',',$res['shared']);
    $shared_arr=array_filter($shared_arr,"shared");
    foreach ($shared_arr as $value){
        $info['shared'][]=$value;
    }

    $urlname_arr=explode('@!',$res['urlname']);
    $urlname_arr=array_filter($urlname_arr);
    $num=0;
    foreach ($urlname_arr as $value){
        $info['urlname'][]=$value;
        $info['time'][]=$res['timeStamp'];
        $info['number'][]=$num;
        $num++;
        $info['taskid'][]=$res['taskid'];
    }
}
function shared($var){
    if($var!=''){
        return true;
    }
    else{
        return false;
    }
}
echo(json_encode($info));


