<?php
//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
//var_dump($link);
$res=mysqli_set_charset($link,'utf8');

//选择数据库
mysqli_query($link,'use database1');
$id=$_GET["id"];
//查询数据
$query="select time,classid,emailcontent from email_history where id='$id'";
$result=mysqli_query($link,$query);
//从结果中获得数据
$row=mysqli_fetch_all($result,1);
//回显json格式的结果
if(!empty($row)) {
    echo json_encode($row);

}
