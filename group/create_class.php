<?php
//-----------------控制台----------------------------------------------
$groupnum=4;

//-----------------获取接口变量----------------------------------------------
$classid=$_GET['classid'];

//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use database1');
for($i=1;$i<=$groupnum;$i++){
    $query="INSERT INTO group_attr(classid,groupid) VALUES ('$classid','$i')";
    $ret=mysqli_query($link,$query);
    if(!$ret){
        echo('failed!');
        break;
    }
}
mysqli_close($link);
echo ('success!');