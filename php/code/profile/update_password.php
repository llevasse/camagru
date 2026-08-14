<?php
  include_once("/var/www/php/utils/get_db_conn.php");
  include_once("/var/www/php/utils/get_info_from_token.php");
  include_once("/var/www/php/utils/quit.php");
  include_once("password_complexity_checker.php");
  ob_start();
  try {
    $conn = get_db_conn();
    
    $info = get_info_from_token('EMAIL_SECRET_KEY');
    
    $input = $_POST;
    if (!$_POST || count($_POST) === 0){
      $json = file_get_contents('php://input');
      $input = json_decode($json, true);
      if (json_last_error() !== JSON_ERROR_NONE){
        quit(json_encode(array("message"=> "Error parsing json : ". json_last_error_msg())), 400);
      }
    }
    
    if (!isset($input['confirmedPassword']) || !isset($input['password'])){
      quit(json_encode(array("message"=> "Not every needed parameters are provided")), 400);
    }
    
    $userId = $info['id'];
    $confirmed_password = $input["confirmedPassword"];
    $password = $input["password"];
		
		checkPasswordComplexity($password);
    
    if (strcmp($password, $confirmed_password) !== 0){
      quit(json_encode(array("message"=> "Passwords do not match")), 400);
    }
    
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    
    $sql = "UPDATE camagru.users SET password_hash=? WHERE id=?";
    $stmt = $conn->prepare($sql);    
    if ($stmt->bind_param("si", $password, $userId) === false) {
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      quit(json_encode(array("message"=> "SQL excute failed: " . $stmt->error)), 400);
    }
    quit(json_encode(array("message"=> "Password updated successfully")), 200);
  }
  catch (Exception $e) {
    quit(array("message"=> $e->getMessage()), 400);
  }
?>