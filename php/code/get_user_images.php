<?php
  include_once("/var/www/php/jwt.php");
  include_once("/var/www/php/utils/get_info_from_token.php");
  include_once("/var/www/php/exceptions/token_expired.php");
  function quit($json, $response_code = 200) {
    ob_clean();
    http_response_code($response_code);
    die($json);
  }
  
  
  try{
    ob_start();

    $info = get_info_from_token();
    $userId = $info['id'];
    
    $db_password = ($_ENV['DB_PASSWORD']);
    $db_user = ($_ENV['DB_USER']);
    $db_host = ($_ENV['DB_HOST']);
    
    $conn = mysqli_connect($db_host, $db_user, $db_password);
  
    if ($conn->connect_error) {
      quit(json_encode(array("message"=> "Connection failed: " . $conn->connect_error)), 400);
    } 
    
    $sql = "SELECT file_path FROM camagru.pictures WHERE user_id=?";
    $stmt = $conn->prepare($sql);
    if ($stmt->bind_param("i",$userId) === false) {
      quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
    }
    if ($stmt->execute() === false) {
      quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
    }
    
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
      while($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row['file_path'];
      }
      quit(json_encode($rows), 200);
    }
    quit(json_encode(array("message"=> "Could not get images" . $stmt->error)), 400);
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