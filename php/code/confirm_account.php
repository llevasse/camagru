<?php
  include_once("utils/get_info_from_token.php");
  include_once("exceptions/token_expired.php");
  
  ob_start();
  function quit($json, $response_code = 200) {
    ob_clean();
    http_response_code($response_code);
    die($json);
  }
  
  function get_db_conn(){
    $db_password = ($_ENV['DB_PASSWORD']);
    $db_user = ($_ENV['DB_USER']);
    $db_host = ($_ENV['DB_HOST']);
      
    $conn = mysqli_connect($db_host, $db_user, $db_password);
  
    if ($conn->connect_error) {
      quit(json_encode(array("message"=> "Connection failed: " . $conn->connect_error)), 400);
    }
    return $conn;
  }

  try{
    $info = get_info_from_token(ENV_VAR:"EMAIL_SECRET_KEY");
    
    $accountId = $info['id'];
    
    $conn = get_db_conn();
    
    $sql = "UPDATE camagru.users SET is_confirmed=true WHERE id=?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt->bind_param("i", $accountId) === false) {
      $stmt->close();  
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      $stmt->close();  
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    $stmt->close();  
    quit(json_encode(array("message"=>"User confirmed successfully")));
  }
  catch(mysqli_sql_exception $e){
    $message = $e->getMessage();
    quit(json_encode(array(
      "message" => $message,
    )), 400);  
  }
  catch(Exception $e){
    $message = $e->getMessage();
    quit(json_encode(array(
      "message" => $message,
    )), 400);  
  }
?>