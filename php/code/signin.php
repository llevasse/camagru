<?php
  include_once("/var/www/php/utils/send_confirmation_email.php");
  
  ob_start();
  function quit($json, $response_code = 200) {
    ob_clean();
    http_response_code($response_code);
    die($json);
  }

  $db_password = ($_ENV['DB_PASSWORD']);
  $db_user = ($_ENV['DB_USER']);
  $db_host = ($_ENV['DB_HOST']);
    
  $conn = mysqli_connect($db_host, $db_user, $db_password);
  
  if ($conn->connect_error) {
    quit(json_encode(array("message"=> "Connection failed: " . $conn->connect_error)), 400);
  }  
  
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
  $username = $input['username'];
  if (!$username){
    quit(json_encode(array("message"=> "No username provided")), 400);
  }
  if (strlen($username) > 30){
    quit(json_encode(array("message"=> "username too long provided")), 400);
  }
  $password = $input['password'];
  if (!$password){
    quit(json_encode(array("message"=> "No password provided")), 400);
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