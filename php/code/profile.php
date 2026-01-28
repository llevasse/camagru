<?php
  include_once("jwt.php");
  include_once("utils/get_info_from_token.php");
  include_once("exceptions/token_expired.php");

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
  
  try{
    $info = get_info_from_token();
    $sql = "SELECT id, username, email FROM camagru.users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt->bind_param("i", $info['id']) === false) {
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    $result = $stmt->get_result();
    if ($result->num_rows == 0) {
      quit(json_encode(["message"=>"Could not get profile"]), 400);
    }
    $result = $result->fetch_assoc();
    quit(json_encode($result), 200);
  }
  catch(TokenExpired $e){
    quit(json_encode(["message"=> "Token expired"]), 400);
  }
  catch(mysqli_sql_exception $e){
    $message = $e->getMessage();
    
    quit(json_encode(array(
      "message" => $message,
    )), 400);
  }
  catch(Exception $e) {
    quit(json_encode(["message"=> $e->getMessage()]), 400);
  }
?>