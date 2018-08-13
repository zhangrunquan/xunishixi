<?php
//-----------------获取接口变量----------------------------------------------
$classid = $_GET['classid'];

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


$query = "UPDATE account SET classid=0,groupid=0 WHERE classid='$classid'AND role='student'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('move student to 0,0 failed!');
    exit();
}

$query = "DELETE FROM group_attr WHERE classid='$classid'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('delete group_attr failed!');
    exit();
}

$query ="DELETE FROM classinfo WHERE classid='$classid'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('delete classinfo failed!');
    exit();
}

$query ="DELETE FROM account WHERE classid='$classid'AND role='tutor'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('error 1');
    exit();
}

$query ="DELETE FROM report WHERE classid='$classid'";
$ret = mysqli_query($link, $query);
if (!$ret) {
    echo('error 2');
    exit();
}

mysqli_close($link);

echo('success!');


