<?php

include("dbFunctions.php");
//if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $message = $_POST['type'];

  switch ($message){
    case "login":
		$username = $_POST["uname"];
		$password = $_POST["pword"];
		$hashedPass = sha1($password);//hash the pass
		$response = login($username, $hashedPass);
	  break;
	  case "register":
		$username = $_POST["uname"];
		$password = $_POST["pword"];
		$hashedPass = sha1($password);//hash the pass
		$response = register($username, $hashedPass);
	  break;
  }
}
//if GET request
else {
  $message = $_GET['instructions'];

  switch ($message){
    case "updateRating": updateRating($_GET['title'],$_GET['rating'],$_GET['user'] );
    break;
    case "userInfo": userInfo($_GET['user']);
    break;
    case "bookList": getBookLibrary();
    break;
    case "getParsedBook": parseBook($_GET['path']);
    break;
    case "savePage": savePage($_GET['user'],$_GET['title'], $_GET['page'] );
    break;
    case "getInfo": getInfo($_GET['path'], $_GET['user']);
    break;
  }
}

function login($username, $password){
  $db = new dbConnect();
  $output = $db->login($username, $password);
  echo json_encode(utf8ize($output));
}
function register($username, $password){
  $db = new dbConnect();
  $output = $db->register($username, $password);
  echo json_encode(utf8ize($output));
}

function getBookLibrary(){
  $db = new dbConnect();
  $output = $db->returnBookList();
  echo json_encode(utf8ize($output));
}
function savePage($user, $title, $page){
  $db = new dbConnect();
  $output = $db->saveCurrentPage($user, $title, $page);
}
function getInfo($path, $user){
  $db = new dbConnect();
  $output = $db->getBookInfo($path, $user);
  echo json_encode(utf8ize($output));
}

function userInfo($path){
  $db = new dbConnect();
  $output = $db->getUserInfo($path);
  echo json_encode(utf8ize($output));
}

function updateRating($title, $rating, $user){
  $db = new dbConnect();
  $output = $db->updateBookRating($title, $rating, $user);
}

//encode data in utf8 format
function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}
function parseBook($path){
    $lineCount = 0;
    $whitespaceCount = 0;
    $myFile = file_get_contents($path);
    //remove header from file and trim
    $fullBook = trim(explode("***", $myFile)[2]);
    //create array by splitting by newlines
    $pageArray = split("\n", $fullBook);
    $pageCountArray = array();//temp array for holding lines for a page
    //create array of arrays (array of lines for each page)
    $newPageArray = array($pageCountArray);
    //loop through array of lines
    for($i = 0;$i < sizeOf($pageArray); $i++) {
      if(strpos($pageArray[$i], 'CHAPTER') !== false){
        //center chapter headings
        $pageArray[$i] = "<div class='text-center'><h3 id='chapter-heading'>".$pageArray[$i]."</h3></div>";
      }
      if($lineCount == 60){
        $lineCount = 0;
        //push array of lines into the page array
        array_push($newPageArray, $pageCountArray);
        $pageCountArray = array();
      }
      //if line is whitespace
      if(strlen($pageArray[$i]) == 1){
        $lineCount++;
        //if next two lines are whitespace
        if((strlen($pageArray[$i+1]) == 1)&&(strlen($pageArray[$i+2]) == 1)){
          //push array of lines into the page array
          array_push($newPageArray, $pageCountArray);
          $pageCountArray = array();
          $lineCount = 0;
          $i += 2;
        }
        else
          array_push($pageCountArray, "<br><br>");
      }
      else{
        //push array of lines into the page array
        array_push($pageCountArray, $pageArray[$i]);
        $lineCount++;
      }
    }

  echo json_encode($newPageArray);
}
?>
