<?php
  include_once("utils/get_info_from_token.php");
  include_once("exceptions/token_expired.php");
  function quit($json, $response_code = 200) {
    ob_clean();
    http_response_code($response_code);
    die($json);
  }
  
  
  try{
    ob_start();

    $info = get_info_from_token();
        
    $db_password = ($_ENV['DB_PASSWORD']);
    $db_user = ($_ENV['DB_USER']);
    $db_host = ($_ENV['DB_HOST']);
    
    $conn = mysqli_connect($db_host, $db_user, $db_password);
  
    if ($conn->connect_error) {
      quit(json_encode(array("message"=> "Connection failed: " . $conn->connect_error)), 400);
    } 
    
    $sql = "SELECT id, file_path FROM camagru.superposable_images";
    $result = mysqli_query($conn, $sql);
    if ($result && $result->num_rows > 0) {
      while($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
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