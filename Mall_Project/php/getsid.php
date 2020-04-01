<?php

include "conn.php";
$sid = $_GET['sid']; //接收前端传入的sid
$sidname = $_GET['sidname']; //接收前端传入的对应页面的sidname
if ($sidname == 'indexsid') {
    $result = $conn->query("select * from indexlist where sid=$sid");
    echo json_encode($result->fetch_assoc());
} else if ($sidname == 'listsid') {
    $result = $conn->query("select * from listgoods where sid=$sid");
    echo json_encode($result->fetch_assoc());
}
