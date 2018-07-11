<?php
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect('localhost:3306', 'root', '12345678');
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use database1');

$query="SELECT userid,username,classid,groupid,numberingroup FROM account WHERE role='student'";
$ret=mysqli_query($link,$query);
mysqli_close($link);
$info=[];
while($res=mysqli_fetch_assoc($ret)){
    $info[]=$res;
}
echo(json_encode($info));