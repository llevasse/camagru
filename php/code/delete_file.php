<?php  
  include_once("/var/www/php/utils/get_info_from_token.php");
  include_once("/var/www/php/exceptions/token_expired.php");
  function quit($json, $response_code = 200) {
    // ob_clean();
    http_response_code($response_code);
    die($json);
  }
  
  
  function delete_file($relativePath){  
    $fullPath = "/var/www/pictures/" . $relativePath;

    unlink($fullPath); // Delete the temp file
  }


  
  try{
    ob_start();
    
    $info = get_info_from_token();
    
    $input = $_POST;
    if (!$_POST || count($_POST) === 0){
      $json = file_get_contents('php://input');
      $input = json_decode($json, true);
      if (json_last_error() !== JSON_ERROR_NONE){
        quit(json_encode(array("message"=> "Error parsing json : ". json_last_error_msg())), 400);
      }
    }
    
    if(isset($input['url'])) {
      $filepath = $input['url'];
      
      $db_password = ($_ENV['DB_PASSWORD']);
      $db_user = ($_ENV['DB_USER']);
      $db_host = ($_ENV['DB_HOST']);
      
      $conn = mysqli_connect($db_host, $db_user, $db_password);
      
      
      if ($conn->connect_error) {
        quit(json_encode(array("message"=> "Connection failed: " . $conn->connect_error)), 400);
      } 
        
      delete_file($filepath);
      
      $userId = $info['id'];
      
      $sql = "DELETE FROM camagru.pictures WHERE file_path=? AND user_id=?";
      $stmt = $conn->prepare($sql);
      if ($stmt->bind_param("si", $filepath,$userId) === false) {
        quit(json_encode(array("message"=> "SQL params binding failed: " . $stmt->error)), 400);
      }
      if ($stmt->execute() === false) {
        quit(json_encode(array("message"=> "SQL execute failed: " . $stmt->error)), 400);
      }
      die();
    }
    else{
      throw new Exception("photo or superposables missing");
    }
    
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