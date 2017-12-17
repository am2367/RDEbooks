<?php
class dbConnect{
    private $dbConnect;
    public function __construct() {
      $this->dbConnect = new mysqli("localhost", "your login username here", "your password here", "your database name");
    }
    public function returnBookList(){
      $statement = "SELECT * FROM Books";
      $query = $this->dbConnect->query($statement);
      $response = $query->fetch_all();
      return $response;
    }

    public function getUserInfo($username){
      $statement = "SELECT * FROM userbookinfo WHERE username = '$username';";
      $query = $this->dbConnect->query($statement);
      $response = $query->fetch_all();
      if(empty($response)){
        $statement = "SELECT * FROM Books";
        $query = $this->dbConnect->query($statement);
        while($row = mysqli_fetch_array($query)) {
          $title = mysqli_real_escape_string($this->dbConnect,$row['Title']);
          $this->dbConnect->query("INSERT INTO userbookinfo(username, Title) VALUES ('$username', '$title')");
        }
      }
      else {
        return $response;
      }
    }
    public function saveCurrentPage($user, $title, $page){
      $title = mysqli_real_escape_string($this->dbConnect,$title);
      $statement = "UPDATE userbookinfo SET CurrentPage=$page WHERE username='$user' AND Title='$title' ";
      $query = $this->dbConnect->query($statement);
    }
    public function updateBookRating($title, $rating, $user){
      if($rating!="none"){
        $title = mysqli_real_escape_string($this->dbConnect,$title);
        $statement = "UPDATE Books SET Ratings=Ratings + 1, RatingSum = RatingSum + $rating WHERE Title='$title'";
        $query = $this->dbConnect->query($statement);
        $statement = "UPDATE Books SET AvgRating=RatingSum/Ratings WHERE Title='$title'";
        $query = $this->dbConnect->query($statement);
      }
      $statement = "UPDATE userbookinfo SET Rated = 1 WHERE Title='$title' AND username='$user'";
      $query = $this->dbConnect->query($statement);
    }
    public function getBookInfo($path, $user){
      $statement = "SELECT result1.Title, Author, userbookinfo.CurrentPage, userbookinfo.Rated FROM (SELECT Title, Author FROM Books WHERE Path='$path')
                    as result1 INNER JOIN userbookinfo ON result1.Title=userbookinfo.Title AND username='$user';";
      $query = $this->dbConnect->query($statement);
      $response = $query->fetch_assoc();
      if(empty($response))
        return 1;
      else {
        return $response;
      }
    }
    public function login($username,$password){
    	$un = $this->dbConnect->real_escape_string($username);
    	$pw = $this->dbConnect->real_escape_string($password);
    	$statement = "select * from users where username = '$un';";
    	$response = $this->dbConnect->query($statement);
    	while ($row = $response->fetch_assoc())
    	{
    		if ($row["password"] == $pw)
    		{
    			return 1;// password match
    		}
    	}
    	return 0;//no users matched username
    }
    //Register user
    public function register($username,$password){
    	$un = $this->dbConnect->real_escape_string($username);
    	$pw = $this->dbConnect->real_escape_string($password);
    	$statement = "INSERT INTO users(username, password) VALUES ('$un', '$pw');";
    	$response = $this->dbConnect->query($statement);
    	if ($response){
    		return 1;
    	}
    	else{
    		return 0;
    	}
    }
}
?>
