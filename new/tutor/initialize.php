<?php

//-----------------常量设置----------------------------------------------
//教师对应小组数
$group_num=4;
$taskemailnum=10;

//-----------------获取接口变量----------------------------------------------

$sid=$_GET['sid'];
session_id($sid);
session_start();
$classid=$_SESSION['classid'];

//-----------------连接mysql服务器----------------------------------------------

$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');
//联合查询作业状态数据
$query="SELECT taskid,evaluation,groupid,numberingroup FROM account INNER JOIN homework_mood ON account.userid=homework_mood.userid WHERE account.classid='$classid'";
$ret=mysqli_query($link,$query);
mysqli_close($link);
while ($rst = mysqli_fetch_assoc($ret)) {
    $homeworkmood[] = $rst;
}
$xml=simplexml_load_file('pro.xml');
$pro=[];
for($i=0;$i<$taskemailnum;$i++){
    $task=$xml->task[$i];
    $pro[$i]=[];
    $pro[$i]['rubrics']=[];
    $pro[$i]['feedback']=[];
    $assessment=$task->assessment;
    $num=count($assessment->children());
    for($k=0;$k<$num;$k++){
        $pro[$i]['rubrics'][]=(string)$assessment->section[$k]->rubrics;
        $pro[$i]['feedback'][]=(string)$assessment->section[$k]->feedback;
   }
   //反馈邮件部分
    $feedback=$task->feedbackEmail;
    $pro[$i]['feedbackintro']=(string)$feedback->feedbackIntro;
    $pro[$i]['allAcceptFeedback']=(string)$feedback->allAcceptFeedback;
    $pro[$i]['allReviseFeedback']=(string)$feedback->allReviseFeedback;
    $pro[$i]['reviseDeadline']=(string)$feedback->reviseDeadline;
    //chats
    $chats=$task->chats;
    $pro[$i]['chatName']=[];
    $pro[$i]['chatMsg']=[];
    $num=count($chats->children());
    for($k=0;$k<$num;$k++){
        $pro[$i]['chatName'][]=(string)$chats->chat[$k]->chatName;
        $pro[$i]['chatMsg'][]=(string)$chats->chat[$k]->chatMsg;
    }
}
$info=[];
$info['pro']=$pro;
$info['homeworkmood']=$homeworkmood;
echo(json_encode($info));