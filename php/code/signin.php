<?php
  include_once("utils/send_confirmation_email.php");
  include_once("utils/quit.php");
  include_once("utils/get_db_conn.php");
  
  function containsAny($haystack, $needle){
		foreach (str_split($haystack) as $char){
			if (str_contains($needle, $char)){
				return true;
			}
		}
		return false;
  }
  
  ob_start();
  
  $conn = get_db_conn();
  
  $input = $_POST;
  if (!$_POST || count($_POST) === 0){
    $json = file_get_contents('php://input');
    $input = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE){
      quit(json_encode(array("message"=> "Error parsing json : ". json_last_error_msg())), 400);
    }
  }
  
  $sql = "INSERT INTO camagru.users (email, username, password_hash) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);
  
	$username = $input['username'];
  if (!$username){
    quit(json_encode(array("message"=> "No username provided")), 400);
  }
  if (strlen($username) > 30){
    quit(json_encode(array("message"=> "Username too long (max 30 character)")), 400);
  }
  if (preg_match("/\s/", $username)){
    quit(json_encode(array("message"=> "Username can't contain any whitespace")), 400);
  }

  $email = $input['email'];
  if (!$email){
    quit(json_encode(array("message"=> "No email provided")), 400);
  }
  if (strlen($email) > 100){
    quit(json_encode(array("message"=> "Email too long provided")), 400);
  }
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    quit(json_encode(array("message"=> "Invalid email format")), 400);
  }

  $password = $input['password'];
  if (!$password){
    quit(json_encode(array("message"=> "No password provided")), 400);
  }
	if (!preg_match("/[a-zA-Z]/", $password)){
		quit(json_encode(array("message"=> "Password needs to contain at least one alphabetical latin characteur")), 400);
	}
	if (!preg_match("/[0-9]/", $password)){
		quit(json_encode(array("message"=> "Password needs to contain at least one number")), 400);
	}
	if (!preg_match("/@|-|_|\+|=|<|>/", $password)){
    quit(json_encode(array("message"=> "Password needs to contain one of these characters : @-_+=<>")), 400);
  }
  if (strlen($password) < 8){
    quit(json_encode(array("message"=> "Password too short (min 8 character)")), 400);
  }
  if (strlen($password) > 100){
    quit(json_encode(array("message"=> "Password too long (max 100 character)")), 400);
  }
  
  $password = password_hash($input['password'], PASSWORD_DEFAULT);
  
  if ($stmt->bind_param("sss", $email, $username, $password) === false) {
    quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
  }
  try{
    if ($stmt->execute() === false) {
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    send_confirmation_email($stmt->insert_id, $email, $username);
    quit(json_encode(array("message"=>"User created successfully", 'return'=>$result)));
  }
  catch(mysqli_sql_exception $e){
    $message = $e->getMessage();
    // duplicate entry
    if ($e->getCode() === 1062){  
      $split = explode(" ", $e->getMessage());
      $column = end($split);
      switch ($column){
        case "'users.username'":
          $message = "This username is already taken";
          break;
        case "'users.email'":
          $message = "This email is already taken";
          break;
      }
      
    }
    quit(json_encode(array(
      "message" => $message,
    )), 400);
    
  }
  $stmt->close();  
?>