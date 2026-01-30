<?php
  include_once("jwt.php");

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
  
  $sql = "SELECT * FROM camagru.users WHERE username = ?";
  $stmt = $conn->prepare($sql);
  $username = $input['username'];
  if (!$username){
    quit(json_encode(array("message"=> "No username provided")), 400);
  }
  $password = $input['password'];
  if (!$password){
    quit(json_encode(array("message"=> "No password provided")), 400);
  }
  
  if ($stmt->bind_param("s", $username) === false) {
    quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
  }
  try{
    if ($stmt->execute() === false) {
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();
    if (password_verify($password, $result['password_hash']) == false){
      quit(json_encode(array("message"=>"Incorrect password")), 400);
    }
    if ($result['is_confirmed'] == false){
      quit(json_encode(array("message"=>"Account is not confirmed")), 400);
    }
    $jwtCtrl = new Jwt($_ENV['JWT_SECRET_KEY']);
    $exp = time() + 1*24*60*60;
    quit(json_encode([
      "message"=>"Correct password",
      "token" => $jwtCtrl->encode([
        "id"=>$result['id'],
        "username"=>$result['username'],
        "exp"=> $exp,
      ])]), 200);
    
  }
  catch(mysqli_sql_exception $e){
    $message = $e->getMessage();
    
    quit(json_encode(array(
      "message" => $message,
    )), 400);
    
  }
  $stmt->close();  
?>