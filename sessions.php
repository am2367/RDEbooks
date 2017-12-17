<?php
switch($_POST["request"]){

	case "set": echo(startSession($_POST["user"]));
	break;
	case "get": echo(getSession());
	break;
	case "stop": stopSessions();
	break;
}
function startSession($user){
	session_start();
	$_SESSION['user'] = $user;
	return true;
}
function getSession(){
	session_start();
	if(isset( $_SESSION['user']))
		return $_SESSION['user'];
	else {
		return "";
	}
}
function stopSessions(){
	session_start();
	session_unset();
	session_destroy();
}
?>
