<?php
  ob_start();
  function error_quit($error) {
    ob_clean();
    http_response_code(400);
    die($error);
  }

  $db_password = ($_ENV['DB_PASSWORD']);
  $db_user = ($_ENV['DB_USER']);
  $db_host = ($_ENV['DB_HOST']);
    
  $conn = mysqli_connect($db_host, $db_user, $db_password);
  
  if ($conn->connect_error) {
    error_quit("Connection failed: " . $conn->connect_error);
  }  
  
  $input = $_POST;
  if (!$_POST || count($_POST) === 0){
    $json = file_get_contents('php://input');
    $input = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE){
      error_quit('Error parsing json : '. json_last_error_msg());
    }
  }
  
  $sql = "INSERT INTO camagru.users (email, username, password_hash) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $email = $input['email'];
  if (!$email){
    error_quit("No email provided");
  }
  $username = $input['username'];
  if (!$email){
    error_quit("No email provided");
  }
  $password = $input['password'];
  if (!$password){
    error_quit("No password provided");
  }
  $password = password_hash($input['password'], PASSWORD_DEFAULT);
  
  if ($stmt->bind_param("sss", $email, $username, $password) === false) {
    error_quit("SQL params binding failed: " . $stmt->error);
  }
  if ($stmt->execute() === false) {
    error_quit("SQL execute failed: " . $stmt->error);
  }
  echo "New user created successfully";
  
  $stmt->close();
  
  // print_r($input);
?>